import { NextRequest, NextResponse } from 'next/server'
import { RuleEngine } from '@/lib/rule-engine/engine'
import { PatientData } from '@/lib/rule-engine/models'
import { updatePatientStatus } from '@/lib/rule-engine/state-updater'
import { validate, assessmentSchema } from '@/lib/validation'
import { getSupabaseKey } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = getSupabaseKey()
const engine = new RuleEngine()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const searchParams = new URL(request.url).searchParams
    const limit = searchParams.get('limit')
    let url = `${supabaseUrl}/rest/v1/assessments?patient_id=eq.${id}&select=*&order=created_at.desc`
    if (limit) url += `&limit=${limit}`
    const res = await fetch(url, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ data, count: data.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch assessments'
    return NextResponse.json({ detail: msg, data: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const v = validate(assessmentSchema, body)
    if (!v.success) return v.response

    const patient: PatientData = {
      usia: v.data.usia || 0,
      bb: v.data.bb || 0,
      tb: v.data.tb || 0,
      jenis_kelamin: v.data.jenis_kelamin || 'wanita',
      tingkat_aktivitas: v.data.tingkat_aktivitas || 'RINGAN',
      mst_penurunan_bb: v.data.mst_penurunan_bb ?? null,
      mst_nafsu_makan: v.data.mst_nafsu_makan ?? null,
      diagnosis_medis: v.data.diagnosis_medis || [],
      keluhan: v.data.keluhan || [],
      asupan_persen: v.data.asupan_persen ?? null,
      albumin: v.data.albumin ?? null,
      gds: v.data.gds ?? null,
    }

    const result = engine.evaluate(patient)

    const res = await fetch(`${supabaseUrl}/rest/v1/assessments`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json', Prefer: 'return=representation',
      },
      body: JSON.stringify({
        patient_id: id,
        usia: patient.usia || null,
        bb: patient.bb || null,
        tb: patient.tb || null,
        jenis_kelamin: patient.jenis_kelamin || null,
        tingkat_aktivitas: patient.tingkat_aktivitas || null,
        asupan_persen: patient.asupan_persen,
        albumin: patient.albumin,
        gds: patient.gds,
        diagnosis_medis: patient.diagnosis_medis,
        keluhan: patient.keluhan,
        imt: result.imt?.nilai != null ? Math.round(result.imt.nilai * 10) / 10 : null,
        imt_kategori: result.imt?.kategori ?? null,
        bee: result.kebutuhan?.bee != null ? Math.round(result.kebutuhan.bee) : null,
        tee: result.kebutuhan?.tee != null ? Math.round(result.kebutuhan.tee) : null,
        protein_gram: result.kebutuhan?.protein != null ? Math.round(result.kebutuhan.protein) : null,
        hasil: result,
        status: v.data.status || 'submitted',
        created_by: v.data.created_by || null,
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    const data = await res.json()

    await updatePatientStatus(id, 'ASESMEN_DILAKUKAN')

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create assessment'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

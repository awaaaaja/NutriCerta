import { NextRequest, NextResponse } from 'next/server'
import { updatePatientStatus } from '@/lib/rule-engine/state-updater'
import { validate, interventionSchema } from '@/lib/validation'
import { getSupabaseKey } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = getSupabaseKey()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const url = `${supabaseUrl}/rest/v1/interventions?patient_id=eq.${id}&select=*&order=created_at.desc`
    const res = await fetch(url, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ data, count: data.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch interventions'
    return NextResponse.json({ detail: msg, data: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const v = validate(interventionSchema, body)
    if (!v.success) return v.response
    const res = await fetch(`${supabaseUrl}/rest/v1/interventions`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json', Prefer: 'return=representation',
      },
      body: JSON.stringify({
        patient_id: id,
        diagnosis_id: v.data.diagnosis_id || null,
        jenis_diet: v.data.jenis_diet,
        rute_pemberian: v.data.rute_pemberian,
        tujuan_intervensi: v.data.tujuan_intervensi || null,
        target_energi: v.data.target_energi ?? null,
        target_protein: v.data.target_protein ?? null,
        alergi: v.data.alergi || null,
        edukasi: v.data.edukasi || null,
        alasan_revisi: v.data.alasan_revisi || null,
        status: v.data.status,
        created_by: v.data.created_by || null,
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    const data = await res.json()

    await updatePatientStatus(id, 'INTERVENSI_DIMULAI')

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create intervention'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

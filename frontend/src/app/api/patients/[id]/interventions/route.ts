import { NextRequest, NextResponse } from 'next/server'
import { updatePatientStatus } from '@/lib/rule-engine/state-updater'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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
    const raw = await request.text()
    const body = JSON.parse(raw)
    const res = await fetch(`${supabaseUrl}/rest/v1/interventions`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json', Prefer: 'return=representation',
      },
      body: JSON.stringify({
        patient_id: id,
        diagnosis_id: body.diagnosis_id || null,
        jenis_diet: body.jenis_diet || null,
        rute_pemberian: body.rute_pemberian || 'ORAL',
        tujuan_intervensi: body.tujuan_intervensi || null,
        target_energi: body.target_energi ? Number(body.target_energi) : null,
        target_protein: body.target_protein ? Number(body.target_protein) : null,
        alergi: body.alergi || null,
        edukasi: body.edukasi || null,
        alasan_revisi: body.alasan_revisi || null,
        status: 'active',
        created_by: body.created_by || null,
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

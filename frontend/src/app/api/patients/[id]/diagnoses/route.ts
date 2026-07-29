import { NextRequest, NextResponse } from 'next/server'
import { updatePatientStatus } from '@/lib/rule-engine/state-updater'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const url = `${supabaseUrl}/rest/v1/diagnoses?patient_id=eq.${id}&select=*&order=created_at.desc`
    const res = await fetch(url, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ data, count: data.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch diagnoses'
    return NextResponse.json({ detail: msg, data: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const raw = await request.text()
    const body = JSON.parse(raw)
    const res = await fetch(`${supabaseUrl}/rest/v1/diagnoses`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json', Prefer: 'return=representation',
      },
      body: JSON.stringify({
        patient_id: id,
        assessment_id: body.assessment_id || null,
        kode_pes: body.kode_pes,
        pernyataan_pes: body.pernyataan_pes,
        domain: body.domain || null,
        etiologi: body.etiologi || null,
        signs: body.signs || null,
        status: 'active',
        created_by: body.created_by || null,
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    const data = await res.json()

    await updatePatientStatus(id, 'DIAGNOSIS_DITETAPKAN')

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create diagnosis'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { updatePatientStatus } from '@/lib/rule-engine/state-updater'
import { validate, screeningSchema } from '@/lib/validation'
import { getSupabaseKey } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = getSupabaseKey()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const searchParams = new URL(request.url).searchParams
    const limit = searchParams.get('limit')
    let url = `${supabaseUrl}/rest/v1/screenings?patient_id=eq.${id}&select=*&order=created_at.desc`
    if (limit) url += `&limit=${limit}`
    const res = await fetch(url, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ data, count: data.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch screenings'
    return NextResponse.json({ detail: msg, data: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const v = validate(screeningSchema, body)
    if (!v.success) return v.response
    const res = await fetch(`${supabaseUrl}/rest/v1/screenings`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json', Prefer: 'return=representation',
      },
      body: JSON.stringify({
        patient_id: id,
        mst_penurunan_bb: v.data.mst_penurunan_bb,
        mst_nafsu_makan: v.data.mst_nafsu_makan,
        status: v.data.status,
        created_by: v.data.created_by || null,
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    const data = await res.json()

    const skor = v.data.mst_penurunan_bb + v.data.mst_nafsu_makan
    await updatePatientStatus(id, 'SKRINING_DILAKUKAN', { screeningSkor: skor })

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create screening'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

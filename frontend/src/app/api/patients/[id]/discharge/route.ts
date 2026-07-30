import { NextRequest, NextResponse } from 'next/server'
import { updatePatientStatus } from '@/lib/rule-engine/state-updater'
import { validate, dischargeSchema } from '@/lib/validation'
import { getSupabaseKey } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = getSupabaseKey()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const url = `${supabaseUrl}/rest/v1/discharge_summaries?patient_id=eq.${id}&select=*`
    const res = await fetch(url, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    if (!data.length) return NextResponse.json({ detail: 'Discharge summary belum tersedia' }, { status: 404 })
    return NextResponse.json(data[0])
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch discharge summary'
    return NextResponse.json({ detail: msg }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const v = validate(dischargeSchema, body)
    if (!v.success) return v.response
    const res = await fetch(`${supabaseUrl}/rest/v1/discharge_summaries?patient_id=eq.${id}`, {
      method: 'PATCH',
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rekomendasi_diet: v.data.rekomendasi_diet || null,
        monitoring_lanjutan: v.data.monitoring_lanjutan || null,
        kontrol_tanggal: v.data.kontrol_tanggal || null,
        catatan: v.data.catatan || null,
        created_by: v.data.created_by || null,
        updated_at: new Date().toISOString(),
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update discharge summary'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const v = validate(dischargeSchema, body)
    if (!v.success) return v.response
    const res = await fetch(`${supabaseUrl}/rest/v1/discharge_summaries`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json', Prefer: 'return=representation',
      },
      body: JSON.stringify({
        patient_id: id,
        rekomendasi_diet: v.data.rekomendasi_diet || null,
        monitoring_lanjutan: v.data.monitoring_lanjutan || null,
        kontrol_tanggal: v.data.kontrol_tanggal || null,
        catatan: v.data.catatan || null,
        created_by: v.data.created_by || null,
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    const data = await res.json()

    await updatePatientStatus(id, 'DISCHARGE_DIRENCANAKAN')

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create discharge summary'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

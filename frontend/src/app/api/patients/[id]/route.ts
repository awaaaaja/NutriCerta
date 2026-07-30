import { NextRequest, NextResponse } from 'next/server'
import { updatePatientStatus } from '@/lib/rule-engine/state-updater'
import { EVENTS } from '@/lib/rule-engine/patient-state'
import { validate, updatePatientSchema } from '@/lib/validation'
import { getSupabaseKey } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = getSupabaseKey()

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!uuidRegex.test(id)) return NextResponse.json({ detail: 'ID tidak valid' }, { status: 400 })
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/patients?id=eq.${id}&select=*`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    if (!data.length) return NextResponse.json({ detail: 'Pasien tidak ditemukan' }, { status: 404 })
    return NextResponse.json(data[0])
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch patient'
    return NextResponse.json({ detail: msg }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!uuidRegex.test(id)) return NextResponse.json({ detail: 'ID tidak valid' }, { status: 400 })
  try {
    const body = await request.json()
    const v = validate(updatePatientSchema, body)
    if (!v.success) return v.response
    const { _action, ...updateBody } = v.data

    if (_action) {
      const eventKey = _action as keyof typeof EVENTS
      const event = EVENTS[eventKey]
      if (event) {
        await updatePatientStatus(id, event)
      }
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/patients?id=eq.${id}`, {
      method: 'PATCH',
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updateBody, updated_at: new Date().toISOString() }),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update patient'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

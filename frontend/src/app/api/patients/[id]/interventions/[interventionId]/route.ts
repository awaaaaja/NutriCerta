import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseKey } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = getSupabaseKey()

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; interventionId: string }> }) {
  const { interventionId } = await params
  try {
    const raw = await request.text()
    const body = JSON.parse(raw)
    const res = await fetch(`${supabaseUrl}/rest/v1/interventions?id=eq.${interventionId}`, {
      method: 'PATCH',
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update intervention'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

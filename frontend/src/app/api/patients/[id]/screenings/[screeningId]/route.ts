import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; screeningId: string }> }) {
  const { screeningId } = await params
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/screenings?id=eq.${screeningId}&select=*`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    if (!data.length) return NextResponse.json({ detail: 'Skrining tidak ditemukan' }, { status: 404 })
    return NextResponse.json(data[0])
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch screening'
    return NextResponse.json({ detail: msg }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string; screeningId: string }> }) {
  const { screeningId } = await params
  try {
    const raw = await request.text()
    const body = JSON.parse(raw)
    const res = await fetch(`${supabaseUrl}/rest/v1/screenings?id=eq.${screeningId}`, {
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
    const msg = err instanceof Error ? err.message : 'Failed to update screening'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ detail: err.error_description || 'Login failed' }, { status: 401 })
    }
    const data = await res.json()
    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Login failed'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

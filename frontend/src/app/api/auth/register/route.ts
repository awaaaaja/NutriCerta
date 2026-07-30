import { NextRequest, NextResponse } from 'next/server'
import { validate, registerSchema } from '@/lib/validation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const v = validate(registerSchema, body)
    if (!v.success) return v.response
    const { email, password } = v.data
    const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: { apikey: supabaseKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ detail: err.msg || 'Registration failed' }, { status: 400 })
    }
    const data = await res.json()
    return NextResponse.json({ message: 'User registered', user: data.user || data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Registration failed'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

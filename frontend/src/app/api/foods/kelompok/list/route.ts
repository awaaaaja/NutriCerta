import { NextResponse } from 'next/server'
import { getSupabaseKey } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = getSupabaseKey()

export async function GET() {
  try {
    const url = new URL(`${supabaseUrl}/rest/v1/food_items`)
    url.searchParams.set('select', 'kelompok_pangan')

    const res = await fetch(url.toString(), {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json',
      },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    const kelompok = [...new Set<string>(data.map((d: any) => d.kelompok_pangan))].sort()
    return NextResponse.json({ kelompok })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch kelompok'
    return NextResponse.json({ detail: msg, kelompok: [] }, { status: 500 })
  }
}

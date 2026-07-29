import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest, { params }: { params: Promise<{ entity_id: string }> }) {
  const { entity_id } = await params
  try {
    const url = new URL(`${supabaseUrl}/rest/v1/food_items`)
    url.searchParams.set('entity_id', `eq.${entity_id}`)
    url.searchParams.set('select', '*')

    const res = await fetch(url.toString(), {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json',
      },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    if (!data.length) return NextResponse.json({ error: 'Food item not found' }, { status: 404 })
    return NextResponse.json(data[0])
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch food'
    return NextResponse.json({ detail: msg }, { status: 500 })
  }
}

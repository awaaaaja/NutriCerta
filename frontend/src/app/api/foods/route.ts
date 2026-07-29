import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const kelompok = searchParams.get('kelompok')
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 100)
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0)

  const url = new URL(`${supabaseUrl}/rest/v1/food_items`)
  url.searchParams.set('select', 'entity_id,nama,nama_latin,kelompok_pangan,energi_kal,protein_g,lemak_g,karbohidrat_g,serat_g,bdd_persen')
  url.searchParams.set('order', 'nama.asc')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', String(offset))

  if (search) url.searchParams.set('nama', `ilike.%${search}%`)
  if (kelompok) url.searchParams.set('kelompok_pangan', `eq.${kelompok}`)

  try {
    const res = await fetch(url.toString(), {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json',
        Prefer: 'count=exact',
      },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    const total = parseInt(res.headers.get('content-range')?.split('/')[1] || '0', 10)
    return NextResponse.json({ data, count: data.length, total, offset, limit })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch foods'
    return NextResponse.json({ detail: msg, data: [], total: 0 }, { status: 500 })
  }
}

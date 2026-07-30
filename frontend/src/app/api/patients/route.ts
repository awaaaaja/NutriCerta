import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const status = searchParams.get('status')
  const limit = Math.min(Number(searchParams.get('limit')) || 20, 100)
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0)

  const url = new URL(`${supabaseUrl}/rest/v1/patients`)
  url.searchParams.set('select', '*')
  url.searchParams.set('order', 'created_at.desc')
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('offset', String(offset))

  if (search) url.searchParams.set('nama', `ilike.%${search}%`)
  if (status) url.searchParams.set('status_pagt', `eq.${status}`)

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
    const msg = err instanceof Error ? err.message : 'Failed to fetch patients'
    return NextResponse.json({ detail: msg, data: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text()
    if (!bodyText || bodyText.trim().length === 0) {
      return NextResponse.json({ detail: 'Body kosong', received: bodyText }, { status: 400 })
    }
    let body: Record<string, any>
    try {
      body = JSON.parse(bodyText)
    } catch (e) {
      return NextResponse.json({ detail: 'JSON tidak valid', received: bodyText.substring(0, 500) }, { status: 400 })
    }

    const bb = body.bb ? Number(body.bb) : null
    const tb = body.tb ? Number(body.tb) : null
    let imt: number | null = null
    let imt_kategori: string | null = null
    if (bb && tb && tb > 0) {
      const tbM = tb / 100
      imt = Math.round((bb / (tbM * tbM)) * 10) / 10
      if (imt < 18.5) imt_kategori = 'KURUS'
      else if (imt < 25) imt_kategori = 'NORMAL'
      else if (imt < 30) imt_kategori = 'GEMUK'
      else imt_kategori = 'OBESITAS'
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/patients`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        no_rm: body.no_rm,
        nama: body.nama,
        tanggal_lahir: body.tanggal_lahir || null,
        jenis_kelamin: body.jenis_kelamin || null,
        ruangan: body.ruangan || null,
        diagnosis_masuk: body.diagnosis_masuk || null,
        tgl_masuk: body.tgl_masuk || new Date().toISOString().split('T')[0],
        bb: bb,
        tb: tb,
        imt: imt,
        imt_kategori: imt_kategori,
        status_pagt: 'BARU_MASUK',
        created_by: body.created_by || null,
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    const data = await res.json()
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create patient'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

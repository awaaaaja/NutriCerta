import { NextRequest, NextResponse } from 'next/server'
import { validate, createPatientSchema } from '@/lib/validation'
import { getSupabaseKey } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = getSupabaseKey()

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
    const body = await request.json()
    const v = validate(createPatientSchema, body)
    if (!v.success) return v.response

    const bb = v.data.bb ?? null
    const tb = v.data.tb ?? null
    let imt: number | null = null
    let imt_kategori: string | null = null
    if (bb && tb && tb > 0) {
      const tbM = tb / 100
      imt = Math.round((bb / (tbM * tbM)) * 10) / 10
      if (imt < 17.0) imt_kategori = 'SANGAT_KURANG'
      else if (imt < 18.5) imt_kategori = 'KURANG'
      else if (imt <= 25.0) imt_kategori = 'NORMAL'
      else if (imt < 27.0) imt_kategori = 'LEBIH'
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
        no_rm: v.data.no_rm,
        nama: v.data.nama,
        tanggal_lahir: v.data.tanggal_lahir || null,
        jenis_kelamin: v.data.jenis_kelamin || null,
        ruangan: v.data.ruangan || null,
        diagnosis_masuk: v.data.diagnosis_masuk || null,
        tgl_masuk: v.data.tgl_masuk || new Date().toISOString().split('T')[0],
        bb: bb,
        tb: tb,
        imt: imt,
        imt_kategori: imt_kategori,
        status_pagt: 'BARU_MASUK',
        created_by: v.data.created_by || null,
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

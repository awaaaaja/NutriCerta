import { NextRequest, NextResponse } from 'next/server'
import { updatePatientStatus } from '@/lib/rule-engine/state-updater'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const url = `${supabaseUrl}/rest/v1/monitoring_logs?patient_id=eq.${id}&select=*&order=tanggal.desc`
    const res = await fetch(url, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`Supabase: ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ data, count: data.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch monitoring logs'
    return NextResponse.json({ detail: msg, data: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const raw = await request.text()
    const body = JSON.parse(raw)
    const res = await fetch(`${supabaseUrl}/rest/v1/monitoring_logs`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json', Prefer: 'return=representation',
      },
      body: JSON.stringify({
        patient_id: id,
        tanggal: body.tanggal || new Date().toISOString().split('T')[0],
        bb: body.bb != null ? Number(body.bb) : null,
        asupan_persen: body.asupan_persen != null ? Number(body.asupan_persen) : null,
        albumin: body.albumin != null ? Number(body.albumin) : null,
        gds: body.gds != null ? Number(body.gds) : null,
        mual_muntah: body.mual_muntah || null,
        diare: body.diare || null,
        catatan: body.catatan || null,
        created_by: body.created_by || null,
      }),
    })
    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ detail: 'Supabase error', supabase_error: errText }, { status: 400 })
    }
    const data = await res.json()

    await updatePatientStatus(id, 'MONITORING_LOG_DIISI')

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create monitoring log'
    return NextResponse.json({ detail: msg }, { status: 400 })
  }
}

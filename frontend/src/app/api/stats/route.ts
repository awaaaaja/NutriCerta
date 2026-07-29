import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function count(url: string) {
  const res = await fetch(url, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json', Prefer: 'count=exact' },
  })
  if (!res.ok) return 0
  const range = res.headers.get('content-range')
  if (range) return parseInt(range.split('/')[1], 10) || 0
  const data = await res.json()
  return Array.isArray(data) ? data.length : 0
}

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    const [totalPasien, assesmentHariIni, monitoringAktif, risikoTinggi] = await Promise.all([
      count(`${supabaseUrl}/rest/v1/patients?select=id`),
      count(`${supabaseUrl}/rest/v1/assessments?created_at=gte.${today}&select=id`),
      count(`${supabaseUrl}/rest/v1/patients?status_pagt=eq.DALAM_MONITORING&select=id`),
      count(`${supabaseUrl}/rest/v1/screenings?kategori=eq.RESIKO&select=id`),
    ])

    return NextResponse.json({
      total_pasien: totalPasien,
      assesment_hari_ini: assesmentHariIni,
      monitoring_aktif: monitoringAktif,
      risiko_tinggi: risikoTinggi,
    })
  } catch (err) {
    return NextResponse.json({ total_pasien: 0, assesment_hari_ini: 0, monitoring_aktif: 0, risiko_tinggi: 0 })
  }
}

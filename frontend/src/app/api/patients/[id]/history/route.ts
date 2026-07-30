import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseKey } from '@/lib/supabase-server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = getSupabaseKey()

async function fetchTable(url: string) {
  const res = await fetch(url, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json' },
  })
  if (!res.ok) return []
  return res.json()
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const [screenings, assessments, diagnoses, interventions, monitoring, discharges] = await Promise.all([
      fetchTable(`${supabaseUrl}/rest/v1/screenings?patient_id=eq.${id}&select=*&order=created_at.desc`),
      fetchTable(`${supabaseUrl}/rest/v1/assessments?patient_id=eq.${id}&select=*&order=created_at.desc`),
      fetchTable(`${supabaseUrl}/rest/v1/diagnoses?patient_id=eq.${id}&select=*&order=created_at.desc`),
      fetchTable(`${supabaseUrl}/rest/v1/interventions?patient_id=eq.${id}&select=*&order=created_at.desc`),
      fetchTable(`${supabaseUrl}/rest/v1/monitoring_logs?patient_id=eq.${id}&select=*&order=created_at.desc`),
      fetchTable(`${supabaseUrl}/rest/v1/discharge_summaries?patient_id=eq.${id}&select=*&order=created_at.desc`),
    ])

    const activities: any[] = []

    for (const s of screenings) {
      activities.push({
        type: 'skrining',
        id: s.id,
        created_at: s.created_at,
        description: `Skrining MST: skor ${s.skor} (${s.kategori})`,
        detail: s.status,
      })
    }
    for (const a of assessments) {
      activities.push({
        type: 'asesmen',
        id: a.id,
        created_at: a.created_at,
        description: `Asesmen gizi — IMT ${a.imt} (${a.imt_kategori})`,
        detail: `BEE ${a.bee} kkal | TEE ${a.tee} kkal`,
      })
    }
    for (const d of diagnoses) {
      activities.push({
        type: 'diagnosis',
        id: d.id,
        created_at: d.created_at,
        description: `Diagnosis PES: ${d.kode_pes}`,
        detail: d.pernyataan_pes,
      })
    }
    for (const i of interventions) {
      const label = i.alasan_revisi ? `Revisi intervensi: ${i.jenis_diet}` : `Intervensi: ${i.jenis_diet}`
      activities.push({
        type: 'intervensi',
        id: i.id,
        created_at: i.created_at,
        description: label,
        detail: `${i.target_energi} kkal | ${i.rute_pemberian}`,
      })
    }
    for (const m of monitoring) {
      activities.push({
        type: 'monitoring',
        id: m.id,
        created_at: m.created_at,
        description: `Monitoring harian — ${m.tanggal}`,
        detail: `BB ${m.bb} kg | Asupan ${m.asupan_persen}%`,
      })
    }
    for (const dc of discharges) {
      activities.push({
        type: 'discharge',
        id: dc.id,
        created_at: dc.created_at,
        description: 'Discharge summary',
        detail: dc.rekomendasi_diet || '',
      })
    }

    activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ data: activities, count: activities.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch history'
    return NextResponse.json({ detail: msg, data: [] }, { status: 500 })
  }
}

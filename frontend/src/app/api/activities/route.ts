import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function fetchList(table: string, limit = 5) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*,patient:patient_id(nama)&order=created_at.desc&limit=${limit}`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json' },
  })
  if (!res.ok) return []
  return res.json()
}

export async function GET() {
  try {
    const [screenings, assessments, diagnoses, interventions, monitoring] = await Promise.all([
      fetchList('screenings'),
      fetchList('assessments'),
      fetchList('diagnoses'),
      fetchList('interventions'),
      fetchList('discharge_summaries'),
    ])

    const activities: any[] = []

    for (const s of screenings) {
      activities.push({ type: 'screening', id: s.id, pasien_id: s.patient_id, pasien_nama: s.patient?.nama || '', description: 'Skrining baru', created_at: s.created_at })
    }
    for (const a of assessments) {
      activities.push({ type: 'assessment', id: a.id, pasien_id: a.patient_id, pasien_nama: a.patient?.nama || '', description: 'Asesmen gizi', created_at: a.created_at })
    }
    for (const d of diagnoses) {
      activities.push({ type: 'diagnosis', id: d.id, pasien_id: d.patient_id, pasien_nama: d.patient?.nama || '', description: `Diagnosis ${d.kode_pes}`, created_at: d.created_at })
    }
    for (const i of interventions) {
      activities.push({ type: 'intervention', id: i.id, pasien_id: i.patient_id, pasien_nama: i.patient?.nama || '', description: `Intervensi ${i.jenis_diet}`, created_at: i.created_at })
    }
    for (const m of monitoring) {
      activities.push({ type: 'monitoring', id: m.id, pasien_id: m.patient_id, pasien_nama: m.patient?.nama || '', description: 'Monitoring harian', created_at: m.created_at })
    }

    activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json(activities.slice(0, 20))
  } catch {
    return NextResponse.json([])
  }
}

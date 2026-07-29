import { nextStatus, STATUSES } from './patient-state'
import type { Event, Status } from './patient-state'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function updatePatientStatus(
  patientId: string,
  event: Event,
  options?: { screeningSkor?: number }
): Promise<{ status: Status; label: string }> {
  const res = await fetch(`${supabaseUrl}/rest/v1/patients?id=eq.${patientId}&select=status_pagt`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Failed to fetch patient: ${res.status}`)
  const patients = await res.json()
  const current = (patients[0]?.status_pagt || STATUSES.BARU_MASUK) as Status

  let target = current

  if (event === 'SKRINING_DILAKUKAN' && options?.screeningSkor && options.screeningSkor >= 2) {
    target = STATUSES.PERLU_ASESMEN
  } else {
    const result = nextStatus(current, event)
    target = result.status
  }

  const patchRes = await fetch(`${supabaseUrl}/rest/v1/patients?id=eq.${patientId}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status_pagt: target, updated_at: new Date().toISOString() }),
  })
  if (!patchRes.ok) throw new Error(`Failed to update status: ${patchRes.status}`)

  const labels: Record<string, string> = {
    BARU_MASUK: 'Baru Masuk',
    SUDAH_DISKRINING: 'Sudah Skrining',
    PERLU_ASESMEN: 'Perlu Asesmen',
    ASESMEN_LENGKAP: 'Asesmen Lengkap',
    PERLU_DIAGNOSIS: 'Perlu Diagnosis',
    DIAGNOSIS_DITETAPKAN: 'Diagnosis Ditetapkan',
    PERLU_INTERVENSI: 'Perlu Intervensi',
    DALAM_INTERVENSI: 'Dalam Intervensi',
    DALAM_MONITORING: 'Dalam Monitoring',
    PERLU_RE_ASESMEN: 'Perlu Re-Asesmen',
    SIAP_DISCHARGE: 'Siap Discharge',
    SELESAI_PULANG: 'Selesai - Pulang',
  }

  return { status: target, label: labels[target] || target }
}

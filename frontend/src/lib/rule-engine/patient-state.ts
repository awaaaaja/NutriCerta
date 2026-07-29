export const STATUSES = {
  BARU_MASUK: 'BARU_MASUK',
  SUDAH_DISKRINING: 'SUDAH_DISKRINING',
  PERLU_ASESMEN: 'PERLU_ASESMEN',
  ASESMEN_LENGKAP: 'ASESMEN_LENGKAP',
  PERLU_DIAGNOSIS: 'PERLU_DIAGNOSIS',
  DIAGNOSIS_DITETAPKAN: 'DIAGNOSIS_DITETAPKAN',
  PERLU_INTERVENSI: 'PERLU_INTERVENSI',
  DALAM_INTERVENSI: 'DALAM_INTERVENSI',
  DALAM_MONITORING: 'DALAM_MONITORING',
  PERLU_RE_ASESMEN: 'PERLU_RE_ASESMEN',
  SIAP_DISCHARGE: 'SIAP_DISCHARGE',
  SELESAI_PULANG: 'SELESAI_PULANG',
} as const

export type Status = typeof STATUSES[keyof typeof STATUSES]

export const EVENTS = {
  SKRINING_DILAKUKAN: 'SKRINING_DILAKUKAN',
  ASESMEN_DILAKUKAN: 'ASESMEN_DILAKUKAN',
  DIAGNOSIS_DITETAPKAN: 'DIAGNOSIS_DITETAPKAN',
  INTERVENSI_DIMULAI: 'INTERVENSI_DIMULAI',
  MONITORING_LOG_DIISI: 'MONITORING_LOG_DIISI',
  TANDA_RE_ASESMEN: 'TANDA_RE_ASESMEN',
  DISCHARGE_DIRENCANAKAN: 'DISCHARGE_DIRENCANAKAN',
  SELESAI_PULANG: 'SELESAI_PULANG',
} as const

export type Event = typeof EVENTS[keyof typeof EVENTS]

type RawTransitionMap = {
  [S in Status]?: Partial<Record<Event, Status>>
}

const transitions: RawTransitionMap = {
  [STATUSES.BARU_MASUK]: {
    [EVENTS.SKRINING_DILAKUKAN]: STATUSES.SUDAH_DISKRINING,
  },
  [STATUSES.SUDAH_DISKRINING]: {
    [EVENTS.ASESMEN_DILAKUKAN]: STATUSES.ASESMEN_LENGKAP,
  },
  [STATUSES.PERLU_ASESMEN]: {
    [EVENTS.ASESMEN_DILAKUKAN]: STATUSES.ASESMEN_LENGKAP,
  },
  [STATUSES.ASESMEN_LENGKAP]: {}, // auto → PERLU_DIAGNOSIS
  [STATUSES.PERLU_DIAGNOSIS]: {
    [EVENTS.DIAGNOSIS_DITETAPKAN]: STATUSES.DIAGNOSIS_DITETAPKAN,
  },
  [STATUSES.DIAGNOSIS_DITETAPKAN]: {}, // auto → PERLU_INTERVENSI
  [STATUSES.PERLU_INTERVENSI]: {
    [EVENTS.INTERVENSI_DIMULAI]: STATUSES.DALAM_INTERVENSI,
  },
  [STATUSES.DALAM_INTERVENSI]: {
    [EVENTS.MONITORING_LOG_DIISI]: STATUSES.DALAM_MONITORING,
    [EVENTS.INTERVENSI_DIMULAI]: STATUSES.DALAM_INTERVENSI,
  },
  [STATUSES.DALAM_MONITORING]: {
    [EVENTS.TANDA_RE_ASESMEN]: STATUSES.PERLU_RE_ASESMEN,
    [EVENTS.DISCHARGE_DIRENCANAKAN]: STATUSES.SIAP_DISCHARGE,
    [EVENTS.MONITORING_LOG_DIISI]: STATUSES.DALAM_MONITORING,
  },
  [STATUSES.PERLU_RE_ASESMEN]: {
    [EVENTS.ASESMEN_DILAKUKAN]: STATUSES.ASESMEN_LENGKAP,
  },
  [STATUSES.SIAP_DISCHARGE]: {
    [EVENTS.SELESAI_PULANG]: STATUSES.SELESAI_PULANG,
    [EVENTS.DISCHARGE_DIRENCANAKAN]: STATUSES.SIAP_DISCHARGE,
  },
  [STATUSES.SELESAI_PULANG]: {},
}

function nextAutomaticStatus(status: Status): Status | null {
  if (status === STATUSES.ASESMEN_LENGKAP) return STATUSES.PERLU_DIAGNOSIS
  if (status === STATUSES.DIAGNOSIS_DITETAPKAN) return STATUSES.PERLU_INTERVENSI
  return null
}

export function canTransition(current: Status, event: Event): boolean {
  const row = transitions[current]
  if (!row) return false
  return event in row
}

export function nextStatus(current: Status, event: Event): { status: Status; autoAdvanced: boolean } {
  const row = transitions[current]
  if (!row) throw new Error(`No transitions defined from status "${current}"`)
  const target = row[event]
  if (!target) throw new Error(`Event "${event}" not allowed from status "${current}"`)

  let status = target
  let autoAdvanced = false

  const auto = nextAutomaticStatus(status)
  if (auto) {
    status = auto
    autoAdvanced = true
  }

  return { status, autoAdvanced }
}

export function getAvailableEvents(status: Status): Event[] {
  const row = transitions[status]
  if (!row) return []
  return Object.keys(row) as Event[]
}

export function getAllowedNextStatuses(status: Status): { event: Event; nextStatus: Status }[] {
  const row = transitions[status]
  if (!row) return []
  const result: { event: Event; nextStatus: Status }[] = []
  for (const [event, target] of Object.entries(row)) {
    let s = target as Status
    const auto = nextAutomaticStatus(s)
    if (auto) s = auto
    result.push({ event: event as Event, nextStatus: s })
  }
  return result
}

export function getStatusLabel(status: string): string {
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
  return labels[status] || status
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft, User, ClipboardList, Stethoscope, Activity, FileText,
  AlertTriangle, Pill, History, Plus, ChevronRight, Calendar, Ruler,
  Zap, Search, FlaskConical, X, Printer, Send, ClipboardCheck,
  Syringe, Weight, LogOut
} from 'lucide-react'
import { Card, Button, StatusBadge, Input, Select, Modal } from '@/components/ui'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/lib/auth-context'

const TABS = [
  { id: 'ringkasan', label: 'Ringkasan', icon: User },
  { id: 'skrining', label: 'Skrining', icon: ClipboardList },
  { id: 'asesmen', label: 'Asesmen', icon: Stethoscope },
  { id: 'diagnosis', label: 'Diagnosis', icon: AlertTriangle },
  { id: 'intervensi', label: 'Intervensi', icon: Pill },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'discharge', label: 'Discharge', icon: FileText },
  { id: 'riwayat', label: 'Riwayat', icon: History },
] as const

type TabId = typeof TABS[number]['id']

type Patient = {
  id: string; no_rm: string; nama: string; tanggal_lahir: string
  jenis_kelamin: string; ruangan: string; diagnosis_masuk: string
  tgl_masuk: string; status_pagt: string
}

type Screening = {
  id: string; mst_penurunan_bb: number; mst_nafsu_makan: number
  skor: number; kategori: string; status: string; created_at: string
}

type Assessment = {
  id: string; usia: number; bb: number; tb: number
  jenis_kelamin: string; tingkat_aktivitas: string
  imt: number; imt_kategori: string; bee: number; tee: number; protein_gram: number
  status: string; created_at: string; hasil: any
}

type Diagnosis = {
  id: string; kode_pes: string; pernyataan_pes: string; domain: string
  status: string; created_at: string
}

type Intervention = {
  id: string; jenis_diet: string; rute_pemberian: string
  target_energi: number; target_protein: number; tujuan_intervensi: string
  alergi: string; edukasi: string; alasan_revisi: string; status: string; created_at: string
}

type MonitoringLog = {
  id: string; tanggal: string; bb: number; asupan_persen: number
  albumin: number; gds: number; mual_muntah: string; diare: string; catatan: string
}

type DischargeSummary = {
  id: string; rekomendasi_diet: string; monitoring_lanjutan: string
  kontrol_tanggal: string; catatan: string
}

const statusConfig: Record<string, { status: 'danger' | 'warning' | 'success' | 'info' | 'muted'; label: string }> = {
  BARU_MASUK: { status: 'muted', label: 'Baru Masuk' },
  SUDAH_DISKRINING: { status: 'info', label: 'Sudah Skrining' },
  PERLU_ASESMEN: { status: 'warning', label: 'Perlu Asesmen' },
  ASESMEN_LENGKAP: { status: 'info', label: 'Asesmen Lengkap' },
  PERLU_DIAGNOSIS: { status: 'warning', label: 'Perlu Diagnosis' },
  DIAGNOSIS_DITETAPKAN: { status: 'info', label: 'Diagnosis Ditetapkan' },
  PERLU_INTERVENSI: { status: 'warning', label: 'Perlu Intervensi' },
  DALAM_INTERVENSI: { status: 'info', label: 'Dalam Intervensi' },
  DALAM_MONITORING: { status: 'success', label: 'Dalam Monitoring' },
  PERLU_RE_ASESMEN: { status: 'danger', label: 'Perlu Re-Asesmen' },
  SIAP_DISCHARGE: { status: 'info', label: 'Siap Discharge' },
  SELESAI_PULANG: { status: 'success', label: 'Selesai - Pulang' },
}

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const pid = params.id as string
  const { user } = useAuth()
  const userId = user?.id
  const [tab, setTab] = useState<TabId>('ringkasan')
  const [patient, setPatient] = useState<Patient | null>(null)
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [monitoring, setMonitoring] = useState<MonitoringLog[]>([])
  const [discharge, setDischarge] = useState<DischargeSummary | null>(null)
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showScreeningModal, setShowScreeningModal] = useState(false)
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [showIntervensiModal, setShowIntervensiModal] = useState(false)

  useEffect(() => {
    if (!pid) return
    setLoading(true)
    Promise.all([
      fetch(`/api/patients/${pid}`).then(r => r.json()),
      fetch(`/api/patients/${pid}/screenings`).then(r => r.json()),
      fetch(`/api/patients/${pid}/assessments`).then(r => r.json()),
      fetch(`/api/patients/${pid}/diagnoses`).then(r => r.json()),
      fetch(`/api/patients/${pid}/interventions`).then(r => r.json()),
      fetch(`/api/patients/${pid}/monitoring`).then(r => r.json()),
      fetch(`/api/patients/${pid}/discharge`).then(r => r.json().catch(() => null)),
    ]).then(([p, s, a, d, i, m, dc]) => {
      if (p.detail) { setPatient(null); return }
      setPatient(p)
      setScreenings(s.data || [])
      setAssessments(a.data || [])
      setDiagnoses(d.data || [])
      setInterventions(i.data || [])
      setMonitoring(m.data || [])
      setDischarge(dc?.id ? dc : null)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [pid])

  if (loading) return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--color-muted-foreground)]">Memuat...</div>
    </ProtectedRoute>
  )

  if (!patient) return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <button onClick={() => router.push('/patients')} className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] mb-6 transition cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Kembali ke daftar pasien
        </button>
        <div className="text-center py-16">
          <User className="w-12 h-12 mx-auto text-[var(--color-muted-foreground)] mb-4" />
          <h2 className="font-semibold text-[var(--color-foreground)] mb-2">Pasien Tidak Ditemukan</h2>
        </div>
      </div>
    </ProtectedRoute>
  )

  const latestAssessment = assessments[0] || null

  return (
    <ProtectedRoute>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <button onClick={() => router.push('/patients')} className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] mb-4 transition cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Kembali ke daftar pasien
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center">
            <User className="w-5 h-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">{patient.nama}</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              RM {patient.no_rm} | {patient.ruangan || '-'} | {patient.jenis_kelamin === 'pria' ? 'L' : 'P'}
            </p>
          </div>
        </div>
        <StatusBadge {...(statusConfig[patient.status_pagt] || { status: 'muted', label: patient.status_pagt })} />
      </div>

      <div className="flex gap-1 sm:gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.id
          const draftCount = t.id === 'skrining' ? screenings.filter(x => x.status === 'draft').length
            : t.id === 'asesmen' ? assessments.filter(x => x.status === 'draft').length
            : 0
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {t.label}
              {draftCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[var(--color-warning)] text-white text-[10px] font-bold">
                  {draftCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {tab === 'ringkasan' && (
        <RingkasanTab patient={patient} assessment={latestAssessment} diagnoses={diagnoses} interventions={interventions} monitoring={monitoring} />
      )}
      {tab === 'skrining' && (
        <SkriningTab
          screenings={screenings}
          onAdd={() => setShowScreeningModal(true)}
          pid={pid}
          onCreated={() => {
            setShowScreeningModal(false)
            fetch(`/api/patients/${pid}/screenings`).then(r => r.json()).then(d => setScreenings(d.data || []))
            fetch(`/api/patients/${pid}`).then(r => r.json()).then(p => setPatient(p))
          }}
        />
      )}
      {tab === 'asesmen' && (
        <AsesmenTab
          assessments={assessments}
          onAdd={() => setShowAssessmentModal(true)}
          pid={pid}
          onCreated={() => {
            setShowAssessmentModal(false)
            Promise.all([
              fetch(`/api/patients/${pid}/assessments`).then(r => r.json()),
              fetch(`/api/patients/${pid}`).then(r => r.json()),
            ]).then(([a, p]) => { setAssessments(a.data || []); setPatient(p) })
          }}
        />
      )}
      {tab === 'diagnosis' && <DiagnosisTab diagnoses={diagnoses} pid={pid} userId={userId} onCreated={() => fetch(`/api/patients/${pid}/diagnoses`).then(r => r.json()).then(d => setDiagnoses(d.data || []))} />}
      {tab === 'intervensi' && (
        <IntervensiTab
          interventions={interventions}
          onAdd={() => setShowIntervensiModal(true)}
          pid={pid}
          onCreated={() => {
            setShowIntervensiModal(false)
            fetch(`/api/patients/${pid}/interventions`).then(r => r.json()).then(d => setInterventions(d.data || []))
          }}
        />
      )}
      {tab === 'monitoring' && <MonitoringTab monitoring={monitoring} pid={pid} userId={userId} onCreated={() => fetch(`/api/patients/${pid}/monitoring`).then(r => r.json()).then(d => setMonitoring(d.data || []))} />}
      {tab === 'discharge' && <DischargeTab discharge={discharge} pid={pid} userId={userId} onCreated={() => fetch(`/api/patients/${pid}/discharge`).then(r => r.json().then(d => setDischarge(d?.id ? d : null)).catch(() => {}))} />}
      {tab === 'riwayat' && <RiwayatTab pid={pid} />}

      <ScreeningModal open={showScreeningModal} onClose={() => setShowScreeningModal(false)} pid={pid} userId={userId} onSuccess={() => {
        setShowScreeningModal(false)
        fetch(`/api/patients/${pid}/screenings`).then(r => r.json()).then(d => setScreenings(d.data || []))
        fetch(`/api/patients/${pid}`).then(r => r.json()).then(p => setPatient(p))
      }} />
      <AssessmentModal open={showAssessmentModal} onClose={() => setShowAssessmentModal(false)} pid={pid} userId={userId} onSuccess={() => {
        setShowAssessmentModal(false)
        Promise.all([
          fetch(`/api/patients/${pid}/assessments`).then(r => r.json()),
          fetch(`/api/patients/${pid}`).then(r => r.json()),
        ]).then(([a, p]) => { setAssessments(a.data || []); setPatient(p) })
      }} />
      <IntervensiModal open={showIntervensiModal} onClose={() => setShowIntervensiModal(false)} pid={pid} userId={userId} onSuccess={() => {
        setShowIntervensiModal(false)
        fetch(`/api/patients/${pid}/interventions`).then(r => r.json()).then(d => setInterventions(d.data || []))
      }} />
    </div>
    </ProtectedRoute>
  )
}

function RingkasanTab({ patient, assessment, diagnoses, interventions, monitoring }: {
  patient: Patient; assessment: Assessment | null; diagnoses: Diagnosis[]; interventions: Intervention[]; monitoring: MonitoringLog[]
}) {
  const activeDiagnoses = diagnoses.filter(d => d.status === 'active')
  const activeInterventions = interventions.filter(i => i.status === 'active')
  const latestMonitoring = monitoring[0] || null

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <div className="text-xs text-[var(--color-muted-foreground)] mb-1">Status PAGT</div>
          <StatusBadge {...(statusConfig[patient.status_pagt] || { status: 'muted', label: patient.status_pagt })} />
        </Card>
        <Card>
          <div className="text-xs text-[var(--color-muted-foreground)] mb-1">Ruangan</div>
          <div className="font-medium text-[var(--color-foreground)]">{patient.ruangan || '-'}</div>
        </Card>
        <Card>
          <div className="text-xs text-[var(--color-muted-foreground)] mb-1">Tanggal Masuk</div>
          <div className="font-medium text-[var(--color-foreground)]">{patient.tgl_masuk || '-'}</div>
        </Card>
        <Card>
          <div className="text-xs text-[var(--color-muted-foreground)] mb-1">Diagnosis Masuk</div>
          <div className="font-medium text-[var(--color-foreground)] text-sm">{patient.diagnosis_masuk || '-'}</div>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-sm text-[var(--color-foreground)] mb-3">Status Gizi Terakhir</h3>
          {assessment ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--color-muted-foreground)]">IMT</span><span className="font-medium">{assessment.imt} ({assessment.imt_kategori})</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-muted-foreground)]">BEE</span><span className="font-medium">{assessment.bee} kkal</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-muted-foreground)]">TEE</span><span className="font-medium">{assessment.tee} kkal</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-muted-foreground)]">Protein</span><span className="font-medium">{assessment.protein_gram} g</span></div>
            </div>
          ) : (
            <div className="text-sm text-[var(--color-muted-foreground)]">Belum ada assessment.</div>
          )}
        </Card>
        <Card>
          <h3 className="font-semibold text-sm text-[var(--color-foreground)] mb-3">Monitoring Terakhir</h3>
          {latestMonitoring ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--color-muted-foreground)]">Tanggal</span><span className="font-medium">{latestMonitoring.tanggal}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-muted-foreground)]">BB</span><span className="font-medium">{latestMonitoring.bb} kg</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-muted-foreground)]">Asupan</span><span className="font-medium">{latestMonitoring.asupan_persen}%</span></div>
            </div>
          ) : (
            <div className="text-sm text-[var(--color-muted-foreground)]">Belum ada monitoring.</div>
          )}
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold text-sm text-[var(--color-foreground)] mb-3">Diagnosis Aktif ({activeDiagnoses.length})</h3>
          {activeDiagnoses.length === 0 ? (
            <div className="text-sm text-[var(--color-muted-foreground)]">Belum ada diagnosis.</div>
          ) : (
            activeDiagnoses.slice(0, 3).map(d => (
              <div key={d.id} className="text-sm py-1 border-b border-[var(--color-border)] last:border-0">
                <span className="font-medium text-[var(--color-foreground)]">{d.kode_pes}</span>
                <span className="text-[var(--color-muted-foreground)] ml-2 text-xs">{d.pernyataan_pes?.substring(0, 60)}...</span>
              </div>
            ))
          )}
        </Card>
        <Card>
          <h3 className="font-semibold text-sm text-[var(--color-foreground)] mb-3">Intervensi Aktif ({activeInterventions.length})</h3>
          {activeInterventions.length === 0 ? (
            <div className="text-sm text-[var(--color-muted-foreground)]">Belum ada intervensi.</div>
          ) : (
            activeInterventions.slice(0, 3).map(i => (
              <div key={i.id} className="text-sm py-1 border-b border-[var(--color-border)] last:border-0">
                <span className="font-medium text-[var(--color-foreground)]">{i.jenis_diet}</span>
                <span className="text-[var(--color-muted-foreground)] ml-2 text-xs">{i.target_energi} kkal | {i.rute_pemberian}</span>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  )
}

function SkriningTab({ screenings, onAdd, pid, onCreated }: { screenings: Screening[]; onAdd: () => void; pid: string; onCreated: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[var(--color-foreground)]">Riwayat Skrining ({screenings.length})</h2>
        <Button size="sm" onClick={onAdd}><Plus className="w-4 h-4" /> Skrining Baru</Button>
      </div>
      {screenings.length === 0 ? (
        <Card><div className="text-sm text-[var(--color-muted-foreground)] text-center py-6">Belum ada skrining.</div></Card>
      ) : (
        <div className="space-y-2">
          {screenings.map(s => (
            <div key={s.id} className="p-3 rounded-lg border border-[var(--color-border)] bg-white text-sm flex items-center justify-between">
              <div>
                <div className="font-medium text-[var(--color-foreground)]">MST: {s.skor} — {s.kategori === 'RESIKO' ? 'Berisiko' : 'Tidak Berisiko'}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">{new Date(s.created_at).toLocaleDateString('id-ID')} | Status: {s.status}</div>
              </div>
              <StatusBadge status={s.kategori === 'RESIKO' ? 'danger' : 'success'} label={s.kategori} size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AsesmenTab({ assessments, onAdd, pid, onCreated }: { assessments: Assessment[]; onAdd: () => void; pid: string; onCreated: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[var(--color-foreground)]">Riwayat Asesmen ({assessments.length})</h2>
        <Button size="sm" onClick={onAdd}><Plus className="w-4 h-4" /> Asesmen Baru</Button>
      </div>
      {assessments.length === 0 ? (
        <Card><div className="text-sm text-[var(--color-muted-foreground)] text-center py-6">Belum ada asesmen.</div></Card>
      ) : (
        <div className="space-y-2">
          {assessments.map(a => (
            <div key={a.id} className="p-3 rounded-lg border border-[var(--color-border)] bg-white text-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-[var(--color-foreground)]">IMT {a.imt} ({a.imt_kategori})</div>
                <StatusBadge status={a.status === 'submitted' ? 'success' : 'warning'} label={a.status} size="sm" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-[var(--color-muted-foreground)]">
                <div>BEE: <span className="font-medium">{a.bee} kkal</span></div>
                <div>TEE: <span className="font-medium">{a.tee} kkal</span></div>
                <div>Protein: <span className="font-medium">{a.protein_gram} g</span></div>
              </div>
              <div className="text-xs text-[var(--color-muted-foreground)] mt-1">{new Date(a.created_at).toLocaleDateString('id-ID')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DiagnosisTab({ diagnoses, pid, userId, onCreated }: { diagnoses: Diagnosis[]; pid: string; userId?: string; onCreated: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ kode_pes: '', pernyataan_pes: '', domain: 'NI', etiologi: '', signs: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!showModal) return
    fetch(`/api/patients/${pid}/assessments?limit=1`)
      .then(r => r.json())
      .then(d => {
        const last = d.data?.[0] || null
        if (last) setForm(f => ({
          ...f,
          signs: [
            last.asupan_persen ? `asupan ${last.asupan_persen}%` : '',
            last.albumin ? `albumin ${last.albumin}` : '',
            last.gds ? `GDS ${last.gds}` : '',
            last.imt ? `IMT ${last.imt}` : '',
          ].filter(Boolean).join('; '),
        }))
      })
      .catch(() => {})
  }, [showModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.kode_pes || !form.pernyataan_pes) { setErr('Kode dan pernyataan PES wajib diisi'); return }
    setSaving(true); setErr('')
    try {
      const res = await fetch(`/api/patients/${pid}/diagnoses`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, created_by: userId }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Gagal')
      setShowModal(false); setForm({ kode_pes: '', pernyataan_pes: '', domain: 'NI', etiologi: '', signs: '' })
      onCreated()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[var(--color-foreground)]">Diagnosis PES ({diagnoses.length})</h2>
        <Button size="sm" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Diagnosis Baru</Button>
      </div>
      {diagnoses.length === 0 ? (
        <Card><div className="text-sm text-[var(--color-muted-foreground)] text-center py-6">Belum ada diagnosis.</div></Card>
      ) : (
        <div className="space-y-2">
          {diagnoses.map(d => (
            <div key={d.id} className="p-3 rounded-lg border border-[var(--color-border)] bg-white text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-[var(--color-foreground)]">{d.kode_pes}</span>
                <StatusBadge status={d.status === 'active' ? 'warning' : 'success'} label={d.status} size="sm" />
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)]">{d.pernyataan_pes}</p>
              <div className="text-xs text-[var(--color-muted-foreground)] mt-1">Domain: {d.domain} | {new Date(d.created_at).toLocaleDateString('id-ID')}</div>
            </div>
          ))}
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Diagnosis PES Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Kode PES" value={form.kode_pes} onChange={e => setForm({...form, kode_pes: e.target.value})} placeholder="NI-2.1" required />
            <Select label="Domain" options={[{label:'NI - Intake',value:'NI'},{label:'NC - Clinical',value:'NC'},{label:'NB - Behavioral',value:'NB'}]} value={form.domain} onChange={e => setForm({...form, domain: e.target.value})} />
          </div>
          <Input label="Pernyataan PES" value={form.pernyataan_pes} onChange={e => setForm({...form, pernyataan_pes: e.target.value})} placeholder="NI-2.1 Asupan oral tidak adekuat..." required />
          <Input label="Etiologi" value={form.etiologi} onChange={e => setForm({...form, etiologi: e.target.value})} placeholder="DM Tipe 2, stroke, dll" />
          <Input label="Signs/Tanda" value={form.signs} onChange={e => setForm({...form, signs: e.target.value})} placeholder="asupan 60%; albumin 3.2; GDS 210" />
          {err && <div className="p-3 rounded-lg bg-[var(--color-destructive-light)] text-[var(--color-destructive)] text-xs">{err}</div>}
          <Button type="submit" loading={saving} className="w-full">Simpan Diagnosis</Button>
        </form>
      </Modal>
    </div>
  )
}

function IntervensiTab({ interventions, onAdd, pid, onCreated }: { interventions: Intervention[]; onAdd: () => void; pid: string; onCreated: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[var(--color-foreground)]">Intervensi Gizi ({interventions.length})</h2>
        <Button size="sm" onClick={onAdd}><Plus className="w-4 h-4" /> Intervensi Baru</Button>
      </div>
      {interventions.length === 0 ? (
        <Card><div className="text-sm text-[var(--color-muted-foreground)] text-center py-6">Belum ada intervensi.</div></Card>
      ) : (
        <div className="space-y-2">
          {interventions.map(i => (
            <div key={i.id} className="p-3 rounded-lg border border-[var(--color-border)] bg-white text-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-[var(--color-foreground)]">{i.jenis_diet || '-'}</span>
                <StatusBadge status={i.status === 'active' ? 'success' : 'muted'} label={i.status} size="sm" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-[var(--color-muted-foreground)]">
                <div>Rute: {i.rute_pemberian}</div>
                <div>Energi: {i.target_energi} kkal</div>
                <div>Protein: {i.target_protein} g</div>
              </div>
              {i.tujuan_intervensi && <div className="text-xs text-[var(--color-muted-foreground)] mt-1">Tujuan: {i.tujuan_intervensi}</div>}
              {i.alergi && <div className="text-xs text-[var(--color-muted-foreground)]">Alergi: {i.alergi}</div>}
              {i.edukasi && <div className="text-xs text-[var(--color-muted-foreground)]">Edukasi: {i.edukasi}</div>}
              {i.alasan_revisi && <div className="text-xs text-[var(--color-warning)]">Revisi: {i.alasan_revisi}</div>}
              <div className="text-xs text-[var(--color-muted-foreground)] mt-1">{new Date(i.created_at).toLocaleDateString('id-ID')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MonitoringTab({ monitoring, pid, userId, onCreated }: { monitoring: MonitoringLog[]; pid: string; userId?: string; onCreated: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ tanggal: new Date().toISOString().split('T')[0], bb: '', asupan_persen: '', albumin: '', gds: '', mual_muntah: '', diare: '', catatan: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [reAssessing, setReAssessing] = useState(false)

  const handleReAssessment = async () => {
    setReAssessing(true)
    try {
      await fetch(`/api/patients/${pid}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'TANDA_RE_ASESMEN' }),
      })
      onCreated()
    } catch (e: any) { setErr(e.message) }
    finally { setReAssessing(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const res = await fetch(`/api/patients/${pid}/monitoring`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, created_by: userId }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Gagal')
      setShowModal(false)
      setForm({ tanggal: new Date().toISOString().split('T')[0], bb: '', asupan_persen: '', albumin: '', gds: '', mual_muntah: '', diare: '', catatan: '' })
      onCreated()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[var(--color-foreground)]">Log Monitoring ({monitoring.length})</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" loading={reAssessing} onClick={handleReAssessment}><AlertTriangle className="w-4 h-4" /> Perlu Re-Asesmen</Button>
          <Button size="sm" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Tambah Hari Ini</Button>
        </div>
      </div>
      {monitoring.length === 0 ? (
        <Card><div className="text-sm text-[var(--color-muted-foreground)] text-center py-6">Belum ada data monitoring.</div></Card>
      ) : (
        <div className="space-y-2">
          {monitoring.slice(0, 20).map(m => (
            <div key={m.id} className="p-3 rounded-lg border border-[var(--color-border)] bg-white text-sm">
              <div className="font-medium text-[var(--color-foreground)] mb-1">{m.tanggal}</div>
              <div className="grid grid-cols-4 gap-2 text-xs text-[var(--color-muted-foreground)]">
                <div>BB: <span className="font-medium">{m.bb} kg</span></div>
                <div>Asupan: <span className="font-medium">{m.asupan_persen}%</span></div>
                <div>Albumin: <span className="font-medium">{m.albumin} g/dL</span></div>
                <div>GDS: <span className="font-medium">{m.gds} mg/dL</span></div>
              </div>
              {m.catatan && <div className="text-xs text-[var(--color-muted-foreground)] mt-1">{m.catatan}</div>}
            </div>
          ))}
          {monitoring.length > 20 && (
            <div className="text-xs text-[var(--color-muted-foreground)] text-center">...dan {monitoring.length - 20} entri lainnya</div>
          )}
        </div>
      )}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Entri Monitoring Harian">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Tanggal" type="date" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="BB (kg)" type="number" step="0.1" value={form.bb} onChange={e => setForm({...form, bb: e.target.value})} />
            <Input label="Asupan (%)" type="number" value={form.asupan_persen} onChange={e => setForm({...form, asupan_persen: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Albumin (g/dL)" type="number" step="0.1" value={form.albumin} onChange={e => setForm({...form, albumin: e.target.value})} />
            <Input label="GDS (mg/dL)" type="number" value={form.gds} onChange={e => setForm({...form, gds: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Mual/Muntah" value={form.mual_muntah} onChange={e => setForm({...form, mual_muntah: e.target.value})} placeholder="Tidak / Kadang / Sering" />
            <Input label="Diare" value={form.diare} onChange={e => setForm({...form, diare: e.target.value})} placeholder="Tidak / Ya" />
          </div>
          <Input label="Catatan" value={form.catatan} onChange={e => setForm({...form, catatan: e.target.value})} placeholder="Observasi tambahan" />
          {err && <div className="p-3 rounded-lg bg-[var(--color-destructive-light)] text-[var(--color-destructive)] text-xs">{err}</div>}
          <Button type="submit" loading={saving} className="w-full">Simpan</Button>
        </form>
      </Modal>
    </div>
  )
}

function DischargeTab({ discharge, pid, userId, onCreated }: { discharge: DischargeSummary | null; pid: string; userId?: string; onCreated: () => void }) {
  const [form, setForm] = useState({ rekomendasi_diet: '', monitoring_lanjutan: '', kontrol_tanggal: '', catatan: '' })
  const [saving, setSaving] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [err, setErr] = useState('')
  const [editing, setEditing] = useState(false)

  const hasDischarge = !!discharge

  useEffect(() => {
    if (discharge) setForm({
      rekomendasi_diet: discharge.rekomendasi_diet || '',
      monitoring_lanjutan: discharge.monitoring_lanjutan || '',
      kontrol_tanggal: discharge.kontrol_tanggal || '',
      catatan: discharge.catatan || '',
    })
  }, [discharge])

  useEffect(() => {
    if (!hasDischarge) return
    const hasChanges = form.rekomendasi_diet || form.monitoring_lanjutan || form.kontrol_tanggal || form.catatan
    if (!hasChanges) return
    const timer = setTimeout(async () => {
      try {
        await fetch(`/api/patients/${pid}/discharge`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, created_by: userId, _method: 'PATCH' }),
        })
        setLastSaved(new Date().toLocaleTimeString('id-ID'))
      } catch {}
    }, 5000)
    return () => clearTimeout(timer)
  }, [form, pid, userId, hasDischarge])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const method = discharge ? 'PATCH' : 'POST'
      const res = await fetch(`/api/patients/${pid}/discharge`, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, created_by: userId }),
      })
      if (!res.ok && res.status !== 201 && res.status !== 200) {
        const d = await res.text()
        throw new Error(d || 'Gagal')
      }
      setEditing(false)
      onCreated()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  const handleFinish = async () => {
    setFinishing(true)
    try {
      await fetch(`/api/patients/${pid}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'SELESAI_PULANG' }),
      })
      onCreated()
    } catch (e: any) { setErr(e.message) }
    finally { setFinishing(false) }
  }

  if (discharge && !editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--color-foreground)]">Discharge Summary</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
            <Button size="sm" loading={finishing} onClick={handleFinish}><LogOut className="w-4 h-4" /> Selesai Pulang</Button>
          </div>
        </div>
        <Card>
          <div className="space-y-3 text-sm">
            <div><span className="text-[var(--color-muted-foreground)]">Rekomendasi Diet:</span><p className="font-medium text-[var(--color-foreground)]">{discharge.rekomendasi_diet || '-'}</p></div>
            <div><span className="text-[var(--color-muted-foreground)]">Monitoring Lanjutan:</span><p className="font-medium text-[var(--color-foreground)]">{discharge.monitoring_lanjutan || '-'}</p></div>
            <div><span className="text-[var(--color-muted-foreground)]">Kontrol Tanggal:</span><p className="font-medium text-[var(--color-foreground)]">{discharge.kontrol_tanggal || '-'}</p></div>
            <div><span className="text-[var(--color-muted-foreground)]">Catatan:</span><p className="font-medium text-[var(--color-foreground)]">{discharge.catatan || '-'}</p></div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-[var(--color-foreground)]">{discharge ? 'Edit' : 'Buat'} Discharge Summary</h2>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Rekomendasi Diet" value={form.rekomendasi_diet} onChange={e => setForm({...form, rekomendasi_diet: e.target.value})} placeholder="Lanjutkan Diet DM 1700 kkal" />
          <Input label="Monitoring Lanjutan" value={form.monitoring_lanjutan} onChange={e => setForm({...form, monitoring_lanjutan: e.target.value})} placeholder="Kontrol gula darah mandiri, pantau BB 1x/minggu" />
          <Input label="Tanggal Kontrol" type="date" value={form.kontrol_tanggal} onChange={e => setForm({...form, kontrol_tanggal: e.target.value})} />
          <Input label="Catatan" value={form.catatan} onChange={e => setForm({...form, catatan: e.target.value})} placeholder="Pasien pulang dengan kondisi stabil" />
          {err && <div className="p-3 rounded-lg bg-[var(--color-destructive-light)] text-[var(--color-destructive)] text-xs">{err}</div>}
          <div className="flex items-center justify-between">
            {lastSaved && <span className="text-xs text-[var(--color-muted-foreground)]">Draft tersimpan {lastSaved}</span>}
            <div className="flex-1" />
            <Button type="submit" loading={saving} className="">{discharge ? 'Update' : 'Simpan'} Discharge Summary</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

const activityIcons: Record<string, any> = {
  skrining: ClipboardCheck,
  asesmen: Stethoscope,
  diagnosis: AlertTriangle,
  intervensi: Pill,
  monitoring: Activity,
  discharge: LogOut,
}

function RiwayatTab({ pid }: { pid: string }) {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pid) return
    setLoading(true)
    fetch(`/api/patients/${pid}/history`)
      .then(r => r.json())
      .then(d => setActivities(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [pid])

  if (loading) return (
    <div className="text-sm text-[var(--color-muted-foreground)] text-center py-8">Memuat riwayat...</div>
  )

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-[var(--color-foreground)]">Riwayat Aktivitas ({activities.length})</h2>
      {activities.length === 0 ? (
        <Card><div className="text-sm text-[var(--color-muted-foreground)] text-center py-6">Belum ada aktivitas.</div></Card>
      ) : (
        <div className="relative pl-6">
          <div className="absolute left-2.5 top-2 bottom-2 w-px bg-[var(--color-border)]" />
          <div className="space-y-4">
            {activities.map((a, idx) => {
              const Icon = activityIcons[a.type] || History
              return (
                <div key={`${a.type}-${a.id}-${idx}`} className="relative">
                  <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] ring-2 ring-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--color-border)] bg-white text-sm ml-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                      <span className="font-medium text-[var(--color-foreground)]">{a.description}</span>
                    </div>
                    {a.detail && <div className="text-xs text-[var(--color-muted-foreground)] ml-6">{a.detail}</div>}
                    <div className="text-xs text-[var(--color-muted-foreground)] mt-1 ml-6">
                      {new Date(a.created_at).toLocaleString('id-ID', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function ScreeningModal({ open, onClose, pid, userId, onSuccess }: { open: boolean; onClose: () => void; pid: string; userId?: string; onSuccess: () => void }) {
  const [form, setForm] = useState({ mst_penurunan_bb: '', mst_nafsu_makan: '' })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!open) return
    fetch(`/api/patients/${pid}/screenings?limit=1`)
      .then(r => r.json())
      .then(d => {
        const last = d.data?.[0] || d[0] || null
        if (last) setForm({ mst_penurunan_bb: String(last.mst_penurunan_bb ?? ''), mst_nafsu_makan: String(last.mst_nafsu_makan ?? '') })
      })
      .catch(() => {})
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const res = await fetch(`/api/patients/${pid}/screenings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'submitted', created_by: userId }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Gagal')
      setForm({ mst_penurunan_bb: '', mst_nafsu_makan: '' })
      onSuccess()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Skrining MST Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label="Q1: Penurunan Berat Badan?" options={[
          { label: 'Tidak (skor 0)', value: '0' },
          { label: 'Iya, 1-5 kg (skor 1)', value: '1' },
          { label: 'Iya, >5 kg (skor 2)', value: '2' },
        ]} value={form.mst_penurunan_bb} onChange={e => setForm({...form, mst_penurunan_bb: e.target.value})} required />
        <Select label="Q2: Nafsu Makan?" options={[
          { label: 'Baik (skor 0)', value: '0' },
          { label: 'Sedang (skor 1)', value: '1' },
          { label: 'Buruk (skor 2)', value: '2' },
        ]} value={form.mst_nafsu_makan} onChange={e => setForm({...form, mst_nafsu_makan: e.target.value})} required />
        {err && <div className="p-3 rounded-lg bg-[var(--color-destructive-light)] text-[var(--color-destructive)] text-xs">{err}</div>}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Batal</Button>
          <Button type="submit" loading={saving} className="flex-1">Simpan Skrining</Button>
        </div>
      </form>
    </Modal>
  )
}

function IntervensiModal({ open, onClose, pid, userId, onSuccess }: { open: boolean; onClose: () => void; pid: string; userId?: string; onSuccess: () => void }) {
  const [form, setForm] = useState({
    jenis_diet: '', rute_pemberian: 'ORAL', target_energi: '', target_protein: '',
    tujuan_intervensi: '', alergi: '', edukasi: '', alasan_revisi: '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!open) return
    fetch(`/api/patients/${pid}/assessments?limit=1`)
      .then(r => r.json())
      .then(d => {
        const last = d.data?.[0] || null
        if (last) setForm(f => ({
          ...f,
          target_energi: last.tee ? String(Math.round(last.tee)) : f.target_energi,
          target_protein: last.protein_gram ? String(Math.round(last.protein_gram)) : f.target_protein,
        }))
      })
      .catch(() => {})
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const res = await fetch(`/api/patients/${pid}/interventions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          target_energi: form.target_energi ? Number(form.target_energi) : null,
          target_protein: form.target_protein ? Number(form.target_protein) : null,
          created_by: userId,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Gagal')
      setForm({ jenis_diet: '', rute_pemberian: 'ORAL', target_energi: '', target_protein: '', tujuan_intervensi: '', alergi: '', edukasi: '', alasan_revisi: '' })
      onSuccess()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Intervensi Gizi Baru">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          <Select label="Jenis Diet" options={[
            { label: 'Diet DM', value: 'Diet DM' },
            { label: 'Diet Jantung', value: 'Diet Jantung' },
            { label: 'Diet Ginjal', value: 'Diet Ginjal' },
            { label: 'Diet TETP', value: 'Diet TETP' },
            { label: 'Diet Rendah Protein', value: 'Diet Rendah Protein' },
            { label: 'Diet Serat', value: 'Diet Serat' },
            { label: 'Diet Cair', value: 'Diet Cair' },
            { label: 'Diet Lunak', value: 'Diet Lunak' },
            { label: 'Diet Biasa', value: 'Diet Biasa' },
            { label: 'Lainnya', value: 'Lainnya' },
          ]} value={form.jenis_diet} onChange={e => setForm({...form, jenis_diet: e.target.value})} required />
          <Select label="Rute Pemberian" options={[
            { label: 'Oral', value: 'ORAL' },
            { label: 'Enteral', value: 'ENTERAL' },
            { label: 'Parenteral', value: 'PARENTERAL' },
          ]} value={form.rute_pemberian} onChange={e => setForm({...form, rute_pemberian: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Target Energi (kkal)" type="number" value={form.target_energi} onChange={e => setForm({...form, target_energi: e.target.value})} />
          <Input label="Target Protein (g)" type="number" value={form.target_protein} onChange={e => setForm({...form, target_protein: e.target.value})} />
        </div>
        <Input label="Tujuan Intervensi" value={form.tujuan_intervensi} onChange={e => setForm({...form, tujuan_intervensi: e.target.value})} placeholder="Mencapai asupan 80% dalam 3 hari" />
        <Input label="Alergi" value={form.alergi} onChange={e => setForm({...form, alergi: e.target.value})} placeholder="Telur, seafood, laktosa" />
        <Input label="Edukasi" value={form.edukasi} onChange={e => setForm({...form, edukasi: e.target.value})} placeholder="Edukasi diet DM mandiri" />
        <Input label="Alasan Revisi (jika revisi)" value={form.alasan_revisi} onChange={e => setForm({...form, alasan_revisi: e.target.value})} placeholder="Perubahan kondisi klinis" />
        {err && <div className="p-3 rounded-lg bg-[var(--color-destructive-light)] text-[var(--color-destructive)] text-xs">{err}</div>}
        <Button type="submit" loading={saving} className="w-full">Simpan Intervensi</Button>
      </form>
    </Modal>
  )
}

function AssessmentModal({ open, onClose, pid, userId, onSuccess }: { open: boolean; onClose: () => void; pid: string; userId?: string; onSuccess: () => void }) {
  const [form, setForm] = useState({
    usia: '', bb: '', tb: '', jenis_kelamin: 'wanita', tingkat_aktivitas: 'RINGAN',
    mst_penurunan_bb: '', mst_nafsu_makan: '',
    diagnosis_medis: '', keluhan: '', asupan_persen: '', albumin: '', gds: '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [preview, setPreview] = useState<any>(null)

  useEffect(() => {
    if (!open) return
    Promise.all([
      fetch(`/api/patients/${pid}`).then(r => r.json()),
      fetch(`/api/patients/${pid}/assessments?limit=1`).then(r => r.json()),
      fetch(`/api/patients/${pid}/screenings?limit=1`).then(r => r.json()),
    ]).then(([patient, assmtRes, scrnRes]) => {
      const prev = assmtRes.data?.[0] || null
      const lastScr = scrnRes.data?.[0] || scrnRes[0] || null
      setForm(f => ({
        ...f,
        usia: patient?.usia ? String(patient.usia) : f.usia,
        bb: prev?.bb ? String(prev.bb) : f.bb,
        tb: prev?.tb ? String(prev.tb) : f.tb,
        jenis_kelamin: patient?.jenis_kelamin || f.jenis_kelamin,
        mst_penurunan_bb: lastScr?.mst_penurunan_bb !== undefined ? String(lastScr.mst_penurunan_bb) : f.mst_penurunan_bb,
        mst_nafsu_makan: lastScr?.mst_nafsu_makan !== undefined ? String(lastScr.mst_nafsu_makan) : f.mst_nafsu_makan,
      }))
    }).catch(() => {})
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setErr('')
    try {
      const body = {
        usia: form.usia ? Number(form.usia) : null,
        bb: form.bb ? Number(form.bb) : null,
        tb: form.tb ? Number(form.tb) : null,
        jenis_kelamin: form.jenis_kelamin,
        tingkat_aktivitas: form.tingkat_aktivitas,
        mst_penurunan_bb: form.mst_penurunan_bb ? Number(form.mst_penurunan_bb) : null,
        mst_nafsu_makan: form.mst_nafsu_makan ? Number(form.mst_nafsu_makan) : null,
        diagnosis_medis: form.diagnosis_medis ? form.diagnosis_medis.split(',').map((s: string) => s.trim()) : [],
        keluhan: form.keluhan ? form.keluhan.split(',').map((s: string) => s.trim()) : [],
        asupan_persen: form.asupan_persen ? Number(form.asupan_persen) : null,
        albumin: form.albumin ? Number(form.albumin) : null,
        gds: form.gds ? Number(form.gds) : null,
        status: 'submitted',
        created_by: userId,
      }
      const res = await fetch(`/api/patients/${pid}/assessments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Gagal')
      onSuccess()
    } catch (e: any) { setErr(e.message) }
    finally { setSaving(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Asesmen Gizi Baru">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-3 gap-2">
          <Input label="Usia" type="number" value={form.usia} onChange={e => setForm({...form, usia: e.target.value})} placeholder="thn" />
          <Input label="BB" type="number" step="0.1" value={form.bb} onChange={e => setForm({...form, bb: e.target.value})} placeholder="kg" />
          <Input label="TB" type="number" step="0.1" value={form.tb} onChange={e => setForm({...form, tb: e.target.value})} placeholder="cm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select label="JK" options={[{label:'Pria',value:'pria'},{label:'Wanita',value:'wanita'}]} value={form.jenis_kelamin} onChange={e => setForm({...form, jenis_kelamin: e.target.value})} />
          <Select label="Aktivitas" options={[{label:'TB (1.2)',value:'TB'},{label:'Ringan (1.3)',value:'RINGAN'},{label:'Sedang (1.4)',value:'SEDANG'}]} value={form.tingkat_aktivitas} onChange={e => setForm({...form, tingkat_aktivitas: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select label="MST Q1" options={[{label:'Tidak (0)',value:'0'},{label:'1-5 kg (1)',value:'1'},{label:'>5 kg (2)',value:'2'}]} value={form.mst_penurunan_bb} onChange={e => setForm({...form, mst_penurunan_bb: e.target.value})} />
          <Select label="MST Q2" options={[{label:'Baik (0)',value:'0'},{label:'Sedang (1)',value:'1'},{label:'Buruk (2)',value:'2'}]} value={form.mst_nafsu_makan} onChange={e => setForm({...form, mst_nafsu_makan: e.target.value})} />
        </div>
        <Input label="Diagnosis Medis (pisahkan dengan koma)" value={form.diagnosis_medis} onChange={e => setForm({...form, diagnosis_medis: e.target.value})} placeholder="DM Tipe 2, Hipertensi" />
        <Input label="Keluhan (pisahkan dengan koma)" value={form.keluhan} onChange={e => setForm({...form, keluhan: e.target.value})} placeholder="poliuria, polidipsi" />
        <div className="grid grid-cols-3 gap-2">
          <Input label="Asupan %" type="number" value={form.asupan_persen} onChange={e => setForm({...form, asupan_persen: e.target.value})} />
          <Input label="Albumin" type="number" step="0.1" value={form.albumin} onChange={e => setForm({...form, albumin: e.target.value})} placeholder="g/dL" />
          <Input label="GDS" type="number" value={form.gds} onChange={e => setForm({...form, gds: e.target.value})} placeholder="mg/dL" />
        </div>
        {err && <div className="p-3 rounded-lg bg-[var(--color-destructive-light)] text-[var(--color-destructive)] text-xs">{err}</div>}
        <Button type="submit" loading={saving} className="w-full">Proses Assessment</Button>
      </form>
    </Modal>
  )
}

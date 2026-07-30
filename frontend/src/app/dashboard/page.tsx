'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, ClipboardList, Activity, AlertTriangle,
  ArrowRight, Plus, User, Calendar, DoorOpen, Stethoscope, Search
} from 'lucide-react'
import { Card, Button, StatusBadge, Input, Select, Modal } from '@/components/ui'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/lib/auth-context'

type Patient = {
  id: string
  no_rm: string
  nama: string
  ruangan: string
  tanggal_lahir: string
  jenis_kelamin: string
  diagnosis_masuk: string
  tgl_masuk: string
  status_pagt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState({ total_pasien: 0, assesment_hari_ini: 0, risiko_tinggi: 0, monitoring_aktif: 0 })
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    no_rm: '', nama: '', tanggal_lahir: '', jenis_kelamin: 'pria' as string,
    ruangan: '', diagnosis_masuk: '', bb: '', tb: '',
  })
  const [formError, setFormError] = useState('')

  const [activities, setActivities] = useState<any[]>([])

  const fetchDashboard = async () => {
    try {
      const [pRes, sRes, aRes] = await Promise.all([
        fetch('/api/patients?limit=5'),
        fetch('/api/stats'),
        fetch('/api/activities'),
      ])
      const pData = await pRes.json()
      const sData = await sRes.json()
      const aData = await aRes.json()
      const list: Patient[] = pData.data || []
      setPatients(list)
      setStats({
        total_pasien: sData.total_pasien || pData.total || 0,
        assesment_hari_ini: sData.assesment_hari_ini || 0,
        risiko_tinggi: sData.risiko_tinggi || 0,
        monitoring_aktif: sData.monitoring_aktif || 0,
      })
      setActivities(aData || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchDashboard() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.no_rm.trim() || !form.nama.trim()) {
      setFormError('No. RM dan Nama wajib diisi')
      return
    }
    setFormError('')
    setSaving(true)
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, created_by: user?.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || data.supabase_error || 'Gagal menyimpan')
      const pid = data.id || data[0]?.id
      setShowModal(false)
      router.push(`/patients/${pid}`)
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
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
  const getStatus = (s: string) => statusConfig[s] || { status: 'muted' as const, label: s }

  return (
    <ProtectedRoute>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-[var(--color-primary)]" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">Dashboard</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {loading ? 'Memuat...' : `${stats.total_pasien} pasien terdaftar`}
            </p>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Tambah Pasien
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { icon: Users, label: 'Total Pasien', value: stats.total_pasien, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary-light)]' },
          { icon: ClipboardList, label: 'Assessment Hari Ini', value: stats.assesment_hari_ini, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent-light)]' },
          { icon: AlertTriangle, label: 'Perlu Tindakan', value: stats.risiko_tinggi, color: 'text-[var(--color-destructive)]', bg: 'bg-[var(--color-destructive-light)]' },
          { icon: Activity, label: 'Monitoring Aktif', value: stats.monitoring_aktif, color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning-light)]' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">{s.label}</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--color-primary)]" />
              <h2 className="font-semibold text-[var(--color-foreground)]">Pasien Terbaru</h2>
            </div>
            <a href="/patients" className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          {loading ? (
            <div className="text-sm text-[var(--color-muted-foreground)] py-4">Memuat...</div>
          ) : patients.length === 0 ? (
            <div className="text-sm text-[var(--color-muted-foreground)] text-center py-8">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Belum ada data pasien.
              <br />
              <button
                onClick={() => setShowModal(true)}
                className="text-[var(--color-primary)] hover:underline mt-2 inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah pasien pertama
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => router.push(`/patients/${p.id}`)}
                  className="w-full text-left p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition bg-white cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-[var(--color-foreground)]">{p.nama}</div>
                      <div className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                        RM {p.no_rm} | {p.ruangan || '-'}
                      </div>
                    </div>
                    <StatusBadge {...getStatus(p.status_pagt)} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--color-primary)]" />
              <h2 className="font-semibold text-[var(--color-foreground)]">Aktivitas Terbaru</h2>
            </div>
          </div>
          {activities.length === 0 ? (
            <div className="text-sm text-[var(--color-muted-foreground)] text-center py-8">
              {stats.total_pasien === 0 ? 'Belum ada aktivitas.' : 'Memuat aktivitas...'}
            </div>
          ) : (
            <div className="space-y-2">
              {activities.slice(0, 8).map((a: any, i: number) => (
                <button
                  key={`${a.type}-${a.id}-${i}`}
                  onClick={() => router.push(`/patients/${a.pasien_id}`)}
                  className="w-full text-left p-2.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] transition bg-white cursor-pointer text-sm"
                >
                  <div className="font-medium text-[var(--color-foreground)] text-xs">{a.pasien_nama}</div>
                  <div className="text-[var(--color-muted-foreground)] text-xs mt-0.5">{a.description}</div>
                  <div className="text-[var(--color-muted-foreground)] text-[10px] mt-0.5">
                    {new Date(a.created_at).toLocaleDateString('id-ID')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setFormError('') }} title="Tambah Pasien Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="No. Rekam Medis"
            value={form.no_rm}
            onChange={(e) => setForm({ ...form, no_rm: e.target.value })}
            placeholder="RM-xxxxx"
            required
          />
          <Input
            label="Nama Pasien"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Nama lengkap"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Tanggal Lahir"
              type="date"
              value={form.tanggal_lahir}
              onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
            />
            <Select
              label="Jenis Kelamin"
              options={[
                { label: 'Pria', value: 'pria' },
                { label: 'Wanita', value: 'wanita' },
              ]}
              value={form.jenis_kelamin}
              onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
            />
          </div>
          <Input
            label="Ruangan"
            value={form.ruangan}
            onChange={(e) => setForm({ ...form, ruangan: e.target.value })}
            placeholder="Ruang Flamboyan"
          />
          <Input
            label="Diagnosis Masuk"
            value={form.diagnosis_masuk}
            onChange={(e) => setForm({ ...form, diagnosis_masuk: e.target.value })}
            placeholder="DM Tipe 2, Hipertensi, dll"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="BB (kg)" type="number" step="0.1" value={form.bb} onChange={e => setForm({...form, bb: e.target.value})} placeholder="Berat badan" />
            <Input label="TB (cm)" type="number" step="0.1" value={form.tb} onChange={e => setForm({...form, tb: e.target.value})} placeholder="Tinggi badan" />
          </div>
          {form.bb && form.tb && Number(form.tb) > 0 && (
            <div className="p-2 rounded-lg bg-[var(--color-primary-light)] text-xs text-[var(--color-primary)]">
              IMT: {(Number(form.bb) / ((Number(form.tb) / 100) ** 2)).toFixed(1)}
              {' — '}
              {(() => {
                const imt = Number(form.bb) / ((Number(form.tb) / 100) ** 2)
                if (imt < 18.5) return 'Kurus'
                if (imt < 25) return 'Normal'
                if (imt < 30) return 'Gemuk'
                return 'Obesitas'
              })()}
            </div>
          )}
          {formError && (
            <div className="p-3 rounded-lg bg-[var(--color-destructive-light)] text-[var(--color-destructive)] text-xs">{formError}</div>
          )}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { setShowModal(false); setFormError('') }} className="flex-1">
              Batal
            </Button>
            <Button type="submit" loading={saving} className="flex-1">
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
    </ProtectedRoute>
  )
}

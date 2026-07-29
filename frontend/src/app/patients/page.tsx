'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Plus, Search, ChevronRight } from 'lucide-react'
import { Card, Button, StatusBadge } from '@/components/ui'
import { ProtectedRoute } from '@/components/auth/protected-route'

type Patient = {
  id: string; no_rm: string; nama: string; ruangan: string
  tanggal_lahir: string; jenis_kelamin: string
  tgl_masuk: string; status_pagt: string
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

export default function PatientsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = search ? `?search=${encodeURIComponent(search)}&limit=100` : '?limit=100'
    fetch(`/api/patients${params}`)
      .then(r => r.json())
      .then(d => setPatients(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search])

  return (
    <ProtectedRoute>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[var(--color-primary)]" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">Daftar Pasien</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">{patients.length} pasien terdaftar</p>
          </div>
        </div>
        <Button onClick={() => router.push('/dashboard')}>
          <Plus className="w-4 h-4" /> Tambah Pasien
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pasien (nama / No. RM)..."
          className="clinical-input pl-9"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-sm text-[var(--color-muted-foreground)]">Memuat data...</div>
      ) : patients.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 mx-auto text-[var(--color-muted-foreground)] mb-4" />
          <h2 className="font-semibold text-[var(--color-foreground)] mb-2">Belum Ada Pasien</h2>
          <p className="text-sm text-[var(--color-muted-foreground)] mb-6">
            Tambah pasien baru dari dashboard.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            <Plus className="w-4 h-4" /> Ke Dashboard
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => router.push(`/patients/${p.id}`)}
              className="w-full text-left clinical-card hover:shadow-md transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[var(--color-foreground)]">{p.nama}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">
                    RM {p.no_rm} | {p.ruangan || '-'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge {...(statusConfig[p.status_pagt] || { status: 'muted', label: p.status_pagt })} size="sm" />
                  <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
}

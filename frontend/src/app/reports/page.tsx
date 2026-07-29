'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Download, Loader2 } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { ProtectedRoute } from '@/components/auth/protected-route'

type StatRow = { label: string; baik: number; risiko: number; malnutrisi: number; total: number }

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total_pasien: 0, monitoring_aktif: 0, assesment_hari_ini: 0, risiko_tinggi: 0 })
  const [screenings, setScreenings] = useState<StatRow[]>([])
  const [unitStats, setUnitStats] = useState<{ ruangan: string; total: number }[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/patients?limit=1000').then(r => r.json()).then(async (d) => {
        const allPatients = d.data || []
        const sData: StatRow[] = []
        for (const p of allPatients.slice(0, 20)) {
          try {
            const skr = await fetch(`/api/patients/${p.id}/screening`).then(r => r.json())
            const sc = skr[0]
            if (sc?.mst_score !== undefined || sc?.mst_total !== undefined) {
              const score = sc.mst_score ?? sc.mst_total ?? 0
              sData.push({ label: p.nama, risiko: score >= 4 ? 1 : 0, baik: score >= 4 ? 0 : 1, malnutrisi: 0, total: 1 })
            }
          } catch {}
        }
        const unitMap: Record<string, number> = {}
        for (const p of allPatients) {
          const r = p.ruangan || 'Tanpa Ruangan'
          unitMap[r] = (unitMap[r] || 0) + 1
        }
        return {
          screenings: sData,
          unitStats: Object.entries(unitMap).map(([ruangan, total]) => ({ ruangan, total })).sort((a, b) => b.total - a.total),
        }
      }),
    ])
      .then(([s, r]) => {
        setStats(s)
        setScreenings(r.screenings)
        setUnitStats(r.unitStats)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const baik = screenings.filter(s => s.baik).length
  const risiko = screenings.filter(s => s.risiko).length
  const totalSkrining = screenings.length

  return (
    <ProtectedRoute>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-[var(--color-primary)]" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)]">Laporan & Statistik</h1>
            <p className="text-sm text-[var(--color-muted-foreground)]">Rangkuman data gizi klinik</p>
          </div>
        </div>
        <Button variant="outline" disabled>
          <Download className="w-4 h-4" /> Export (Coming Soon)
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--color-muted-foreground)]" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <Card><div className="text-sm"><span className="text-[var(--color-muted-foreground)]">Total Pasien</span><p className="text-2xl font-bold text-[var(--color-foreground)]">{stats.total_pasien}</p></div></Card>
            <Card><div className="text-sm"><span className="text-[var(--color-muted-foreground)]">Assesment Hari Ini</span><p className="text-2xl font-bold text-[var(--color-foreground)]">{stats.assesment_hari_ini}</p></div></Card>
            <Card><div className="text-sm"><span className="text-[var(--color-muted-foreground)]">Monitoring Aktif</span><p className="text-2xl font-bold text-[var(--color-foreground)]">{stats.monitoring_aktif}</p></div></Card>
            <Card><div className="text-sm"><span className="text-[var(--color-muted-foreground)]">Risiko Tinggi</span><p className="text-2xl font-bold text-[var(--color-destructive)]">{stats.risiko_tinggi}</p></div></Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card title="Status Gizi Pasien (Skrining)">
              {totalSkrining === 0 ? (
                <p className="text-sm text-[var(--color-muted-foreground)] py-6 text-center">Belum ada data skrining.</p>
              ) : (
                <div className="space-y-3 py-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted-foreground)]">Baik (MST 0-3)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 sm:w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${totalSkrining ? (baik / totalSkrining) * 100 : 0}%` }} />
                      </div>
                      <span className="font-semibold text-sm w-10 text-right">{baik}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted-foreground)]">Risiko (MST &ge;4)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 sm:w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${totalSkrining ? (risiko / totalSkrining) * 100 : 0}%` }} />
                      </div>
                      <span className="font-semibold text-sm w-10 text-right">{risiko}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card title="Distribusi per Ruangan">
              {unitStats.length === 0 ? (
                <p className="text-sm text-[var(--color-muted-foreground)] py-6 text-center">Belum ada data pasien.</p>
              ) : (
                <div className="space-y-2 py-2">
                  {unitStats.slice(0, 8).map((u) => (
                    <div key={u.ruangan} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-muted-foreground)]">{u.ruangan}</span>
                      <span className="font-semibold">{u.total}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
    </ProtectedRoute>
  )
}

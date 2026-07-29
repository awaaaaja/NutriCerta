import { MonitoringResult, Citation } from './models'

const MONITORING_REGISTRY: Record<string, { parameter: string; frekuensi: string; keterangan: string }> = {
  'MONITOR-BB-001': {
    parameter: 'Berat Badan',
    frekuensi: '1x/minggu',
    keterangan: 'Timbang BB setiap minggu pada waktu yang sama',
  },
  'MONITOR-ASUPAN-001': {
    parameter: 'Asupan Makan (Comstock)',
    frekuensi: 'Setiap hari',
    keterangan: 'Catat sisa makan pasien dengan metode Comstock',
  },
  'MONITOR-IMT-001': {
    parameter: 'IMT',
    frekuensi: '1x/bulan',
    keterangan: 'Hitung IMT ulang setiap bulan',
  },
  'MONITOR-LILA-001': {
    parameter: 'LILA (Lingkar Lengan Atas)',
    frekuensi: '1x/bulan',
    keterangan: 'Ukur LILA sebagai indikator massa otot',
  },
  'MONITOR-ALBUMIN-001': {
    parameter: 'Albumin',
    frekuensi: 'Sesuai indikasi',
    keterangan: 'Cek albumin serum untuk menilai status protein visceral',
  },
  'MONITOR-GDS-001': {
    parameter: 'Gula Darah Sewaktu',
    frekuensi: 'Sesuai indikasi',
    keterangan: 'Cek GDS untuk pasien DM atau risiko hipoglikemi',
  },
}

export function rekomendasi_monitoring(
  diagnosis_medis: string[],
  imt_kategori: string,
  mst_kategori: string,
): [MonitoringResult[], Citation[]] {
  const results: MonitoringResult[] = []
  const citations: Citation[] = []
  const monitor_keys: string[] = []

  monitor_keys.push('MONITOR-BB-001')
  monitor_keys.push('MONITOR-ASUPAN-001')

  if (mst_kategori === 'RISIKO') {
    monitor_keys.push('MONITOR-IMT-001')
    monitor_keys.push('MONITOR-LILA-001')
    monitor_keys.push('MONITOR-ALBUMIN-001')
  }

  for (const dm of diagnosis_medis) {
    if (['dm', 'diabetes', 'gds'].some((k) => dm.toLowerCase().includes(k))) {
      monitor_keys.push('MONITOR-GDS-001')
    }
    if (['ginjal', 'ckd', 'albumin'].some((k) => dm.toLowerCase().includes(k))) {
      monitor_keys.push('MONITOR-ALBUMIN-001')
    }
  }

  const seen = new Set<string>()
  for (const key of monitor_keys) {
    if (seen.has(key)) continue
    seen.add(key)
    const info = MONITORING_REGISTRY[key]
    if (info) {
      results.push({ parameter: info.parameter, frekuensi: info.frekuensi, keterangan: info.keterangan })
      citations.push({
        rule: key,
        source_id: 'PGRS-001',
        kutipan: `Monitoring: ${info.parameter} — ${info.frekuensi}`,
      })
    }
  }

  return [results, citations]
}

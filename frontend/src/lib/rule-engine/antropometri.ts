import { IMTResult, Citation } from './models'

const SOURCE_ID = 'AKG-001'
const SOURCE_PASAL = 'Lampiran III - Ambang Batas IMT'
const SOURCE_HALAMAN = '30'

function hitung_imt(bb: number, tb: number): number {
  return Math.round((bb / Math.pow(tb / 100, 2)) * 10) / 10
}

function tentukan_kategori(imt: number): [string, string, string] {
  if (imt < 17.0) return ['SANGAT_KURANG', 'Berat badan sangat kurang', 'IMT-SANGAT-KURANG-001']
  if (imt < 18.5) return ['KURANG', 'Berat badan kurang', 'IMT-KURANG-001']
  if (imt <= 25.0) return ['NORMAL', 'Berat badan normal', 'IMT-NORMAL-001']
  if (imt < 27.0) return ['LEBIH', 'Berat badan lebih', 'IMT-LEBIH-001']
  return ['OBESITAS', 'Obesitas', 'IMT-OBESITAS-001']
}

export function evaluate(bb: number, tb: number): [IMTResult, Citation[]] {
  const imt = hitung_imt(bb, tb)
  const [label, interp, rule_id] = tentukan_kategori(imt)

  const result: IMTResult = { nilai: imt, kategori: label, interpretasi: interp }

  const citations: Citation[] = [
    {
      rule: rule_id,
      source_id: SOURCE_ID,
      kutipan: `IMT ${imt} → ${interp} (ambang batas populasi Indonesia/Asia)`,
      halaman: SOURCE_HALAMAN,
    },
    {
      rule: 'IMT-NORMAL-001',
      source_id: SOURCE_ID,
      kutipan: 'Rumus IMT = BB(kg) / TB(m)^2',
      halaman: SOURCE_HALAMAN,
    },
  ]

  return [result, citations]
}

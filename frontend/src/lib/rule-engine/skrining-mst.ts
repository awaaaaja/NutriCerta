import { SkriningResult, Citation } from './models'

const SOURCE_ID = 'PGRS-001'
const SOURCE_HALAMAN = '97'

export function evaluate(
  penurunan_bb_skor: number,
  nafsu_makan_skor: number,
): [SkriningResult, Citation[]] {
  const citations: Citation[] = [
    {
      rule: 'SKRINING-MST-Q1-001',
      source_id: SOURCE_ID,
      kutipan: 'MST Q1: Penurunan BB tidak diinginkan - skor 0-4',
      halaman: SOURCE_HALAMAN,
    },
    {
      rule: 'SKRINING-MST-Q2-001',
      source_id: SOURCE_ID,
      kutipan: 'MST Q2: Nafsu makan menurun - skor 0-1',
      halaman: SOURCE_HALAMAN,
    },
  ]

  const total = penurunan_bb_skor + nafsu_makan_skor
  let kategori: string
  let interpretasi: string

  if (total >= 2) {
    kategori = 'RISIKO'
    interpretasi = 'Berisiko malnutrisi - wajib dirujuk ke Ahli Gizi dalam 1x24 jam'
    citations.push({
      rule: 'SKRINING-MST-THRESHOLD-001',
      source_id: SOURCE_ID,
      kutipan: 'Skor total >= 2 → risiko malnutrisi',
      halaman: SOURCE_HALAMAN,
    })
  } else {
    kategori = 'NORMAL'
    interpretasi = 'Tidak berisiko - lakukan skrining ulang setiap 7 hari'
    citations.push({
      rule: 'SKRINING-MST-NORMAL-001',
      source_id: SOURCE_ID,
      kutipan: 'Skor total < 2 → tidak berisiko',
      halaman: SOURCE_HALAMAN,
    })
  }

  return [{ skor: total, kategori, interpretasi }, citations]
}

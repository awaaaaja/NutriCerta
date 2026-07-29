import { KebutuhanGiziResult, Citation } from './models'

const SOURCE_BEE = 'PGRS-001'
const SOURCE_AKG = 'AKG-001'
const SOURCE_AKTIVITAS = 'PGRS-001'

const FAKTOR_AKTIVITAS: Record<string, number> = {
  TB: 1.2,
  RINGAN: 1.3,
  SEDANG: 1.5,
}

const PRIA_KEYWORDS = ['pria', 'laki-laki', 'male', 'm']

function isPria(jk: string): boolean {
  return PRIA_KEYWORDS.includes(jk.toLowerCase())
}

function hitung_bee(bb: number, tb: number, usia: number, jenis_kelamin: string): number {
  if (isPria(jenis_kelamin)) {
    return Math.round((10 * bb + 6.25 * tb - 5 * usia + 5) * 10) / 10
  }
  return Math.round((10 * bb + 6.25 * tb - 5 * usia - 161) * 10) / 10
}

export function hitung_kebutuhan(
  bb: number,
  tb: number,
  usia: number,
  jenis_kelamin: string,
  tingkat_aktivitas: string,
): [KebutuhanGiziResult, Citation[]] {
  const bee = hitung_bee(bb, tb, usia, jenis_kelamin)
  const faktor = FAKTOR_AKTIVITAS[tingkat_aktivitas.toUpperCase()] ?? 1.3
  const tee = Math.round(bee * faktor * 10) / 10

  const protein = 57.0

  const rule_bee = isPria(jenis_kelamin) ? 'RUMUS-BEE-PRIA-001' : 'RUMUS-BEE-WANITA-001'
  const operator = isPria(jenis_kelamin) ? '+ 5' : '- 161'

  const citations: Citation[] = [
    {
      rule: rule_bee,
      source_id: SOURCE_BEE,
      kutipan: `Mifflin-St Jeor: BEE = (10x${bb}) + (6.25x${tb}) - (5x${usia}) ${operator} = ${bee} kkal/hari`,
    },
    {
      rule: `FAKTOR-AKTIVITAS-${tingkat_aktivitas.toUpperCase()}-001`,
      source_id: SOURCE_AKTIVITAS,
      kutipan: `Faktor aktivitas ${tingkat_aktivitas} = ${faktor}`,
    },
    {
      rule: 'AKG-PROTEIN-RATA-001',
      source_id: SOURCE_AKG,
      kutipan: 'AKG protein: 57 gram per orang per hari (tingkat konsumsi)',
    },
  ]

  return [
    { bee, tee, satuan: 'kkal/hari', protein, satuan_protein: 'g/hari' },
    citations,
  ]
}

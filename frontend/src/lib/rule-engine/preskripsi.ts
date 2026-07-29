import { PreskripsiResult, Citation } from './models'

const DIET_REGISTRY: Record<string, { entity_id: string; deskripsi: string }> = {
  'DIET-BIASA': { entity_id: 'DIET-BIASA-001', deskripsi: 'Makanan biasa - tekstur normal, nutrisi lengkap' },
  'DIET-LUNAK': { entity_id: 'DIET-LUNAK-001', deskripsi: 'Makanan lunak - tekstur lunak, mudah cerna' },
  'DIET-SARING': { entity_id: 'DIET-SARING-001', deskripsi: 'Makanan saring - tekstur halus (blender)' },
  'DIET-CAIR': { entity_id: 'DIET-CAIR-001', deskripsi: 'Makanan cair - formula enteral/cair bening/penuh' },
  'DIET-DM': { entity_id: 'DIET-DM-001', deskripsi: 'Diet Diabetes Melitus - rendah gula, tinggi serat' },
  'DIET-RG': { entity_id: 'DIET-RG-001', deskripsi: 'Diet Rendah Garam - < 1g garam/hari' },
  'DIET-RP': { entity_id: 'DIET-RP-001', deskripsi: 'Diet Rendah Protein - 0.6-0.8 g/kgBB/hari' },
  'DIET-RL': { entity_id: 'DIET-RL-001', deskripsi: 'Diet Rendah Lemak - < 20% total energi dari lemak' },
  'DIET-TP': { entity_id: 'DIET-TP-001', deskripsi: 'Diet Tinggi Protein - > 1.5 g/kgBB/hari' },
  'DIET-SERAT': { entity_id: 'DIET-SERAT-001', deskripsi: 'Diet Tinggi Serat - > 25 g/hari' },
  'DIET-RS': { entity_id: 'DIET-RS-001', deskripsi: 'Diet Rendah Serat - < 10 g/hari' },
}

const RUTE_REGISTRY: Record<string, { entity_id: string; deskripsi: string }> = {
  ORAL: { entity_id: 'RUTE-ORAL-001', deskripsi: 'Rute oral - makanan/minuman via mulut' },
  NGT: { entity_id: 'RUTE-NGT-001', deskripsi: 'Rute enteral - selang NGT/OGT/PEG' },
  PARENTERAL: { entity_id: 'RUTE-PARENTERAL-001', deskripsi: 'Rute parenteral - infus/TPN' },
}

const DIAGNOSIS_KE_DIET: Record<string, string> = {
  dm: 'DIET-DM',
  diabetes: 'DIET-DM',
  'diabetes melitus': 'DIET-DM',
  gagal_ginjal: 'DIET-RP',
  ckd: 'DIET-RP',
  hipertensi: 'DIET-RG',
  jantung: 'DIET-RL',
  kolesterol: 'DIET-RL',
  post_op: 'DIET-LUNAK',
  pasca_operasi: 'DIET-LUNAK',
  stroke: 'DIET-SARING',
  disfagia: 'DIET-SARING',
  sulit_telan: 'DIET-SARING',
  obesitas: 'DIET-RL',
  kurang_gizi: 'DIET-TP',
  malnutrisi: 'DIET-TP',
  diare: 'DIET-RS',
  konstipasi: 'DIET-SERAT',
}

export function rekomendasi_diet(
  diagnosis_medis: string[],
  imt_kategori: string,
  mst_kategori: string,
  ada_kesulitan_telan: boolean = false,
): [PreskripsiResult[], Citation[]] {
  const results: PreskripsiResult[] = []
  const citations: Citation[] = []
  const diet_keys = new Set<string>()
  let rute = 'ORAL'

  for (const dm of diagnosis_medis) {
    for (const [key, diet_key] of Object.entries(DIAGNOSIS_KE_DIET)) {
      if (dm.toLowerCase().includes(key)) diet_keys.add(diet_key)
    }
  }

  if (imt_kategori === 'OBESITAS') diet_keys.add('DIET-RL')
  if (imt_kategori === 'SANGAT_KURANG' || imt_kategori === 'KURANG') diet_keys.add('DIET-TP')
  if (mst_kategori === 'RISIKO') diet_keys.add('DIET-TP')

  if (ada_kesulitan_telan || diagnosis_medis.some((d) => d.toLowerCase().includes('stroke'))) {
    diet_keys.add('DIET-SARING')
    rute = 'NGT'
  }

  if (diet_keys.size === 0) diet_keys.add('DIET-BIASA')

  for (const dk of diet_keys) {
    const info = DIET_REGISTRY[dk]
    if (info) {
      results.push({ diet: dk, deskripsi: info.deskripsi, rute })
      citations.push({
        rule: info.entity_id,
        source_id: 'PGRS-001',
        kutipan: `Rekomendasi diet: ${dk}`,
      })
    }
  }

  const rute_info = RUTE_REGISTRY[rute]
  if (rute_info) {
    citations.push({
      rule: rute_info.entity_id,
      source_id: 'PGRS-001',
      kutipan: `Rute pemberian: ${rute}`,
    })
  }

  return [results, citations]
}

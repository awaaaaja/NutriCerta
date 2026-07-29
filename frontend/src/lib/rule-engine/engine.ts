import { PatientData, AssessmentResult, Citation } from './models'
import * as skrining_mst from './skrining-mst'
import * as antropometri from './antropometri'
import * as kebutuhan_gizi from './kebutuhan-gizi'
import * as diagnosis_pes from './diagnosis-pes'
import * as preskripsi from './preskripsi'
import * as monitoring from './monitoring'

export class RuleEngine {
  evaluate(patient: PatientData): AssessmentResult {
    const result: AssessmentResult = {
      skrining: null,
      imt: null,
      kebutuhan: null,
      diagnosis: [],
      preskripsi: [],
      monitoring: [],
      citations: [],
    }
    const all_citations: Citation[] = []

    if (patient.mst_penurunan_bb != null && patient.mst_nafsu_makan != null) {
      const [skr_result, skr_citations] = skrining_mst.evaluate(
        patient.mst_penurunan_bb,
        patient.mst_nafsu_makan,
      )
      result.skrining = skr_result
      all_citations.push(...skr_citations)
    }

    if (patient.bb > 0 && patient.tb > 0) {
      const [imt_result, imt_citations] = antropometri.evaluate(patient.bb, patient.tb)
      result.imt = imt_result
      all_citations.push(...imt_citations)
    }

    if (patient.bb > 0 && patient.tb > 0 && patient.usia > 0 && patient.jenis_kelamin) {
      const [giz_result, giz_citations] = kebutuhan_gizi.hitung_kebutuhan(
        patient.bb,
        patient.tb,
        patient.usia,
        patient.jenis_kelamin,
        patient.tingkat_aktivitas,
      )
      result.kebutuhan = giz_result
      all_citations.push(...giz_citations)
    }

    if (patient.keluhan.length > 0 || patient.diagnosis_medis.length > 0) {
      const kode_pes = diagnosis_pes.infer_kode_dari_keluhan(patient.keluhan, patient.diagnosis_medis)
      const etiologi = patient.diagnosis_medis.length > 0
        ? patient.diagnosis_medis.join('; ')
        : 'etiologi belum diketahui'

      const signs_parts: string[] = []
      if (patient.asupan_persen != null) signs_parts.push(`asupan ${patient.asupan_persen}% dari kebutuhan`)
      if (patient.albumin != null) signs_parts.push(`albumin ${patient.albumin} g/dL`)
      if (patient.gds != null) signs_parts.push(`GDS ${patient.gds} mg/dL`)
      const signs = signs_parts.length > 0 ? signs_parts.join('; ') : 'data objektif belum tersedia'

      const [pes_result, pes_citations] = diagnosis_pes.bangun_pernyataan(kode_pes, etiologi, signs)
      result.diagnosis.push(pes_result)
      all_citations.push(...pes_citations)
    }

    if (patient.diagnosis_medis.length > 0) {
      const imt_cat = result.imt?.kategori ?? 'NORMAL'
      const mst_cat = result.skrining?.kategori ?? 'NORMAL'

      const ada_sulit_telan =
        patient.diagnosis_medis.some((d) => ['stroke', 'disfagia'].some((k) => d.toLowerCase().includes(k))) ||
        patient.keluhan.some((k) => ['sulit_telan', 'disfagia'].some((x) => k.toLowerCase().includes(x)))

      const [presk_result, presk_citations] = preskripsi.rekomendasi_diet(
        patient.diagnosis_medis,
        imt_cat,
        mst_cat,
        ada_sulit_telan,
      )
      result.preskripsi = presk_result
      all_citations.push(...presk_citations)

      const [mon_result, mon_citations] = monitoring.rekomendasi_monitoring(
        patient.diagnosis_medis,
        imt_cat,
        mst_cat,
      )
      result.monitoring = mon_result
      all_citations.push(...mon_citations)
    }

    result.citations = all_citations
    return result
  }
}

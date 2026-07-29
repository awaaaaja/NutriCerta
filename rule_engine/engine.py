from .models import PatientData, AssessmentResult, Citation
from .rules import skrining_mst, antropometri, kebutuhan_gizi, diagnosis_pes, preskripsi, monitoring


class RuleEngine:
    def evaluate(self, patient: PatientData) -> AssessmentResult:
        result = AssessmentResult()
        all_citations: list[Citation] = []

        if patient.mst_penurunan_bb is not None and patient.mst_nafsu_makan is not None:
            skr_result, skr_citations = skrining_mst.evaluate(
                patient.mst_penurunan_bb,
                patient.mst_nafsu_makan,
            )
            result.skrining = skr_result
            all_citations.extend(skr_citations)

        if patient.bb > 0 and patient.tb > 0:
            imt_result, imt_citations = antropometri.evaluate(patient.bb, patient.tb)
            result.imt = imt_result
            all_citations.extend(imt_citations)

        if patient.bb > 0 and patient.tb > 0 and patient.usia > 0 and patient.jenis_kelamin:
            giz_result, giz_citations = kebutuhan_gizi.hitung_kebutuhan(
                patient.bb,
                patient.tb,
                patient.usia,
                patient.jenis_kelamin,
                patient.tingkat_aktivitas,
            )
            result.kebutuhan = giz_result
            all_citations.extend(giz_citations)

        if patient.keluhan or patient.diagnosis_medis:
            kode_pes = diagnosis_pes.infer_kode_dari_keluhan(
                patient.keluhan, patient.diagnosis_medis
            )
            etiologi = "; ".join(patient.diagnosis_medis) if patient.diagnosis_medis else "etiologi belum diketahui"
            signs_parts = []
            if patient.asupan_persen is not None:
                signs_parts.append(f"asupan {patient.asupan_persen}% dari kebutuhan")
            if patient.albumin is not None:
                signs_parts.append(f"albumin {patient.albumin} g/dL")
            if patient.gds is not None:
                signs_parts.append(f"GDS {patient.gds} mg/dL")
            signs = "; ".join(signs_parts) if signs_parts else "data objektif belum tersedia"

            pes_result, pes_citations = diagnosis_pes.bangun_pernyataan(
                kode_pes, etiologi, signs
            )
            result.diagnosis.append(pes_result)
            all_citations.extend(pes_citations)

        if patient.diagnosis_medis:
            imt_cat = result.imt.kategori if result.imt else "NORMAL"
            mst_cat = result.skrining.kategori if result.skrining else "NORMAL"
            ada_sulit_telan = any(
                k in k.lower() for d in patient.diagnosis_medis for k in ["stroke", "disfagia"]
            ) or any(k in k.lower() for d in patient.keluhan for k in ["sulit_telan", "disfagia"])

            presk_result, presk_citations = preskripsi.rekomendasi_diet(
                patient.diagnosis_medis, imt_cat, mst_cat, ada_sulit_telan
            )
            result.preskripsi = presk_result
            all_citations.extend(presk_citations)

            mon_result, mon_citations = monitoring.rekomendasi_monitoring(
                patient.diagnosis_medis, imt_cat, mst_cat, patient.albumin, patient.gds
            )
            result.monitoring = mon_result
            all_citations.extend(mon_citations)

        result.citations = all_citations
        return result

from typing import List, Tuple
from ..models import DiagnosisPESResult, Citation

PES_REGISTRY = {
    "NI-1.1": {"entity_id": "PES-NI_1_1", "label": "Energi tidak sesuai (berlebih/kurang)", "domain": "NI"},
    "NI-1.2": {"entity_id": "PES-NI_1_2", "label": "Asupan energi oral inadekuat", "domain": "NI"},
    "NI-1.3": {"entity_id": "PES-NI_1_3", "label": "Asupan energi oral berlebih", "domain": "NI"},
    "NI-1.4": {"entity_id": "PES-NI_1_4", "label": "Asupan energi parenteral inadekuat", "domain": "NI"},
    "NI-1.5": {"entity_id": "PES-NI_1_5", "label": "Asupan energi parenteral berlebih", "domain": "NI"},
    "NI-2.1": {"entity_id": "PES-NI_2_1", "label": "Asupan oral inadekuat", "domain": "NI"},
    "NI-3.1": {"entity_id": "PES-NI_3_1", "label": "Asupan cairan inadekuat", "domain": "NI"},
    "NI-3.2": {"entity_id": "PES-NI_3_2", "label": "Asupan cairan berlebih", "domain": "NI"},
    "NI-5.1": {"entity_id": "PES-NI_5_1", "label": "Asupan protein inadekuat", "domain": "NI"},
    "NI-5.2": {"entity_id": "PES-NI_5_2", "label": "Asupan protein berlebih", "domain": "NI"},
    "NI-5.3": {"entity_id": "PES-NI_5_3", "label": "Asupan protein tidak seimbang", "domain": "NI"},
    "NI-5.4": {"entity_id": "PES-NI_5_4", "label": "Asupan asam amino inadekuat", "domain": "NI"},
    "NI-5.5": {"entity_id": "PES-NI_5_5", "label": "Asupan asam amino berlebih", "domain": "NI"},
    "NI-5.6.1": {"entity_id": "PES-NI_5_6_1", "label": "Asupan lemak inadekuat", "domain": "NI"},
    "NI-5.6.2": {"entity_id": "PES-NI_5_6_2", "label": "Asupan lemak berlebih", "domain": "NI"},
    "NI-5.7.1": {"entity_id": "PES-NI_5_7_1", "label": "Asupan karbohidrat inadekuat", "domain": "NI"},
    "NI-5.7.2": {"entity_id": "PES-NI_5_7_2", "label": "Asupan karbohidrat berlebih", "domain": "NI"},
    "NI-5.8.1": {"entity_id": "PES-NI_5_8_1", "label": "Asupan serat inadekuat", "domain": "NI"},
    "NI-5.8.2": {"entity_id": "PES-NI_5_8_2", "label": "Asupan serat berlebih", "domain": "NI"},
    "NI-5.9": {"entity_id": "PES-NI_5_9", "label": "Asupan vitamin inadekuat", "domain": "NI"},
    "NI-5.10.1": {"entity_id": "PES-NI_5_10_1", "label": "Asupan mineral inadekuat", "domain": "NI"},
    "NI-5.10.2": {"entity_id": "PES-NI_5_10_2", "label": "Asupan mineral berlebih", "domain": "NI"},
    "NI-7.1": {"entity_id": "PES-NI_7_1", "label": "Kesulitan menelan/mengunyah", "domain": "NI"},
    "NI-7.2": {"entity_id": "PES-NI_7_2", "label": "Kesulitan menyusui", "domain": "NI"},
    "NC-1.1": {"entity_id": "PES-NC_1_1", "label": "Berat badan kurang", "domain": "NC"},
    "NC-1.2": {"entity_id": "PES-NC_1_2", "label": "Berat badan lebih/obesitas", "domain": "NC"},
    "NC-1.3": {"entity_id": "PES-NC_1_3", "label": "Penurunan berat badan tidak diinginkan", "domain": "NC"},
    "NC-1.4": {"entity_id": "PES-NC_1_4", "label": "Peningkatan berat badan tidak diinginkan", "domain": "NC"},
    "NC-2.1": {"entity_id": "PES-NC_2_1", "label": "Malnutrisi", "domain": "NC"},
    "NC-2.2": {"entity_id": "PES-NC_2_2", "label": "Malnutrisi terkait penyakit kronis", "domain": "NC"},
    "NC-2.3": {"entity_id": "PES-NC_2_3", "label": "Malnutrisi terkait kelaparan", "domain": "NC"},
    "NC-2.4": {"entity_id": "PES-NC_2_4", "label": "Malnutrisi terkait trauma/cedera akut", "domain": "NC"},
    "NC-3.1": {"entity_id": "PES-NC_3_1", "label": "Aspirasi/resiko aspirasi", "domain": "NC"},
    "NC-3.2": {"entity_id": "PES-NC_3_2", "label": "Gangguan menelan", "domain": "NC"},
    "NC-3.3": {"entity_id": "PES-NC_3_3", "label": "Gangguan fungsi saluran cerna", "domain": "NC"},
    "NB-1.1": {"entity_id": "PES-NB_1_1", "label": "Kurang pengetahuan gizi", "domain": "NB"},
    "NB-1.2": {"entity_id": "PES-NB_1_2", "label": "Sikap/keyakinan terkait gizi tidak tepat", "domain": "NB"},
    "NB-1.3": {"entity_id": "PES-NB_1_3", "label": "Pola makan tidak tepat", "domain": "NB"},
    "NB-1.4": {"entity_id": "PES-NB_1_4", "label": "Aktivitas fisik kurang/berlebih", "domain": "NB"},
    "NB-1.5": {"entity_id": "PES-NB_1_5", "label": "Ketidakmampuan merawat diri", "domain": "NB"},
    "NB-2.1": {"entity_id": "PES-NB_2_1", "label": "Akses pangan terbatas", "domain": "NB"},
    "NB-2.2": {"entity_id": "PES-NB_2_2", "label": "Dukungan sosial/fasilitas tidak adekuat", "domain": "NB"},
}

MAKANAN_KE_KODE = {
    "mual": "NI-1.2",
    "nafsu_makan_turun": "NI-1.2",
    "sesak": "NI-1.2",
    "asupan_kurang": "NI-1.2",
    "asupan_oral_kurang": "NI-1.2",
    "dm": "NI-5.7.2",
    "diabetes": "NI-5.7.2",
    "kencing_manis": "NI-5.7.2",
    "gagal_ginjal": "NI-5.1",
    "ckd": "NI-5.1",
    "penurunan_bb": "NC-1.3",
    "bb_turun": "NC-1.3",
    "bb_kurang": "NC-1.1",
    "kurang_gizi": "NC-2.1",
    "obesitas": "NC-1.2",
    "gemuk": "NC-1.2",
    "diare": "NC-3.3",
    "konstipasi": "NC-3.3",
    "sulit_telan": "NI-7.1",
    "disfagia": "NI-7.1",
    "stroke": "NI-7.1",
}


def infer_kode_dari_keluhan(keluhan: List[str], diagnosis_medis: List[str]) -> str:
    semua = [k.lower() for k in keluhan] + [d.lower() for d in diagnosis_medis]
    for kata in semua:
        for key, kode in MAKANAN_KE_KODE.items():
            if key in kata:
                return kode
    return "NI-1.2"


def bangun_pernyataan(
    kode_pes: str,
    etiologi: str,
    signs: str,
) -> Tuple[DiagnosisPESResult, List[Citation]]:
    info = PES_REGISTRY.get(kode_pes)
    if not info:
        info = PES_REGISTRY["NI-1.2"]

    pes_statement = f"{kode_pes} {info['label']} related to {etiologi} as evidenced by {signs}"

    result = DiagnosisPESResult(
        problem=kode_pes,
        label=info["label"],
        etiologi=etiologi,
        signs=signs,
        pes_statement=pes_statement,
        domain=info["domain"],
    )

    citations = [
        Citation(
            rule=info["entity_id"],
            source_id="IDNT-001",
            kutipan=f"PES: {kode_pes} — {info['label']} (domain {info['domain']})",
        ),
        Citation(
            rule="PAGT-001",
            source_id="PAGT-001",
            kutipan="Format PES: Problem related to Etiology as evidenced by Signs/Symptoms",
        ),
    ]

    return result, citations

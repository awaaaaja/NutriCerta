from typing import List, Tuple
from ..models import PreskripsiResult, Citation

DIET_REGISTRY = {
    "DIET-BIASA": {"entity_id": "DIET-BIASA-001", "deskripsi": "Makanan biasa — tekstur normal, nutrisi lengkap"},
    "DIET-LUNAK": {"entity_id": "DIET-LUNAK-001", "deskripsi": "Makanan lunak — tekstur lunak, mudah cerna"},
    "DIET-SARING": {"entity_id": "DIET-SARING-001", "deskripsi": "Makanan saring — tekstur halus (blender)"},
    "DIET-CAIR": {"entity_id": "DIET-CAIR-001", "deskripsi": "Makanan cair — formula enteral/cair bening/penuh"},
    "DIET-DM": {"entity_id": "DIET-DM-001", "deskripsi": "Diet Diabetes Melitus — rendah gula, tinggi serat"},
    "DIET-RG": {"entity_id": "DIET-RG-001", "deskripsi": "Diet Rendah Garam — < 1g garam/hari"},
    "DIET-RP": {"entity_id": "DIET-RP-001", "deskripsi": "Diet Rendah Protein — 0.6-0.8 g/kgBB/hari"},
    "DIET-RL": {"entity_id": "DIET-RL-001", "deskripsi": "Diet Rendah Lemak — < 20% total energi dari lemak"},
    "DIET-TP": {"entity_id": "DIET-TP-001", "deskripsi": "Diet Tinggi Protein — > 1.5 g/kgBB/hari"},
    "DIET-SERAT": {"entity_id": "DIET-SERAT-001", "deskripsi": "Diet Tinggi Serat — > 25 g/hari"},
    "DIET-RS": {"entity_id": "DIET-RS-001", "deskripsi": "Diet Rendah Serat — < 10 g/hari"},
}

RUTE_REGISTRY = {
    "ORAL": {"entity_id": "RUTE-ORAL-001", "deskripsi": "Rute oral — makanan/minuman via mulut"},
    "NGT": {"entity_id": "RUTE-NGT-001", "deskripsi": "Rute enteral — selang NGT/OGT/PEG"},
    "PARENTERAL": {"entity_id": "RUTE-PARENTERAL-001", "deskripsi": "Rute parenteral — infus/TPN"},
}

DIAGNOSIS_KE_DIET = {
    "dm": "DIET-DM",
    "diabetes": "DIET-DM",
    "diabetes melitus": "DIET-DM",
    "gagal ginjal": "DIET-RP",
    "ckd": "DIET-RP",
    "hipertensi": "DIET-RG",
    "jantung": "DIET-RL",
    "kolesterol": "DIET-RL",
    "post_op": "DIET-LUNAK",
    "pasca operasi": "DIET-LUNAK",
    "stroke": "DIET-SARING",
    "disfagia": "DIET-SARING",
    "sulit_telan": "DIET-SARING",
    "obesitas": "DIET-RL",
    "kurang_gizi": "DIET-TP",
    "malnutrisi": "DIET-TP",
    "diare": "DIET-RS",
    "konstipasi": "DIET-SERAT",
}


def rekomendasi_diet(
    diagnosis_medis: List[str],
    imt_kategori: str,
    mst_kategori: str,
    ada_kesulitan_telan: bool = False,
) -> tuple[list[PreskripsiResult], list[Citation]]:
    results = []
    citations = []

    diet_keys = set()
    rute = "ORAL"

    for dm in diagnosis_medis:
        for key, diet_key in DIAGNOSIS_KE_DIET.items():
            if key in dm.lower():
                diet_keys.add(diet_key)

    if imt_kategori == "OBESITAS":
        diet_keys.add("DIET-RL")
    if imt_kategori == "SANGAT_KURANG" or imt_kategori == "KURANG":
        diet_keys.add("DIET-TP")

    if mst_kategori == "RISIKO":
        diet_keys.add("DIET-TP")

    if ada_kesulitan_telan or any("stroke" in d.lower() for d in diagnosis_medis):
        diet_keys.add("DIET-SARING")
        rute = "NGT"

    if not diet_keys:
        diet_keys.add("DIET-BIASA")

    for dk in diet_keys:
        info = DIET_REGISTRY.get(dk)
        if info:
            results.append(PreskripsiResult(
                diet=dk,
                deskripsi=info["deskripsi"],
                rute=rute,
            ))
            citations.append(Citation(
                rule=info["entity_id"],
                source_id="PGRS-001",
                kutipan=f"Rekomendasi diet: {dk}",
            ))

    rute_info = RUTE_REGISTRY.get(rute)
    if rute_info:
        citations.append(Citation(
            rule=rute_info["entity_id"],
            source_id="PGRS-001",
            kutipan=f"Rute pemberian: {rute}",
        ))

    return results, citations

from typing import List, Tuple
from ..models import IMTResult, Citation

SOURCE_ID = "AKG-001"
SOURCE_PASAL = "Lampiran III — Ambang Batas IMT"
SOURCE_HALAMAN = "30"

IMT_KATEGORI = [
    (17.0, "SANGAT_KURANG", "Berat badan sangat kurang", "IMT-SANGAT-KURANG-001"),
    (18.5, "KURANG", "Berat badan kurang", "IMT-KURANG-001"),
    (25.0, "NORMAL", "Berat badan normal", "IMT-NORMAL-001"),
    (27.0, "LEBIH", "Berat badan lebih", "IMT-LEBIH-001"),
    (float("inf"), "OBESITAS", "Obesitas", "IMT-OBESITAS-001"),
]


def hitung_imt(bb: float, tb: float) -> float:
    return round(bb / ((tb / 100) ** 2), 1)


def tentukan_kategori(imt: float) -> Tuple[str, str, str]:
    if imt < 17.0:
        return "SANGAT_KURANG", "Berat badan sangat kurang", "IMT-SANGAT-KURANG-001"
    elif imt < 18.5:
        return "KURANG", "Berat badan kurang", "IMT-KURANG-001"
    elif imt <= 25.0:
        return "NORMAL", "Berat badan normal", "IMT-NORMAL-001"
    elif imt < 27.0:
        return "LEBIH", "Berat badan lebih", "IMT-LEBIH-001"
    else:
        return "OBESITAS", "Obesitas", "IMT-OBESITAS-001"


def evaluate(bb: float, tb: float) -> Tuple[IMTResult, List[Citation]]:
    imt = hitung_imt(bb, tb)
    label, interp, rule_id = tentukan_kategori(imt)

    result = IMTResult(
        nilai=imt,
        kategori=label,
        interpretasi=interp,
    )

    citations = [
        Citation(
            rule=rule_id,
            source_id=SOURCE_ID,
            kutipan=f"IMT {imt} → {interp} (ambang batas populasi Indonesia/Asia)",
            halaman=SOURCE_HALAMAN,
        ),
        Citation(
            rule="IMT-NORMAL-001",
            source_id=SOURCE_ID,
            kutipan="Rumus IMT = BB(kg) / TB(m)^2",
            halaman=SOURCE_HALAMAN,
        ),
    ]

    return result, citations

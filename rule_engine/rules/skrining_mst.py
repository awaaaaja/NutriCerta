from typing import List
from ..models import SkriningResult, Citation

SOURCE_ID = "PGRS-001"
SOURCE_HALAMAN = "97"


def evaluate(
    penurunan_bb_skor: int,
    nafsu_makan_skor: int,
) -> tuple[SkriningResult, List[Citation]]:
    citations = [
        Citation(
            rule="SKRINING-MST-Q1-001",
            source_id=SOURCE_ID,
            kutipan="MST Q1: Penurunan BB tidak diinginkan — skor 0-4",
            halaman=SOURCE_HALAMAN,
        ),
        Citation(
            rule="SKRINING-MST-Q2-001",
            source_id=SOURCE_ID,
            kutipan="MST Q2: Nafsu makan menurun — skor 0-1",
            halaman=SOURCE_HALAMAN,
        ),
    ]

    total = penurunan_bb_skor + nafsu_makan_skor

    if total >= 2:
        kategori = "RISIKO"
        interpretasi = "Berisiko malnutrisi — wajib dirujuk ke Ahli Gizi dalam 1x24 jam"
        citations.append(
            Citation(
                rule="SKRINING-MST-THRESHOLD-001",
                source_id=SOURCE_ID,
                kutipan="Skor total >= 2 → risiko malnutrisi",
                halaman=SOURCE_HALAMAN,
            )
        )
    else:
        kategori = "NORMAL"
        interpretasi = "Tidak berisiko — lakukan skrining ulang setiap 7 hari"
        citations.append(
            Citation(
                rule="SKRINING-MST-NORMAL-001",
                source_id=SOURCE_ID,
                kutipan="Skor total < 2 → tidak berisiko",
                halaman=SOURCE_HALAMAN,
            )
        )

    result = SkriningResult(
        skor=total,
        kategori=kategori,
        interpretasi=interpretasi,
    )

    return result, citations

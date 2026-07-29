from typing import List, Tuple
from ..models import KebutuhanGiziResult, Citation

SOURCE_BEE = "PGRS-001"
SOURCE_AKG = "AKG-001"
SOURCE_AKTIVITAS = "PGRS-001"

FAKTOR_AKTIVITAS = {
    "TB": 1.2,
    "RINGAN": 1.3,
    "SEDANG": 1.5,
}


def hitung_bee(bb: float, tb: float, usia: float, jenis_kelamin: str) -> float:
    if jenis_kelamin.lower() in ("pria", "laki-laki", "male", "m"):
        bee = (10 * bb) + (6.25 * tb) - (5 * usia) + 5
    else:
        bee = (10 * bb) + (6.25 * tb) - (5 * usia) - 161
    return round(bee, 1)


def hitung_kebutuhan(
    bb: float,
    tb: float,
    usia: float,
    jenis_kelamin: str,
    tingkat_aktivitas: str,
) -> Tuple[KebutuhanGiziResult, List[Citation]]:
    bee = hitung_bee(bb, tb, usia, jenis_kelamin)
    faktor = FAKTOR_AKTIVITAS.get(tingkat_aktivitas.upper(), 1.3)
    tee = round(bee * faktor, 1)

    protein = round(57.0, 1)

    citations = [
        Citation(
            rule="RUMUS-BEE-PRIA-001" if jenis_kelamin.lower() in ("pria", "laki-laki", "male", "m") else "RUMUS-BEE-WANITA-001",
            source_id=SOURCE_BEE,
            kutipan=f"Mifflin-St Jeor: BEE = (10x{bb}) + (6.25x{tb}) - (5x{usia}) {'+ 5' if jenis_kelamin.lower() in ('pria','laki-laki','male','m') else '- 161'} = {bee} kkal/hari",
        ),
        Citation(
            rule=f"FAKTOR-AKTIVITAS-{tingkat_aktivitas.upper()}-001",
            source_id=SOURCE_AKTIVITAS,
            kutipan=f"Faktor aktivitas {tingkat_aktivitas} = {faktor}",
        ),
        Citation(
            rule="AKG-PROTEIN-RATA-001",
            source_id=SOURCE_AKG,
            kutipan="AKG protein: 57 gram per orang per hari (tingkat konsumsi)",
        ),
    ]

    result = KebutuhanGiziResult(
        bee=bee,
        tee=tee,
        satuan="kkal/hari",
        protein=protein,
        satuan_protein="g/hari",
    )

    return result, citations

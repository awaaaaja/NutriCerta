"""FASE 2 BUILD: Parse AKG formulas, thresholds, IMT categories into knowledge entities.
Output: YAML files in knowledge/extracted/entities/
"""
import yaml, os
from pathlib import Path

ENTITIES_DIR = Path(__file__).parent / "extracted" / "entities"
ENTITIES_DIR.mkdir(parents=True, exist_ok=True)

SOURCE_AKG = "AKG-001"  # Permenkes 28/2019
SOURCE_PGRS = "PGRS-001"  # Permenkes 78/2013

entities = []

# ─── 1. AKG Rata-rata Energi & Protein (Pasal 3) ───
entities.append({
    "entity_id": "AKG-ENERGI-RATA-001",
    "kategori": "kebutuhan_energi",
    "nama": "Rata-rata angka kecukupan energi masyarakat Indonesia",
    "nilai": "2100 kkal per orang per hari (tingkat konsumsi)",
    "kondisi_berlaku": "Rata-rata makro nasional",
    "sumber": {
        "source_id": SOURCE_AKG,
        "pasal": "Pasal 3 ayat (2)",
        "halaman": 3,
        "url": "https://peraturan.bpk.go.id/Details/138621/permenkes-no-28-tahun-2019"
    },
    "status_validasi": "DRAFT",
    "catatan": "Nilai makro untuk perencanaan konsumsi nasional"
})

entities.append({
    "entity_id": "AKG-PROTEIN-RATA-001",
    "kategori": "kebutuhan_protein",
    "nama": "Rata-rata angka kecukupan protein masyarakat Indonesia",
    "nilai": "57 gram per orang per hari (tingkat konsumsi)",
    "kondisi_berlaku": "Rata-rata makro nasional",
    "sumber": {
        "source_id": SOURCE_AKG,
        "pasal": "Pasal 3 ayat (3)",
        "halaman": 3
    },
    "status_validasi": "DRAFT",
    "catatan": ""
})

# ─── 2. Ambang Batas IMT untuk Indonesia (AKG Lampiran III) ───
# Nilai berdasarkan standar Kemenkes RI untuk populasi Asia/Indonesia
imt_categories = [
    ("IMT-SANGAT-KURANG-001", "Berat Badan Sangat Kurang", "< 17.0"),
    ("IMT-KURANG-001", "Berat Badan Kurang", "17.0 - 18.4"),
    ("IMT-NORMAL-001", "Normal", "18.5 - 25.0"),
    ("IMT-LEBIH-001", "Berat Badan Lebih (Overweight)", "25.1 - 27.0"),
    ("IMT-OBESITAS-001", "Obesitas", "> 27.0"),
]

for eid, name, threshold in imt_categories:
    entities.append({
        "entity_id": eid,
        "kategori": "antropometri_imt",
        "nama": f"Kategori IMT: {name}",
        "nilai": threshold,
        "satuan": "kg/m2",
        "rumus": "IMT = BB(kg) / TB(m)^2",
        "kondisi_berlaku": "Dewasa Indonesia (Asia)",
        "sumber": {
            "source_id": SOURCE_AKG,
            "pasal": "Lampiran III — Ambang Batas IMT",
            "halaman": 30
        },
        "status_validasi": "DRAFT",
        "catatan": "Ambang batas IMT khusus populasi Indonesia/Asia, berbeda dengan WHO global"
    })

# ─── 3. Konversi Makronutrien (AKG standar) ───
entities.append({
    "entity_id": "MAKRO-KONVERSI-ENERGI-001",
    "kategori": "konversi_zat_gizi",
    "nama": "Konversi energi karbohidrat",
    "nilai": "4 kkal/gram",
    "sumber": {
        "source_id": SOURCE_AKG,
        "catatan": "Nilai konversi standar Atwater"
    },
    "status_validasi": "DRAFT"
})

entities.append({
    "entity_id": "MAKRO-KONVERSI-PROTEIN-001",
    "kategori": "konversi_zat_gizi",
    "nama": "Konversi energi protein",
    "nilai": "4 kkal/gram",
    "sumber": {
        "source_id": SOURCE_AKG,
        "catatan": "Nilai konversi standar Atwater"
    },
    "status_validasi": "DRAFT"
})

entities.append({
    "entity_id": "MAKRO-KONVERSI-LEMAK-001",
    "kategori": "konversi_zat_gizi",
    "nama": "Konversi energi lemak",
    "nilai": "9 kkal/gram",
    "sumber": {
        "source_id": SOURCE_AKG,
        "catatan": "Nilai konversi standar Atwater"
    },
    "status_validasi": "DRAFT"
})

# ─── 4. Rumus Mifflin-St Jeor (dari PGRS) ───
entities.append({
    "entity_id": "RUMUS-BEE-PRIA-001",
    "kategori": "kebutuhan_energi",
    "nama": "Rumus Mifflin-St Jeor untuk BEE/REE Pria",
    "rumus": "BEE = (10 x BB) + (6.25 x TB) - (5 x Usia) + 5",
    "keterangan": "BB=berat badan (kg), TB=tinggi badan (cm), Usia (tahun)",
    "satuan": "kkal/hari",
    "kondisi_berlaku": "Dewasa (19-70 tahun), non-kritis",
    "sumber": {
        "source_id": SOURCE_PGRS,
        "halaman": 90,
        "catatan": "Juga tercantum di PAGT Lampiran 05. Sumber asli: Mifflin et al. 1990."
    },
    "status_validasi": "DRAFT"
})

entities.append({
    "entity_id": "RUMUS-BEE-WANITA-001",
    "kategori": "kebutuhan_energi",
    "nama": "Rumus Mifflin-St Jeor untuk BEE/REE Wanita",
    "rumus": "BEE = (10 x BB) + (6.25 x TB) - (5 x Usia) - 161",
    "keterangan": "BB=berat badan (kg), TB=tinggi badan (cm), Usia (tahun)",
    "satuan": "kkal/hari",
    "kondisi_berlaku": "Dewasa (19-70 tahun), non-kritis",
    "sumber": {
        "source_id": SOURCE_PGRS,
        "halaman": 90
    },
    "status_validasi": "DRAFT"
})

# ─── 5. Faktor Aktivitas (PGRS) ───
activity_factors = [
    ("FAKTOR-AKTIVITAS-TB-001", "Tirah Baring (Bed Rest)", "1.1 - 1.2"),
    ("FAKTOR-AKTIVITAS-RINGAN-001", "Ringan", "1.3"),
    ("FAKTOR-AKTIVITAS-SEDANG-001", "Sedang", "1.5"),
]

for eid, name, factor in activity_factors:
    entities.append({
        "entity_id": eid,
        "kategori": "kebutuhan_energi_faktor_aktivitas",
        "nama": f"Faktor Aktivitas: {name}",
        "nilai": factor,
        "keterangan": "TEE = BEE x FA x FS",
        "sumber": {
            "source_id": SOURCE_PGRS,
            "halaman": 90
        },
        "status_validasi": "DRAFT"
    })

# Write all AKG+IMT entities
filepath = ENTITIES_DIR / "entities_akg_imt.yaml"
with open(filepath, "w", encoding="utf-8") as f:
    yaml.dump_all(entities, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
print(f"Written {len(entities)} entities to {filepath}")

# Summary
for e in entities:
    print(f"  [{e['entity_id']}] {e.get('nama','')[:60]}")

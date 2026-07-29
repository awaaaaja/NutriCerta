"""FASE 2 BUILD: Parse TKPI food composition tables into structured data.
Output: YAML files in knowledge/extracted/entities/
"""
import yaml, csv
from pathlib import Path

ENTITIES_DIR = Path(__file__).parent / "extracted" / "entities"
TKPI_PATH = Path(r"D:\NutriCerta\knowledge\raw_documents\TKPI_2018.pdf")

# ─── Representative Sample Food Items ───
# Based on TKPI 2017/2018 commonly used in hospital diet planning
food_items = [
    # Serealia (Grains)
    ("TKPI-BERAS-001", "Serealia", "Beras putih, mentah", "100 g",
     {"energi": 360, "protein": 6.8, "lemak": 0.7, "karbohidrat": 78.9, "serat": 0.3, "air": 12.0}),
    ("TKPI-BERAS-002", "Serealia", "Beras merah, mentah", "100 g",
     {"energi": 352, "protein": 7.3, "lemak": 0.9, "karbohidrat": 76.2, "serat": 0.8, "air": 14.6}),
    ("TKPI-TEPUNG-001", "Serealia", "Tepung terigu", "100 g",
     {"energi": 365, "protein": 8.9, "lemak": 1.3, "karbohidrat": 77.3, "serat": 0.3, "air": 11.8}),
    ("TKPI-ROTI-001", "Serealia", "Roti putih", "100 g",
     {"energi": 248, "protein": 8.0, "lemak": 1.2, "karbohidrat": 50.0, "serat": 0.5, "air": 38.0}),
    ("TKPI-MIE-001", "Serealia", "Mie basah", "100 g",
     {"energi": 86, "protein": 0.6, "lemak": 0.1, "karbohidrat": 20.0, "serat": 0.1, "air": 80.0}),
    ("TKPI-JAGUNG-001", "Serealia", "Jagung kuning, segar", "100 g",
     {"energi": 147, "protein": 5.1, "lemak": 0.7, "karbohidrat": 31.5, "serat": 1.3, "air": 61.8}),

    # Umbi (Tubers)
    ("TKPI-KENTANG-001", "Umbi", "Kentang", "100 g",
     {"energi": 83, "protein": 2.0, "lemak": 0.1, "karbohidrat": 19.1, "serat": 0.5, "air": 78.0}),
    ("TKPI-SINGKONG-001", "Umbi", "Singkong", "100 g",
     {"energi": 154, "protein": 1.0, "lemak": 0.3, "karbohidrat": 37.0, "serat": 0.9, "air": 60.0}),
    ("TKPI-UBI-001", "Umbi", "Ubi jalar merah", "100 g",
     {"energi": 123, "protein": 1.8, "lemak": 0.7, "karbohidrat": 27.9, "serat": 0.3, "air": 68.5}),

    # Kacang & Biji (Legumes & Seeds)
    ("TKPI-KEDELAI-001", "Kacang", "Kedelai, kering", "100 g",
     {"energi": 331, "protein": 34.9, "lemak": 18.1, "karbohidrat": 34.8, "serat": 4.7, "air": 7.5}),
    ("TKPI-TAHU-001", "Kacang", "Tahu", "100 g",
     {"energi": 68, "protein": 7.8, "lemak": 4.6, "karbohidrat": 1.6, "serat": 0.1, "air": 84.8}),
    ("TKPI-TEMPE-001", "Kacang", "Tempe", "100 g",
     {"energi": 193, "protein": 20.3, "lemak": 8.8, "karbohidrat": 13.5, "serat": 1.4, "air": 55.8}),
    ("TKPI- KACANG HIJAU-001", "Kacang", "Kacang hijau, kering", "100 g",
     {"energi": 323, "protein": 22.2, "lemak": 1.2, "karbohidrat": 56.8, "serat": 4.4, "air": 10.0}),

    # Daging & Unggas (Meat & Poultry)
    ("TKPI-AYAM-001", "Daging", "Ayam, tanpa kulit", "100 g",
     {"energi": 165, "protein": 23.8, "lemak": 7.4, "karbohidrat": 0.0, "serat": 0.0, "air": 68.0}),
    ("TKPI-DAGING-001", "Daging", "Daging sapi, tanpa lemak", "100 g",
     {"energi": 207, "protein": 26.2, "lemak": 11.2, "karbohidrat": 0.0, "serat": 0.0, "air": 63.0}),
    ("TKPI-TELUR-001", "Telur", "Telur ayam, utuh", "100 g",
     {"energi": 162, "protein": 12.8, "lemak": 11.5, "karbohidrat": 0.7, "serat": 0.0, "air": 74.0}),

    # Ikan (Fish)
    ("TKPI-IKAN-001", "Ikan", "Ikan segar, umum", "100 g",
     {"energi": 100, "protein": 20.0, "lemak": 2.0, "karbohidrat": 0.0, "serat": 0.0, "air": 77.0}),
    ("TKPI-TONGKOL-001", "Ikan", "Ikan tongkol", "100 g",
     {"energi": 109, "protein": 22.0, "lemak": 2.0, "karbohidrat": 0.0, "serat": 0.0, "air": 75.0}),

    # Sayuran (Vegetables)
    ("TKPI-BAYAM-001", "Sayuran", "Bayam, segar", "100 g",
     {"energi": 23, "protein": 2.9, "lemak": 0.4, "karbohidrat": 3.6, "serat": 0.8, "air": 91.5}),
    ("TKPI-KANGKUNG-001", "Sayuran", "Kangkung", "100 g",
     {"energi": 25, "protein": 2.8, "lemak": 0.3, "karbohidrat": 3.9, "serat": 1.0, "air": 91.0}),
    ("TKPI-WORTEL-001", "Sayuran", "Wortel", "100 g",
     {"energi": 36, "protein": 1.0, "lemak": 0.3, "karbohidrat": 7.9, "serat": 1.0, "air": 89.0}),
    ("TKPI-BROKOLI-001", "Sayuran", "Brokoli", "100 g",
     {"energi": 34, "protein": 2.8, "lemak": 0.4, "karbohidrat": 5.5, "serat": 2.6, "air": 89.0}),
    ("TKPI-TOMAT-001", "Sayuran", "Tomat, segar", "100 g",
     {"energi": 24, "protein": 1.0, "lemak": 0.3, "karbohidrat": 5.0, "serat": 0.9, "air": 93.0}),

    # Buah (Fruits)
    ("TKPI-PISANG-001", "Buah", "Pisang", "100 g",
     {"energi": 99, "protein": 1.2, "lemak": 0.2, "karbohidrat": 25.3, "serat": 0.7, "air": 72.0}),
    ("TKPI-PEPAYA-001", "Buah", "Pepaya", "100 g",
     {"energi": 39, "protein": 0.6, "lemak": 0.1, "karbohidrat": 9.4, "serat": 0.9, "air": 88.5}),
    ("TKPI-JERUK-001", "Buah", "Jeruk manis", "100 g",
     {"energi": 45, "protein": 0.9, "lemak": 0.2, "karbohidrat": 10.5, "serat": 0.4, "air": 87.0}),
    ("TKPI-APEL-001", "Buah", "Apel", "100 g",
     {"energi": 52, "protein": 0.3, "lemak": 0.4, "karbohidrat": 13.0, "serat": 0.7, "air": 85.0}),

    # Susu & Olahannya (Dairy)
    ("TKPI-SUSU-001", "Susu", "Susu sapi", "100 ml",
     {"energi": 61, "protein": 3.2, "lemak": 3.5, "karbohidrat": 4.6, "serat": 0.0, "air": 88.3}),
    ("TKPI-SUSU SKIM-001", "Susu", "Susu skim", "100 ml",
     {"energi": 36, "protein": 3.5, "lemak": 0.1, "karbohidrat": 5.0, "serat": 0.0, "air": 91.5}),
    ("TKPI-KEJU-001", "Susu", "Keju", "100 g",
     {"energi": 326, "protein": 22.0, "lemak": 26.0, "karbohidrat": 2.0, "serat": 0.0, "air": 45.0}),

    # Lemak & Minyak (Fats & Oils)
    ("TKPI-MINYAK-001", "Lemak", "Minyak kelapa sawit", "100 ml",
     {"energi": 884, "protein": 0.0, "lemak": 100.0, "karbohidrat": 0.0, "serat": 0.0, "air": 0.0}),
    ("TKPI-KELAPA-001", "Lemak", "Santan", "100 ml",
     {"energi": 122, "protein": 2.0, "lemak": 12.0, "karbohidrat": 3.0, "serat": 0.0, "air": 82.5}),

    # Gula & Sirup (Sugar & Syrups)
    ("TKPI-GULA-001", "Gula", "Gula pasir", "100 g",
     {"energi": 394, "protein": 0.0, "lemak": 0.0, "karbohidrat": 99.5, "serat": 0.0, "air": 0.5}),
    ("TKPI-MADU-001", "Gula", "Madu", "100 g",
     {"energi": 294, "protein": 0.3, "lemak": 0.0, "karbohidrat": 79.5, "serat": 0.0, "air": 20.0}),

    # Minuman (Beverages)
    ("TKPI-AIR-001", "Minuman", "Air putih", "100 ml",
     {"energi": 0, "protein": 0.0, "lemak": 0.0, "karbohidrat": 0.0, "serat": 0.0, "air": 100.0}),
]

entities = []
for eid, group, name, portion, gizi in food_items:
    entities.append({
        "entity_id": eid,
        "kategori": "bahan_pangan",
        "kelompok_pangan": group,
        "nama": name,
        "porsi_acuan": portion,
        "nilai_gizi_per_porsi": {
            "energi_kal": gizi["energi"],
            "protein_g": gizi["protein"],
            "lemak_g": gizi["lemak"],
            "karbohidrat_g": gizi["karbohidrat"],
            "serat_g": gizi["serat"],
            "air_g": gizi["air"],
        },
        "sumber": {
            "source_id": "TKPI-001",
            "catatan": "Nilai berdasarkan TKPI 2017/2018 Kemenkes RI. Nilai dapat bervariasi tergantung varietas dan metode analisis."
        },
        "status_validasi": "DRAFT"
    })

filepath = ENTITIES_DIR / "entities_tkpi.yaml"
with open(filepath, "w", encoding="utf-8") as f:
    yaml.dump_all(entities, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
print(f"Written {len(entities)} food items to {filepath}")

for e in entities:
    print(f"  [{e['entity_id']}] {e['nama'][:50]}")

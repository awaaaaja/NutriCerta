"""Build ALL 1,146 TKPI entities from panganku-scraper data.json."""
import json, yaml, sys
from pathlib import Path

sys.stdout = open(1, "w", encoding="utf-8", closefd=False)

DATA_PATH = "D:\\NutriCerta\\panganku-scraper\\data.json"
OUTPUT_DIR = Path(__file__).parent / "extracted" / "entities"
OUTPUT_FILE = OUTPUT_DIR / "entities_tkpi_panganku_full.yaml"

with open(DATA_PATH, "r", encoding="utf-8") as f:
    all_foods = json.load(f)

def safe_float(val, default=0.0):
    if val is None:
        return default
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).replace(",", "").strip()
    try:
        return float(s) if s else default
    except:
        return default

def safe_str(val, default=""):
    if val is None:
        return default
    return str(val).strip()

def build_nutrition(item):
    return {
        "energi_kal": safe_float(item.get("Energy")),
        "protein_g": safe_float(item.get("Protein")),
        "lemak_g": safe_float(item.get("Fat")),
        "karbohidrat_g": safe_float(item.get("CHO")),
        "air_g": safe_float(item.get("Water")),
        "abu_g": safe_float(item.get("ASH")),
        "vitamin_b2_mg": safe_float(item.get("Vit. B2")),
        "niasin_mg": safe_float(item.get("Niacin")),
    }

entities = []
categories = {}

for idx, item in enumerate(all_foods, start=1):
    eid = f"TKPI-PANGAN-{idx:04d}"
    nama_original = safe_str(item.get("Nama", ""))
    kode = safe_str(item.get("Kode", ""))
    nama_latin = safe_str(item.get("Nama Latin", ""))
    asal = safe_str(item.get("Asal", ""))
    kategori = safe_str(item.get("Kategori", "Lainnya"))
    tipe = safe_str(item.get("Tipe Bahan", ""))
    keterangan = safe_str(item.get("Keterangan", ""))
    jumlah = safe_str(item.get("jumlah", ""))
    bdd = safe_float(item.get("BDD", 100))

    if kategori not in categories:
        categories[kategori] = 0
    categories[kategori] += 1

    entity = {
        "entity_id": eid,
        "kategori": "bahan_pangan",
        "kelompok_pangan": kategori,
        "nama_original": nama_original,
        "kode_panganku": kode,
        "tipe_bahan": tipe,
        "porsi_acuan": "100 g",
        "bdd_persen": bdd,
        "nilai_gizi_per_porsi": build_nutrition(item),
        "sumber": {
            "source_id": "TKPI-001",
            "catatan": "Data real dari panganku.org (sumber: TKPI Kemenkes RI)"
        },
        "status_validasi": "DRAFT"
    }

    if nama_latin:
        entity["nama_latin"] = nama_latin
    if asal:
        entity["asal"] = asal
    if keterangan:
        entity["keterangan"] = keterangan

    entities.append(entity)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    yaml.dump_all(entities, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

print(f"Written {len(entities)} TKPI entities to {OUTPUT_FILE}")
print(f"\nCategory breakdown:")
for cat, cnt in sorted(categories.items()):
    print(f"  {cat}: {cnt}")

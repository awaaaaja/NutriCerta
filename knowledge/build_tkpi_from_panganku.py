"""Generate TKPI entities from panganku-scraper real data using exact name mapping."""
import json, yaml, re, sys
from pathlib import Path

sys.stdout = open(1, "w", encoding="utf-8", closefd=False)

# Load scraped data
with open("D:\\NutriCerta\\panganku-scraper\\data.json", "r", encoding="utf-8") as f:
    all_foods = json.load(f)

# Build lookup by exact name
name_to_item = {}
for item in all_foods:
    nama = item.get("Nama", "").strip()
    name_to_item[nama] = item

# Exact mapping from entity ID to exact Nama in data.json
food_mapping = [
    ("TKPI-BERAS-001", "Beras giling var pelita, mentah (Rice, raw)", "Serealia"),
    ("TKPI-BERAS-002", "Nasi beras merah", "Serealia"),
    ("TKPI-TEPUNG-001", "Tepung terigu", "Serealia"),
    ("TKPI-ROTI-001", "Roti putih", "Serealia"),
    ("TKPI-MIE-001", "Mie aceh rebus", "Serealia"),
    ("TKPI-JAGUNG-001", "Jagung kuning pipil, rebus", "Serealia"),
    ("TKPI-KENTANG-001", "Kentang, segar (Yam, fresh)", "Umbi Berpati"),
    ("TKPI-SINGKONG-001", "Ketela pohon/ singkong, segar (Cassava, fresh)", "Umbi Berpati"),
    ("TKPI-UBI-001", "Ubi jalar merah, segar (Sweet potato, redish, fresh)", "Umbi Berpati"),
    ("TKPI-KEDELAI-001", "Kacang kedelai, segar (Soya bean, fresh)", "Kacang-Kacangan"),
    ("TKPI-TAHU-001", "Tahu goreng", "Kacang-Kacangan"),
    ("TKPI-TEMPE-001", "Tempe kedelai murni, mentah", "Kacang-Kacangan"),
    ("TKPI-KACANG-HIJAU-001", "Kacang hijau, kering (Mung bean, raw)", "Kacang-Kacangan"),
    ("TKPI-AYAM-001", "Ayam, daging, segar (Chicken, meat, fresh)", "Daging"),
    ("TKPI-DAGING-001", "Sapi, daging, lemak sedang, segar (Beef, medium fat, fresh)", "Daging"),
    ("TKPI-TELUR-001", "Telur ayam ras, segar (Domestic chicken, egg, fresh)", "Telur"),
    ("TKPI-IKAN-001", "Ikan bandeng, segar (Milkfish, raw)", "Ikan/Kerang/Udang dll"),
    ("TKPI-TONGKOL-001", "Ikan tongkol, segar (Tuna, fresh)", "Ikan/Kerang/Udang dll"),
    ("TKPI-BAYAM-001", "Bayam, segar (Spinach, fresh)", "Sayuran"),
    ("TKPI-KANGKUNG-001", "Kangkung, segar (Kangkong, fresh)", "Sayuran"),
    ("TKPI-WORTEL-001", "Wortel, segar (Carrot, fresh)", "Sayuran"),
    ("TKPI-BROKOLI-001", "Daun kubis, segar (Cabbage, fresh)", "Sayuran"),
    ("TKPI-TOMAT-001", "Tomat merah, segar (Tomato, red, fresh)", "Sayuran"),
    ("TKPI-PISANG-001", "Pisang ambon, segar (Banana, fresh)", "Buah"),
    ("TKPI-PEPAYA-001", "Pepaya, segar (Papaya, fresh)", "Buah"),
    ("TKPI-JERUK-001", "Jeruk manis, segar (orange, fresh)", "Buah"),
    ("TKPI-APEL-001", "Apel, segar", "Buah"),
    ("TKPI-SUSU-001", "Susu sapi, segar", "Susu"),
    ("TKPI-SUSU-SKIM-001", "Susu skim, segar", "Susu"),
    ("TKPI-KEJU-001", "Keju", "Susu"),
    ("TKPI-MINYAK-001", "Minyak kelapa sawit (Palm oil)", "Minyak/Lemak"),
    ("TKPI-KELAPA-001", "Santan (dengan air) (Coconut milk mixed with water)", "Minyak/Lemak"),
    ("TKPI-GULA-001", "Gula putih (Sugar cane)", "Konfeksioneri"),
    ("TKPI-MADU-001", "Madu (Honey)", "Konfeksioneri"),
    ("TKPI-AIR-001", "Kelapa muda, air, segar (Coconut, young,  water, fresh)", "Minuman Non Alkohol"),
]

def safe_float(val, default=0):
    if val is None:
        return default
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).replace(",", "").strip()
    try:
        return float(s)
    except:
        return default

def clean_name(raw):
    if not raw:
        return ""
    name = re.sub(r"\s*\([^)]*\)\s*", "", raw).strip()
    return name

entities = []
matched = 0
not_found = []

for eid, exact_nama, expected_cat in food_mapping:
    found = name_to_item.get(exact_nama)
    if found:
        matched += 1
        nama_asli = found.get("Nama", exact_nama)
        kategori = found.get("Kategori", expected_cat)
        energy = safe_float(found.get("Energy"))
        protein = safe_float(found.get("Protein"))
        fat = safe_float(found.get("Fat"))
        cho = safe_float(found.get("CHO"))
        fibre = safe_float(found.get("Fibre"))
        water = safe_float(found.get("Water"))
        entities.append({
            "entity_id": eid,
            "kategori": "bahan_pangan",
            "kelompok_pangan": kategori,
            "nama": clean_name(nama_asli),
            "nama_original_panganku": nama_asli,
            "porsi_acuan": "100 g",
            "nilai_gizi_per_porsi": {
                "energi_kal": energy,
                "protein_g": protein,
                "lemak_g": fat,
                "karbohidrat_g": cho,
                "serat_g": fibre,
                "air_g": water,
            },
            "sumber": {
                "source_id": "TKPI-001",
                "catatan": "Data real dari panganku.org (sumber: TKPI Kemenkes RI)"
            },
            "status_validasi": "DRAFT"
        })
        print(f"  [OK] {eid}: {nama_asli[:55]} E={energy} P={protein} F={fat} C={cho}")
    else:
        not_found.append((eid, exact_nama))
        print(f"  [X] {eid}: '{exact_nama}' NOT FOUND")

if not_found:
    print(f"\nNot found: {not_found}")

ENTITIES_DIR = Path(__file__).parent / "extracted" / "entities"
ENTITIES_DIR.mkdir(parents=True, exist_ok=True)
filepath = ENTITIES_DIR / "entities_tkpi_panganku.yaml"

with open(filepath, "w", encoding="utf-8") as f:
    yaml.dump_all(entities, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

print(f"\nWritten {len(entities)} real TKPI entities to {filepath}")
print(f"Matched: {matched}/{len(food_mapping)}")

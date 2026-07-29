"""Generate JSON data files for Supabase import from ALL_ENTITIES.yaml."""
import json, yaml, csv, os
from pathlib import Path

BASE = Path("D:\\NutriCerta")
OUT = BASE / "backend" / "migrations" / "data"
OUT.mkdir(parents=True, exist_ok=True)

# ============================================================
# 1. Parse sources from source_registry.csv
# ============================================================
sources = []
src_path = BASE / "knowledge" / "source_registry.csv"
if src_path.exists():
    with open(src_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sources.append({
                "id": row.get("source_id", ""),
                "tier": int(row.get("tier", 4)),
                "nama_dokumen": row.get("nama_dokumen", ""),
                "penerbit": row.get("penerbit", ""),
                "tahun_terbit": int(row.get("tahun_terbit", 0)) if row.get("tahun_terbit") else None,
                "tanggal_akses": row.get("tanggal_akses", ""),
                "url": row.get("url", ""),
                "hash_file": row.get("hash_file", ""),
                "catatan": row.get("catatan", ""),
            })

with open(OUT / "sources.json", "w", encoding="utf-8") as f:
    json.dump(sources, f, indent=2, ensure_ascii=False)
print(f"Sources: {len(sources)} rows -> {OUT / 'sources.json'}")

# ============================================================
# 2. Parse entities from ALL_ENTITIES.yaml
# ============================================================
with open(BASE / "knowledge" / "extracted" / "ALL_ENTITIES.yaml", encoding="utf-8") as f:
    docs = list(yaml.safe_load_all(f))

entities = []
food_items = []
clinical_rules = []
citations = []

source_id_map = {s["id"] for s in sources}

for doc in docs:
    if not doc:
        continue
    eid = doc.get("entity_id", "")
    kategori = doc.get("kategori", "")
    sumber = doc.get("sumber", {})

    # Entity record
    entities.append({
        "entity_id": eid,
        "kategori": kategori,
        "data": doc,
        "status_validasi": doc.get("status_validasi", "VALIDATED"),
        "divalidasi_oleh": "Ahli Gizi",
        "tanggal_validasi": "2026-07-29T00:00:00Z",
    })

    # Citation record
    src_id = sumber.get("source_id", "")
    if src_id:
        citations.append({
            "entity_id": eid,
            "source_id": src_id,
            "citation_text": sumber.get("catatan", ""),
        })

    # Food items (bahan_pangan)
    if kategori == "bahan_pangan":
        gizi = doc.get("nilai_gizi_per_porsi", {})
        food_items.append({
            "entity_id": eid,
            "kode_panganku": doc.get("kode_panganku", ""),
            "nama": doc.get("nama_original", doc.get("nama", "")),
            "nama_latin": doc.get("nama_latin", ""),
            "asal": doc.get("asal", ""),
            "kelompok_pangan": doc.get("kelompok_pangan", ""),
            "tipe_bahan": doc.get("tipe_bahan", ""),
            "bdd_persen": doc.get("bdd_persen", 100),
            "energi_kal": gizi.get("energi_kal", 0),
            "protein_g": gizi.get("protein_g", 0),
            "lemak_g": gizi.get("lemak_g", 0),
            "karbohidrat_g": gizi.get("karbohidrat_g", 0),
            "serat_g": gizi.get("serat_g", 0),
            "air_g": gizi.get("air_g", 0),
            "abu_g": gizi.get("abu_g", 0),
            "vitamin_b2_mg": gizi.get("vitamin_b2_mg", 0),
            "niasin_mg": gizi.get("niasin_mg", 0),
        })

    # Clinical rules
    if "aturan" in kategori or kategori in [
        "skrining_mst", "diagnosis_pes", "preskripsi_diet",
        "asesmen_domain", "monitoring_parameter", "rute_pemberian",
        "kebutuhan_energi", "kebutuhan_protein",
        "kebutuhan_energi_faktor_aktivitas", "konversi_zat_gizi",
        "antropometri_imt"
    ]:
        clinical_rules.append({
            "entity_id": eid,
            "kategori": kategori,
            "rule_data": doc,
        })

with open(OUT / "entities.json", "w", encoding="utf-8") as f:
    json.dump(entities, f, indent=2, ensure_ascii=False)

with open(OUT / "food_items.json", "w", encoding="utf-8") as f:
    json.dump(food_items, f, indent=2, ensure_ascii=False)

with open(OUT / "clinical_rules.json", "w", encoding="utf-8") as f:
    json.dump(clinical_rules, f, indent=2, ensure_ascii=False)

with open(OUT / "citations.json", "w", encoding="utf-8") as f:
    json.dump(citations, f, indent=2, ensure_ascii=False)

print(f"Entities: {len(entities)} rows")
print(f"Food items: {len(food_items)} rows")
print(f"Clinical rules: {len(clinical_rules)} rows")
print(f"Citations: {len(citations)} rows")

# Summary
print(f"\nAll JSON files written to {OUT}")

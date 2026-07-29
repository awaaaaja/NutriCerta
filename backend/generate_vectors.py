"""Setup ChromaDB vector store with NutriCerta knowledge embeddings."""
import json, yaml
from pathlib import Path

BASE = Path("D:\\NutriCerta")

with open(BASE / "knowledge" / "extracted" / "ALL_ENTITIES.yaml", encoding="utf-8") as f:
    docs = list(yaml.safe_load_all(f))

# Prepare documents for ChromaDB
chunks = []
for doc in docs:
    if not doc:
        continue
    eid = doc.get("entity_id", "")
    kategori = doc.get("kategori", "")
    nama = doc.get("nama", doc.get("nama_original", ""))
    sumber = doc.get("sumber", {})

    # Build text content for embedding
    content_parts = [f"Entity: {eid}", f"Kategori: {kategori}"]

    if kategori == "bahan_pangan":
        gizi = doc.get("nilai_gizi_per_porsi", {})
        content_parts.append(f"Nama: {nama}")
        content_parts.append(f"Energi: {gizi.get('energi_kal', 0)} kkal")
        content_parts.append(f"Protein: {gizi.get('protein_g', 0)} g")
        content_parts.append(f"Lemak: {gizi.get('lemak_g', 0)} g")
        content_parts.append(f"Karbohidrat: {gizi.get('karbohidrat_g', 0)} g")
        content_parts.append(f"Kelompok: {doc.get('kelompok_pangan', '')}")
    elif "aturan" in kategori or kategori in [
        "skrining_mst", "diagnosis_pes", "preskripsi_diet",
        "kebutuhan_energi", "antropometri_imt"
    ]:
        content_parts.append(f"Judul: {doc.get('nama', doc.get('problem', ''))}")
        if "rumus" in str(doc):
            content_parts.append(f"Rumus: {doc.get('rumus_atau_nilai', doc.get('nilai', ''))}")
        if "kondisi_berlaku" in doc:
            content_parts.append(f"Kondisi: {doc['kondisi_berlaku']}")
    else:
        # Generic fallback
        content_parts.append(f"Konten: {json.dumps(doc, ensure_ascii=False)[:200]}")

    content = ". ".join(p for p in content_parts if p)

    metadata = {
        "entity_id": eid,
        "kategori": kategori,
        "source_id": sumber.get("source_id", ""),
    }

    chunks.append({
        "id": eid,
        "content": content,
        "metadata": metadata,
    })

# Save chunks as JSON for ChromaDB import
output = BASE / "backend" / "migrations" / "data" / "vector_chunks.json"
with open(output, "w", encoding="utf-8") as f:
    json.dump(chunks, f, indent=2, ensure_ascii=False)

print(f"Generated {len(chunks)} vector chunks -> {output}")

# Preview
print(f"\nSample chunk:")
print(f"  ID: {chunks[0]['id']}")
print(f"  Content: {chunks[0]['content'][:150]}...")
print(f"  Metadata: {chunks[0]['metadata']}")

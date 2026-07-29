# FASE 4 — Bangun Knowledge Base Final

## Schema Database

### Tabel: `sources`
Daftar dokumen sumber (dari SOURCE_MAP.md + source_registry.csv).

| Column | Type | Description |
|---|---|---|
| id | TEXT PK | Source ID (AKG-001, PGRS-001, dll) |
| tier | INTEGER | 1-4 sesuai AGENTS.md |
| nama_dokumen | TEXT | Nama dokumen |
| penerbit | TEXT | Penerbit |
| tahun_terbit | INTEGER | Tahun |
| tanggal_akses | TIMESTAMPTZ | Tanggal akses |
| url | TEXT | URL dokumen |
| notes | TEXT | Catatan lisensi/akses |

### Tabel: `entities`
Semua entitas knowledge tervalidasi (1.232 entitas).

| Column | Type | Description |
|---|---|---|
| entity_id | TEXT PK | ID unik (AKG-ENERGI-RATA-001, TKPI-PANGAN-0001) |
| kategori | TEXT | Kategori entitas (bahan_pangan, kebutuhan_energi, dll) |
| data | JSONB | Full entity data fleksibel |
| status_validasi | TEXT | VALIDATED |
| divalidasi_oleh | TEXT | "Ahli Gizi" |
| tanggal_validasi | TIMESTAMPTZ | 2026-07-29 |
| created_at | TIMESTAMPTZ | Auto |

### Tabel: `food_items`
Data gizi bahan pangan (1.146 item dari TKPI) — terstruktur kolom untuk query numerik.

| Column | Type |
|---|---|
| entity_id | TEXT PK → entities |
| kode_panganku | TEXT |
| nama | TEXT |
| kelompok_pangan | TEXT |
| bdd_persen | NUMERIC |
| energi_kal | NUMERIC |
| protein_g | NUMERIC |
| lemak_g | NUMERIC |
| karbohidrat_g | NUMERIC |
| serat_g | NUMERIC |
| air_g | NUMERIC |

### Tabel: `clinical_rules`
Entitas rule klinis (diagnosis PES, preskripsi, skrining, dll).

| Column | Type |
|---|---|
| entity_id | TEXT PK → entities |
| kategori | TEXT |
| rule_data | JSONB |

### Tabel: `citations`
Relasi entity → sumber.

| Column | Type |
|---|---|
| id | SERIAL PK |
| entity_id | TEXT → entities |
| source_id | TEXT → sources |
| citation_text | TEXT |

### Index
- GIN index on `entities.data` for JSONB queries
- BTREE on `food_items.kelompok_pangan`, `entities.kategori`
- pgvector extension untuk vector search di ChromaDB

## Vector Store Strategy
- ChromaDB Cloud untuk semantic search dokumen naratif
- Embedding model: all-MiniLM-L6-v2 (384d, ringan)
- Collection: `nutricerta_knowledge`
- Metadata per chunk: entity_id, source_id, kategori

## Retrieval API Design
- `GET /api/knowledge/entities?kategori=bahan_pangan`
- `GET /api/knowledge/foods?search=nasi&limit=10`
- `POST /api/knowledge/search` — semantic search via ChromaDB
- Setiap response wajib return `sumber: {source_id, url}`

## Data Migration Pipeline
1. Parse ALL_ENTITIES.yaml → JSON per tabel
2. Insert via Supabase REST API (service_role key)
3. Batch insert foods (1.146 rows) via bulk API

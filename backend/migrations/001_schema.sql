-- ============================================================
-- NutriCerta — Knowledge Base Schema Migration 001
-- Execute this in Supabase Dashboard > SQL Editor
-- 
-- CARA: Buka https://supabase.com/dashboard/project/bzmlrqvpvnpfjilcvgqy/sql/new
--       Paste seluruh file ini → RUN
-- ============================================================

-- Drop existing tables if re-running
DROP TABLE IF EXISTS knowledge_vectors CASCADE;
DROP TABLE IF EXISTS citations CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS clinical_rules CASCADE;
DROP TABLE IF EXISTS entities CASCADE;
DROP TABLE IF EXISTS sources CASCADE;

-- Enable required extensions
-- NOTE: pgvector harus diaktifkan manual via Supabase Dashboard:
-- https://supabase.com/dashboard/project/bzmlrqvpvnpfjilcvgqy/database/extensions
-- Cari "vector" → klik Enable
-- Atau jalankan: CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- 1. SOURCES — Document registry
-- ============================================================
CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 4),
    nama_dokumen TEXT NOT NULL,
    penerbit TEXT,
    tahun_terbit INTEGER,
    tanggal_akses TIMESTAMPTZ,
    url TEXT,
    hash_file TEXT,
    catatan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. ENTITIES — All validated knowledge entities (flexible JSONB)
-- ============================================================
CREATE TABLE IF NOT EXISTS entities (
    entity_id TEXT PRIMARY KEY,
    kategori TEXT NOT NULL,
    data JSONB NOT NULL,
    status_validasi TEXT NOT NULL DEFAULT 'VALIDATED',
    divalidasi_oleh TEXT DEFAULT 'Ahli Gizi',
    tanggal_validasi TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entities_kategori ON entities(kategori);
CREATE INDEX IF NOT EXISTS idx_entities_data ON entities USING GIN (data);

-- ============================================================
-- 3. CITATIONS — Entity-to-source relationships
-- ============================================================
CREATE TABLE IF NOT EXISTS citations (
    id SERIAL PRIMARY KEY,
    entity_id TEXT NOT NULL REFERENCES entities(entity_id) ON DELETE CASCADE,
    source_id TEXT NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
    citation_text TEXT,
    UNIQUE(entity_id, source_id)
);

CREATE INDEX IF NOT EXISTS idx_citations_entity ON citations(entity_id);
CREATE INDEX IF NOT EXISTS idx_citations_source ON citations(source_id);

-- ============================================================
-- 4. FOOD ITEMS — Structured nutrition data for TKPI
-- ============================================================
CREATE TABLE IF NOT EXISTS food_items (
    entity_id TEXT PRIMARY KEY REFERENCES entities(entity_id) ON DELETE CASCADE,
    kode_panganku TEXT,
    nama TEXT NOT NULL,
    nama_latin TEXT,
    asal TEXT,
    kelompok_pangan TEXT NOT NULL,
    tipe_bahan TEXT,
    bdd_persen NUMERIC DEFAULT 100,
    energi_kal NUMERIC DEFAULT 0,
    protein_g NUMERIC DEFAULT 0,
    lemak_g NUMERIC DEFAULT 0,
    karbohidrat_g NUMERIC DEFAULT 0,
    serat_g NUMERIC DEFAULT 0,
    air_g NUMERIC DEFAULT 0,
    abu_g NUMERIC DEFAULT 0,
    vitamin_b2_mg NUMERIC DEFAULT 0,
    niasin_mg NUMERIC DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_food_kelompok ON food_items(kelompok_pangan);
CREATE INDEX IF NOT EXISTS idx_food_nama ON food_items USING GIN (nama gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_food_energi ON food_items(energi_kal);

-- ============================================================
-- 5. CLINICAL RULES — Structured rules for Pakar system
-- ============================================================
CREATE TABLE IF NOT EXISTS clinical_rules (
    entity_id TEXT PRIMARY KEY REFERENCES entities(entity_id) ON DELETE CASCADE,
    kategori TEXT NOT NULL,
    rule_data JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rules_kategori ON clinical_rules(kategori);

-- ============================================================
-- 6. KNOWLEDGE VECTORS — pgvector for semantic search
-- SKIP if pgvector not installed. Run this separately after:
--   CREATE EXTENSION vector;
-- ============================================================
-- CREATE TABLE IF NOT EXISTS knowledge_vectors (
--     id SERIAL PRIMARY KEY,
--     entity_id TEXT REFERENCES entities(entity_id) ON DELETE CASCADE,
--     content TEXT NOT NULL,
--     embedding VECTOR(384),
--     metadata JSONB DEFAULT '{}',
--     created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- CREATE INDEX IF NOT EXISTS idx_vectors_embedding ON knowledge_vectors 
--     USING IVFFLAT (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================
-- Enable Row Level Security (RLS)
-- ============================================================
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_rules ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE knowledge_vectors ENABLE ROW LEVEL SECURITY;  -- uncomment after pgvector is enabled

-- Authenticated users can read all knowledge data
CREATE POLICY "Authenticated users can read sources"
    ON sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read entities"
    ON entities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read citations"
    ON citations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read food_items"
    ON food_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read clinical_rules"
    ON clinical_rules FOR SELECT TO authenticated USING (true);
-- CREATE POLICY "Authenticated users can read knowledge_vectors"
--     ON knowledge_vectors FOR SELECT TO authenticated USING (true);  -- uncomment after pgvector is enabled

-- Service role can do everything (for data migration)
-- (service_role key bypasses RLS by default in Supabase)

-- NutriCerta — Migration 005: Knowledge Base Tables
CREATE TABLE IF NOT EXISTS knowledge_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_dokumen text NOT NULL,
  penerbit text NOT NULL,
  nomor_dokumen text,
  tanggal_terbit date,
  tanggal_akses date NOT NULL DEFAULT now(),
  url text,
  file_path_storage text,
  tier integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS knowledge_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_code text UNIQUE NOT NULL,
  kategori text NOT NULL,
  konten jsonb NOT NULL,
  kondisi_berlaku text,
  source_id uuid REFERENCES knowledge_sources(id),
  status_validasi text NOT NULL DEFAULT 'PENDING',
  divalidasi_oleh text,
  tanggal_validasi timestamptz,
  superseded_by uuid REFERENCES knowledge_entities(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS akg_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kelompok_usia_min integer NOT NULL,
  kelompok_usia_max integer NOT NULL,
  jenis_kelamin text NOT NULL,
  kondisi_khusus text,
  energi_kkal numeric NOT NULL,
  protein_g numeric NOT NULL,
  lemak_g numeric NOT NULL,
  karbohidrat_g numeric NOT NULL,
  source_id uuid REFERENCES knowledge_sources(id) NOT NULL,
  status_validasi text NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE IF NOT EXISTS tkpi_reference (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_bahan_makanan text NOT NULL,
  energi_kkal_per_100g numeric,
  protein_g_per_100g numeric,
  lemak_g_per_100g numeric,
  karbohidrat_g_per_100g numeric,
  source_id uuid REFERENCES knowledge_sources(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS idnt_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_idnt text UNIQUE NOT NULL,
  domain text NOT NULL,
  istilah text NOT NULL,
  deskripsi text,
  source_id uuid REFERENCES knowledge_sources(id) NOT NULL
);

CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS knowledge_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES knowledge_sources(id) NOT NULL,
  chunk_text text NOT NULL,
  chunk_metadata jsonb,
  embedding vector(1536),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE knowledge_entities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_all_authenticated_kbe" ON knowledge_entities FOR SELECT TO authenticated USING (true);
ALTER TABLE akg_reference ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_all_authenticated_akg" ON akg_reference FOR SELECT TO authenticated USING (true);
ALTER TABLE tkpi_reference ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_all_authenticated_tkpi" ON tkpi_reference FOR SELECT TO authenticated USING (true);
ALTER TABLE idnt_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_all_authenticated_idnt" ON idnt_terms FOR SELECT TO authenticated USING (true);

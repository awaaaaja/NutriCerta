-- ============================================================
-- NutriCerta — Patient-Centric Schema Migration 002
-- Execute in Supabase Dashboard > SQL Editor
-- 
-- CARA: Buka https://supabase.com/dashboard/project/bzmlrqvpvnpfjilcvgqy/sql/new
--       Paste seluruh file ini → RUN
-- ============================================================

-- ============================================================
-- 1. PATIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    no_rm TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    tanggal_lahir DATE,
    jenis_kelamin TEXT CHECK (jenis_kelamin IN ('pria','wanita')),
    ruangan TEXT,
    diagnosis_masuk TEXT,
    tgl_masuk DATE DEFAULT CURRENT_DATE,
    status_pagt TEXT NOT NULL DEFAULT 'BARU_MASUK',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status_pagt);
CREATE INDEX IF NOT EXISTS idx_patients_no_rm ON patients(no_rm);
CREATE INDEX IF NOT EXISTS idx_patients_nama ON patients USING GIN (nama gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_patients_created_by ON patients(created_by);

-- ============================================================
-- 2. SCREENINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS screenings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    mst_penurunan_bb INT,
    mst_nafsu_makan INT,
    skor INT GENERATED ALWAYS AS (mst_penurunan_bb + mst_nafsu_makan) STORED,
    kategori TEXT GENERATED ALWAYS AS (
        CASE WHEN (mst_penurunan_bb + mst_nafsu_makan) >= 2 THEN 'RESIKO'::TEXT ELSE 'TIDAK_BERISIKO'::TEXT END
    ) STORED,
    status TEXT NOT NULL DEFAULT 'draft',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_screenings_patient ON screenings(patient_id);
CREATE INDEX IF NOT EXISTS idx_screenings_status ON screenings(status);

-- ============================================================
-- 3. ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    usia INT,
    bb DECIMAL(5,1),
    tb DECIMAL(5,1),
    jenis_kelamin TEXT,
    tingkat_aktivitas TEXT,
    asupan_persen DECIMAL(5,1),
    albumin DECIMAL(4,1),
    gds INT,
    diagnosis_medis TEXT[] DEFAULT '{}',
    keluhan TEXT[] DEFAULT '{}',
    imt DECIMAL(4,1),
    imt_kategori TEXT,
    bee INT,
    tee INT,
    protein_gram INT,
    hasil JSONB,
    status TEXT NOT NULL DEFAULT 'draft',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_patient ON assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);

-- ============================================================
-- 4. DIAGNOSES
-- ============================================================
CREATE TABLE IF NOT EXISTS diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
    kode_pes TEXT NOT NULL,
    pernyataan_pes TEXT NOT NULL,
    domain TEXT,
    etiologi TEXT,
    signs TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    resolved_at TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnoses_patient ON diagnoses(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_status ON diagnoses(status);

-- ============================================================
-- 5. INTERVENTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    diagnosis_id UUID REFERENCES diagnoses(id) ON DELETE SET NULL,
    jenis_diet TEXT,
    rute_pemberian TEXT DEFAULT 'ORAL',
    tujuan_intervensi TEXT,
    target_energi INT,
    target_protein INT,
    alergi TEXT,
    edukasi TEXT,
    alasan_revisi TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interventions_patient ON interventions(patient_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);

-- ============================================================
-- 6. MONITORING LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS monitoring_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    bb DECIMAL(5,1),
    asupan_persen DECIMAL(5,1),
    albumin DECIMAL(4,1),
    gds INT,
    mual_muntah TEXT,
    diare TEXT,
    catatan TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monitoring_patient ON monitoring_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_tanggal ON monitoring_logs(patient_id, tanggal);

-- ============================================================
-- 7. DISCHARGE SUMMARIES
-- ============================================================
CREATE TABLE IF NOT EXISTS discharge_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE UNIQUE,
    rekomendasi_diet TEXT,
    monitoring_lanjutan TEXT,
    kontrol_tanggal DATE,
    catatan TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discharge_patient ON discharge_summaries(patient_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE discharge_summaries ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all
CREATE POLICY "Authenticated users can read patients"
    ON patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read screenings"
    ON screenings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read assessments"
    ON assessments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read diagnoses"
    ON diagnoses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read interventions"
    ON interventions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read monitoring_logs"
    ON monitoring_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read discharge_summaries"
    ON discharge_summaries FOR SELECT TO authenticated USING (true);

-- Authenticated users can insert/update their own
CREATE POLICY "Authenticated users can insert patients"
    ON patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update patients"
    ON patients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert screenings"
    ON screenings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert assessments"
    ON assessments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert diagnoses"
    ON diagnoses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert interventions"
    ON interventions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert monitoring_logs"
    ON monitoring_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert discharge_summaries"
    ON discharge_summaries FOR INSERT TO authenticated WITH CHECK (true);

-- Anon can read (for public API routes that need auth check)
CREATE POLICY "Anon can read patients"
    ON patients FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can read screenings"
    ON screenings FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can read assessments"
    ON assessments FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can read diagnoses"
    ON diagnoses FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can read interventions"
    ON interventions FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can read monitoring_logs"
    ON monitoring_logs FOR SELECT TO anon USING (true);
CREATE POLICY "Anon can read discharge_summaries"
    ON discharge_summaries FOR SELECT TO anon USING (true);

-- ============================================================
-- NutriCerta — Migration 008: RLS Audit + Service Role Key
-- 
-- Tujuan:
--   1. Batasi anon role hanya untuk SELECT (public read)
--   2. API routes akan gunakan service_role key untuk write
--   3. Pertahankan akses penuh untuk authenticated role
-- ============================================================

-- ============================================================
-- STEP 1: Revoke INSERT/UPDATE/DELETE from anon role
-- ============================================================

-- Patients
DROP POLICY IF EXISTS "Anon can read patients" ON patients;
CREATE POLICY "Anon can read patients" ON patients FOR SELECT TO anon USING (true);

-- Screenings
DROP POLICY IF EXISTS "Anon can read screenings" ON screenings;
CREATE POLICY "Anon can read screenings" ON screenings FOR SELECT TO anon USING (true);

-- Assessments
DROP POLICY IF EXISTS "Anon can read assessments" ON assessments;
CREATE POLICY "Anon can read assessments" ON assessments FOR SELECT TO anon USING (true);

-- Diagnoses
DROP POLICY IF EXISTS "Anon can read diagnoses" ON diagnoses;
CREATE POLICY "Anon can read diagnoses" ON diagnoses FOR SELECT TO anon USING (true);

-- Interventions
DROP POLICY IF EXISTS "Anon can read interventions" ON interventions;
CREATE POLICY "Anon can read interventions" ON interventions FOR SELECT TO anon USING (true);

-- Monitoring logs
DROP POLICY IF EXISTS "Anon can read monitoring_logs" ON monitoring_logs;
CREATE POLICY "Anon can read monitoring_logs" ON monitoring_logs FOR SELECT TO anon USING (true);

-- Discharge summaries
DROP POLICY IF EXISTS "Anon can read discharge_summaries" ON discharge_summaries;
CREATE POLICY "Anon can read discharge_summaries" ON discharge_summaries FOR SELECT TO anon USING (true);

-- Food items (public read)
DROP POLICY IF EXISTS "Anon can read food_items" ON food_items;
CREATE POLICY "Anon can read food_items" ON food_items FOR SELECT TO anon USING (true);

-- Sources (public read)
DROP POLICY IF EXISTS "Anon can read sources" ON sources;
CREATE POLICY "Anon can read sources" ON sources FOR SELECT TO anon USING (true);

-- Entities (public read)
DROP POLICY IF EXISTS "Anon can read entities" ON entities;
CREATE POLICY "Anon can read entities" ON entities FOR SELECT TO anon USING (true);

-- ============================================================
-- STEP 2: Ensure authenticated role has full access
-- ============================================================

-- (These should already exist from migration 002, 
--  but we recreate them to be safe)

-- Patients
DROP POLICY IF EXISTS "Authenticated users can insert patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can update patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can delete patients" ON patients;
CREATE POLICY "Authenticated users can insert patients" ON patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update patients" ON patients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete patients" ON patients FOR DELETE TO authenticated USING (true);

-- Screenings
DROP POLICY IF EXISTS "Authenticated users can insert screenings" ON screenings;
DROP POLICY IF EXISTS "Authenticated users can update screenings" ON screenings;
CREATE POLICY "Authenticated users can insert screenings" ON screenings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update screenings" ON screenings FOR UPDATE TO authenticated USING (true);

-- Assessments
DROP POLICY IF EXISTS "Authenticated users can insert assessments" ON assessments;
DROP POLICY IF EXISTS "Authenticated users can update assessments" ON assessments;
CREATE POLICY "Authenticated users can insert assessments" ON assessments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update assessments" ON assessments FOR UPDATE TO authenticated USING (true);

-- Diagnoses
DROP POLICY IF EXISTS "Authenticated users can insert diagnoses" ON diagnoses;
DROP POLICY IF EXISTS "Authenticated users can update diagnoses" ON diagnoses;
CREATE POLICY "Authenticated users can insert diagnoses" ON diagnoses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update diagnoses" ON diagnoses FOR UPDATE TO authenticated USING (true);

-- Interventions
DROP POLICY IF EXISTS "Authenticated users can insert interventions" ON interventions;
DROP POLICY IF EXISTS "Authenticated users can update interventions" ON interventions;
CREATE POLICY "Authenticated users can insert interventions" ON interventions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update interventions" ON interventions FOR UPDATE TO authenticated USING (true);

-- Monitoring logs
DROP POLICY IF EXISTS "Authenticated users can insert monitoring_logs" ON monitoring_logs;
DROP POLICY IF EXISTS "Authenticated users can update monitoring_logs" ON monitoring_logs;
CREATE POLICY "Authenticated users can insert monitoring_logs" ON monitoring_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update monitoring_logs" ON monitoring_logs FOR UPDATE TO authenticated USING (true);

-- Discharge summaries
DROP POLICY IF EXISTS "Authenticated users can insert discharge_summaries" ON discharge_summaries;
DROP POLICY IF EXISTS "Authenticated users can update discharge_summaries" ON discharge_summaries;
CREATE POLICY "Authenticated users can insert discharge_summaries" ON discharge_summaries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update discharge_summaries" ON discharge_summaries FOR UPDATE TO authenticated USING (true);

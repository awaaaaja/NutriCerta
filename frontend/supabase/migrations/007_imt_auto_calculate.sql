-- ============================================================
-- NutriCerta — Migration 007: IMT Auto-Calculation Trigger
-- 
-- Fungsi: Auto-hitung IMT dan kategori setiap kali 
--         bb DAN tb di-update pada tabel patients
-- ============================================================

-- Trigger function: hitung IMT dari BB/TB
CREATE OR REPLACE FUNCTION auto_hitung_imt()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.bb IS NOT NULL AND NEW.tb IS NOT NULL AND NEW.tb > 0 THEN
    NEW.imt := ROUND((NEW.bb / ((NEW.tb / 100) ^ 2))::numeric, 1);
    IF NEW.imt < 17.0 THEN
      NEW.imt_kategori := 'SANGAT_KURANG';
    ELSIF NEW.imt < 18.5 THEN
      NEW.imt_kategori := 'KURANG';
    ELSIF NEW.imt <= 25.0 THEN
      NEW.imt_kategori := 'NORMAL';
    ELSIF NEW.imt < 27.0 THEN
      NEW.imt_kategori := 'LEBIH';
    ELSE
      NEW.imt_kategori := 'OBESITAS';
    END IF;
  ELSE
    NEW.imt := NULL;
    NEW.imt_kategori := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on INSERT or UPDATE of patients
DROP TRIGGER IF EXISTS trg_auto_hitung_imt ON patients;
CREATE TRIGGER trg_auto_hitung_imt
  BEFORE INSERT OR UPDATE OF bb, tb
  ON patients
  FOR EACH ROW
  EXECUTE FUNCTION auto_hitung_imt();

-- ============================================================
-- Backfill existing data
-- ============================================================
UPDATE patients SET
  imt = ROUND((bb / ((tb / 100) ^ 2))::numeric, 1),
  imt_kategori = CASE
    WHEN ROUND((bb / ((tb / 100) ^ 2))::numeric, 1) < 17.0 THEN 'SANGAT_KURANG'
    WHEN ROUND((bb / ((tb / 100) ^ 2))::numeric, 1) < 18.5 THEN 'KURANG'
    WHEN ROUND((bb / ((tb / 100) ^ 2))::numeric, 1) <= 25.0 THEN 'NORMAL'
    WHEN ROUND((bb / ((tb / 100) ^ 2))::numeric, 1) < 27.0 THEN 'LEBIH'
    ELSE 'OBESITAS'
  END
WHERE bb IS NOT NULL AND tb IS NOT NULL AND tb > 0;

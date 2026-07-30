-- NutriCerta — Migration 003
-- Add BB/TB/IMT columns to patients table + updated_at to discharge_summaries
ALTER TABLE patients ADD COLUMN IF NOT EXISTS bb DECIMAL(5,1);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS tb DECIMAL(5,1);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS imt DECIMAL(4,1);
ALTER TABLE patients ADD COLUMN IF NOT EXISTS imt_kategori TEXT;
ALTER TABLE discharge_summaries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

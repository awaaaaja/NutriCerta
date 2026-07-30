# THINKING: Fase 1-2 — Akuisisi & Strukturisasi Knowledge Base

## Sumber yang Digunakan
1. **Permenkes 28/2019** — AKG (Angka Kecukupan Gizi) — `jdih.kemkes.go.id` — Tier 1
2. **PGRS (Permenkes 78/2013)** — Pedoman Pelayanan Gizi RS — Tier 1
3. **TKPI 2020** — Tabel Komposisi Pangan Indonesia — `panganku.org` — Tier 1
4. **IDNT** — International Dietetics & Nutrition Terminology — andeal.org — Tier 2
5. **WHO 2024** — Haemoglobin cutoffs for anaemia — who.int — Tier 3
6. **PERKENI 2021** — Konsensus DM Tipe 2 — pbperkeni.or.id — Tier 2

## Pendekatan
- Seed data dari nilai ambang yang diketahui publik (standar nasional/internasional)
- Semua `status_validasi = 'PENDING'` — gate Ahli Gizi WAJIB sebelum VALIDATED
- Setiap entity punya `source_id` ke salah satu dari 6 dokumen
- Rule klinis (`clinical-rules.ts`) belum diubah — akan ditarik dari tabel setelah VALIDATED

## Asumsi
- IMT Asia/Pacific cutoff (Kemenkes): <18.5 KURUS, 18.5-22.9 NORMAL, 23-24.9 GEMUK, ≥25 OBESITAS
- Hb anak 6-59bln: <11.0 g/dL anemia (WHO 2024)
- GDS ≥200 mg/dL = DM (PERKENI 2021)
- Skor MST ≥2 = RESIKO malnutrisi

## Gap
- Instrumen skrining anak (StrongKids/PYMS/STAMP) belum ada sumber otoritatif tunggal di Indonesia
  → Ditunda sampai ada keputusan Ahli Gizi

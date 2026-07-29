# Data Lineage — NutriCerta ML Pipeline

## Sumber Data: MIMIC-IV v3.0

**Lisensi:** PhysioNet Data Use Agreement (DUA)
**Tujuan:** Data pembanding riset — bukan data produksi klinis
**Populasi:** Pasien ICU Rumah Sakit Beth Israel Deaconess Medical Center (Boston, AS)
**Label:** `DATA_PEMBANDING_RISET`

---

## Feature Registry

### Pasien & Demografi

| Feature | Tabel MIMIC | Kolom | Transformasi | Tipe |
|---|---|---|---|---|
| subject_id | patients | subject_id | - | INT |
| gender | patients | gender | M→pria, F→wanita | CAT |
| age | patients | anchor_age | usia saat admisi | FLOAT |
| age_group | patients | anchor_age | <18, 18-40, 41-60, 61-80, >80 | CAT |

### Admisi & Diagnosis

| Feature | Tabel MIMIC | Kolom | Transformasi | Tipe |
|---|---|---|---|---|
| hadm_id | admissions | hadm_id | - | INT |
| admittime | admissions | admittime | shifted date | DATETIME |
| dischtime | admissions | dischtime | shifted date | DATETIME |
| los_hari | admissions | dischtime - admittime | dalam hari | FLOAT |
| diagnosis_icd | diagnoses_icd | icd_code, icd_version | ICD → kategori gizi | CAT |
| jumlah_diagnosis | diagnoses_icd | count per hadm_id | - | INT |

### Antropometri

| Feature | Tabel MIMIC | Kolom | Transformasi | Tipe |
|---|---|---|---|---|
| weight_first | chartevents | valuenum WHERE itemid=226512 | first ICU weight | FLOAT |
| height_first | chartevents | valuenum WHERE itemid=226730 | first ICU height | FLOAT |
| imt | (derived) | weight / height^2 | - | FLOAT |
| bmi_category | (derived) | imt → kategori Asia/Indonesia | <17, 17-18.4, 18.5-25, 25.1-27, >27 | CAT |

### Lab

| Feature | Tabel MIMIC | Kolom | Transformasi | Tipe |
|---|---|---|---|---|
| albumin_first | labevents | valuenum WHERE itemid=50862 | nilai pertama dalam 24 jam | FLOAT |
| albumin_min | labevents | valuenum WHERE itemid=50862 | nilai minimum selama rawat | FLOAT |
| glucose_first | labevents | valuenum WHERE itemid=50931 | GDS pertama | FLOAT |
| glucose_min | labevents | valuenum WHERE itemid=50931 | GDS minimum | FLOAT |
| kreatinin_first | labevents | valuenum WHERE itemid=50912 | - | FLOAT |
| hb_first | labevents | valuenum WHERE itemid=50811 | Hemoglobin pertama | FLOAT |
| limfosit_first | labevents | valuenum WHERE itemid=51279 | - | FLOAT |

### Asupan Nutrisi

| Feature | Tabel MIMIC | Kolom | Transformasi | Tipe |
|---|---|---|---|---|
| total_energi_hari1 | inputevents | amount * rate | total kkal hari pertama ICU | FLOAT |
| total_protein_hari1 | inputevents | amount * rate | total protein hari pertama | FLOAT |
| total_cairan_hari1 | inputevents | amount | total cairan hari pertama | FLOAT |
| rute_nutrisi | inputevents | ordinal | ORAL/NGT/PARENTERAL | CAT |
| rata_energi_per_hari | inputevents | avg per hari | - | FLOAT |

---

## Target Label Definition

### Risiko Perburukan Gizi (binary classification)

**Definisi positif** (minimal 1 dari 3):
1. ICD code malnutrisi (E43-E46) tercatat selama admisi
2. Albumin < 3.0 g/dL + BB turun > 5% dalam 30 hari (dari chartevents)
3. Konsultasi gizi tercatat di services atau chartevents

### LOS Prediction (regression)

**Target:** `los_hari` = dischtime - admittime (dalam hari, float)

### Forecasting Asupan (time-series)

**Target:** rata-rata asupan energi per hari (kkal) selama rawat ICU

---

## Etika & Privasi

- Semua tanggal digeser (date shifting) per PhysioNet DUA
- Usia > 89 tahun dikelompokkan menjadi "> 89"
- Tidak ada identitas pasien (subject_id sudah de-identified oleh PhysioNet)
- Wajib UU PDP compliance jika data ini digunakan dalam konteks Indonesia

## Status: PRA-PENGOLAHAN

Pipeline ETL siap dijalankan setelah:
1. ✅ CITI Program certification
2. ✅ MIMIC-IV access granted
3. ✅ MIMIC-IV CSV files downloaded ke `ml/data/raw/`

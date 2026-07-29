# FASE 6 — Akuisisi & Persiapan Data ML

## 1. Tujuan

Menyiapkan pipeline data riil untuk training model ML NutriCerta:
- **Prediksi risiko perburukan gizi** — klasifikasi pasien berisiko malnutrisi
- **Prediksi LOS** — lama rawat inap sebagai proksi severity
- **Forecasting asupan/BB** — time-series monitoring

**Sumber data:** MIMIC-IV v3.0 (PhysioNet/MIT) — sebagai *data pembanding riset*.

## 2. Prasyarat

- [ ] Sertifikasi CITI Program ("Data or Specimens Only Research") — user action
- [ ] Apply akses MIMIC-IV di physionet.org
- [ ] Download MIMIC-IV database (CSV, ~7-10 GB)
- [ ] Dilarang keras menggunakan data sintetis/dummy

## 3. Data Lineage

```
MIMIC-IV CSV files
    │
    ├── hosp/patients.csv.gz       → pasien (subject_id, gender, anchor_age, anchor_year)
    ├── hosp/admissions.csv.gz     → admisi (hadm_id, admittime, dischtime, diagnosis, insurance)
    ├── hosp/transfers.csv.gz      → perpindahan ruang
    ├── hosp/d_labitems.csv.gz     → katalog lab
    ├── hosp/labevents.csv.gz      → hasil lab (albumin, glucose, dll)
    ├── hosp/emar.csv.gz           → obat (termasuk nutrisi enteral/parenteral)
    ├── hosp/emar_detail.csv.gz    → detail pemberian obat
    ├── hosp/ingredients.csv.gz    → komposisi nutrisi
    ├── icu/icustays.csv.gz        → ICU stay (LOS ICU)
    ├── icu/chartevents.csv.gz     → vital signs, height, weight
    └── icu/inputevents.csv.gz     → asupan cairan/enteral/parenteral
```

## 4. Pipeline ETL

```
download/           → raw CSV.gz files
    │
    ▼
extract/            → decompressed CSV
    │
    ▼
load_raw/           → load ke pandas DataFrame, validasi skema
    │
    ▼
clean/              → missing values, outliers, unit conversion
    │
    ▼
feature_engineer/   → feature extraction per pasien per admisi
    │
    ▼
anonymize/          → verifikasi tidak ada PHI (usia > 89 digroup, tanggal digeser)
    │
    ▼
final/              → dataset siap training + data_lineage.json
```

## 5. Feature Engineering

### Untuk Prediksi Risiko Perburukan Gizi (target: malnutrisi)

| Feature | Sumber MIMIC-IV | Keterangan |
|---|---|---|
| usia | patients.anchor_age | Umur saat admisi |
| jenis_kelamin | patients.gender | M/F |
| IMT | chartevents (height/weight) | Dihitung dari first weight & height |
| albumin_first | labevents (ALB) | Albumin pertama saat admisi |
| albumin_min | labevents (ALB) | Albumin terendah selama rawat |
| gds_first | labevents (GLUCOSE) | GDS pertama |
| diagnosis_category | admissions.diagnosis | ICD code → kategori |
| los_sebelumnya | admissions | LOS admisi sebelumnya |
| jumlah_diagnosis | admissions | Komorbiditas |
| asupan_energi | inputevents | Total energi per hari |
| vasopresor | inputevents (vasopressors) | Ya/Tidak |

### Untuk Prediksi LOS (target: length_of_stay)

| Feature | Sumber | Keterangan |
|---|---|---|
| usia | patients | - |
| diagnosis_category | admissions | ICD → kategori |
| jumlah_diagnosis | admissions | - |
| imt | chartevents | - |
| albumin | labevents | - |
| gds | labevents | - |
| ventilasi | chartevents | Ya/Tidak |
| icu_pertama | icustays | ICU di admisi pertama? |

### Untuk Forecasting Asupan/BB (target: asupan_hari_ke_n)

Time-series per pasien: asupan energi (kkal/hari), BB (kg/minggu)

## 6. Anonimisasi

Wajib sesuai UU PDP No. 27/2022 + PhysioNet DUA (Data Use Agreement):
- Hapus: nama, alamat, no. rekam medis, tanggal lahir eksak
- Shift tanggal: semua tanggal digeser acak (konsisten per pasien)
- Age: usia > 89 tahun dikelompokkan menjadi "> 89"
- ZIP/Postal code: dihapus

## 7. Output

- `ml/data_lineage/DATA_LINEAGE.md` — dokumentasi asal-usul tiap fitur
- `ml/data_lineage/feature_registry.csv` — tiap fitur terhubung ke tabel MIMIC-IV asli
- `ml/data/raw/` — pointer ke MIMIC-IV files
- `ml/data/processed/` — dataset final dalam format Parquet
- `ml/pipeline/etl_mimic.py` — ETL pipeline utama

## Gap

- MIMIC-IV data dari rumah sakit AS, mungkin tidak langsung representatif untuk populasi Indonesia
- Tidak ada data MST (skrining gizi) di MIMIC-IV — perlu proksi atau rule-based definition
- Label malnutrisi di MIMIC-IV bisa dari ICD code (E43-E46) atau dari chart data
- Tujuan utama: training model prototipe, validasi klinis final pakai data RS Indonesia nanti

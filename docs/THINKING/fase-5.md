# FASE 5 — Rule Engine / Sistem Pakar

## 1. Tujuan

Membangun Rule Engine (Sistem Pakar berbasis aturan) untuk NutriCerta yang mengimplementasikan logika klinis gizi secara **auditable**, **bersitasi**, dan **zero-hallucination**. Rule Engine menangani 3 ranah sesuai AGENTS.md Bagian 4:

- **Skrining gizi** (MST — Malnutrition Screening Tool)
- **Diagnosis PES** (Problem-Etiology-Signs/Symptoms)
- **Kalkulasi kebutuhan gizi** (energi, protein, IMT, dll.)

## 2. Sumber Data

Seluruh rule bersumber dari entitas yang sudah tervalidasi di Knowledge Base (FASE 1-4):

| Kategori | Jumlah Rule | Sumber Utama |
|---|---|---|
| skrining_mst | 4 | PAGT-001 (PAGT Kemenkes 2014) |
| antropometri_imt | 5 | AKG-001 (Permenkes AKG 2019) |
| kebutuhan_energi + faktor_aktivitas | 6 | AKG-001, PGRS-001 |
| kebutuhan_protein | 1 | AKG-001 |
| konversi_zat_gizi | 3 | TKPI-001 |
| asesmen_domain | 5 | PAGT-001, IDNT-001 |
| diagnosis_pes | 42 | IDNT-001, PAGT-001 |
| preskripsi_diet | 11 | PGRS-001, PAGT-001 |
| rute_pemberian | 3 | PGRS-001 |
| monitoring_parameter | 6 | PGRS-001, PAGT-001 |

## 3. Arsitektur

```
┌─────────────────────────────────────────────┐
│              Patient Data (JSON)             │
│  { usia, bb, tb, aktivitas, keluhan, ... }   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              RuleEngine.evaluate()           │
│  ┌───────────┐ ┌──────────┐ ┌────────────┐  │
│  │ Skrining  │ │Antropom. │ │Kebutuhan   │  │
│  │ MST       │ │IMT       │ │Gizi (BEE)  │  │
│  └─────┬─────┘ └────┬─────┘ └──────┬─────┘  │
│  ┌──────┴─────┐ ┌───┴────┐ ┌──────┴─────┐  │
│  │ Diagnosis  │ │Preskrip│ │ Monitoring │  │
│  │ PES        │ │Diet    │ │ Parameter  │  │
│  └──────┬─────┘ └───┬────┘ └──────┬─────┘  │
└──────────┼───────────┼─────────────┼────────┘
           │           │             │
           ▼           ▼             ▼
┌─────────────────────────────────────────────┐
│           AssessmentResult (JSON)            │
│  { skrining, imt, kebutuhan, pes,           │
│    preskripsi, monitoring, citations[] }     │
└─────────────────────────────────────────────┘
```

### 3.1 Rule Engine Core (`engine.py`)

- Entry point: `RuleEngine.evaluate(patient_data: PatientData) -> AssessmentResult`
- Memuat rule modules secara plugin-based
- Setiap rule module mengembalikan `RuleResult` yang berisi:
  - `value`: nilai hasil evaluasi
  - `label`: interpretasi
  - `citations`: daftar sumber yang mendukung

### 3.2 Rule Modules (`rules/`)

Setiap module adalah class Python dengan method `evaluate(context) -> RuleResult`:

| Module | Fungsi |
|---|---|
| `skrining_mst.py` | Hitung skor MST dari 2 pertanyaan, tentukan risiko malnutrisi |
| `antropometri.py` | Hitung IMT, tentukan kategori (sangat kurang s.d. obesitas) |
| `kebutuhan_gizi.py` | Hitung BEE (Mifflin-St Jeor), TEE dengan faktor aktivitas/stress |
| `diagnosis_pes.py` | Bangun pernyataan PES dari problem + etiologi + signs/symptoms |
| `preskripsi.py` | Rekomendasi jenis diet berdasarkan kondisi pasien |
| `monitoring.py` | Parameter monitoring yang relevan berdasarkan diagnosis |

## 4. Algoritma Kunci

### 4.1 Skrining MST
```
Q1: Apakah pasien mengalami penurunan BB tanpa direncanakan?
    0 = Tidak / Tidak tahu
    1 = Ya, 0.5-5 kg
    2 = Ya, 5-10 kg
    3 = Ya, >10 kg

Q2: Apakah asupan makan berkurang karena nafsu makan menurun?
    0 = Tidak
    1 = Ya

Total = Q1 + Q2
Interpretasi:
  Total < 2  → Risiko rendah (kategori: NORMAL)
  Total >= 2 → Risiko malnutrisi (kategori: RISIKO)
```
Sumber: PAGT-001 (Pedoman PAGT Kemenkes 2014), halaman 12-15

### 4.2 IMT (Indeks Massa Tubuh)
```
IMT = BB(kg) / TB(m)^2

Kategori Asia/Indonesia:
  < 17.0    → Sangat Kurang
  17.0-18.4 → Kurang
  18.5-25.0 → Normal
  25.1-27.0 → Lebih
  > 27.0    → Obesitas
```
Sumber: AKG-001 (Permenkes AKG 2019), Lampiran III

### 4.3 Kebutuhan Energi — Mifflin-St Jeor
```
BEE Pria   = (10 × BB) + (6.25 × TB) - (5 × Usia) + 5
BEE Wanita = (10 × BB) + (6.25 × TB) - (5 × Usia) - 161

TEE = BEE × Faktor Aktivitas
  TB (bed rest)      = 1.2
  Ringan             = 1.3
  Sedang             = 1.4
```
Sumber: PGRS-001 (Permenkes PGRS 2013), IDNT-001

### 4.4 Diagnosis PES
```
PES Statement: [Problem] related to [Etiology] as evidenced by [Signs/Symptoms]

Problem codes: NI (Nutrition Intake), NC (Clinical), NB (Behavioral)
Example: NI-2.1 (Inadequate oral intake) related to [etiologi] as evidenced by [signs]
```
Sumber: IDNT-001 (NCPT Reference Manual)

### 4.5 Preskripsi Diet
```
Berdasarkan kondisi: 
  DM → DIET-DM
  Gagal ginjal → DIET-RG
  Hipertensi → DIET-RL (Rendah Lemak)
  Pasca operasi → DIET-LUNAK / DIET-SARING / DIET-CAIR
  Normal → DIET-BIASA
```
Sumber: PGRS-001 (Pedoman Pelayanan Gizi RS)

## 5. Desain Output

AssessmentResult:
```json
{
  "skrining": { "skor": 2, "kategori": "RISIKO", "interpretasi": "Risiko malnutrisi" },
  "imt": { "nilai": 21.5, "kategori": "NORMAL", "interpretasi": "Berat badan normal" },
  "kebutuhan": {
    "bee": 1475, "tee": 1918, "satuan": "kkal/hari",
    "protein": 57, "satuan_protein": "g/hari"
  },
  "diagnosis": [
    {
      "problem": "NI-2.1",
      "label": "Asupan oral tidak adekuat",
      "etiologi": "mual dan muntah",
      "signs": "asupan 40% dari kebutuhan",
      "pes_statement": "NI-2.1 Asupan oral tidak adekuat related to mual dan muntah as evidenced by asupan 40% dari kebutuhan"
    }
  ],
  "preskripsi": [
    { "diet": "DIET-LUNAK", "deskripsi": "Makanan lunak", "rute": "ORAL" }
  ],
  "monitoring": [
    { "parameter": "Berat Badan", "frekuensi": "1x/minggu" }
  ],
  "citations": [
    {
      "rule": "IMT-NORMAL-001",
      "source_id": "AKG-001",
      "kutipan": "IMT 18.5-25.0 → Normal (Lampiran III)"
    }
  ]
}
```

## 6. Integrasi dengan Backend

Rule Engine akan dipanggil dari backend API endpoint:
```
POST /api/evaluate
Body: PatientData
Response: AssessmentResult
```

Backend memuat rule engine sebagai dependency Python. Data rule bisa di-cache dari Supabase saat startup atau dimuat dari file JSON lokal untuk development.

## 7. Asumsi & Keputusan

### Asumsi
- Input pasien sudah divalidasi oleh caller (BB > 0, TB > 0, usia > 0)
- Faktor stress belum diimplementasi di versi awal (hanya faktor aktivitas)
- Diagnosis PES membutuhkan input manual Ahli Gizi untuk etiologi dan signs — engine hanya menyediakan template

### Gap yang Diketahui
- [ ] Faktor stress/penyakit untuk kalkulasi TEE (cedera, infeksi, luka bakar) — butuh sumber tambahan
- [ ] Kebutuhan protein spesifik per kondisi (gagal ginjal vs luka bakar) — butuh rule tambahan
- [ ] Interaksi obat-gizi — belum ada di knowledge base

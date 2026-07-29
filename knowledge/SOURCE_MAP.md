# SOURCE_MAP.md — NutriCerta

**Fase:** 0 — Setup & Perencanaan Sumber
**Tanggal:** 2026-07-29
**Status:** DRAFT — menunggu validasi Fase 0 DoD

---

## Ringkasan Sumber Tier Berdasarkan Modul PAGT

| Modul PAGT | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| **0. Identitas** | PGRS, PAGT, SNARS | — | — | — |
| **1. Skrining Gizi** | PGRS | PERSAGI | WHO, ESPEN | — |
| **2. Asesmen Gizi** | Permenkes AKG, PGRS, PAGT | IDNT | WHO Growth Standards | — |
| **3. Diagnosis (PES)** | PAGT | IDNT, PERSAGI | — | — |
| **4. Intervensi Gizi** | Permenkes AKG, PGRS, PAGT, TKPI | PERSAGI | ASPEN/ESPEN | — |
| **5. Monitoring** | PGRS, PAGT | — | — | MIMIC-IV (prototipe) |
| **6. Discharge** | PGRS, PAGT, SNARS | — | — | — |
| **7. Rekap Bulanan** | SNARS, PGRS, PAGT | — | — | — |

---

## Detail Mapping per Modul

### 0. Identitas Pasien & RS

| Item Data | Sumber | Keterangan |
|---|---|---|
| Format identitas RS & pasien | PGRS (Pedoman Pelayanan Gizi RS) — Kemenkes RI | Format baku PAGT |
| Nomor RM & struktur RM | SNARS (Standar Akreditasi RS) — KARS | Standar rekam medis |
| Alur admisi pasien | PAGT (Proses Asuhan Gizi Terstandar) — Kemenkes RI | — |

**Dokumen dicari:**
- PGRS Kemenkes RI (PDF) → portal Kemenkes
- PAGT Kemenkes RI/PERSAGI (PDF)
- SNARS edisi terbaru (KARS)

---

### 1. Skrining Gizi

#### 1a. Malnutrition Screening Tool (MST) — Dewasa

| Pengetahuan | Nilai/Threshold | Sumber |
|---|---|---|
| Pertanyaan 1: Penurunan BB 6 bulan terakhir | Skor 0-4 (tidak yakin=2, 0.5-5kg=1, 6-10kg=2, 11-15kg=3, >15kg=4) | PGRS Kemenkes RI |
| Pertanyaan 2: Nafsu makan menurun | Skor 0 (tidak) / 1 (ya) | PGRS Kemenkes RI |
| Total skor MST | 0-5 (dari penjumlahan) | PGRS Kemenkes RI |
| Threshold risiko malnutrisi | **Skor ≥ 2** → berisiko, rujuk Ahli Gizi dalam 1x24 jam | PGRS Kemenkes RI |
| Skrining ulang jika tidak berisiko | Setiap 7 hari | PGRS Kemenkes RI |

#### 1b. Strong Kids — Anak (alternatif)

| Pengetahuan | Sumber |
|---|---|
| Alat skrining Strong Kids | PGRS Kemenkes RI, WHO/ESPEN guidelines |
| Threshold & interpretasi | ESPEN/ASPEN pediatric guidelines |

#### 1c. MNA-SF — Geriatri (alternatif)

| Pengetahuan | Sumber |
|---|---|
| Mini Nutritional Assessment Short-Form | PGRS, ESPEN guidelines |

**Dokumen dicari:**
- PGRS (konfirmasi threshold MST)
- ESPEN Guideline on Clinical Nutrition (Tier 3)

---

### 2. Asesmen Gizi — 5 Domain

#### Domain 1: Riwayat Terkait Gizi (Food/Nutrition-Related History)

| Pengetahuan | Sumber |
|---|---|
| Format recall 24 jam | PAGT Kemenkes RI |
| Klasifikasi pola makan & alergi | IDNT (International Dietetics and Nutrition Terminology) |

#### Domain 2: Antropometri

| Pengetahuan | Nilai/Threshold | Sumber |
|---|---|---|
| Rumus IMT | BB(kg) / TB(m)^2 | Standar internasional (WHO) |
| Kategori IMT untuk Indonesia | Lihat tabel di bawah | **Permenkes AKG** (Kemenkes RI) — ambang batas IMT untuk Indonesia |

**Tabel Ambang Batas IMT Indonesia** (sumber: Depkes RI / Permenkes AKG):

| Kategori | IMT (kg/m²) |
|---|---|
| BB Sangat Kurang (Severe Thinness) | < 17.0 |
| BB Kurang (Mild Thinness) | 17.0 - 18.4 |
| Normal | 18.5 - 25.0 |
| BB Lebih (Overweight) | 25.1 - 27.0 |
| Obesitas | > 27.0 |

> **Catatan:** Nilai angka di atas adalah estimasi berdasarkan ambang batas IMT Asia. Nilai pasti dari Permenkes AKG perlu diverifikasi di Fase 1 saat akuisisi dokumen.

| Pengetahuan | Sumber |
|---|---|
| LILA (Lingkar Lengan Atas) | PGRS, WHO |
| BB estimasi jika tidak bisa ditimbang | PGRS (rumus estimasi) |
| TB estimasi (rentang lengan, tinggi lutut) | PGRS |

#### Domain 3: Biokimia

| Parameter | Nilai Rujukan Normal | Sumber |
|---|---|---|
| Hemoglobin (Hb) | 13.0-17.0 g/dL (Pria) / 12.0-15.0 g/dL (Wanita) | Standar laboratorium klinis (verifikasi sumber spesifik di Fase 1) |
| Albumin | 3.5-5.0 g/dL | Standar laboratorium klinis |
| Gula Darah Sewaktu (GDS) | < 200 mg/dL | Standar laboratorium klinis |
| Ureum | 10-50 mg/dL | Standar laboratorium klinis |
| Kreatinin | 0.6-1.3 mg/dL | Standar laboratorium klinis |

#### Domain 4: Fisik Klinis

| Pengetahuan | Sumber |
|---|---|
| Definsi edema, wasting, lemak subkutan | IDNT (terminologi klinis) |
| Pemeriksaan tanda malnutrisi klinis | PGRS, IDNT |

#### Domain 5: Riwayat Klien

| Pengetahuan | Sumber |
|---|---|
| Klasifikasi riwayat penyakit, obat, sosial | PAGT, IDNT |

**Dokumen dicari:**
- Permenkes AKG (konfirmasi ambang batas IMT)
- IDNT edisi terbaru (mungkin berbayar)
- WHO Growth Standards (gratis online)
- Standar nilai rujukan laboratorium nasional

---

### 3. Diagnosis Gizi — Format PES

| Pengetahuan | Sumber |
|---|---|
| Format PES: Problem - Etiology - Symptom | IDNT (International Dietetics and Nutrition Terminology) |
| Kode IDNT 3 domain: | IDNT |
| - Intake (NI) | IDNT |
| - Clinical (NC) | IDNT |
| - Behavioral-Environmental (NB) | IDNT |
| Contoh: NI-2.1 Asupan oral inadekuat | IDNT (tercantum di template Excel) |
| Terminologi diagnosis gizi Indonesia | PERSAGI (Panduan Praktik Dietisien Indonesia) |
| Alur diagnosis dalam PAGT | PAGT Kemenkes RI |

**Dokumen dicari:**
- IDNT — International Dietetics and Nutrition Terminology (edisi terbaru, cek ketersediaan via PERSAGI)
- PERSAGI — Panduan Praktik Dietisien Indonesia

---

### 4. Intervensi Gizi — Preskripsi Diet

#### 4a. Perhitungan Kebutuhan Energi

| Pengetahuan | Rumus/Nilai | Sumber |
|---|---|---|
| BEE/REE — Mifflin-St Jeor (Pria) | (10 × BB) + (6.25 × TB) − (5 × Usia) + 5 | **Permenkes AKG**, juga literatur (Mifflin et al., 1990) |
| BEE/REE — Mifflin-St Jeor (Wanita) | (10 × BB) + (6.25 × TB) − (5 × Usia) − 161 | **Permenkes AKG**, juga literatur (Mifflin et al., 1990) |
| Faktor Aktivitas: Tirah Baring | 1.1 - 1.2 | PGRS Kemenkes RI |
| Faktor Aktivitas: Ringan | 1.3 | PGRS Kemenkes RI |
| Faktor Aktivitas: Sedang | 1.5 | PGRS Kemenkes RI |
| Faktor Stres/Injury | Sesuai kondisi klinis (pasca-bedah, sepsis, luka bakar) | PGRS, ASPEN/ESPEN |
| TEE (Total Energy Expenditure) | BEE × FA × FS | PGRS |

#### 4b. Distribusi Makronutrien

| Zat Gizi | Konversi Energi | Sumber |
|---|---|---|
| Karbohidrat | 4 kkal/gram | **Permenkes AKG** |
| Protein | 4 kkal/gram | **Permenkes AKG** |
| Lemak | 9 kkal/gram | **Permenkes AKG** |

#### 4c. Preskripsi Diet

| Pengetahuan | Sumber |
|---|---|
| Jenis Diet (DM, Rendah Garam, Rendah Protein, dll) | PGRS, PAGT |
| Bentuk Makanan (Biasa/Lunak/Saring/Cair) | PGRS |
| Rute Pemberian (Oral/NGT/Parenteral) | PGRS, ASPEN/ESPEN |
| Tabel Komposisi Pangan Indonesia (zat gizi per 100g) | **TKPI** (Tabel Komposisi Pangan Indonesia) — Kemenkes RI |
| Suplementasi & terapi gizi tambahan | PGRS, ASPEN/ESPEN |

**Dokumen dicari:**
- Permenkes AKG (rumus Mifflin-St Jeor, konversi makronutrien)
- TKPI versi digital/data terbuka
- PGRS (faktor aktivitas, stres, jenis diet)

---

### 5. Monitoring Harian

| Pengetahuan | Sumber |
|---|---|
| Metode penilaian sisa makanan (Comstock/plate waste) | PGRS Kemenkes RI |
| Frekuensi monitoring BB | PGRS |
| Target asupan harian (% dari kebutuhan) | PAGT |
| Kolom status risiko ML (sinyal ML) | Model ML Fase 7 (berbasis MIMIC-IV) |

> **Catatan:** Status risiko ML adalah output Machine Learning (Fase 6-7), ditampilkan sebagai sinyal bantu — bukan keputusan otomatis. Keputusan revisi diet tetap oleh Ahli Gizi.

**Dokumen dicari:**
- PGRS (metode Comstock)

---

### 6. Ringkasan Pulang (Discharge)

| Pengetahuan | Sumber |
|---|---|
| Struktur ringkasan pulang gizi | PGRS, PAGT |
| Status gizi akhir & capaian target | PGRS, PAGT |
| Rekomendasi diet di rumah | PGRS |
| Edukasi gizi & materi | PGRS |
| Rencana kontrol poli gizi | PGRS, SNARS |
| Pengesahan digital (nama, tanggal, tanda tangan) | PGRS, SNARS |

**Dokumen dicari:**
- PGRS (format discharge summary)
- SNARS (standar pengesahan)

---

### 7. Rekap Bulanan

| Pengetahuan | Sumber |
|---|---|
| Struktur laporan bulanan pelayanan gizi | **SNARS** (Standar Akreditasi RS) — KARS |
| Kategori risiko: Tinggi / Sedang / Rendah | PGRS |
| Status pasien: Pulang / Rawat | PGRS, PAGT |
| Statistik bulanan otomatis (total, distribusi risiko, status) | PGRS, SNARS |
| Data klaim BPJS | PGRS |

**Dokumen dicari:**
- SNARS edisi terbaru (KARS)

---

## Daftar Sumber Lengkap (Tier 1-4)

### Tier 1 — Regulasi & Pedoman Nasional

| No | Nama Dokumen | Penerbit | Format | Ketersediaan | Prioritas |
|---|---|---|---|---|---|
| 1 | Permenkes AKG (Angka Kecukupan Gizi) | Kemenkes RI | PDF (jdih.kemkes.go.id) | Perlu cari | Tertinggi |
| 2 | PGRS (Pedoman Pelayanan Gizi RS) | Kemenkes RI | PDF | Perlu cari | Tertinggi |
| 3 | PAGT (Proses Asuhan Gizi Terstandar) | Kemenkes RI/PERSAGI | PDF | Perlu cari | Tertinggi |
| 4 | TKPI (Tabel Komposisi Pangan Indonesia) | Kemenkes RI | PDF/Data | Perlu cari | Tinggi |
| 5 | SNARS (Standar Akreditasi RS) | KARS | PDF | Perlu cari | Tinggi |
| 6 | UU No. 27/2022 tentang PDP | Pemerintah RI | PDF (peraturan.go.id) | Tersedia publik | Tinggi |

### Tier 2 — Standar Profesi

| No | Nama Dokumen | Penerbit | Format | Ketersediaan | Prioritas |
|---|---|---|---|---|---|
| 7 | IDNT (International Dietetics and Nutrition Terminology) | AND/Academy of Nutrition and Dietetics | Buku/PDF | Mungkin berbayar (`PERLU LISENSI`) | Tertinggi untuk diagnosis |
| 8 | PERSAGI (Panduan Praktik Dietisien Indonesia) | PERSAGI | PDF | Perlu cari | Tinggi |

### Tier 3 — Literatur Ilmiah & Pembanding Internasional

| No | Nama Dokumen | Sumber | Format | Ketersediaan |
|---|---|---|---|---|
| 9 | WHO Growth Standards | who.int | Online/gratis | Tersedia publik |
| 10 | ASPEN Guidelines | aspenjournals.onlinelibrary.wiley.com | PDF | Cek lisensi |
| 11 | ESPEN Guidelines | espen.info | PDF | Cek lisensi |
| 12 | PubMed/PMC Literature | pubmed.ncbi.nlm.nih.gov | API/PDF | Gratis via E-utilities |
| 13 | Semantic Scholar API | semanticscholar.org | API | Gratis (rate limited) |

### Tier 4 — Data Machine Learning

| No | Dataset | Sumber | Format | Akses |
|---|---|---|---|---|
| 14 | MIMIC-IV | PhysioNet/MIT | CSV/Parquet | Wajib CITI Program + physionet.org approval |
| 15 | Data RS mitra | Kerja sama RS | CSV/DB | Wajib ethical clearance + anonimisasi |

---

## Ringkasan Kesenjangan (Gaps)

| Gap | Dampak | Rencana Tindak Lanjut (Fase 1) |
|---|---|---|
| Nomor spesifik & tahun Permenkes AKG belum diketahui | Rumus & threshold belum bisa dikutip presisi | Cari di jdih.kemkes.go.id |
| IDNT edisi terbaru status lisensi | Terminologi PES bergantung IDNT | Cek via PERSAGI; jika berbayar → `PERLU LISENSI` |
| PGRS, PAGT, SNARS dokumen PDF lokasi pasti | Semua modul klinis bergantung dokumen ini | Cari portal Kemenkes/KARS |
| TKPI format data belum pasti (PDF gambar vs tabel digital) | Perhitungan zat gizi butuh data terstruktur | Cari versi data terbuka TKPI |
| Nilai rujukan biokimia sumber spesifik | Domain asesmen biokimia | Cari standar lab nasional |
| MIMIC-IV butuh sertifikasi CITI | Data ML prototipe tertunda | Proses CITI di Fase 1 |

---

## Catatan

1. Dokumen dicentang `[SUMBER TIDAK DITEMUKAN - PERLU VALIDASI MANUAL]` jika setelah Fase 1 akuisisi gagal.
2. Sumber berbayar/lisensi tertutup ditandai `PERLU LISENSI`.
3. File `source_registry.csv` akan mencatat metadata detail setiap dokumen setelah Fase 1.

# PRD — NutriCerta
### Sistem Digital Asuhan Gizi Klinis Rumah Sakit Berbasis Sistem Pakar & Machine Learning

**Versi:** 1.0
**Tanggal:** 2026-07-29
**Nama Proses/Metodologi:** Grounded Clinical Nutrition Knowledge Pipeline (GCNKP)

---

## 1. Latar Belakang

Proses pelayanan gizi klinis di rumah sakit mengikuti standar **PAGT (Proses Asuhan Gizi Terstandar)** dari Kemenkes/PERSAGI, terdiri dari skrining, asesmen, diagnosis, intervensi, monitoring, hingga discharge. Proses ini saat ini masih banyak dikerjakan manual (form kertas), rawan tidak konsisten, sulit diaudit, dan lambat dalam deteksi dini risiko malnutrisi pasien.

NutriCerta dibangun untuk mendigitalisasi seluruh alur PAGT ini, dengan dua mesin cerdas pendukung:
- **Sistem Pakar (Rule-Based)** — untuk diagnosis gizi (format PES/IDNT) dan kalkulasi kebutuhan gizi, karena ranah ini bersifat baku dan harus auditable.
- **Machine Learning** — untuk prediksi risiko perburukan status gizi, prediksi lama rawat inap (LOS), dan forecasting tren asupan/berat badan, karena ranah ini butuh pola dari data historis.

**Prinsip non-negotiable:** Setiap keputusan/jawaban sistem harus bisa ditelusuri ke dokumen resmi (Permenkes, PGRS, IDNT, TKPI, AKG, jurnal ilmiah). Tidak ada data sintetis. Tidak ada jawaban AI tanpa sitasi sumber.

---

## 2. Tujuan Produk

1. Mendigitalisasi seluruh 15 form PAGT dari admisi sampai discharge pasien
2. Menyediakan sistem pakar diagnosis gizi yang konsisten dengan standar IDNT/PES
3. Menyediakan kalkulasi kebutuhan gizi otomatis berbasis rumus resmi (AKG, Mifflin-St Jeor, dll)
4. Memberi sinyal dini risiko perburukan status gizi pasien via ML (bukan menggantikan keputusan Ahli Gizi)
5. Menyediakan asisten AI (RAG) yang menjawab pertanyaan Ahli Gizi dengan jawaban bersitasi dokumen resmi
6. Menghasilkan dokumentasi & pelaporan otomatis untuk kebutuhan rekam medis, akreditasi, dan klaim BPJS

---

## 3. Target Pengguna

- **Primary user:** Ahli Gizi/Dietisien di rumah sakit — **1 akun = 1 Ahli Gizi**, terhubung ke institusi/RS masing-masing
- **Secondary:** Dokter, perawat (akses baca dashboard status gizi pasien via CPPT terintegrasi)
- **Admin:** Kepala Instalasi Gizi (kelola akun, kelola menu cycle, laporan)

---

## 4. Ruang Lingkup (Scope)

### Termasuk (In-Scope)
- Modul Skrining Gizi (MST, Strong Kids, MNA-SF)
- Modul Asesmen Gizi (5 domain: riwayat gizi, antropometri, biokimia, fisik klinis, riwayat klien)
- Modul Diagnosis Gizi (Sistem Pakar, format PES/IDNT)
- Modul Intervensi & Preskripsi Diet (kalkulasi kebutuhan gizi otomatis + order ke instalasi gizi)
- Modul Monitoring & Evaluasi (asupan harian/comstock, antropometri berkala, dashboard risiko ML)
- Modul Discharge (ringkasan pulang gizi, rencana tindak lanjut)
- Asisten AI RAG bersitasi (tanya-jawab berbasis knowledge base resmi)
- Basis Pengetahuan (Knowledge Base) tervalidasi manusia dari dokumen resmi nasional
- Audit trail & log aktivitas per akun

### Tidak Termasuk (Out-of-Scope, fase awal)
- Estimasi porsi makanan via foto (computer vision) — masuk roadmap lanjutan
- Integrasi penuh dengan seluruh SIMRS eksisting RS (fase awal: modul berdiri sendiri, integrasi bertahap)
- Aplikasi mobile native (fase awal: web app responsif)

---

## 5. Fitur & Modul

| Modul | Deskripsi | Mesin AI |
|---|---|---|
| Skrining Gizi | Form MST/Strong Kids/MNA-SF, auto-flag risiko | Sistem Pakar (rule tetap) |
| Asesmen Gizi | Input 5 domain data, auto-hitung IMT/LILA | - |
| Diagnosis Gizi | Rumusan PES otomatis dari data asesmen | Sistem Pakar (forward chaining) |
| Preskripsi Diet | Kalkulasi kebutuhan energi/zat gizi + rekomendasi jenis diet | Sistem Pakar + rumus AKG |
| Monitoring | Tracking asupan, dashboard skor risiko, grafik tren | Machine Learning (klasifikasi + time-series) |
| Discharge | Ringkasan status gizi akhir + rencana tindak lanjut | - |
| Asisten AI | Tanya jawab Ahli Gizi, jawaban wajib bersitasi | RAG + Knowledge Base |
| Laporan | Ekspor untuk rekam medis, akreditasi SNARS, klaim BPJS | - |

---

## 6. Sumber Ilmiah Wajib (Knowledge Base)

Lihat detail lengkap di `AGENTS.md` Bagian Daftar Sumber. Ringkasan:
- **Tier 1 (wajib):** Permenkes AKG, PGRS, PAGT, TKPI, SNARS, UU PDP
- **Tier 2:** IDNT, PERSAGI
- **Tier 3:** PubMed/PMC, Semantic Scholar, ASPEN/ESPEN, WHO Growth Standards
- **Tier 4 (data ML):** MIMIC-IV (prototipe), data RS mitra (dengan ethical clearance, anonimisasi penuh)

---

## 7. Kebutuhan Non-Fungsional

- **Auditability:** Setiap output sistem pakar & RAG wajib menyertakan sitasi sumber
- **Privasi:** Wajib patuh UU No. 27/2022 (PDP) — anonimisasi data pasien untuk keperluan ML
- **Keamanan:** 1 akun = 1 Ahli Gizi, autentikasi ketat, audit log semua aktivitas
- **Human-in-the-loop:** Keputusan klinis akhir selalu di tangan Ahli Gizi — ML hanya sinyal bantu, bukan otomasi penuh
- **Ketertelusuran (traceability):** Semua entitas knowledge base tersimpan dengan metadata sumber (dokumen, pasal/tabel, tanggal terbit, tanggal akses)

---

## 8. Metrik Keberhasilan

- 100% entitas knowledge base berstatus `VALIDATED` oleh Ahli Gizi sebelum dipakai sistem
- 0% jawaban AI tanpa sitasi sumber dirilis ke pengguna
- Waktu pengisian form PAGT berkurang signifikan dibanding proses manual (baseline diukur saat uji terintegrasi)
- Model ML memiliki confidence score & SHAP explanation tampil di setiap prediksi risiko

---

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| AI mengarang jawaban klinis | Wajib sitasi, RAG hanya jawab dari knowledge base tervalidasi, jika tidak ketemu → jawab "tidak ditemukan referensi" |
| Data pasien riil sulit didapat untuk ML | Mulai dari MIMIC-IV untuk prototipe, paralel ajukan kerja sama data RS dengan ethical clearance |
| Ahli Gizi tidak percaya rekomendasi sistem | ML selalu tampil sebagai "sinyal bantu" bukan keputusan otomatis; sistem pakar selalu tunjukkan rujukan sumber |
| Perubahan regulasi (Permenkes baru) | Jadwal review knowledge base berkala (min. tiap 6 bulan) |

---

## 10. Dokumen Terkait

- `AGENTS.md` — aturan kerja & siklus AI Agent per fase
- `STEPS.md` — checklist teknis eksekusi per fase

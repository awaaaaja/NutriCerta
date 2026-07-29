# AGENTS.md — NutriCerta
### Panduan Kerja AI Agent (Coding Agent & Knowledge Agent)

Dokumen ini adalah instruksi wajib untuk AI Agent (mis. OpenCode/Claude Code) yang mengerjakan proyek NutriCerta. Baca `PRD.md` dulu untuk konteks produk sebelum membaca file ini.

---

## 0. ATURAN WAJIB (Non-Negotiable) — Berlaku di Seluruh Proyek

1. **DILARANG mengarang fakta klinis, rumus, threshold, atau istilah gizi.** Kalau sumber tidak ditemukan → tulis `[SUMBER TIDAK DITEMUKAN - PERLU VALIDASI MANUAL]`, jangan generate jawaban sendiri.
2. **DILARANG memakai dataset sintetis/dummy untuk data final.** Dummy data HANYA untuk testing struktur UI, wajib berlabel `TEST_DATA_ONLY`, wajib dihapus sebelum rilis produksi.
3. **WAJIB menyimpan metadata sitasi** di setiap entri knowledge base: nama dokumen, nomor pasal/tabel/halaman, penerbit, tahun terbit, tanggal akses, URL/DOI sumber.
4. **WAJIB ada gate validasi manusia (Ahli Gizi)** sebelum knowledge/rule masuk ke sistem final. Agent tidak boleh mem-publish rule/threshold sendiri tanpa approval tertulis.
5. **WAJIB mengikuti siklus kerja 6 langkah** di setiap fase (Bagian 1). Dilarang loncat fase sebelum semua langkah selesai & tercentang di `STEPS.md`.
6. **WAJIB tulis log kerja** ke `AGENT_LOG.md` setiap selesai satu langkah: apa yang dibaca, apa yang diputuskan, apa yang dibangun, apa hasil review, apa yang diperbaiki.
7. **Kerjakan satu fase penuh dalam satu waktu.** Jangan mulai fase Rule Engine sebelum fase Knowledge Base berstatus Definition of Done (DoD) selesai.
8. **Kalau menemukan kebutuhan sumber di luar Daftar Sumber (Bagian 3) → HENTIKAN dan minta klarifikasi manusia.** Jangan lanjut dengan asumsi sendiri.

---

## 1. SIKLUS KERJA WAJIB (berlaku di SETIAP fase)

```
READ → THINKING → BUILD → REVIEW → FIX → SEMPURNAKAN → [lanjut fase berikutnya]
```

| Langkah | Yang Dilakukan Agent | Output Wajib |
|---|---|---|
| **READ** | Baca dokumen sumber resmi terkait fase ini + hasil fase sebelumnya | Ringkasan sumber dibaca + daftar sitasi mentah |
| **THINKING** | Rencanakan pendekatan, kenapa, dari sumber mana tiap keputusan. Tulis asumsi eksplisit kalau ada gap | `docs/THINKING/fase-X.md` |
| **BUILD** | Implementasi (kode/skema/dokumen/rule). Tiap rule/rumus wajib komentar sitasi | Kode/artefak + inline citation |
| **REVIEW** | Cek: semua klaim ada sitasi? Ada yang "mengarang"? Bandingkan ke dokumen asli | `docs/REVIEW_NOTES/fase-X.md` |
| **FIX** | Perbaiki semua temuan REVIEW. Gap sumber ditandai untuk validasi manusia, bukan ditutupi asumsi | Kode/artefak revisi |
| **SEMPURNAKAN** | Polish akhir: konsistensi format, dokumentasi lengkap, test jalan, siap human validation gate | Checklist DoD tercentang semua di `STEPS.md` |

**Gate klinis:** Setelah SEMPURNAKAN untuk fase yang menyentuh logika klinis (Knowledge Base, Rule Engine, Diagnosis), WAJIB ada tanda "APPROVED BY AHLI GIZI" tertulis sebelum lanjut. Fase teknis murni (Backend, Frontend) cukup review tech lead/developer.

---

## 2. URUTAN FASE (rujuk detail teknis per fase di `STEPS.md`)

```
FASE 0  → Setup & Perencanaan Sumber
FASE 1  → Akuisisi Dokumen Resmi
FASE 2  → Ekstraksi & Strukturisasi Knowledge
FASE 3  → Validasi Manusia (Ahli Gizi)
FASE 4  → Bangun Knowledge Base Final (DB + Vector Store bersitasi)
FASE 5  → Bangun Rule Engine / Sistem Pakar
FASE 6  → Akuisisi & Persiapan Data ML (real data)
FASE 7  → Bangun & Validasi Model ML
FASE 8  → Bangun Backend & API
FASE 9  → Bangun Web App (Frontend)
FASE 10 → Uji Terintegrasi + Validasi Klinis
FASE 11 → Deployment & Monitoring Pasca-Rilis
```

**Prinsip urutan:** Knowledge dulu, baru logika (rule engine/ML), baru backend, baru web app paling akhir. Dilarang membangun frontend sebelum Knowledge Base & Rule Engine tervalidasi.

---

## 3. DAFTAR SUMBER RESMI (WAJIB — dilarang sumber di luar daftar ini tanpa approval)

### Tier 1 — Regulasi & Pedoman Nasional (prioritas tertinggi)
- Permenkes RI tentang **Angka Kecukupan Gizi (AKG)** — `jdih.kemkes.go.id`, `peraturan.go.id`
- **PGRS** (Pedoman Pelayanan Gizi Rumah Sakit) — Kemenkes RI
- **PAGT** (Proses Asuhan Gizi Terstandar) — Kemenkes RI
- **TKPI** (Tabel Komposisi Pangan Indonesia) — Kemenkes RI/Panel Pangan Nasional
- **SNARS** (Standar Akreditasi RS, bagian Pelayanan Gizi) — KARS
- **UU No. 27/2022 tentang PDP** — acuan desain privasi

### Tier 2 — Standar Profesi & Terminologi
- **IDNT** (International Dietetics and Nutrition Terminology) — untuk format diagnosis PES
- **PERSAGI** — Panduan Praktik Dietisien Indonesia

### Tier 3 — Literatur Ilmiah & Pembanding Internasional
- **PubMed/PMC** — via E-utilities API resmi
- **Semantic Scholar API**
- **ASPEN/ESPEN Guidelines** (cek lisensi tiap dokumen)
- **WHO Growth Standards**
- **Garuda/Sinta** (cek ToS/API)

### Tier 4 — Data Machine Learning
- **MIMIC-IV** (PhysioNet/MIT) — wajib sertifikasi CITI Program dulu, label sebagai *data pembanding riset*
- **Data rekam medis riil RS mitra** — wajib kerja sama resmi + ethical clearance/IRB + anonimisasi penuh
- ❌ **DILARANG KERAS:** dataset sintetis buatan AI, data JSON karangan, data forum/medsos yang diklaim "kasus nyata"

**Aturan tambahan:** Cek `robots.txt`/ToS sebelum scraping otomatis. Sumber berbayar/lisensi tertutup → tandai `PERLU LISENSI`, jangan diakali scraping paksa.

---

## 4. PEMBAGIAN MESIN AI (jangan dicampur — auditability)

| Ranah | Mesin | Alasan |
|---|---|---|
| Skrining, Diagnosis (PES), Kalkulasi kebutuhan gizi | **Sistem Pakar (rule-based)** | Berbasis standar baku, harus 100% auditable & bersitasi |
| Prediksi risiko perburukan gizi, LOS, forecasting asupan/BB | **Machine Learning** | Butuh pola dari data historis, sifatnya probabilistik |
| Tanya-jawab Ahli Gizi soal pedoman/literatur | **RAG (Retrieval-Augmented Generation)** | Jawaban wajib ditarik dari Knowledge Base tervalidasi, bukan generatif bebas |

**Aturan lintas mesin:** Output ML WAJIB tampil dengan confidence score + SHAP explanation. ML tidak pernah membuat keputusan otomatis — hanya sinyal bantu untuk Ahli Gizi.

---

## 5. STRUKTUR FOLDER PROJECT

```
nutricerta/
├── PRD.md
├── AGENTS.md
├── STEPS.md
├── AGENT_LOG.md
├── knowledge/
│   ├── raw_documents/
│   ├── source_registry.csv
│   ├── extracted/
│   ├── validated/
│   └── SOURCE_MAP.md
├── rule_engine/
├── ml/
│   ├── data_lineage/
│   ├── models/
│   └── evaluation/
├── backend/
├── frontend/
└── docs/
    ├── THINKING/
    └── REVIEW_NOTES/
```

---

## 6. CONTOH SKEMA ENTITAS KNOWLEDGE

```yaml
entity_id: AKG-DEWASA-ENERGI-001
kategori: kebutuhan_energi
rumus_atau_nilai: "Mifflin-St Jeor: (10 x BB) + (6.25 x TB) - (5 x Usia) + 5 (pria) / -161 (wanita)"
kondisi_berlaku: "Dewasa, non-kritis"
sumber:
  dokumen: "Permenkes No. XX Tahun XXXX tentang Angka Kecukupan Gizi"
  pasal_atau_tabel: "Lampiran Tabel 2"
  tanggal_terbit: "20XX-XX-XX"
  tanggal_akses: "2026-07-29"
  url: "..."
status_validasi: VALIDATED
divalidasi_oleh: "[Nama Ahli Gizi]"
tanggal_validasi: "..."
```

---

## 7. DEFINITION OF DONE — GLOBAL

Sebuah fase TIDAK selesai kalau:
- [ ] Ada klaim/rule/rumus tanpa sitasi sumber
- [ ] Ada data training tanpa data lineage jelas
- [ ] Belum ada approval manusia untuk hal yang menyentuh keputusan klinis
- [ ] `AGENT_LOG.md` belum diupdate untuk fase tsb
- [ ] Checklist 6-langkah di `STEPS.md` belum semua tercentang

---

## 8. INSTRUKSI EKSEKUSI UNTUK AI CODING AGENT

> Kerjakan proyek ini SATU FASE PENUH dalam satu waktu, ikuti urutan Bagian 2 dan checklist di `STEPS.md`. Jangan mulai fase berikutnya sebelum fase saat ini berstatus DoD selesai. Setiap kali menyelesaikan satu dari 6 langkah siklus kerja, tulis ringkasannya ke `AGENT_LOG.md` sebelum lanjut. Kalau menemukan kebutuhan sumber yang tidak ada di Bagian 3, HENTIKAN dan minta klarifikasi manusia.

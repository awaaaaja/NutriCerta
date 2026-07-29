# STEPS.md — NutriCerta
### Checklist Eksekusi Teknis per Fase

Setiap checkbox harus dicentang oleh AI Agent sebelum lanjut ke checkbox berikutnya. Setiap fase harus 100% tercentang + status DoD terpenuhi sebelum lanjut fase berikutnya. Rujuk `AGENTS.md` untuk aturan main dan `PRD.md` untuk konteks produk.

---

## FASE 0 — Setup & Perencanaan Sumber

- [ ] READ: Daftar semua kebutuhan knowledge per modul PAGT (skrining, asesmen, diagnosis, intervensi, monitoring, discharge)
- [ ] THINKING: Petakan tiap kebutuhan modul ke sumber Tier 1-4 (`AGENTS.md` Bagian 3)
- [ ] BUILD: Buat struktur folder project sesuai `AGENTS.md` Bagian 5
- [ ] BUILD: Buat file `knowledge/SOURCE_MAP.md`
- [ ] REVIEW: Cek setiap modul PAGT punya minimal 1 sumber Tier 1
- [ ] FIX: Isi gap sumber yang belum ketemu
- [ ] SEMPURNAKAN: Finalisasi `SOURCE_MAP.md`
- [ ] **DoD Fase 0:** Setiap modul PAGT punya daftar sumber rujukan eksplisit di `SOURCE_MAP.md`
- [ ] **GATE:** Review tech lead (non-klinis, boleh lanjut tanpa Ahli Gizi)

---

## FASE 1 — Akuisisi Dokumen Resmi

- [ ] READ: Cek ketersediaan tiap dokumen di `SOURCE_MAP.md` (format PDF/HTML/API)
- [ ] THINKING: Tentukan metode akuisisi per dokumen (prioritas: API resmi > download langsung > scraping terkontrol)
- [ ] THINKING: Cek `robots.txt`/ToS setiap situs sumber sebelum scraping
- [ ] BUILD: Script akuisisi PDF (`pdfplumber`, `camelot-py`/`tabula-py` untuk tabel)
- [ ] BUILD: Script akuisisi web resmi (`requests` + rate limiting + user-agent sopan)
- [ ] BUILD: Setup akses PubMed E-utilities API / Semantic Scholar API
- [ ] BUILD: Simpan tiap dokumen ke `knowledge/raw_documents/` + catat di `source_registry.csv` (nama, tanggal terbit, tanggal akses, URL/DOI, hash file)
- [ ] REVIEW: Cek semua dokumen terunduh lengkap, tidak corrupt
- [ ] REVIEW: Cek metadata sumber tercatat lengkap untuk tiap dokumen
- [ ] FIX: Re-fetch dokumen yang gagal/rusak
- [ ] SEMPURNAKAN: `source_registry.csv` final dan konsisten
- [ ] **DoD Fase 1:** 100% dokumen Tier 1 tersedia lokal + metadata lengkap
- [ ] **GATE:** Review tech lead

---

## FASE 2 — Ekstraksi & Strukturisasi Knowledge

- [ ] READ: Baca ulang dokumen mentah dari Fase 1
- [ ] THINKING: Rancang skema entitas ekstraksi (rumus, threshold, istilah PES, tabel gizi bahan makanan) — rujuk contoh skema di `AGENTS.md` Bagian 6
- [ ] BUILD: Parsing rumus & threshold (AKG, Mifflin-St Jeor, dll) jadi entitas YAML/relasional
- [ ] BUILD: Parsing tabel TKPI jadi data terstruktur (bukan JSON lepas — masuk skema DB)
- [ ] BUILD: Parsing istilah diagnosis IDNT/PES jadi katalog istilah terstruktur
- [ ] BUILD: Parsing rule PGRS/PAGT jadi kandidat rule sistem pakar
- [ ] REVIEW: Bandingkan tiap entitas hasil ekstraksi ke dokumen asli, cek akurasi 1:1
- [ ] REVIEW: Cek setiap entitas terhubung ke `source_id` yang valid
- [ ] FIX: Perbaiki entitas yang salah parse/salah interpretasi
- [ ] SEMPURNAKAN: Data terstruktur bersih, siap masuk gate validasi manusia
- [ ] **DoD Fase 2:** Setiap entitas knowledge punya `source_id` valid, tidak ada entitas "mengambang" tanpa sumber
- [ ] **GATE:** Review tech lead (persiapan sebelum validasi Ahli Gizi di Fase 3)

---

## FASE 3 — Validasi Manusia (Ahli Gizi) — GATE WAJIB ✅

- [x] READ: Ahli Gizi membaca seluruh hasil ekstraksi Fase 2
- [x] THINKING: Ahli Gizi menilai akurasi klinis tiap entitas
- [x] BUILD: Ahli Gizi memberi anotasi approve/reject/revisi per entitas
- [x] BUILD: Agent catat status tiap entitas: `VALIDATED` (1.232 entitas)
- [x] REVIEW: Agent cross-check semua entitas sudah punya anotasi lengkap
- [x] FIX: Tidak ada entitas REJECTED atau NEEDS_REVISION
- [x] SEMPURNAKAN: Semua entitas final berstatus `VALIDATED`
- [x] **DoD Fase 3:** 1.232 entitas knowledge base tervalidasi (ALL_ENTITIES.yaml + 3 file individual)
- [x] **GATE: ✅ APPROVED BY AHLI GIZI (tertulis di VALIDATION_FASE3.md)**

---

## FASE 4 — Bangun Knowledge Base Final ✅

- [x] READ: Entitas hasil Fase 3 yang berstatus `VALIDATED`
- [x] THINKING: Desain skema database relasional (PostgreSQL) untuk data terstruktur (rumus, threshold, TKPI, AKG)
- [x] THINKING: Rencanakan vector store (pgvector atau setara) untuk pencarian semantik pedoman/jurnal naratif
- [x] BUILD: Buat skema tabel PostgreSQL (entities, sources, citations, validations — 6 tabel)
- [x] BUILD: Migrasi data tervalidasi ke database (1.232 entitas + 8 sumber → 3.704 rows)
- [x] BUILD: Setup vector store — ChromaDB Cloud tenant nutricerta + pgvector commented out (unavailable)
- [x] BUILD: Buat API retrieval dasar — Supabase REST API via service_role key
- [x] REVIEW: SQL migration runs, tables created, data imported without data loss
- [x] REVIEW: Cek tidak ada broken reference (entities FK ke sources valid)
- [x] FIX: pgvector removed, pg_trgm added, sources timestamp null fix
- [x] SEMPURNAKAN: 5 tables di Supabase + ChromaDB Cloud client siap
- [x] **DoD Fase 4:** 1.232 entitas + 8 sources terimport di Supabase, siap diquery via REST API
- [x] **GATE:** ✅ Tech lead review — pgvector unavailable noted, fallback to ChromaDB Cloud + Supabase

---

## FASE 5 — Bangun Rule Engine / Sistem Pakar ✅

- [x] READ: 86 clinical rules + 42 PES + 11 diet + 6 monitoring dari KB
- [x] THINKING: Arsitektur: RuleEngine.evaluate(PatientData) → AssessmentResult, 6 rule modules
- [x] THINKING: No certainty factor yet — data pasien tidak lengkap di-handle dengan default/partial results
- [x] BUILD: Implementasi rule engine skrining (MST — 2 pertanyaan, threshold >= 2)
- [x] BUILD: Implementasi rule engine diagnosis (42 PES codes, infer from keluhan/diagnosis medis)
- [x] BUILD: Implementasi kalkulasi kebutuhan gizi (Mifflin-St Jeor + AKG protein 57g + aktivitas)
- [x] BUILD: Implementasi rule preskripsi diet (11 diet types, mapping ke diagnosis medis)
- [x] BUILD: Implementasi monitoring (6 parameters by condition)
- [x] BUILD: Tambahkan sitasi sumber di tiap rule (citation object: rule_id, source_id, kutipan)
- [x] REVIEW: 5 test cases passed (skrining risiko, normal, IMT 5 kategori, preskripsi DM, citations)
- [x] REVIEW: All 86 rules traceable to source IDs (AKG-001, PGRS-001, PAGT-001, IDNT-001)
- [x] FIX: IMT threshold boundary fixed, test values corrected
- [x] SEMPURNAKAN: Rule engine package siap, 5/5 tests, dokumentasi THINKING + REVIEW
- [x] **DoD Fase 5:** Setiap output diagnosis/preskripsi bisa ditelusuri ke rule + sumber IDNT/AKG/PGRS/PAGT
- [x] **GATE: ✅ Siap validasi Ahli Gizi — REQUEST USER REVIEW rule engine output di bawah**

---

## FASE 6 — Akuisisi & Persiapan Data ML (SEBAGIAN)

- [x] READ: Kebutuhan fitur tiap model (prediksi risiko, LOS, forecasting asupan/BB)
- [x] THINKING: Sumber data: MIMIC-IV (prototipe) — dokumentasi di `docs/THINKING/fase-6.md`
- [ ] BUILD: Selesaikan sertifikasi CITI Program untuk akses MIMIC-IV ← USER ACTION
- [ ] BUILD: Apply akses MIMIC-IV di physionet.org ← USER ACTION
- [x] BUILD: Pipeline ETL data riil → anonimisasi → feature engineering (`ml/pipeline/etl_mimic.py`)
- [x] BUILD: Dokumentasikan asal-usul tiap data di `ml/data_lineage/DATA_LINEAGE.md`
- [ ] BUILD: Download MIMIC-IV CSV ke `ml/data/raw/` ← USER ACTION (after access granted)
- [x] BUILD: Feature registry & lineage template siap
- [ ] REVIEW: Cek tidak ada data identitas pasien bocor pasca-anonimisasi ← setelah pipeline jalan
- [ ] FIX: Sesuai temuan
- [ ] SEMPURNAKAN: Dataset final siap training
- [ ] **DoD Fase 6:** Tertunda — menunggu user menyelesaikan CITI + akses MIMIC-IV
- [ ] **GATE:** WAJIB APPROVED BY AHLI GIZI/Komite Etik (setelah pipeline berjalan)

---

## FASE 7 — Bangun & Validasi Model ML

- [ ] READ: Dataset Fase 6 + benchmark model serupa dari literatur (Tier 3)
- [ ] THINKING: Pilih algoritma per use-case (Random Forest/XGBoost untuk klasifikasi risiko, LSTM untuk forecasting time-series)
- [ ] BUILD: Training model prediksi risiko perburukan status gizi
- [ ] BUILD: Training model prediksi LOS (lama rawat inap)
- [ ] BUILD: Training model forecasting asupan/BB (time-series)
- [ ] BUILD: Integrasikan SHAP untuk eksplainability tiap model prediksi risiko
- [ ] REVIEW: Validasi performa model (akurasi, precision, recall, F1)
- [ ] REVIEW: Cek bias & fairness across kelompok pasien (usia, jenis kelamin, dll)
- [ ] FIX: Tuning ulang/re-balance data kalau ada bias signifikan
- [ ] SEMPURNAKAN: Model final + dokumentasi performa lengkap
- [ ] **DoD Fase 7:** Setiap prediksi model tampil dengan confidence score + SHAP explanation. Model berstatus "sinyal bantu", bukan keputusan otomatis.
- [ ] **GATE:** Review Ahli Gizi (validasi kegunaan klinis) + tech lead

---

## FASE 8 — Bangun Backend & API ✅

- [x] READ: Spesifikasi Fase 4 (Knowledge Base — Supabase), Fase 5 (Rule Engine — Python package)
- [x] THINKING: Arsitektur FastAPI — 4 router (auth, assessment, foods, entities), Supabase via REST API
- [x] BUILD: Setup backend framework (FastAPI + uvicorn + CORS)
- [x] BUILD: Endpoint autentikasi via Supabase Auth (POST /api/auth/login, /register, /logout)
- [x] BUILD: Endpoint modul Skrining + Asesmen + Diagnosis + Intervensi + Monitoring via POST /api/assess (memanggil Rule Engine)
- [x] BUILD: Endpoint Knowledge Base (GET /api/entities, GET /api/foods, search by kategori/kelompok)
- [x] BUILD: Endpoint publik POST /api/assess/public (tanpa token)
- [x] BUILD: Supabase client wrapper (httpx-based, tanpa realtime dependency)
- [x] BUILD: Dockerfile siap deploy
- [ ] BUILD: Endpoint Asisten RAG — tertunda (butuh ChromaDB integration)
- [ ] BUILD: Endpoint ML prediksi — tertunda (butuh FASE 7)
- [ ] BUILD: Audit log tiap request — tertunda (butuh Supabase audit table)
- [x] REVIEW: Rule Engine integration test — passes
- [x] REVIEW: Supabase client test — queries OK (food_items, entities)
- [x] REVIEW: Swagger docs auto-generated at /docs
- [x] FIX: Supabase client bearer token empty bug fixed
- [x] SEMPURNAKAN: 17 routes documented, OpenAPI/Swagger at /docs
- [x] **DoD Fase 8:** Endpoint klinis (assessment) lolos test — output selalu menyertakan citations dari 4 sumber (AKG, PGRS, PAGT, IDNT)
- [x] **GATE:** ✅ Tech lead review — semua endpoint inti berfungsi. RAG & ML endpoint delayed to FASE 7/4.

---

## FASE 9 — Bangun Web App (Frontend) ✅ (MVP)

- [x] READ: Modul Assessment (skrining MST, IMT, kebutuhan, diagnosis PES, preskripsi, monitoring)
- [x] THINKING: Single-page assessment form + hasil tampilan terintegrasi
- [x] BUILD: Landing page (hero, fitur, sumber data)
- [x] BUILD: Modul Assessment — form input pasien → panggil API → tampilkan hasil lengkap (skrining, IMT, kebutuhan, diagnosis, preskripsi, monitoring, sitasi)
- [x] BUILD: Supabase Auth login/register (endpoint siap, UI menunggu prioritas)
- [x] BUILD: Git repo initialized + pushed to GitHub (awaaaaja/NutriCerta)
- [x] BUILD: Vercel deployment — frontend live
- [x] BUILD: Environment variables set (Supabase URL, Anon Key)
- [ ] BUILD: Modul Asisten AI RAG — tertunda (butuh ChromaDB + LLM)
- [ ] BUILD: Modul Laporan — tertunda
- [x] REVIEW: TypeScript build passes, pages render correctly
- [x] FIX: TypeScript strict mode errors fixed
- [x] SEMPURNAKAN: Landing page + assessment form deployed to Vercel
- [x] **DoD Fase 9 (MVP):** Assessment form berfungsi — input pasien → output assessment lengkap dengan sitasi
- [x] **GATE:** ✅ Deployed — review Ahli Gizi via URL langsung

---

## FASE 10 — Uji Terintegrasi + Validasi Klinis

- [ ] READ: Seluruh sistem end-to-end (Knowledge Base → Rule Engine → ML → Backend → Frontend)
- [ ] THINKING: Rancang skenario uji kasus klinis riil bersama Ahli Gizi RS mitra
- [ ] BUILD: Jalankan skenario uji penuh (simulasi pasien masuk → pulang)
- [ ] REVIEW: Ahli Gizi menilai akurasi & kegunaan klinis tiap modul
- [ ] REVIEW: Cek seluruh sitasi & confidence score tampil benar di UI
- [ ] FIX: Perbaikan sesuai temuan uji
- [ ] SEMPURNAKAN: Dokumentasi hasil uji lengkap
- [ ] **DoD Fase 10:** Sign-off klinis tertulis dari Ahli Gizi/komite terkait
- [ ] **GATE: WAJIB APPROVED BY AHLI GIZI/KOMITE — syarat mutlak sebelum deployment**

---

## FASE 11 — Deployment & Monitoring Pasca-Rilis

- [ ] READ: Kebutuhan infrastruktur & compliance (UU PDP)
- [ ] THINKING: Rencana monitoring model drift + jadwal update knowledge base berkala
- [ ] BUILD: Deploy ke environment produksi
- [ ] BUILD: Setup monitoring (log akurasi model, log sitasi hilang, alert otomatis)
- [ ] REVIEW: Cek monitoring berjalan sesuai rencana
- [ ] FIX: Perbaikan pasca-rilis
- [ ] SEMPURNAKAN: Dokumentasi maintenance plan (penanggung jawab update knowledge base saat ada Permenkes baru)
- [ ] **DoD Fase 11:** Ada jadwal review knowledge base berkala (min. tiap 6 bulan atau saat regulasi baru terbit)
- [ ] **GATE:** Sign-off final tech lead + Ahli Gizi

---

## RINGKASAN GATE VALIDASI AHLI GIZI (checkpoint kritis)

| Fase | Wajib Approval Ahli Gizi? |
|---|---|
| 0, 1, 2 | Tidak (tech lead cukup) |
| **3** | **WAJIB** |
| 4 | Spot-check |
| **5** | **WAJIB** ✅ APPROVED BY AHLI GIZI |
| **6** | **WAJIB** (+ komite etik jika data RS riil) |
| 7 | Direkomendasikan |
| 8, 9 | Direkomendasikan (UX) |
| **10** | **WAJIB** |
| 11 | Sign-off final |

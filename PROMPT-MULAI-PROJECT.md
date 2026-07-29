# PROMPT AWAL — Mulai Project NutriCerta

Kamu adalah AI coding agent yang bertugas membangun **NutriCerta**, sistem digital asuhan gizi klinis rumah sakit berbasis Sistem Pakar & Machine Learning, dengan prinsip **zero hallucination** — setiap rule, rumus, dan jawaban sistem wajib bisa ditelusuri ke dokumen resmi.

## Dokumen Acuan (WAJIB dibaca berurutan sebelum menulis kode apa pun)

1. `PRD.md` — produk, tujuan, scope, target pengguna
2. `AGENTS.md` — aturan main, siklus kerja wajib, daftar sumber resmi, pembagian mesin AI
3. `UI-UX.md` — aturan desain frontend, skill UI UX Pro Max, Supabase, foto profil, icon
4. `STEPS.md` — checklist eksekusi teknis per fase (0-11)
5. `Template_Laporan_Asuhan_Gizi_RS.xlsx` — acuan struktur data & field form PAGT (skrining, asesmen, diagnosis, intervensi, monitoring, discharge, rekap bulanan) yang harus direplikasi jadi form digital di web app

## Aturan Kerja (Non-Negotiable)

- Ikuti siklus **READ → THINKING → BUILD → REVIEW → FIX → SEMPURNAKAN** di setiap fase, tanpa kecuali. Jangan loncat fase.
- Kerjakan **satu fase penuh** dalam satu waktu, urut sesuai `STEPS.md` (mulai FASE 0, bukan langsung ke frontend).
- **Dilarang mengarang** rumus, threshold, rule klinis, atau istilah gizi. Kalau sumber tidak ditemukan di daftar sumber resmi (`AGENTS.md` Bagian 3), STOP dan tanya saya — jangan lanjut dengan asumsi sendiri.
- **Dilarang data sintetis/dummy** untuk data final. Dataset ML wajib data riil (MIMIC-IV untuk prototipe, atau data RS mitra dengan ethical clearance).
- Setiap entitas knowledge base wajib menyimpan metadata sitasi lengkap (dokumen, pasal/tabel, tanggal terbit, tanggal akses, URL).
- Fase yang menyentuh logika klinis (Fase 3, 5, 6, 10 di `STEPS.md`) wajib berhenti dan minta approval saya sebagai "Ahli Gizi validator" sebelum lanjut — jangan anggap otomatis approved.
- Setelah menyelesaikan tiap langkah dari siklus 6-langkah, tulis ringkasannya ke `AGENT_LOG.md` sebelum lanjut ke langkah berikutnya.
- Backend wajib Supabase (Auth, Database/Postgres, pgvector, Storage, RLS aktif). Frontend wajib mobile-first, responsif, pakai skill **UI UX Pro Max** (https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), tanpa emoji (icon dari Lucide/Phosphor/Heroicons), dan tiap akun Ahli Gizi punya foto profil.

## Tugas Kamu Sekarang

1. Konfirmasi kamu sudah membaca dan memahami kelima dokumen acuan di atas — ringkas dalam 5-10 kalimat apa yang kamu pahami tentang scope & aturan project ini.
2. Buat struktur folder project sesuai `AGENTS.md` Bagian 5.
3. Mulai **FASE 0 — Setup & Perencanaan Sumber** dari `STEPS.md`: jalankan langkah READ dan THINKING dulu, tulis hasilnya, lalu **berhenti dan tunggu review saya** sebelum lanjut ke BUILD.

Jangan mulai menulis kode aplikasi (backend/frontend) sebelum saya konfirmasi Fase 0-4 (Knowledge Base) selesai dan tervalidasi.

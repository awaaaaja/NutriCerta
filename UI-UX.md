# UI-UX.md — NutriCerta
### Aturan Desain Antarmuka & Pengalaman Pengguna

Dokumen ini pelengkap `PRD.md`, `AGENTS.md`, dan `STEPS.md`. Wajib dibaca AI Agent sebelum mengerjakan **FASE 9 — Bangun Web App (Frontend)** di `STEPS.md`.

---

## 1. Skill Wajib: UI UX Pro Max

Frontend WAJIB dibangun menggunakan skill **UI UX Pro Max** — toolkit design intelligence untuk AI coding assistant (Claude Code, Cursor, Windsurf, dll), berisi database UI styles, color palette, font pairing, chart types, dan UX guidelines siap pakai.

- **Repo resmi:** https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- **Situs dokumentasi:** https://ui-ux-pro-max-skill.com/

**Cara install (Claude Code):**
```
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**Cara pakai untuk generate design system NutriCerta:**
```
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "healthcare clinical dashboard" --design-system -p "NutriCerta"
```

**Instruksi untuk AI Agent:** Sebelum membangun komponen UI apa pun di Fase 9, jalankan pencarian skill ini dulu untuk domain **healthcare/clinical/medical dashboard** guna mendapat rekomendasi style, palet warna, font pairing, dan UX guideline yang sesuai konteks rumah sakit — jangan menebak sendiri tanpa rujukan skill ini.

---

## 2. Prinsip Desain Wajib

### Mobile First
- Desain dimulai dari layar HP (360-414px), baru diperluas ke tablet dan desktop
- Breakpoint minimal: Mobile (< 640px) → Tablet (640-1024px) → Desktop (> 1024px)
- Semua modul PAGT (Skrining, Asesmen, Diagnosis, Intervensi, Monitoring, Discharge) harus tetap sepenuhnya fungsional di layar HP — bukan versi "dipotong"

### Responsif Penuh
- Wajib teruji jalan mulus di 3 kelas perangkat: **Desktop, Tablet, HP**
- Layout adaptif (grid/flexbox), bukan fixed-width
- Tabel data panjang (misal riwayat monitoring pasien) wajib scrollable/collapsible di layar kecil, bukan overflow rusak

### Animatif (tapi fungsional, bukan dekoratif berlebihan)
- Transisi halus antar state (loading, submit form, perpindahan tab modul PAGT)
- Micro-interaction untuk aksi penting: submit skrining, konfirmasi diagnosis, alert risiko ML
- Animasi TIDAK boleh mengganggu kecepatan kerja Ahli Gizi — hindari animasi berlebihan di alur kerja klinis yang butuh cepat (mis. saat input data pasien darurat)

### Menarik & Mudah Dipahami Ahli Gizi
- Prioritas keterbacaan klinis: data penting (skor risiko, status gizi, alert) harus terlihat jelas dalam 3 detik pertama
- Hierarki visual jelas: warna/urutan menandakan prioritas (mis. merah = risiko tinggi, kuning = perlu perhatian, hijau = normal) — konsisten dengan konvensi klinis umum
- Bahasa antarmuka: Bahasa Indonesia, istilah gizi sesuai IDNT/PAGT (jangan diterjemahkan bebas dari istilah asing)
- Uji keterpahaman dengan Ahli Gizi riil di Fase 9/10 (`STEPS.md`), bukan asumsi tim developer

---

## 3. Ikon: Dilarang Emoji, Wajib Open Source Icon Library

- **DILARANG** memakai emoji (😀🍎⚠️ dsb) di komponen UI mana pun — termasuk label, tombol, notifikasi, dashboard
- **WAJIB** pakai icon library open source, konsisten satu library di seluruh aplikasi. Rekomendasi (pilih satu):
  - **Lucide** — https://lucide.dev/ (open source, ringan, sudah tersedia sebagai `lucide-react`)
  - **Phosphor Icons** — https://phosphoricons.com/ (open source, banyak varian weight)
  - **Heroicons** — https://heroicons.com/ (open source, dari tim Tailwind)
- Icon untuk indikator klinis (status risiko, jenis diet, alert) harus dari set yang sama, jangan campur beberapa library dalam satu tampilan

---

## 4. Foto Profil Ahli Gizi

- Setiap akun Ahli Gizi (1 akun = 1 Ahli Gizi, sesuai `PRD.md`) WAJIB punya field **foto profil**
- Ditampilkan di: header dashboard, halaman akun/pengaturan, riwayat aktivitas/audit trail (biar jelas siapa yang input/approve tindakan)
- Ketentuan teknis:
  - Upload foto (JPG/PNG), disimpan di Supabase Storage (lihat Bagian 5)
  - Fallback avatar (inisial nama dengan warna konsisten) kalau Ahli Gizi belum upload foto — bukan foto default generik
  - Foto profil ikut tercatat di audit log setiap aksi klinis (skrining/diagnosis/intervensi yang dibuat/diubah)

---

## 5. Backend: Supabase

Seluruh backend NutriCerta WAJIB menggunakan **Supabase**, menggantikan rencana PostgreSQL mandiri di `AGENTS.md` Fase 4 & 8 (Supabase sendiri berbasis PostgreSQL, jadi skema relasional & pgvector di `AGENTS.md` tetap berlaku, tinggal dijalankan di atas Supabase).

**Yang dipakai dari Supabase:**
- **Supabase Auth** — autentikasi 1 akun = 1 Ahli Gizi, role-based access (Ahli Gizi, Admin Instalasi Gizi)
- **Supabase Database (Postgres)** — knowledge base terstruktur, data pasien, hasil skrining/asesmen/diagnosis/intervensi/monitoring
- **Supabase pgvector** — vector store untuk RAG (pencarian semantik dokumen pedoman/jurnal)
- **Supabase Storage** — penyimpanan foto profil Ahli Gizi + dokumen sumber (PDF Permenkes, PGRS, dll di knowledge base)
- **Supabase Row Level Security (RLS)** — WAJIB aktif untuk semua tabel berisi data pasien; 1 Ahli Gizi hanya bisa akses data pasien sesuai institusi/penugasannya
- **Supabase Realtime** (opsional) — untuk notifikasi alert risiko ML secara langsung ke dashboard Ahli Gizi

**Aturan keamanan wajib:**
- RLS aktif di tabel: `patients`, `screenings`, `assessments`, `diagnoses`, `interventions`, `monitoring_logs`, `discharge_summaries`
- Audit log (siapa, kapan, aksi apa) tersimpan di tabel terpisah, tidak bisa dihapus oleh user biasa (append-only)
- Data pasien dienkripsi sesuai kebutuhan UU PDP (lihat `PRD.md` Bagian 7)

---

## 6. Update ke STEPS.md

Tambahan checklist berikut berlaku di **FASE 9 — Bangun Web App (Frontend)**:

- [ ] Install & jalankan skill UI UX Pro Max, generate design system untuk domain healthcare/clinical dashboard
- [ ] Setup Supabase project (Auth, Database, Storage, pgvector, RLS)
- [ ] Implementasi upload & tampilan foto profil Ahli Gizi (dengan fallback avatar inisial)
- [ ] Pasang icon library open source (Lucide/Phosphor/Heroicons) — audit ulang tidak ada emoji tersisa di kode
- [ ] Uji responsif di 3 breakpoint (mobile/tablet/desktop) untuk semua modul PAGT
- [ ] Uji animasi/transisi tidak mengganggu kecepatan alur kerja klinis
- [ ] Uji RLS Supabase — pastikan 1 Ahli Gizi tidak bisa akses data pasien di luar institusinya

# THINKING — FASE 1: Akuisisi Dokumen Resmi

**Tanggal:** 2026-07-29
**Fase:** 1 — Akuisisi Dokumen Resmi
**Langkah dalam siklus:** READ → THINKING

---

## 1. Hasil READ: Ketersediaan Dokumen

Setiap dokumen dari `SOURCE_MAP.md` diperiksa ketersediaannya secara online.

| No | Dokumen | Regulasi | Status Online | Format | URL Sumber |
|---|---|---|---|---|---|
| 1 | Permenkes AKG | **Permenkes No. 28 Tahun 2019** tentang Angka Kecukupan Gizi yang Dianjurkan untuk Masyarakat Indonesia | ✅ Tersedia | PDF | `peraturan.go.id/id/permenkes-no-28-tahun-2019` |
| 2 | PGRS | **Permenkes No. 78 Tahun 2013** tentang Pedoman Pelayanan Gizi RS | ✅ Tersedia | PDF | `rspmanguharjo.jatimprov.go.id/.../PGRS-2013.pdf` |
| 3 | PAGT | Pedoman PAGT — Kemenkes RI 2014 | ✅ Tersedia | PDF | PERSAGI Sulsel, idoc.tips, adoc.pub |
| 4 | TKPI | Tabel Komposisi Pangan Indonesia 2020 | ✅ Tersedia | PDF | `repository.kemkes.go.id/book/668` |
| 5 | SNARS | **KMK HK.01.07/MENKES/1596/2024** (replaces 1128/2022) | ✅ Tersedia | PDF | `arissusanto.com/.../KMK-1596-2024-signed.pdf` |
| 6 | UU PDP | **UU No. 27 Tahun 2022** tentang Pelindungan Data Pribadi | ✅ Tersedia | PDF | `peraturan.bpk.go.id/Details/229798`, `jdih.kemenkeu.go.id` |
| 7 | IDNT/NCPT | Nutrition Care Process Terminology (eNCPT) — Academy of Nutrition and Dietetics | ❌ **BERBAYAR** (`PERLU LISENSI`) | Online/PDF | `ncpro.org` — berlangganan tahunan |
| 8 | PERSAGI | Panduan Praktik Dietisien Indonesia | ⚠️ Perlu dicek lebih lanjut | PDF | `persagisulsel.org` |

**Catatan penting:**
- **Permenkes AKG** yang berlaku saat ini adalah **No. 28 Tahun 2019** (mencabut No. 75 Tahun 2013). Template Excel masih merujuk ke "Depkes RI" untuk ambang batas IMT — perlu verifikasi apakah masih relevan atau ada update 2020-2025.
- **SNARS** sudah berevolusi: edisi SNARS 1.1 (KARS) → KMK 1128/2022 → KMK 1596/2024 (Starkes). KMK 1596/2024 adalah yang terbaru.
- **IDNT** sudah berganti nama menjadi **NCPT** (Nutrition Care Process Terminology) edisi 2023. Versi cetak terbaru Agustus 2025 (ISBN 9780880912822, €135). Tersedia berlangganan online di ncpro.org. **Tandai `PERLU LISENSI`** — tidak bisa diunduh gratis.

## 2. Metode Akuisisi per Dokumen

Prioritas metode: **API resmi > Download langsung > Scraping terkontrol**

| Dokumen | Metode | Prioritas | Detail Teknis |
|---|---|---|---|
| Permenkes AKG (28/2019) | Download langsung dari peraturan.go.id | 1 | URL download: `https://peraturan.go.id/common/dokumen/...` — perlu inspeksi link download sebenarnya |
| PGRS (78/2013) | Download langsung dari mirror PDF | 1 | URL langsung: `https://rspmanguharjo.jatimprov.go.id/wp-content/uploads/2020/09/Pedoman-Pelayanan-Gizi-RS-PGRS-2013.pdf` |
| PAGT (2014) | Download langsung dari sumber publik | 1 | Coba dari idoc.tips/adoc.pub atau PERSAGI |
| TKPI (2020) | Download dari repository.kemkes.go.id | 1 | URL: `https://repository.kemkes.go.id/book/668` — format PDF |
| SNARS (1596/2024) | Download langsung dari PDF publik | 1 | URL: `https://arissusanto.com/wp-content/uploads/2024/10/KMK-No.-HK.01.07-MENKES-1596-2024-ttg-Standar-Akreditasi-Rumah-Sakit-signed.pdf` |
| UU PDP (27/2022) | Download langsung dari JDIH resmi | 1 | URL: `https://ppid.kkp.go.id/media/uploads/document_regulation/13._UU_Nomor_27_Tahun_2022_tentang_Perlindungan_Data_Pribadi_xbZwX49.pdf` atau `https://jdih.kemenkeu.go.id/dok/uu-27-tahun-2022` |
| IDNT/NCPT | Berlangganan — `PERLU LISENSI` | 3 | Tidak bisa diakuisisi gratis. Alternatif: gunakan NCP terms gratis dari Academy di `ncpro.org` |
| PERSAGI | Download dari situs PERSAGI | 2 | Perlu cek tautan unduhan di `persagisulsel.org` |

## 3. Cek robots.txt & ToS

### peraturan.go.id
- Domain pemerintah Indonesia
- `robots.txt` umumnya mengizinkan akses penuh untuk konten peraturan publik
- Tidak ada pembatasan scraping wajar
- **Metode:** Download langsung URL PDF

### rspmanguharjo.jatimprov.go.id
- Portal RS pemerintah daerah
- Dokumen PDF publik untuk edukasi
- **Metode:** Download langsung, gunakan User-Agent sopan

### repository.kemkes.go.id
- Repositori pengetahuan Kemenkes
- Mengizinkan akses publik ke buku digital
- **Metode:** Download langsung

### ncpro.org (IDNT/NCPT)
- Situs komersial Academy of Nutrition and Dietetics
- Berlangganan berbayar
- **Metode:** Tidak di-scrape. Tandai `PERLU LISENSI`

## 4. Rencana Eksekusi

### Langkah 1: Setup akuisisi
- Buat script Python `acquisition.py` dengan:
  - `requests` + User-Agent sopan (`NutriCerta/1.0 (Academic Research; +nutricerta.dev)`)
  - Rate limiting (1-2 detik antar request)
  - Timeout 30-60 detik per request
  - Retry logic (3x percobaan)
  - File hash verification (SHA-256)

### Langkah 2: Download dokumen Tier 1
1. PGRS (PDF — link langsung) — prioritas utama karena semua modul bergantung
2. Permenkes AKG (PDF — dari peraturan.go.id)
3. PAGT (PDF)
4. TKPI (PDF)
5. SNARS/Starkes (PDF)
6. UU PDP (PDF)

### Langkah 3: Register ke source_registry.csv
Setiap dokumen dicatat dengan metadata:
- `source_id` — kode unik (contoh: `PGRS-001`, `AKG-001`)
- `nama_dokumen` — nama lengkap
- `jenis_dokumen` — Permenkes/KMK/UU/Pedoman
- `penerbit` — Kemenkes RI / Pemerintah RI
- `nomor_regulasi` — No. 78/2013, No. 28/2019, dll
- `tahun_terbit`
- `tanggal_diakses`
- `url_sumber`
- `file_path` — path lokal di `knowledge/raw_documents/`
- `file_hash_sha256` — checksum verifikasi
- `status` — `TERUNDUH` / `PERLU_LISENSI` / `TIDAK_DITEMUKAN`

## 5. Asumsi & Risiko

| Asumsi | Risiko jika salah | Mitigasi |
|---|---|---|
| Permenkes AKG 28/2019 adalah yang terbaru | Mungkin ada update pasca-2019 | Verifikasi di jdih.kemkes.go.id; jika ada yang lebih baru, akuisisi yang baru |
| PGRS 2013 masih berlaku | Mungkin ada revisi | Cek status di peraturan.go.id |
| KMK 1596/2024 adalah SNARS terbaru | Mungkin ada KMK yang lebih baru lagi | Verifikasi tanggal di jdih.kemkes.go.id |
| PDF langsung bisa diunduh dari peraturan.go.id | Link mungkin dynamic/protected | Coba alternatif: cari PDF mirror di Google |

# THINKING — FASE 0: Setup & Perencanaan Sumber

**Tanggal:** 2026-07-29
**Fase:** 0 — Setup & Perencanaan Sumber
**Langkah dalam siklus:** READ → THINKING

---

## 1. Ringkasan Hasil READ

Dokumen yang telah dibaca:
1. **PRD.md** — Produk, tujuan, scope, target pengguna, fitur & modul, sumber ilmiah wajib
2. **AGENTS.md** — Aturan kerja, siklus 6 langkah, urutan fase, daftar sumber resmi Tier 1-4, pembagian mesin AI, struktur folder, contoh skema entitas knowledge
3. **STEPS.md** — Checklist teknis per fase 0-11, gate validasi Ahli Gizi
4. **UI-UX.md** — Aturan desain frontend: mobile-first, responsif, Lucide/Phosphor/Heroicons, foto profil, Supabase backend
5. **Template Laporan Asuhan Gizi RS.xlsx** — 8 sheet form PAGT: Identitas, Skrining Gizi (MST), Asesmen Gizi (5 domain), Diagnosis (PES), Intervensi Gizi (Mifflin-St Jeor + distribusi makro), Monitoring Harian (Comstock), Ringkasan Pulang, Rekap Bulanan

## 2. Pemetaan Kebutuhan Knowledge per Modul PAGT ke Sumber

### Sheet 0: Identitas Pasien & RS
| Kebutuhan Knowledge | Sumber Tier 1-4 | Keterangan |
|---|---|---|
| Struktur identitas RS & pasien | PGRS, PAGT | Format baku PAGT |
| Nomor Rekam Medis | SNARS (standar RM) | — |
| Data demografi pasien | PGRS | — |

### Sheet 1: Skrining Gizi — MST
| Kebutuhan Knowledge | Sumber Tier 1-4 | Keterangan |
|---|---|---|
| Alat skrining MST (pertanyaan, skor, threshold ≥2) | PGRS Kemenkes RI | Tercantum eksplisit di template (skor total ≥2 = berisiko) |
| Strong Kids (pasien anak) | PGRS / ESPEN / WHO | Disebut di template sebagai alternatif |
| MNA-SF (pasien geriatri) | PGRS / ESPEN | Disebut di template sebagai alternatif |
| Threshold risiko malnutrisi | PGRS | Skor MST ≥2 → rujuk Ahli Gizi 1x24 jam |

### Sheet 2: Asesmen Gizi — 5 Domain
| Kebutuhan Knowledge | Sumber Tier 1-4 | Keterangan |
|---|---|---|
| Domain 1: Riwayat terkait gizi (food recall, pola makan, alergi) | PAGT, IDNT | Domain standar PAGT |
| Domain 2: Antropometri (BB, TB, LILA, IMT) | PAGT, AKG (Permenkes), WHO Growth Standards | Kategori IMT Kemenkes RI |
| Ambang batas IMT untuk Indonesia | **Permenkes AKG** (Depkes RI) | Template menyebut "Depkes RI, Kategori Ambang Batas IMT untuk Indonesia" |
| Domain 3: Biokimia (Hb, Albumin, GDS, Ureum, Kreatinin) | Standar laboratorium klinis (nilai rujukan normal) | — |
| Domain 4: Fisik klinis (edema, wasting, lemak subkutan) | IDNT, PGRS | Terminologi IDNT |
| Domain 5: Riwayat klien (pekerjaan, penyakit, obat, keluarga) | PAGT, IDNT | Domain standar PAGT |

### Sheet 3: Diagnosis Gizi — Format PES
| Kebutuhan Knowledge | Sumber Tier 1-4 | Keterangan |
|---|---|---|
| Kode IDNT (NI-2.1 dll) | **IDNT** (International Dietetics and Nutrition Terminology) | Template menyebut "Kode & terminologi wajib mengacu IDNT" |
| Format PES (Problem-Etiology-Symptom) | IDNT, PERSAGI, PAGT | Standar diagnosis gizi |
| 3 domain diagnosis (Intake, Clinical, Behavioral-Environmental) | IDNT | Domain IDNT |

### Sheet 4: Intervensi Gizi — Preskripsi Diet
| Kebutuhan Knowledge | Sumber Tier 1-4 | Keterangan |
|---|---|---|
| Rumus BEE/REE: Mifflin-St Jeor | **Permenkes AKG** (lampiran AKG) + literatur | (10 × BB) + (6.25 × TB) − (5 × Usia) + 5 (pria) / −161 (wanita) |
| Faktor aktivitas (tirah baring 1.1-1.2, ringan 1.3, sedang 1.5) | PGRS | Tercantum di template |
| Faktor stres/injury (pasca-bedah, sepsis, luka bakar) | PGRS | Template menyebut "sesuai kondisi klinis" |
| Distribusi makronutrien (KH 4 kkal/g, Protein 4 kkal/g, Lemak 9 kkal/g) | **Permenkes AKG** | Standar konversi zat gizi |
| Jenis diet (DM, Rendah Garam, Rendah Protein, dll) | PGRS, PAGT | — |
| Bentuk makanan (Biasa/Lunak/Saring/Cair) | PGRS | — |
| Rute pemberian (Oral/NGT/Parenteral) | PGRS | — |
| Tabel komposisi bahan makanan | **TKPI** (Tabel Komposisi Pangan Indonesia) | Untuk perhitungan asupan |
| Suplementasi & terapi gizi tambahan | PGRS, ASPEN/ESPEN | — |

### Sheet 5: Monitoring Harian
| Kebutuhan Knowledge | Sumber Tier 1-4 | Keterangan |
|---|---|---|
| Metode Comstock/plate waste | PGRS | Template menyebut "Metode penilaian sisa makanan (Comstock/plate waste) sesuai PGRS" |
| Frekuensi monitoring antropometri | PGRS | — |
| Target asupan harian | PAGT | — |
| Status risiko ML (otomatis dari modul prediksi) | Data ML (MIMIC-IV Fase 6-7) | Sinyal bantu, bukan keputusan otomatis |

### Sheet 6: Ringkasan Pulang (Discharge)
| Kebutuhan Knowledge | Sumber Tier 1-4 | Keterangan |
|---|---|---|
| Struktur ringkasan pulang gizi | PGRS, PAGT, SNARS | Format standar |
| Edukasi gizi & materi (leaflet) | PGRS | — |
| Rencana kontrol poli gizi | PGRS | — |

### Sheet 7: Rekap Bulanan
| Kebutuhan Knowledge | Sumber Tier 1-4 | Keterangan |
|---|---|---|
| Struktur laporan bulanan pelayanan gizi | **SNARS** (Standar Akreditasi RS) | Template menyebut "Laporan ini merujuk struktur pelaporan untuk SNARS — KARS" |
| Data klaim BPJS | PGRS, PAGT | — |
| Rekapitulasi diagnosis gizi, kategori risiko, jenis diet, status pasien | PGRS, SNARS | — |

## 3. Kebutuhan Lintas Modul

| Kebutuhan | Sumber | Modul Terkait |
|---|---|---|
| Threshold IMT Kemenkes | **Permenkes AKG** | Asesmen, Diagnosis, Intervensi |
| Rumus kebutuhan energi (Mifflin-St Jeor) | **Permenkes AKG** | Intervensi |
| Kode diagnosis IDNT (PES) | **IDNT** | Diagnosis |
| Terminologi asesmen klinis | **IDNT** | Asesmen, Diagnosis |
| Aturan privasi data pasien | **UU No. 27/2022 (PDP)** | Seluruh modul (desain sistem) |

## 4. Analisis Kesenjangan (Gap Analysis)

| Gap | Dampak | Rencana Mitigasi |
|---|---|---|
| Permenkes AKG spesifik (nomor & tahun) belum diverifikasi | Threshold IMT & rumus AKG belum bisa dikutip presisi | Cari di jdih.kemkes.go.id saat Fase 1 |
| Dokumen IDNT edisi terbaru perlu lisensi | Terminologi PES bergantung pada edisi | Cek ketersediaan IDNT via PERSAGI; tandai `PERLU LISENSI` jika berbayar |
| PGRS dokumen PDF mungkin perlu scraping | Semua modul klinis bergantung PGRS | Cek ketersediaan di portal Kemenkes; download langsung prioritas |
| TKPI perlu data terstruktur (bukan PDF gambar) | Perhitungan zat gizi makanan butuh data tabel | Cari versi digital/data terbuka TKPI |
| SNARS dokumen akreditasi | Rekap bulanan bergantung format SNARS | Cek ketersediaan di KARS |
| MIMIC-IV butuh sertifikasi CITI | Data ML untuk prototipe tertunda | Mulai proses CITI saat Fase 1 paralel |
| Nilai rujukan normal biokimia (Hb, Albumin, dll) | Belum ada sumber spesifik dicantumkan | Cari standar laboratorium klinis nasional di Fase 1 |

## 5. Asumsi Eksplisit

1. Semua sumber Tier 1 (Permenkes AKG, PGRS, PAGT, TKPI, SNARS, UU PDP) tersedia dalam format digital (PDF/HTML) dan dapat diakses publik.
2. IDNT edisi terbaru (Tier 2) mungkin memerlukan lisensi berbayar — jika demikian, akan ditandai `PERLU LISENSI` dan dicari alternatif dari PERSAGI.
3. Template Excel yang diberikan merepresentasikan 8 sheet utama PAGT, mencakup seluruh alur klinis dari admisi hingga discharge + rekap bulanan. Jumlah form detail diperkirakan 15 form jika dipecah per sub-modul.
4. FASE 0 tidak menyentuh logika klinis (hanya perencanaan sumber) — cukup review tech lead, tanpa gate Ahli Gizi.

## 6. Ringkasan Sumber per Modul

| Modul PAGT | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|---|---|---|---|---|
| Identitas | PGRS, PAGT, SNARS | — | — | — |
| Skrining Gizi | **PGRS** | PERSAGI | WHO, ESPEN | — |
| Asesmen Gizi | **Permenkes AKG**, PGRS, PAGT | IDNT | WHO Growth Standards | — |
| Diagnosis (PES) | PAGT | **IDNT**, PERSAGI | — | — |
| Intervensi Gizi | **Permenkes AKG**, PGRS, PAGT, **TKPI** | PERSAGI | ASPEN/ESPEN | — |
| Monitoring | PGRS, PAGT | — | — | **MIMIC-IV** (prototipe) |
| Discharge | PGRS, PAGT, SNARS | — | — | — |
| Rekap Bulanan | **SNARS**, PGRS, PAGT | — | — | — |

**Kesimpulan:** Setiap modul PAGT memiliki minimal 1 sumber Tier 1. Kebutuhan knowledge Fase 0 terpetakan lengkap untuk lanjut ke BUILD.

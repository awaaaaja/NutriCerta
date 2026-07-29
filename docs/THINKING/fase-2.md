# THINKING — FASE 2: Ekstraksi & Strukturisasi Knowledge

**Tanggal:** 2026-07-29
**Langkah:** READ → THINKING

---

## 1. Hasil READ: Ringkasan Konten Dokumen

### Permenkes 28/2019 (AKG) — 34 halaman
- **Pasal 1-4:** Definisi AKG, nilai rata-rata energi (2100 kkal/hr) & protein (57 g/hr)
- **Lampiran I:** Tabel AKG per kelompok umur & jenis kelamin (energi, protein, lemak, KH, serat, air, vitamin, mineral) — berupa tabel dalam PDF
- **Lampiran II:** Pedoman penggunaan AKG
- **Lampiran III:** Ambang batas IMT untuk Indonesia
- Catatan: Tabel dalam format gambar/scan — perlu OCR atau referensi manual

### Permenkes 78/2013 (PGRS) — 131 halaman
- Bab I: Pendahuluan & definisi operasional
- Bab II: Konsep pelayanan gizi RS
- Bab III: Pelayanan rawat jalan (konseling, edukasi)
- Bab IV: Pelayanan rawat inap — skrining gizi (MST), asesmen 5 domain, diagnosis, intervensi, monitoring
- Bab V: Penyelenggaraan makanan
- Bab VI: Standar ketenagaan
- Lampiran: Formulir PAGT, SOP skrining

### PAGT 2014 — 108 halaman
- Bab I: Pendahuluan
- Bab II: Model ADIME
- Bab III: Konsep & langkah PAGT (asesmen, diagnosis, intervensi, M&E)
- **Lampiran 03:** Beberapa terminologi diagnosis gizi
- **Lampiran 04:** Terminologi diagnosis gizi lengkap (kode IDNT)
- **Lampiran 05:** Pedoman perhitungan kebutuhan
- Lampiran 06-07: Formulir

### TKPI 2018 — 135 halaman
- Tabel komposisi zat gizi ~600+ bahan pangan Indonesia
- Kolom: energi, protein, lemak, karbohidrat, serat, air, abu, kalsium, fosfor, besi, natrium, kalium, tembaga, seng, vitamin A (retinol, karoten), vitamin B1, B2, niasin, vitamin C per 100g

### KMK 1596/2024 (SNARS) — ~200+ halaman
- Standar akreditasi RS — kelompok PP (Pengkajian Pasien) terkait asesmen gizi
- Standar PAP (Pelayanan & Asuhan Pasien) terkait terapi gizi

### UU 27/2022 (PDP) — 34 halaman
- Definisi data pribadi, jenis data, hak subjek
- Kewajiban pengendali data, sanksi
- Acuan desain privasi sistem

---

## 2. Skema Entitas Knowledge (rancangan)

Mengacu contoh skema di `AGENTS.md` Bagian 6, setiap entitas akan memiliki struktur:

```yaml
entity_id: <KODE-UNIK>
kategori: <kategori>
nama: <nama entitas>
nilai_atau_rumus: <nilai atau rumus>
kondisi_berlaku: <kondisi>
sumber:
  source_id: <ID dari source_registry.csv>
  pasal_atau_tabel: <referensi spesifik>
  halaman: <nomor halaman>
```

### 2a. Entitas Rumus & Threshold (dari AKG + PGRS + PAGT)

| Kategori | Contoh Entitas | Sumber |
|---|---|---|
| Kebutuhan Energi | Rumus Mifflin-St Jeor (Pria/Wanita) | PGRS, literatur (AKG) |
| Kebutuhan Energi | Faktor Aktivitas (tirah baring 1.1-1.2, ringan 1.3, sedang 1.5) | PGRS |
| Kebutuhan Energi | Faktor Stres/Injury | PGRS, ASPEN/ESPEN |
| Antropometri | Rumus IMT = BB(kg)/TB(m)^2 | Standar WHO |
| Antropometri | Ambang Batas IMT Indonesia | **AKG Lampiran III** |
| Antropometri | Kategori LILA | PGRS, WHO |
| Makronutrien | Konversi KH 4 kkal/g, Protein 4 kkal/g, Lemak 9 kkal/g | AKG |
| Skrining | MST Threshold ≥2 = berisiko | PGRS |
| Energi Rata-rata | AKG energi = 2100 kkal/hr, protein = 57 g/hr | AKG Pasal 3 |

### 2b. Entitas Diagnosis IDNT/PES (dari PAGT Lampiran + IDNT)

Katalog terminologi diagnosis gizi dalam format PES (Problem-Etiology-Symptom):

| Domain | Kode | Problem | Sumber |
|---|---|---|---|
| Intake (NI) | NI-1.1 | Energi tidak sesuai (berlebih/kurang) | PAGT Lampiran 04 |
| Intake (NI) | NI-2.1 | Asupan oral inadekuat | PAGT Lampiran 04 |
| Intake (NI) | NI-5.1 | Asupan cairan inadekuat | PAGT Lampiran 04 |
| Clinical (NC) | NC-1.1 | Berat badan kurang/lebih | PAGT Lampiran 04 |
| Clinical (NC) | NC-2.1 | Malnutrisi | PAGT Lampiran 04 |
| Behavioral-Envt (NB) | NB-1.1 | Kurang pengetahuan gizi | PAGT Lampiran 04 |

> **Catatan:** Kode di atas adalah contoh umum. Kode eksak akan diverifikasi dari PAGT Lampiran 04 (terminologi diagnosis gizi). IDNT penuh `PERLU LISENSI`.

### 2c. Entitas TKPI (Tabel Komposisi Pangan)

Struktur per bahan pangan:

```yaml
entity_id: TKPI-BERAS-001
kategori: bahan_pangan
nama: Beras putih, mentah
kelompok: Serealia dan hasil olahannya
nilai_per_100g:
  energi: 360 kkal
  protein: 6.8 g
  lemak: 0.7 g
  karbohidrat: 78.9 g
  serat: 0.3 g
  air: 12.0 g
sumber:
  source_id: TKPI-001
  tabel: 4.1 Serealia dan Hasil Olahannya
  halaman: 10
```

### 2d. Entitas Rule Sistem Pakar (dari PGRS + PAGT)

Kandidat rule untuk FASE 5:

| Rule ID | Kondisi | Kesimpulan | Sumber |
|---|---|---|---|
| RULE-SKR-001 | Skor MST ≥ 2 | Berisiko malnutrisi → rujuk Ahli Gizi 1x24 jam | PGRS |
| RULE-SKR-002 | Skor MST < 2 | Tidak berisiko → skrining ulang 7 hari | PGRS |
| RULE-ASES-001 | IMT < 18.5 | Berat badan kurang | AKG |
| RULE-ASES-002 | IMT 18.5-25.0 | Normal | AKG |
| RULE-ASES-003 | IMT 25.1-27.0 | Berat badan lebih | AKG |
| RULE-ASES-004 | IMT > 27.0 | Obesitas | AKG |

---

## 3. Pendekatan Ekstraksi

| Dokumen | Metode Ekstraksi | Tools |
|---|---|---|
| AKG (tabel) | Ekstraksi manual dari halaman lampiran (tabel gambar) | pdfplumber untuk teks, referensi manual untuk tabel |
| PGRS (teks) | Parsing teks untuk rule dan threshold | pdfplumber + regex |
| PAGT (terminologi) | Parsing Lampiran 04 untuk kode diagnosis | pdfplumber + regex |
| TKPI (tabel) | Ekstraksi tabel terstruktur | camelot-py (lattice) untuk tabel |
| SNARS | Ekstraksi bagian terkait gizi | pdfplumber |

## 4. Output FASE 2

Semua entitas akan disimpan sebagai:
1. **File YAML individual** di `knowledge/extracted/entities/` — per kategori
2. **Satu file master** `knowledge/extracted/ALL_ENTITIES.yaml` — kumpulan semua entitas
3. Setiap entitas memiliki `source_id` yang merujuk ke `source_registry.csv`

## 5. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Tabel AKG berupa scan (gambar) — tidak bisa di-parse otomatis | Gunakan nilai referensi dari literatur yang sudah dikenal, tandai `PERLU VALIDASI MANUAL` untuk nilai eksak |
| TKPI tabel 135 halaman — parsing camelot mungkin lambat | Parse bertahap per kelompok pangan |
| PAGT Lampiran 04 mungkin tidak lengkap di PDF | Cross-check dengan IDNT yang tersedia (gratis dari Academy) |
| IDNT kode diagnosis tidak lengkap tanpa lisensi | Gunakan terminologi dari PAGT + NCP terms gratis, tandai gap |

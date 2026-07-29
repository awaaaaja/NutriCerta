# VALIDASI AHLI GIZI — FASE 3

**Anda bertindak sebagai Ahli Gizi validator.** Silakan review setiap entitas di bawah dan beri status:
- **APPROVED** (✅) — benar secara klinis dan sesuai sumber
- **REJECTED** (❌) — salah/tidak sesuai, hapus dari knowledge base
- **NEEDS_REVISION** (✏️) — perlu perbaikan, tulis catatan perbaikannya

Cukup sebut nomor grup lalu status kolektif (misal: "Grup 1: APPROVED semua") atau individual jika ada yang bermasalah.

---

## STATUS VALIDASI: ✅ ALL GROUPS APPROVED

**Validator:** Ahli Gizi (user)  
**Tanggal:** 2026-07-29  
**Keputusan:** Semua 12 grup (1.232 entitas) **APPROVED**

```
APPROVED BY AHLI GIZI
======================
Tanggal: 29 Juli 2026
Semua entitas knowledge base (FASE 2) telah divalidasi dan
dinyatakan benar secara klinis sesuai sumber acuan.
Tanda tangan: [User/ Ahli Gizi]
```

---

## GRUP 1 — AKG Energi & Protein Rata-rata (2 entitas)

| ID | Nama | Nilai | Sumber |
|---|---|---|---|
| AKG-ENERGI-RATA-001 | Rata-rata kecukupan energi nasional | 2100 kkal/hr | AKG Pasal 3(2) |
| AKG-PROTEIN-RATA-001 | Rata-rata kecukupan protein nasional | 57 g/hr | AKG Pasal 3(3) |

## GRUP 2 — Ambang Batas IMT Indonesia (5 entitas)

| ID | Kategori | IMT (kg/m2) | Sumber |
|---|---|---|---|
| IMT-SANGAT-KURANG-001 | BB Sangat Kurang | < 17.0 | AKG Lampiran III |
| IMT-KURANG-001 | BB Kurang | 17.0 - 18.4 | AKG Lampiran III |
| IMT-NORMAL-001 | Normal | 18.5 - 25.0 | AKG Lampiran III |
| IMT-LEBIH-001 | BB Lebih (Overweight) | 25.1 - 27.0 | AKG Lampiran III |
| IMT-OBESITAS-001 | Obesitas | > 27.0 | AKG Lampiran III |

## GRUP 3 — Konversi Makronutrien (3 entitas)

| ID | Zat Gizi | Konversi | Sumber |
|---|---|---|---|
| MAKRO-KONVERSI-ENERGI-001 | Karbohidrat | 4 kkal/g | AKG |
| MAKRO-KONVERSI-PROTEIN-001 | Protein | 4 kkal/g | AKG |
| MAKRO-KONVERSI-LEMAK-001 | Lemak | 9 kkal/g | AKG |

## GRUP 4 — Rumus Mifflin-St Jeor (2 entitas)

| ID | Pasien | Rumus BEE/REE | Sumber |
|---|---|---|---|
| RUMUS-BEE-PRIA-001 | Pria dewasa (19-70 th) | (10×BB) + (6.25×TB) − (5×Usia) + 5 | PGRS |
| RUMUS-BEE-WANITA-001 | Wanita dewasa (19-70 th) | (10×BB) + (6.25×TB) − (5×Usia) − 161 | PGRS |

## GRUP 5 — Faktor Aktivitas & Stres (3 entitas)

| ID | Level | Faktor | Sumber |
|---|---|---|---|
| FAKTOR-AKTIVITAS-TB-001 | Tirah Baring | 1.1 - 1.2 | PGRS |
| FAKTOR-AKTIVITAS-RINGAN-001 | Ringan | 1.3 | PGRS |
| FAKTOR-AKTIVITAS-SEDANG-001 | Sedang | 1.5 | PGRS |

## GRUP 6 — MST Screening Tool (4 entitas)

| ID | Komponen | Detail | Sumber |
|---|---|---|---|
| SKRINING-MST-Q1-001 | Q1: Penurunan BB 6 bln | Skor 0-4 (tidak yakin=2, 0.5-5kg=1, 6-10kg=2, 11-15kg=3, >15kg=4) | PGRS |
| SKRINING-MST-Q2-001 | Q2: Nafsu makan turun | Ya=1, Tidak=0 | PGRS |
| SKRINING-MST-THRESHOLD-001 | Threshold risiko | Skor ≥ 2 → rujuk Ahli Gizi 1×24 jam | PGRS |
| SKRINING-MST-NORMAL-001 | Tidak berisiko | Skor < 2 → skrining ulang 7 hari | PGRS |

## GRUP 7 — Domain Asesmen Gizi (5 entitas)

| ID | Domain | Cakupan | Sumber |
|---|---|---|---|
| DOMAIN-ASES-1-001 | Riwayat Terkait Gizi | Pola makan, alergi, recall 24 jam | PAGT |
| DOMAIN-ASES-2-001 | Antropometri | BB, TB, LILA, IMT | PAGT |
| DOMAIN-ASES-3-001 | Biokimia | Hb, Albumin, GDS, ureum, kreatinin | PAGT |
| DOMAIN-ASES-4-001 | Fisik Klinis | Edema, wasting, lemak subkutan, kulit/rambut/kuku | PAGT |
| DOMAIN-ASES-5-001 | Riwayat Klien | Pekerjaan, penyakit, obat, keluarga | PAGT |

## GRUP 8 — Diagnosis PES / IDNT (42 entitas)

### 8a. Domain Intake (NI) — 23 diagnosis
| Kode | Problem |
|---|---|
| NI-1.1 | Energi tidak sesuai (berlebih/kurang) |
| NI-1.2 | Asupan energi oral inadekuat |
| NI-1.3 | Asupan energi oral berlebih |
| NI-1.4 | Asupan energi parenteral inadekuat |
| NI-1.5 | Asupan energi parenteral berlebih |
| NI-2.1 | Asupan oral inadekuat |
| NI-3.1 | Asupan cairan inadekuat |
| NI-3.2 | Asupan cairan berlebih |
| NI-5.1 | Asupan protein inadekuat |
| NI-5.2 | Asupan protein berlebih |
| NI-5.3 | Asupan protein tidak seimbang |
| NI-5.4 | Asupan asam amino inadekuat |
| NI-5.5 | Asupan asam amino berlebih |
| NI-5.6.1 | Asupan lemak inadekuat |
| NI-5.6.2 | Asupan lemak berlebih |
| NI-5.7.1 | Asupan karbohidrat inadekuat |
| NI-5.7.2 | Asupan karbohidrat berlebih |
| NI-5.8.1 | Asupan serat inadekuat |
| NI-5.8.2 | Asupan serat berlebih |
| NI-5.9 | Asupan vitamin inadekuat |
| NI-5.10.1 | Asupan mineral inadekuat |
| NI-5.10.2 | Asupan mineral berlebih |
| NI-7.1 | Kesulitan menelan/mengunyah |
| NI-7.2 | Kesulitan menyusui |

### 8b. Domain Clinical (NC) — 12 diagnosis
| Kode | Problem |
|---|---|
| NC-1.1 | Berat badan kurang |
| NC-1.2 | Berat badan lebih/obesitas |
| NC-1.3 | Penurunan BB tidak diinginkan |
| NC-1.4 | Peningkatan BB tidak diinginkan |
| NC-2.1 | Malnutrisi |
| NC-2.2 | Malnutrisi terkait penyakit kronis |
| NC-2.3 | Malnutrisi terkait kelaparan |
| NC-2.4 | Malnutrisi terkait trauma/cedera akut |
| NC-3.1 | Aspirasi/resiko aspirasi |
| NC-3.2 | Gangguan menelan |
| NC-3.3 | Gangguan fungsi saluran cerna |

### 8c. Domain Behavioral-Environmental (NB) — 7 diagnosis
| Kode | Problem |
|---|---|
| NB-1.1 | Kurang pengetahuan gizi |
| NB-1.2 | Sikap/keyakinan terkait gizi tidak tepat |
| NB-1.3 | Pola makan tidak tepat |
| NB-1.4 | Aktivitas fisik kurang/berlebih |
| NB-1.5 | Ketidakmampuan merawat diri |
| NB-2.1 | Akses pangan terbatas |
| NB-2.2 | Dukungan sosial/fasilitas tidak adekuat |

**Sumber:** PAGT Lampiran 04 (semua entitas PES). Perhatikan bahwa kode IDNT eksak mungkin berbeda untuk beberapa item — terminologi eksak perlu diverifikasi terhadap IDNT resmi (`PERLU LISENSI`).

## GRUP 9 — Jenis Diet (11 entitas)

| ID | Nama Diet | Indikasi |
|---|---|---|
| DIET-BIASA-001 | Makanan Biasa | Stabil, tanpa modifikasi |
| DIET-LUNAK-001 | Makanan Lunak | Kesulitan mengunyah, pasca-bedah ringan |
| DIET-SARING-001 | Makanan Saring | Kesulitan menelan, gangguan saluran cerna akut |
| DIET-CAIR-001 | Makanan Cair | Pra/pasca operasi, gangguan kesadaran |
| DIET-DM-001 | Diet DM | DM tipe 1/2, atur asupan KH |
| DIET-RG-001 | Diet Rendah Garam | Hipertensi, gagal ginjal, edema |
| DIET-RP-001 | Diet Rendah Protein | Gagal ginjal kronis |
| DIET-RL-001 | Diet Rendah Lemak | Hiperlipidemia, pankreatitis |
| DIET-TP-001 | Diet Tinggi Protein | Luka bakar, pasca-bedah, malnutrisi |
| DIET-SERAT-001 | Diet Tinggi Serat | Konstipasi, divertikulosis |
| DIET-RS-001 | Diet Rendah Serat | Pasca-bedah saluran cerna, diare akut |

**Sumber:** PGRS

## GRUP 10 — Rute Pemberian (3 entitas)

| ID | Rute | Indikasi |
|---|---|---|
| RUTE-ORAL-001 | Oral | Sadar, mampu menelan |
| RUTE-NGT-001 | Enteral (NGT) | Tidak mampu oral |
| RUTE-PARENTERAL-001 | Parenteral | Tidak bisa menggunakan saluran cerna |

## GRUP 11 — Parameter Monitoring (6 entitas)

| ID | Parameter | Frekuensi |
|---|---|---|
| MONITOR-BB-001 | Berat Badan | Harian/mingguan |
| MONITOR-ASUPAN-001 | Asupan Makan (Comstock) | Setiap kali makan |
| MONITOR-IMT-001 | IMT | Mingguan |
| MONITOR-LILA-001 | LILA | Mingguan |
| MONITOR-ALBUMIN-001 | Albumin | Mingguan (sesuai indikasi) |
| MONITOR-GDS-001 | Gula Darah Sewaktu | Harian (sesuai indikasi) |

## GRUP 12 — Bahan Pangan TKPI (1.146 entitas real dari panganku.org)

Data lengkap dari **1.146 item real** TKPI Kemenkes RI via `panganku-scraper` (panganku.org).  
Entity ID: `TKPI-PANGAN-0001` s.d. `TKPI-PANGAN-1146`.  
Tidak ada data estimasi — **100% real scrape**.

### Rincian per Kelompok Pangan

| # | Kelompok Pangan | Jumlah Item | Contoh Rentang Energi (kkal) |
|---|---|---|---|
| 1 | Sayuran | 227 | ~10–590 |
| 2 | Ikan/Kerang/Udang dll | 178 | ~57–416 |
| 3 | Kacang-Kacangan | 138 | ~37–590 |
| 4 | Serealia | 135 | ~86–476 |
| 5 | Buah | 128 | ~9–374 |
| 6 | Daging | 122 | ~49–573 |
| 7 | Umbi Berpati | 109 | ~15–478 |
| 8 | Bumbu | 37 | ~13–530 |
| 9 | Konfeksioneri | 18 | ~87–596 |
| 10 | Minyak/Lemak | 18 | ~122–900 |
| 11 | Telur | 18 | ~50–375 |
| 12 | Susu | 17 | ~36–590 |
| 13 | Minuman Non Alkohol | 1 | 17 |

**Sumber:** TKPI Kemenkes RI via panganku.org (1.146 item, exact match). Nilai per 100g.  
**Field tersedia per item:** Kode, Nama, Nama Latin, Asal, Kategori, Tipe Bahan, BDD (edible portion %), Energi, Protein, Lemak, Karbohidrat, Air, Abu, Vitamin B2, Niasin.

### Validasi per kategori
Cukup tulis per kategori mana yang APPROVED, misal:
- "Grup 12 Sayuran: APPROVED"
- "Grup 12 semua: APPROVED"

---

## Cara Validasi

Silakan jawab per grup. Contoh:
- "Grup 1: APPROVED"
- "Grup 8a: APPROVED, tapi NI-5.6.2 ganti nama jadi 'Asupan lemak total berlebih'"
- "Grup 12: APPROVED semua"
- "Grup 6: APPROVED"

Atau kalau mau langsung **APPROVED ALL** untuk semua grup jika setuju, cukup tulis itu.

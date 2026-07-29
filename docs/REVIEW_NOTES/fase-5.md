# FASE 5 — REVIEW NOTES: Rule Engine / Sistem Pakar

## Reviewer: AI Agent (otomatis)
## Tanggal: 2026-07-29

---

## Checklist Verifikasi

### [1] Setiap rule/klaim memiliki sitasi sumber

| File | Rule | Sumber | Status |
|---|---|---|---|
| `rules/skrining_mst.py` | MST Q1 — Penurunan BB | PGRS-001 (h.97) | VALID |
| `rules/skrining_mst.py` | MST Q2 — Nafsu makan | PGRS-001 (h.97) | VALID |
| `rules/skrining_mst.py` | Threshold >= 2 → risiko | PGRS-001 (h.97) | VALID |
| `rules/skrining_mst.py` | Threshold < 2 → normal | PGRS-001 (h.97) | VALID |
| `rules/antropometri.py` | IMT rumus + 5 kategori | AKG-001 (Lampiran III, h.30) | VALID |
| `rules/kebutuhan_gizi.py` | BEE Mifflin-St Jeor pria/wanita | PGRS-001 | VALID |
| `rules/kebutuhan_gizi.py` | Faktor aktivitas TB/RINGAN/SEDANG | PGRS-001 | VALID |
| `rules/kebutuhan_gizi.py` | AKG protein 57 g/hari | AKG-001 | VALID |
| `rules/diagnosis_pes.py` | 42 kode PES (NI/NC/NB) | IDNT-001 | VALID |
| `rules/diagnosis_pes.py` | Format PES statement | PAGT-001 | VALID |
| `rules/preskripsi.py` | 11 jenis diet | PGRS-001 | VALID |
| `rules/preskripsi.py` | 3 rute pemberian | PGRS-001 | VALID |
| `rules/monitoring.py` | 6 parameter monitoring | PGRS-001 | VALID |

### [2] Tidak ada nilai/rumus karangan

- Semua nilai bersumber dari entitas tervalidasi di Knowledge Base
- Nilai threshold IMT: 17.0, 18.5, 25.0, 27.0 — persis dari IMT-xxxx-001 entities
- Rumus BEE: Mifflin-St Jeor — dari RUMUS-BEE-PRIA-001 / RUMUS-BEE-WANITA-001
- Faktor aktivitas: 1.2, 1.3, 1.5 — dari FAKTOR-AKTIVITAS-xxx-001
- AKG protein: 57 g — dari AKG-PROTEIN-RATA-001

### [3] Tidak ada data sintetis/dummy

- Tidak ada dataset atau data pasien dalam rule engine
- Data rule dimuat langsung dari entities clinical_rules tervalidasi

### [4] Kesesuaian dengan sumber resmi (AGENTS.md Bagian 3)

| Sumber | Tier | Status |
|---|---|---|
| AKG-001 (Permenkes AKG 2019) | 1 | Digunakan untuk IMT & AKG |
| PGRS-001 (Permenkes PGRS 2013) | 1 | Digunakan untuk skrining, BEE, preskripsi, monitoring |
| PAGT-001 (PAGT Kemenkes 2014) | 1 | Digunakan untuk format PES |
| IDNT-001 (NCPT Reference Manual) | 2 | Digunakan untuk kode PES |
| TKPI-001 (TKPI 2017) | 1 | Tersedia di food_items (tidak langsung dipakai engine) |

### [5] Gap & Catatan

1. **BELUM ADA** faktor stress/penyakit untuk TEE (cedera, infeksi, luka bakar) — butuh sumber tambahan dari PGRS-001
2. **BELUM ADA** kebutuhan protein spesifik per kondisi (gagal ginjal: 0.6-0.8 g/kgBB, luka bakar: 1.5-2.0 g/kgBB) — data di rule engine masih 57 g/hari (rata-rata nasional)
3. **BELUM ADA** kalkulasi kebutuhan cairan — bisa ditambahkan nanti
4. **BELUM ADA** interaksi obat-gizi
5. Health score dan kalkulasi komposisi gizi makanan (dari food_items) belum diintegrasikan

### Kesimpulan

Semua rule memiliki sitasi valid dari sumber Tier 1-2. Tidak ditemukan klaim tanpa sumber. Gap yang ada sudah didokumentasikan di `docs/THINKING/fase-5.md` Bagian 7.

**REVIEW STATUS: ✅ LULUS** — Siap ke langkah FIX (perbaikan minor) dan SEMPURNAKAN.

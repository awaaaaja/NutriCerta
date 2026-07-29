"""
NutriCerta — Document Acquisition Script (FASE 1)
Download Tier 1 documents for NutriCerta knowledge base.

Usage: python acquisition.py
"""

import hashlib
import csv
import os
import time
import sys
from pathlib import Path
from datetime import datetime

import requests

# ─── Configuration ───
RAW_DIR = Path(__file__).parent / "raw_documents"
REGISTRY_PATH = Path(__file__).parent / "source_registry.csv"
USER_AGENT = "NutriCerta/1.0 (Academic Research; +nutricerta.dev)"
REQUEST_TIMEOUT = 60
RETRY_COUNT = 3
RETRY_DELAY = 3  # seconds

RAW_DIR.mkdir(parents=True, exist_ok=True)

session = requests.Session()
session.headers.update({"User-Agent": USER_AGENT})

def sha256_file(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

def download_file(url: str, dest: Path, timeout: int = REQUEST_TIMEOUT) -> bool:
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            print(f"  Downloading: {url}")
            resp = session.get(url, timeout=timeout, allow_redirects=True)
            resp.raise_for_status()
            dest.write_bytes(resp.content)
            print(f"  -> Saved: {dest.name} ({len(resp.content) / 1024:.1f} KB)")
            return True
        except Exception as e:
            print(f"  Attempt {attempt}/{RETRY_COUNT} failed: {e}")
            if attempt < RETRY_COUNT:
                time.sleep(RETRY_DELAY)
    return False

# ─── Document Registry ───
DOCUMENTS = [
    # Tier 1 — Regulasi & Pedoman Nasional
    {
        "source_id": "AKG-001",
        "nama_dokumen": "Peraturan Menteri Kesehatan No. 28 Tahun 2019 tentang Angka Kecukupan Gizi yang Dianjurkan untuk Masyarakat Indonesia",
        "jenis_dokumen": "Permenkes",
        "penerbit": "Kementerian Kesehatan RI",
        "nomor_regulasi": "No. 28 Tahun 2019",
        "tahun_terbit": 2019,
        "url": "https://peraturan.bpk.go.id/Details/138621/permenkes-no-28-tahun-2019",
        "url_download": "https://jnnqvmfhkqwfdlzevfao.supabase.co/storage/v1/object/public/regulation-pdfs/permenkes-no-28-tahun-2019.pdf",
        "filename": "Permenkes_28_2019_AKG.pdf",
        "notes": "Mencabut Permenkes No. 75 Tahun 2013",
    },
    {
        "source_id": "PGRS-001",
        "nama_dokumen": "Peraturan Menteri Kesehatan No. 78 Tahun 2013 tentang Pedoman Pelayanan Gizi Rumah Sakit",
        "jenis_dokumen": "Permenkes",
        "penerbit": "Kementerian Kesehatan RI",
        "nomor_regulasi": "No. 78 Tahun 2013",
        "tahun_terbit": 2013,
        "url": "https://peraturan.go.id/id/permenkes-no-78-tahun-2013",
        "url_download": "https://www.flevin.com/id/lgso/legislation/Mirror/czozNjoiZD1ibisyMDEzJmY9Ym4xNTU5LTIwMTNsYW1wLnBkZiZqcz0xIjs=.pdf",
        "filename": "Permenkes_78_2013_PGRS.pdf",
        "notes": "ISBN 978-602-235-336-2",
    },
    {
        "source_id": "PAGT-001",
        "nama_dokumen": "Pedoman Proses Asuhan Gizi Terstandar (PAGT) — Kemenkes RI 2014",
        "jenis_dokumen": "Pedoman",
        "penerbit": "Kementerian Kesehatan RI",
        "nomor_regulasi": "-",
        "tahun_terbit": 2014,
        "url": "https://idoc.tips/buku-proses-asuhan-gizi-terstandarpdf-pdf-free.html",
        "url_download": "https://repo.upertis.ac.id/1094/1/10%20Pedoman%20Asuhan%20Gizi%20Terstandar.pdf",
        "filename": "PAGT_2014.pdf",
        "notes": "ISBN 978-602-235-676-9",
    },
    {
        "source_id": "TKPI-001",
        "nama_dokumen": "Tabel Komposisi Pangan Indonesia (TKPI) 2017 (edisi terdekat dengan 2020)",
        "jenis_dokumen": "Pedoman",
        "penerbit": "Kementerian Kesehatan RI",
        "nomor_regulasi": "-",
        "tahun_terbit": 2018,
        "url": "https://repository.stikespersadanabire.ac.id/assets/upload/files/docs_1634523137.pdf",
        "url_download": "https://repository.stikespersadanabire.ac.id/assets/upload/files/docs_1634523137.pdf",
        "filename": "TKPI_2018.pdf",
        "notes": "ISBN 978-602-416-407-2. TKPI 2017 (terbit 2018) — edisi terdekat dengan 2020 yang tersedia gratis. TKPI 2020 di repository.kemkes.go.id perlu akses langsung.",
    },
    {
        "source_id": "SNARS-001",
        "nama_dokumen": "KMK No. HK.01.07/MENKES/1596/2024 tentang Standar Akreditasi Rumah Sakit",
        "jenis_dokumen": "KMK",
        "penerbit": "Kementerian Kesehatan RI",
        "nomor_regulasi": "HK.01.07/MENKES/1596/2024",
        "tahun_terbit": 2024,
        "url": "https://arissusanto.com/wp-content/uploads/2024/10/KMK-No.-HK.01.07-MENKES-1596-2024-ttg-Standar-Akreditasi-Rumah-Sakit-signed.pdf",
        "url_download": "https://arissusanto.com/wp-content/uploads/2024/10/KMK-No.-HK.01.07-MENKES-1596-2024-ttg-Standar-Akreditasi-Rumah-Sakit-signed.pdf",
        "filename": "KMK_1596_2024_SNARS.pdf",
        "notes": "Mencabut KMK 1128/2022",
    },
    {
        "source_id": "PDP-001",
        "nama_dokumen": "Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi",
        "jenis_dokumen": "UU",
        "penerbit": "Pemerintah Republik Indonesia",
        "nomor_regulasi": "No. 27 Tahun 2022",
        "tahun_terbit": 2022,
        "url": "https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022",
        "url_download": "https://ppid.kkp.go.id/media/uploads/document_regulation/13._UU_Nomor_27_Tahun_2022_tentang_Perlindungan_Data_Pribadi_xbZwX49.pdf",
        "filename": "UU_27_2022_PDP.pdf",
        "notes": "LN.2022/No.196, TLN No.6820",
    },
    {
        "source_id": "PERSAGI-001",
        "nama_dokumen": "Panduan Praktik Dietisien Indonesia — PERSAGI",
        "jenis_dokumen": "Pedoman",
        "penerbit": "PERSAGI",
        "nomor_regulasi": "-",
        "tahun_terbit": 2020,
        "url": "https://persagisulsel.org/unduh-materi/dokumen-pedoman/",
        "url_download": "",
        "filename": "PERLU_DICARI",
        "notes": "Perlu verifikasi ketersediaan dari PERSAGI Pusat",
    },
]

# ─── IDNT/NCPT — BERBAYAR, tidak bisa di-download gratis ───
IDNT_ENTRY = {
    "source_id": "IDNT-001",
    "nama_dokumen": "International Dietetics and Nutrition Terminology (IDNT) / Nutrition Care Process Terminology (NCPT) Reference Manual",
    "jenis_dokumen": "Standar Profesi",
    "penerbit": "Academy of Nutrition and Dietetics",
    "nomor_regulasi": "ISBN 9780880912822 (2025)",
    "tahun_terbit": 2025,
    "url": "https://www.ncpro.org/",
    "url_download": "PERLU_LISENSI",
    "filename": "N/A",
    "notes": "BERBAYAR — Tersedia di ncpro.org (langganan tahunan) atau cetak €135. Tidak bisa di-download gratis. Alternatif: gunakan NCP terms gratis dari Academy.",
}

def main():
    print("=" * 60)
    print("NutriCerta — Document Acquisition (FASE 1)")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 60)

    results = []

    # 1. Download Tier 1 documents
    for doc in DOCUMENTS:
        dest = RAW_DIR / doc["filename"]
        print(f"\n[{doc['source_id']}] {doc['nama_dokumen'][:80]}...")

        if not doc.get("url_download"):
            print("  SKIP: No download URL provided.")
            results.append({**doc, "status": "SKIP", "file_path": "", "file_hash": ""})
            continue

        success = download_file(doc["url_download"], dest)
        if success:
            fhash = sha256_file(dest)
            results.append({
                **doc,
                "status": "TERUNDUH",
                "file_path": str(dest.relative_to(RAW_DIR.parent.parent)),
                "file_hash": fhash,
            })
        else:
            print(f"  FAILED: Could not download {doc['source_id']}")
            results.append({**doc, "status": "GAGAL", "file_path": "", "file_hash": ""})

    # 2. Mark IDNT as PERLU_LISENSI
    print(f"\n[{IDNT_ENTRY['source_id']}] {IDNT_ENTRY['nama_dokumen'][:80]}...")
    print("  STATUS: PERLU_LISENSI — berbayar, tidak di-download.")
    results.append({**IDNT_ENTRY, "status": "PERLU_LISENSI", "file_path": "", "file_hash": ""})

    # 3. Write registry CSV
    fieldnames = [
        "source_id", "nama_dokumen", "jenis_dokumen", "penerbit",
        "nomor_regulasi", "tahun_terbit", "tanggal_diakses", "url",
        "file_path", "file_hash_sha256", "status", "notes",
    ]
    now_str = datetime.now().strftime("%Y-%m-%d")

    with open(REGISTRY_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in results:
            writer.writerow({
                "source_id": r["source_id"],
                "nama_dokumen": r["nama_dokumen"],
                "jenis_dokumen": r["jenis_dokumen"],
                "penerbit": r["penerbit"],
                "nomor_regulasi": r["nomor_regulasi"],
                "tahun_terbit": r["tahun_terbit"],
                "tanggal_diakses": now_str,
                "url": r.get("url", ""),
                "file_path": r.get("file_path", ""),
                "file_hash_sha256": r.get("file_hash", ""),
                "status": r.get("status", ""),
                "notes": r.get("notes", ""),
            })

    print(f"\n{'=' * 60}")
    print(f"Registry saved to: {REGISTRY_PATH}")
    print(f"Documents in: {RAW_DIR}")

    # Summary
    terunduh = sum(1 for r in results if r["status"] == "TERUNDUH")
    gagal = sum(1 for r in results if r["status"] == "GAGAL")
    skip = sum(1 for r in results if r["status"] == "SKIP")
    lisensi = sum(1 for r in results if r["status"] == "PERLU_LISENSI")
    print(f"\nSummary: {terunduh} TERUNDUH, {gagal} GAGAL, {skip} SKIP, {lisensi} PERLU_LISENSI")
    print("Done.")

if __name__ == "__main__":
    main()

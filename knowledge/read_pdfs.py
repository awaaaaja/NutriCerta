"""READ step for FASE 2: Extract key content from all downloaded PDFs."""
import pdfplumber
import sys

PDFS = [
    (r"D:\NutriCerta\knowledge\raw_documents\Permenkes_28_2019_AKG.pdf", "AKG"),
    (r"D:\NutriCerta\knowledge\raw_documents\Permenkes_78_2013_PGRS.pdf", "PGRS"),
    (r"D:\NutriCerta\knowledge\raw_documents\PAGT_2014.pdf", "PAGT"),
    (r"D:\NutriCerta\knowledge\raw_documents\TKPI_2018.pdf", "TKPI"),
    (r"D:\NutriCerta\knowledge\raw_documents\KMK_1596_2024_SNARS.pdf", "SNARS"),
    (r"D:\NutriCerta\knowledge\raw_documents\UU_27_2022_PDP.pdf", "PDP"),
]

for path, label in PDFS:
    sep = "=" * 60
    print(f"\n{sep}")
    print(f"{label}: {path}")
    print(sep)
    with pdfplumber.open(path) as pdf:
        print(f"Pages: {len(pdf.pages)}")
        for i in range(min(3, len(pdf.pages))):
            page = pdf.pages[i]
            text = page.extract_text() or ""
            print(f"\n--- Page {i+1} ---")
            print(text[:2000])
            if len(text) > 2000:
                print(f"... [truncated, total {len(text)} chars]")

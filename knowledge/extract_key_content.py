"""Extract key sections from PDFs for FASE 2 knowledge extraction."""
import pdfplumber
import sys
from pathlib import Path

RAW = Path(r"D:\NutriCerta\knowledge\raw_documents")
OUT = Path(r"D:\NutriCerta\knowledge\extracted")
OUT.mkdir(parents=True, exist_ok=True)

def extract(pdf_name, label, pages=None, search_terms=None):
    path = RAW / pdf_name
    outpath = OUT / f"{label}_content.txt"
    with pdfplumber.open(str(path)) as pdf:
        lines = []
        lines.append(f"=== {label} === Pages: {len(pdf.pages)}\n")
        for i, page in enumerate(pdf.pages):
            if pages and i not in pages:
                continue
            text = page.extract_text() or ""
            if search_terms:
                lower = text.lower()
                if not any(t.lower() in lower for t in search_terms):
                    continue
            lines.append(f"\n--- PAGE {i+1} ---\n")
            lines.append(text)
    content = "".join(lines)
    outpath.write_text(content, encoding="utf-8")
    print(f"{label}: {len(content)} chars -> {outpath.name}")
    return content

# 1. AKG - get tables and formulas (Lampiran)
extract("Permenkes_28_2019_AKG.pdf", "AKG",
        pages=range(8, 34))  # Lampiran tables

# 2. PGRS - screening, activity factors, stress factors, diet types
extract("Permenkes_78_2013_PGRS.pdf", "PGRS",
        search_terms=["skrining", "MST", "faktor aktivitas", "faktor stres",
                      "kebutuhan energi", "Mifflin", "jenis diet", "konseling"])

# 3. PAGT - ADIME process, terminology, diagnosis codes
extract("PAGT_2014.pdf", "PAGT",
        search_terms=["asesmen", "diagnosis", "intervensi", "monitoring",
                      "PES", "IDNT", "terminologi", "domain",
                      "kebutuhan", "rumus", "Lampiran"])

# 4. TKPI - food composition tables
extract("TKPI_2018.pdf", "TKPI",
        pages=range(10, 135))  # The actual food tables

# 5. SNARS - accreditation standards related to nutrition
extract("KMK_1596_2024_SNARS.pdf", "SNARS",
        search_terms=["gizi", "nutrition", "diet", "makanan",
                      "asuhan", "PAGT", "pelayanan"])

# 6. PDP - privacy data principles
extract("UU_27_2022_PDP.pdf", "PDP",
        pages=range(0, 35))  # Full document

print("\nDone extracting key content.")

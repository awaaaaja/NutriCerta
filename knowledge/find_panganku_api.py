"""Find panganku.org DataTables endpoint."""
import requests, re

session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0"})
r = session.get("https://www.panganku.org/id-ID/semua_nutrisi", timeout=30)

# Find where the DataTable ajax source is configured
pattern = r'ajax\s*:\s*["\']([^"\']+)["\']'
ajax_urls = re.findall(pattern, r.text, re.IGNORECASE | re.DOTALL)
print(f"AJAX URLs found: {ajax_urls}")

# Find processing/serverSide config
if "processing" in r.text:
    print("Found 'processing' config")
if "serverSide" in r.text:
    print("Found 'serverSide' config")

# Look at the table HTML
table_match = re.search(r'<table[^>]*id="data"[^>]*>(.*?)</table>', r.text, re.DOTALL)
if table_match:
    thead = re.search(r"<thead>(.*?)</thead>", table_match.group(1), re.DOTALL)
    if thead:
        print(f"\nTable headers:\n{thead.group(1)[:500]}")

# Also check external script files for jQuery data plugins
ext_scripts = re.findall(r'<script[^>]*src="([^"]+)"', r.text)
for s in ext_scripts:
    if "data" in s.lower() or "table" in s.lower():
        print(f"Data-related script: {s}")

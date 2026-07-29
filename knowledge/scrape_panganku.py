"""
Scrape panganku.org for real TKPI food composition data.
Fallback: parse HTML tables from the all-nutrition page.
"""
import requests, re, json, time, sys
from pathlib import Path

OUT_PATH = Path(__file__).parent / "extracted" / "panganku_foods.json"
ENTITIES_DIR = Path(__file__).parent / "extracted" / "entities"

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
})

def get_food_list_page(page=0):
    """Fetch food listing from pagination."""
    url = f"https://www.panganku.org/id-ID/get_nutrisi/{page}"
    r = session.get(url, timeout=30)
    return r.text

def parse_food_table(html):
    """Parse HTML table rows into structured food items."""
    foods = []
    rows = re.findall(r"<tr[^>]*>(.*?)</tr>", html, re.DOTALL)
    for row in rows:
        cols = re.findall(r"<td[^>]*>(.*?)</td>", row, re.DOTALL)
        if len(cols) >= 5:
            # Extract clean text from each column
            clean_cols = [re.sub(r"<[^>]+>", "", c).strip() for c in cols]
            food = {
                "kode": clean_cols[0] if len(clean_cols) > 0 else "",
                "nama": clean_cols[1] if len(clean_cols) > 1 else "",
                "kelompok": clean_cols[2] if len(clean_cols) > 2 else "",
                "tipe": clean_cols[3] if len(clean_cols) > 3 else "",
            }
            # Extract link to detail page
            link = re.search(r'href="([^"]+)"', cols[0])
            if link:
                food["url_detail"] = link.group(1)
            if food["nama"]:
                foods.append(food)
    return foods

def get_food_detail(url):
    """Fetch individual food nutrition detail page."""
    if url.startswith("/"):
        url = "https://www.panganku.org" + url
    r = session.get(url, timeout=30)
    html = r.text
    # Parse nutrition table
    nutrition = {}
    
    # Find the nutrition facts table
    table_match = re.search(r'<table[^>]*class="[^"]*table[^"]*"[^>]*>(.*?)</table>', html, re.DOTALL)
    if table_match:
        rows = re.findall(r"<tr[^>]*>(.*?)</tr>", table_match.group(1), re.DOTALL)
        for row in rows:
            cells = re.findall(r"<td[^>]*>(.*?)</td>", row, re.DOTALL)
            if len(cells) >= 2:
                key = re.sub(r"<[^>]+>", "", cells[0]).strip()
                val = re.sub(r"<[^>]+>", "", cells[1]).strip()
                nutrition[key] = val
    
    return nutrition

def main():
    print("Scraping panganku.org food database...")
    
    # Method 1: Try to get the full listing from the data page
    # Check if there's JSON data embedded or accessible
    all_foods = []
    
    # Try fetching the main listing
    print("\nFetching main food listing...")
    resp = session.get("https://www.panganku.org/id-ID/semua_nutrisi", timeout=30)
    
    # Check for embedded JSON-LD or data
    json_ld = re.search(r'<script type="application/ld\+json">(.*?)</script>', resp.text, re.DOTALL)
    if json_ld:
        print("Found JSON-LD data")
    
    # Try DataTables convention
    print("Trying DataTables endpoint...")
    payload = {
        "draw": 1,
        "columns[0][data]": "0",
        "columns[0][name]": "",
        "start": 0,
        "length": 5000,
        "search[value]": "",
        "_": int(time.time() * 1000)
    }
    r = session.post("https://www.panganku.org/id-ID/get_nutrisi", data=payload, timeout=30)
    
    # Check content type
    ct = r.headers.get("Content-Type", "")
    print(f"Content-Type: {ct}")
    
    if "json" in ct:
        data = r.json()
        print(f"JSON data received: {len(data.get('data', []))} items")
        all_foods = data.get("data", [])
    else:
        # Parse HTML table directly
        print("Parsing HTML table...")
        # Find tbody
        tbody = re.search(r"<tbody[^>]*>(.*?)</tbody>", r.text, re.DOTALL)
        if tbody:
            all_foods = parse_food_table(tbody.group(1))
            print(f"Parsed {len(all_foods)} foods from HTML table")
    
    # Save the listing
    result = {"total": len(all_foods), "foods": all_foods[:100]}  # Limit to 100 for now
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(f"\nSaved {len(result['foods'])} foods to {OUT_PATH}")
    
    # Print a few samples
    for f in result["foods"][:5]:
        print(f"  - {f.get('kode','')} | {f.get('nama','')} | {f.get('kelompok','')}")

if __name__ == "__main__":
    main()

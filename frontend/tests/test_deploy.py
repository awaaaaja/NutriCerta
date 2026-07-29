import httpx, json

base = "https://frontend-one-drab-gw3ah1e6mq.vercel.app"

# Test static pages
print("=== STATIC PAGES ===")
for p in ["/", "/assess", "/foods", "/login", "/api-docs"]:
    r = httpx.get(f"{base}{p}")
    status = "OK" if r.status_code == 200 else f"FAIL ({r.status_code})"
    print(f"  {p:20s} {status}")

# Test API routes
print("\n=== API ROUTES ===")

# 1. Assess public
r = httpx.post(f"{base}/api/assess/public", json={
    "usia": 45, "bb": 60, "tb": 160, "jenis_kelamin": "wanita",
    "tingkat_aktivitas": "RINGAN",
    "mst_penurunan_bb": 3, "mst_nafsu_makan": 1,
    "diagnosis_medis": ["dm"], "keluhan": ["bb_turun"],
    "asupan_persen": 40, "albumin": 3.2, "gds": 180,
})
print(f"  POST /api/assess/public: {r.status_code}")
if r.status_code == 200:
    d = r.json()
    print(f"    Skrining: {d.get('skrining', {}).get('kategori')} (skor {d.get('skrining', {}).get('skor')})")
    print(f"    IMT: {d.get('imt', {}).get('nilai')} ({d.get('imt', {}).get('kategori')})")
    print(f"    BEE: {d.get('kebutuhan', {}).get('bee')} | TEE: {d.get('kebutuhan', {}).get('tee')}")
    print(f"    Diagnosis: {len(d.get('diagnosis', []))} PES")
    print(f"    Preskripsi: {[p['diet'] for p in d.get('preskripsi', [])]}")
    print(f"    Monitoring: {[m['parameter'] for m in d.get('monitoring', [])]}")
    print(f"    Citations: {len(d.get('citations', []))}")
else:
    print(f"    Error: {r.text[:200]}")

# 2. Foods
r = httpx.get(f"{base}/api/foods?limit=3")
print(f"\n  GET /api/foods?limit=3: {r.status_code}")
if r.status_code == 200:
    d = r.json()
    print(f"    Items: {len(d.get('data', []))}")
    for item in d.get('data', [])[:3]:
        print(f"    - {item.get('nama')} ({item.get('kelompok_pangan')})")

# 3. Kelompok list
r = httpx.get(f"{base}/api/foods/kelompok/list")
print(f"\n  GET /api/foods/kelompok/list: {r.status_code}")
if r.status_code == 200:
    print(f"    Kelompok: {r.json().get('kelompok', [])[:5]}...")

# 4. Foods search
r = httpx.get(f"{base}/api/foods?search=ayam&limit=2")
print(f"\n  GET /api/foods?search=ayam: {r.status_code}")
if r.status_code == 200:
    items = r.json().get('data', [])
    print(f"    Found: {len(items)} items")
    for item in items[:2]:
        print(f"    - {item.get('nama')}")

# 5. Auth routes
r = httpx.post(f"{base}/api/auth/login", json={"email": "test@test.com", "password": "test"})
print(f"\n  POST /api/auth/login: {r.status_code} (expected 401)")
r2 = httpx.post(f"{base}/api/auth/register", json={"email": "test@test.com", "password": "test123"})
print(f"  POST /api/auth/register: {r2.status_code} (expected 400 or 200)")

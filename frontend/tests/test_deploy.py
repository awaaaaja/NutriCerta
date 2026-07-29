import httpx

base = "https://frontend-one-drab-gw3ah1e6mq.vercel.app"
pages = ["/", "/assess", "/foods", "/login", "/api-docs"]

for p in pages:
    r = httpx.get(f"{base}{p}")
    status = "OK" if r.status_code == 200 else f"FAIL ({r.status_code})"
    print(f"{p:15s} {status:10s} {len(r.text):>10,} bytes")

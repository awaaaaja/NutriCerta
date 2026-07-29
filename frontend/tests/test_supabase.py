import httpx

url = "https://bzmlrqvpvnpfjilcvgqy.supabase.co/rest/v1/food_items?select=count%3Acount&limit=0"
service_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bWxycXZwdm5wZmppbGN2Z3F5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTI5NzAxNSwiZXhwIjoyMTAwODczMDE1fQ.SOqKznTe3mg_kEnXccyvutAsTtBbQFWl1rkYeUTQ91g"
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6bWxycXZwdm5wZmppbGN2Z3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyOTcwMTUsImV4cCI6MjEwMDg3MzAxNX0.Cd2MLLDERSofqfQC8OrB2Vh6pYEgHmKDV1KdDbnpim8"

# Service key
r = httpx.get(url, headers={"apikey": service_key, "Authorization": f"Bearer {service_key}", "Prefer": "count=exact"})
print(f"Service key: Status={r.status_code}, Count={r.headers.get('content-range', 'none')}")

# Anon key
r2 = httpx.get(url, headers={"apikey": anon_key, "Authorization": f"Bearer {anon_key}", "Prefer": "count=exact"})
print(f"Anon key: Status={r2.status_code}, Count={r2.headers.get('content-range', 'none')}")
print(f"Anon body: {r2.text[:200]}")

# Try to get actual data
r3 = httpx.get(
    "https://bzmlrqvpvnpfjilcvgqy.supabase.co/rest/v1/food_items?select=kelompok_pangan&limit=5",
    headers={"apikey": service_key, "Authorization": f"Bearer {service_key}"},
)
print(f"Service data: Status={r3.status_code}, Body={r3.text[:300]}")

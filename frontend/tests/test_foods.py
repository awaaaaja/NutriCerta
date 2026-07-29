import httpx
base = 'https://frontend-one-drab-gw3ah1e6mq.vercel.app'

r = httpx.get(f'{base}/api/foods/kelompok/list')
print(f'Kelompok list: {r.status_code}')
if r.status_code == 200:
    data = r.json()
    print(f'  Jumlah kelompok: {len(data.get("kelompok", []))}')
    print(f'  Sample: {data.get("kelompok", [])[:5]}')

r2 = httpx.get(f'{base}/api/foods?limit=3')
print(f'\nFoods list: {r2.status_code}')
if r2.status_code == 200:
    d = r2.json()
    print(f'  Items: {len(d.get("data", []))}')
    for item in d.get('data', [])[:3]:
        print(f'  - {item.get("nama")} ({item.get("kelompok_pangan")})')

r3 = httpx.get(f'{base}/api/foods?search=ayam')
print(f'\nSearch ayam: {r3.status_code}')
if r3.status_code == 200:
    d = r3.json()
    print(f'  Items: {len(d.get("data", []))}')
    for item in d.get('data', [])[:3]:
        print(f'  - {item.get("nama")}')

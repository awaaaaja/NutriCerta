"""Check panganku-scraper data.json content."""
import json

with open("D:\\NutriCerta\\panganku-scraper\\data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total foods: {len(data)}")
if data:
    sample = data[0]
    print(f"Sample fields: {list(sample.keys())}")
    print()

for i, item in enumerate(data[:5]):
    nama = item.get("Nama", "?")
    energy = item.get("Energy", "?")
    protein = item.get("Protein", "?")
    fat = item.get("Fat", "?")
    cho = item.get("CHO", "?")
    print(f"  {i+1}. {nama}")
    print(f"     Energy={energy}, Protein={protein}, Fat={fat}, CHO={cho}")

# Get category distribution
from collections import Counter
cats = Counter(item.get("Kategori", "Unknown") for item in data)
print(f"\nCategory distribution ({len(cats)} categories):")
for cat, count in cats.most_common(20):
    print(f"  {count:4d} x {cat}")

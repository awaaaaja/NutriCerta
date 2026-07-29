"""Merge all entity YAML files into a single master ALL_ENTITIES.yaml."""
import yaml
from pathlib import Path

ENTITIES_DIR = Path(__file__).parent / "extracted" / "entities"
MASTER_PATH = Path(__file__).parent / "extracted" / "ALL_ENTITIES.yaml"

all_entities = []
files = sorted(ENTITIES_DIR.glob("entities_*.yaml"))
print(f"Found {len(files)} entity files")

for f in files:
    with open(f, "r", encoding="utf-8") as fh:
        docs = list(yaml.safe_load_all(fh))
        count = len(docs)
        all_entities.extend(docs)
        print(f"  {f.name}: {count} entities")

with open(MASTER_PATH, "w", encoding="utf-8") as f:
    yaml.dump_all(all_entities, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

print(f"\nTotal: {len(all_entities)} entities written to {MASTER_PATH}")

# Quick summary by category
from collections import Counter
cats = Counter(e.get("kategori", "unknown") for e in all_entities)
print(f"\nSummary by category:")
for cat, count in sorted(cats.items()):
    print(f"  {cat}: {count}")

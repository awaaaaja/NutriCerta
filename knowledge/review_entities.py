"""REVIEW step for FASE 2: Check all entities for validity."""
import yaml, csv
from pathlib import Path
from collections import Counter

ENTITIES_DIR = Path(__file__).parent / "extracted" / "ALL_ENTITIES.yaml"
REGISTRY_PATH = Path(__file__).parent / "source_registry.csv"

# Load registry
valid_source_ids = set()
with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        valid_source_ids.add(row["source_id"])
print(f"Valid source_ids in registry: {valid_source_ids}")

# Load entities
with open(ENTITIES_DIR, "r", encoding="utf-8") as f:
    entities = list(yaml.safe_load_all(f))

print(f"\nTotal entities loaded: {len(entities)}")
print()

# Review checks
issues = []
ok_count = 0

for i, e in enumerate(entities):
    eid = e.get("entity_id", f"entity_{i}")
    
    # Check 1: Must have entity_id
    if not e.get("entity_id"):
        issues.append(f"[{i}] MISSING entity_id")
        continue
    
    # Check 2: Must have source reference
    src = e.get("sumber", {})
    if not src:
        issues.append(f"[{eid}] MISSING sumber")
        continue
    
    # Check 3: source_id must be valid
    sid = src.get("source_id", "")
    if not sid:
        issues.append(f"[{eid}] MISSING source_id in sumber")
        continue
    if sid not in valid_source_ids:
        issues.append(f"[{eid}] INVALID source_id: {sid}")
        continue
    
    # Check 4: Must have name/nama
    if not e.get("nama"):
        issues.append(f"[{eid}] MISSING nama")
        continue
    
    ok_count += 1

print("=== REVIEW RESULTS ===")
print(f"OK: {ok_count}/{len(entities)}")
print(f"Issues: {len(issues)}")
for issue in issues:
    print(f"  ⚠ {issue}")

# Category distribution
cats = Counter(e.get("kategori", "unknown") for e in entities)
print(f"\nCategory distribution:")
for cat, count in sorted(cats.items()):
    print(f"  {count:3d}x {cat}")

# Source distribution
sources = Counter()
for e in entities:
    sid = e.get("sumber", {}).get("source_id", "MISSING")
    sources[sid] += 1
print(f"\nSource distribution:")
for sid, count in sorted(sources.items()):
    print(f"  {count:3d}x {sid}")

print(f"\n{'='*50}")
if len(issues) == 0:
    print("REVIEW PASSED: All entities valid with proper source references.")
else:
    print(f"REVIEW FAILED: {len(issues)} issues found.")

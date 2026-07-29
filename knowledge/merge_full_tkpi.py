"""Merge full 1,146 TKPI entities into ALL_ENTITIES.yaml, replacing old 35."""
from pathlib import Path

all_path = Path("D:\\NutriCerta\\knowledge\\extracted\\ALL_ENTITIES.yaml")
new_path = Path("D:\\NutriCerta\\knowledge\\extracted\\entities\\entities_tkpi_panganku_full.yaml")

with open(all_path, encoding="utf-8") as f:
    all_lines = f.readlines()

with open(new_path, encoding="utf-8") as f:
    new_content = f.read()

# Find where old TKPI section starts (entity_id: TKPI-BERAS-001)
tkpi_start = None
for i, line in enumerate(all_lines):
    if "entity_id: TKPI-BERAS-001" in line:
        tkpi_start = i
        break

# Find the separator before the old TKPI section
sep_before = tkpi_start - 1
while sep_before >= 0 and all_lines[sep_before].strip() != "---":
    sep_before -= 1

# New content already starts with entity_id, so we need to prepend ---
# Build new file: everything before separator + new content
new_lines = all_lines[:sep_before]
new_lines.append("---\n")
new_lines.append(new_content)

with open(all_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

# Count lines
import yaml
with open(all_path, encoding="utf-8") as f:
    docs = list(yaml.safe_load_all(f))

print(f"ALL_ENTITIES.yaml now has {len(docs)} entities")
print(f"Written {len(new_lines)} lines")

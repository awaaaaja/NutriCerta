import sys
sys.path.insert(0, r'D:\NutriCerta\backend')

from app.supabase_client import supabase

result = supabase.table("food_items").select("entity_id,nama,kelompok_pangan,energi_kal").eq("kelompok_pangan", "Serealia").order("nama").range(0, 4).execute()
print("Food items (Serealia):")
for item in result.data:
    print(f'  {item["entity_id"]}: {item["nama"]} ({item["energi_kal"]} kkal)')

result = supabase.table("entities").select("entity_id,kategori").eq("kategori", "skrining_mst").execute()
print(f"Entities (skrining_mst): {len(result.data)} items")

print("\nSupabase client OK")

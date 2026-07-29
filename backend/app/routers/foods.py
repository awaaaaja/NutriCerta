from fastapi import APIRouter, Query
from typing import List, Optional
from app.supabase_client import supabase

router = APIRouter(prefix="/api/foods", tags=["Food Items"])


@router.get("")
def list_foods(
    search: Optional[str] = Query(None),
    kelompok: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
):
    query = supabase.table("food_items").select(
        "entity_id,nama,nama_latin,kelompok_pangan,energi_kal,protein_g,lemak_g,karbohidrat_g,serat_g,bdd_persen"
    )

    if search:
        query = query.ilike("nama", f"%{search}%")

    if kelompok:
        query = query.eq("kelompok_pangan", kelompok)

    query = query.order("nama").range(offset, offset + limit - 1)
    result = query.execute()

    return {
        "data": result.data,
        "count": len(result.data),
        "offset": offset,
        "limit": limit,
    }


@router.get("/{entity_id}")
def get_food(entity_id: str):
    result = supabase.table("food_items").select("*").eq("entity_id", entity_id).execute()
    if not result.data:
        return {"error": "Food item not found"}
    return result.data[0]


@router.get("/kelompok/list")
def list_kelompok():
    result = supabase.table("food_items").select("kelompok_pangan").execute()
    kelompok = sorted(set(item["kelompok_pangan"] for item in result.data))
    return {"kelompok": kelompok}

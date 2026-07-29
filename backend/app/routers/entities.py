from fastapi import APIRouter, Query
from typing import Optional
from app.supabase_client import supabase

router = APIRouter(prefix="/api/entities", tags=["Knowledge Entities"])


@router.get("")
def list_entities(
    kategori: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
):
    query = supabase.table("entities").select("entity_id,kategori,status_validasi")

    if kategori:
        query = query.eq("kategori", kategori)

    if search:
        query = query.ilike("entity_id", f"%{search}%")

    query = query.order("entity_id").range(offset, offset + limit - 1)
    result = query.execute()

    return {
        "data": result.data,
        "count": len(result.data),
        "offset": offset,
        "limit": limit,
    }


@router.get("/{entity_id}")
def get_entity(entity_id: str):
    result = supabase.table("entities").select("*").eq("entity_id", entity_id).execute()
    if not result.data:
        return {"error": "Entity not found"}
    return result.data[0]


@router.get("/kategori/list")
def list_kategori():
    result = supabase.table("entities").select("kategori").execute()
    kategoris = sorted(set(item["kategori"] for item in result.data))
    return {"kategori": kategoris}

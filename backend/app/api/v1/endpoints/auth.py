from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
async def login():
    return {"message": "Auth endpoints coming soon with Supabase integration"}

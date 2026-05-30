from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def log_workout():
    return {"message": "Workout logging will be handled here with Supabase"}

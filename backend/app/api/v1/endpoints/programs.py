from fastapi import APIRouter
from typing import List
from app.schemas.program import Program

router = APIRouter()

# Temporary hardcoded programs (will come from Supabase later)
PROGRAMS = [
    {
        "id": "program_shadow_strength",
        "name": "Shadow Strength",
        "kanji": "影力",
        "description": "5-week powerlifting program",
        "style": "powerlifting",
        "difficulty": "intermediate",
        "days_per_week": 4,
        "duration_weeks": 5,
        "xp_multiplier": 1.3
    },
    {
        "id": "program_iron_body",
        "name": "Iron Body",
        "kanji": "鋼体",
        "description": "5-week calisthenics program",
        "style": "calisthenics",
        "difficulty": "beginner",
        "days_per_week": 4,
        "duration_weeks": 5,
        "xp_multiplier": 1.0
    }
]

@router.get("/", response_model=List[Program])
async def list_programs():
    return PROGRAMS

@router.get("/{program_id}", response_model=Program)
async def get_program(program_id: str):
    for p in PROGRAMS:
        if p["id"] == program_id:
            return p
    return {"error": "Program not found"}

from pydantic import BaseModel
from typing import Optional

class Program(BaseModel):
    id: str
    name: str
    kanji: Optional[str] = None
    description: str
    style: str
    difficulty: str
    days_per_week: int
    duration_weeks: int
    xp_multiplier: float = 1.0

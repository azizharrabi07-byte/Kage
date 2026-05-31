from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class WorkoutSet(BaseModel):
    set_number: int = Field(..., ge=1)
    weight: float = Field(..., ge=0)
    reps: int = Field(..., ge=1)
    completed: bool = False
    rpe: Optional[int] = Field(None, ge=1, le=10)


class WorkoutExercise(BaseModel):
    exercise_id: str
    exercise_name: str
    sets: List[WorkoutSet]
    notes: Optional[str] = None


class WorkoutSessionCreate(BaseModel):
    program_id: Optional[str] = None
    name: str = Field(..., min_length=3, max_length=100)
    duration_seconds: int = Field(..., ge=60)
    exercises: List[WorkoutExercise]
    total_xp: int = Field(0, ge=0)
    mastery: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class WorkoutSession(WorkoutSessionCreate):
    id: str
    user_id: str
    date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

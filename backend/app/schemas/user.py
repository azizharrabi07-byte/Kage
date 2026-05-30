from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from datetime import datetime

ExperienceLevel = Literal["beginner", "intermediate", "advanced"]
GoalType = Literal["build_muscle", "lose_fat", "performance", "general"]


class ProfileBase(BaseModel):
    username: Optional[str] = Field(None, max_length=50)
    age: Optional[int] = Field(None, ge=13, le=100)
    height_cm: Optional[float] = Field(None, ge=100, le=250)
    weight_kg: Optional[float] = Field(None, ge=30, le=300)
    experience_level: Optional[ExperienceLevel] = None
    primary_goal: Optional[GoalType] = None


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    pass


class Profile(ProfileBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserProfileForAI(BaseModel):
    """Clean profile data sent to AI services."""
    age: Optional[int] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    experience_level: Optional[ExperienceLevel] = None
    primary_goal: Optional[GoalType] = None
    injuries: Optional[str] = None
    active_program_id: Optional[str] = None

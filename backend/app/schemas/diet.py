from pydantic import BaseModel, Field
from typing import Optional, Literal
from app.schemas.user import UserProfileForAI


class DietRecommendationRequest(BaseModel):
    profile: UserProfileForAI
    target_calories_override: Optional[int] = Field(None, ge=1200, le=6000)


class DietRecommendation(BaseModel):
    calories: int = Field(..., ge=1200, le=6000)
    protein: int = Field(..., ge=50, le=400)
    carbs: int = Field(..., ge=0, le=800)
    fat: int = Field(..., ge=20, le=250)
    style: str
    key_advice: str
    weekly_framework: str
    macro_split: dict

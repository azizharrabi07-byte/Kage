from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Literal
from app.schemas.user import UserProfileForAI


class ModelThinkingRequest(BaseModel):
    profile: UserProfileForAI
    additional_context: Optional[str] = None


class RecommendedDiet(BaseModel):
    calories: int = Field(..., ge=1200, le=6000)
    protein: int = Field(..., ge=50, le=400)
    carbs: int = Field(..., ge=0, le=800)
    fat: int = Field(..., ge=20, le=250)
    style: str
    key_advice: str


class ModelThinkingReport(BaseModel):
    recommended_program_id: str
    program_reason: str
    expected_outcomes: str
    recommended_diet: RecommendedDiet
    strategic_summary: str
    confidence_score: Optional[float] = Field(None, ge=0, le=1)

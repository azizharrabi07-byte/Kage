from fastapi import APIRouter, Depends
from app.schemas.diet import DietRecommendationRequest, DietRecommendation
from app.services.ai_service import generate_model_thinking_report
from app.core.dependencies import get_current_active_user, CurrentUser

router = APIRouter()

@router.post("/recommendation", response_model=DietRecommendation)
async def get_diet_recommendation(
    request: DietRecommendationRequest,
    current_user: CurrentUser = Depends(get_current_active_user)
):
    """
    Returns a personalized diet recommendation.
    Uses the same AI engine as Model Thinking for consistency.
    """
    # For now, we reuse the AI service to get diet data
    report = await generate_model_thinking_report(request.profile)
    diet = report.recommended_diet

    return DietRecommendation(
        calories=diet.calories,
        protein=diet.protein,
        carbs=diet.carbs,
        fat=diet.fat,
        style=diet.style,
        key_advice=diet.key_advice,
        weekly_framework="Training days: higher carbs. Rest days: controlled intake.",
        macro_split={
            "protein_percent": round((diet.protein * 4) / diet.calories * 100),
            "carbs_percent": round((diet.carbs * 4) / diet.calories * 100),
            "fat_percent": round((diet.fat * 9) / diet.calories * 100),
        }
    )

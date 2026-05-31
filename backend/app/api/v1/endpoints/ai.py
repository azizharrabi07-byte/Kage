from fastapi import APIRouter, Depends
from app.schemas.ai import UserProfileForAI, ModelThinkingReport
from app.services.ai_service import generate_model_thinking_report
from app.core.dependencies import get_current_active_user, CurrentUser

router = APIRouter()

@router.post("/model-thinking", response_model=ModelThinkingReport)
async def run_model_thinking(
    profile: UserProfileForAI,
    current_user: CurrentUser = Depends(get_current_active_user)
):
    """
    Main endpoint for the AI Strategist.
    Currently accepts profile data directly. Will later merge with Supabase user data.
    """
    report = await generate_model_thinking_report(profile)
    return report

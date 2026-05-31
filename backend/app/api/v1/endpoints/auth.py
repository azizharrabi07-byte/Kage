from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user, CurrentUser
from app.services.supabase_client import supabase_service
from typing import Optional

router = APIRouter()


@router.get("/me")
async def get_me(current_user: CurrentUser = Depends(get_current_user)):
    """
    Returns the currently authenticated user.
    Useful for frontend to check login state.
    """
    if current_user.id == "dev-user-123":
        return {
            "user_id": current_user.id,
            "mode": "development",
            "message": "Using dev bypass. Login with real Supabase token for production behavior."
        }

    # Try to enrich with profile data if available
    profile = None
    if supabase_service.client:
        try:
            profile = await supabase_service.get_profile(current_user.id)
        except Exception:
            pass

    return {
        "user_id": current_user.id,
        "mode": "authenticated",
        "profile": profile
    }


@router.post("/login")
async def login_placeholder():
    """
    Placeholder. Real login should be done from the frontend using Supabase JS client
    (email + password or magic link). The frontend then sends the access_token
    in the Authorization header for all protected routes.
    """
    return {
        "message": "Use Supabase client on frontend to login (email/password or OTP). "
                   "Then send the access_token as Bearer token to protected endpoints."
    }

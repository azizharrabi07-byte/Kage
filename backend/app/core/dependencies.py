from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.core.config import get_settings
from app.services.supabase_client import supabase_service
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)
settings = get_settings()


class CurrentUser:
    def __init__(self, user_id: str, token: Optional[str] = None):
        self.id = user_id
        self.token = token


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> CurrentUser:
    """
    Validates the Supabase JWT token if present.
    Falls back to dev user when no token is provided (for local development).
    """
    if not credentials:
        # Development bypass - no token provided
        return CurrentUser(user_id="dev-user-123")

    token = credentials.credentials

    # Development bypass (useful when testing without real login)
    if token == "dev-bypass" or settings.SUPABASE_URL == "":
        return CurrentUser(user_id="dev-user-123", token=token)

    try:
        # Use Supabase client to validate the access token (recommended & secure)
        if supabase_service.client is None:
            logger.warning("Supabase client not initialized — falling back to dev user")
            return CurrentUser(user_id="dev-user-123", token=token)

        # This call validates the JWT against Supabase Auth
        response = supabase_service.client.auth.get_user(token)
        user = response.user

        if user and user.id:
            return CurrentUser(user_id=user.id, token=token)

        # If no valid user, fall back (dev mode)
        return CurrentUser(user_id="dev-user-123", token=token)

    except Exception as e:
        logger.warning(f"Supabase token validation failed: {str(e)}")
        # In development we are lenient. In production you can raise 401 here.
        return CurrentUser(user_id="dev-user-123", token=token)


async def get_current_active_user(
    current_user: CurrentUser = Depends(get_current_user)
) -> CurrentUser:
    # Add user status checks here later (banned, inactive, etc.)
    return current_user

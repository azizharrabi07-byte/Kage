from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.core.config import get_settings
import jwt

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
    Basic auth dependency.
    Currently returns a placeholder user.
    Will be upgraded to validate Supabase JWT when credentials are provided.
    """
    if not credentials:
        # For development - allow unauthenticated requests with placeholder user
        return CurrentUser(user_id="dev-user-123")

    token = credentials.credentials

    try:
        # Placeholder JWT decode (will be replaced with Supabase verification)
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"verify_signature": False}  # TODO: Remove this when using real Supabase JWT
        )
        user_id: str = payload.get("sub") or payload.get("user_id", "dev-user-123")
        return CurrentUser(user_id=user_id, token=token)

    except Exception:
        # Fallback for development
        return CurrentUser(user_id="dev-user-123", token=token)


async def get_current_active_user(
    current_user: CurrentUser = Depends(get_current_user)
) -> CurrentUser:
    # Add user status checks here later (banned, inactive, etc.)
    return current_user

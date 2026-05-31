from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    GROQ_API_KEY: str
    SECRET_KEY: str = "change-this-in-production-very-important"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # Computed property for Supabase JWKS (used for real JWT validation)
    @property
    def SUPABASE_JWKS_URL(self) -> str:
        # Supabase exposes JWKS at /auth/v1/.well-known/jwks.json
        return f"{self.SUPABASE_URL}/auth/v1/.well-known/jwks.json"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

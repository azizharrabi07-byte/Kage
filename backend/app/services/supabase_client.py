"""
Supabase Client Service - Production-ready with real credentials.
"""

from supabase import create_client, Client
from typing import Optional, Dict, Any, List
from app.core.config import get_settings
import logging

logger = logging.getLogger(__name__)

settings = get_settings()

# Initialize Supabase clients
try:
    # Main client (using service role for backend operations)
    supabase: Client = create_client(
        settings.SUPABASE_URL, 
        settings.SUPABASE_KEY
    )
    
    # Admin client (explicitly using service role)
    supabase_admin: Client = create_client(
        settings.SUPABASE_URL, 
        settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
    )
    
    logger.info("Supabase clients initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Supabase clients: {e}")
    supabase = None
    supabase_admin = None


class SupabaseService:
    """High-level service for interacting with Supabase."""

    def __init__(self):
        self.client: Optional[Client] = supabase
        self.admin: Optional[Client] = supabase_admin

    def is_connected(self) -> bool:
        return self.client is not None

    # ====================== PROFILES ======================
    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        if not self.client:
            return None
        try:
            response = (
                self.client.table("profiles")
                .select("*")
                .eq("id", user_id)
                .single()
                .execute()
            )
            return response.data
        except Exception as e:
            logger.error(f"Error fetching profile for {user_id}: {e}")
            return None

    async def upsert_profile(self, user_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.admin:
            return None
        try:
            payload = {"id": user_id, **data}
            response = self.admin.table("profiles").upsert(payload).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error upserting profile for {user_id}: {e}")
            return None

    # ====================== USER PROGRAMS ======================
    async def get_active_user_program(self, user_id: str) -> Optional[Dict[str, Any]]:
        if not self.client:
            return None
        try:
            response = (
                self.client.table("user_programs")
                .select("*, programs(*)")
                .eq("user_id", user_id)
                .eq("is_active", True)
                .single()
                .execute()
            )
            return response.data
        except Exception as e:
            logger.info(f"No active program for user {user_id}")
            return None

    async def save_user_program_progress(self, user_id: str, program_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.admin:
            return None
        try:
            payload = {
                "user_id": user_id,
                "program_id": program_id,
                **data
            }
            response = self.admin.table("user_programs").upsert(payload).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error saving program progress: {e}")
            return None

    # ====================== WORKOUT SESSIONS ======================
    async def create_workout_session(self, user_id: str, session_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.admin:
            return None
        try:
            payload = {"user_id": user_id, **session_data}
            response = self.admin.table("workout_sessions").insert(payload).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error creating workout session: {e}")
            return None

    async def get_recent_workouts(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        if not self.client:
            return []
        try:
            response = (
                self.client.table("workout_sessions")
                .select("*")
                .eq("user_id", user_id)
                .order("date", desc=True)
                .limit(limit)
                .execute()
            )
            return response.data or []
        except Exception as e:
            logger.error(f"Error fetching workouts: {e}")
            return []

    # ====================== MOVEMENT INSIGHTS ======================
    async def save_movement_insight(self, user_id: str, insight: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.admin:
            return None
        try:
            payload = {"user_id": user_id, **insight}
            response = self.admin.table("movement_insights").insert(payload).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error saving movement insight: {e}")
            return None

    # ====================== NUTRITION ======================
    async def log_nutrition_entry(self, user_id: str, entry: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.admin:
            return None
        try:
            payload = {"user_id": user_id, **entry}
            response = self.admin.table("nutrition_logs").insert(payload).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error logging nutrition: {e}")
            return None

    # ====================== AI REPORTS ======================
    async def save_ai_report(self, user_id: str, report_type: str, input_data: Dict, output_data: Dict) -> Optional[Dict[str, Any]]:
        if not self.admin:
            return None
        try:
            payload = {
                "user_id": user_id,
                "report_type": report_type,
                "input_data": input_data,
                "output_data": output_data,
            }
            response = self.admin.table("ai_reports").insert(payload).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error saving AI report: {e}")
            return None

    # ====================== PERSONAL RECORDS ======================
    async def upsert_personal_record(self, user_id: str, exercise_name: str, best_weight: float, best_reps: int, best_volume: float) -> Optional[Dict[str, Any]]:
        if not self.admin:
            return None
        try:
            payload = {
                "user_id": user_id,
                "exercise_name": exercise_name,
                "best_weight": best_weight,
                "best_reps": best_reps,
                "best_volume": best_volume,
                "date": "now()",  # Supabase will use current timestamp
            }
            # Use upsert with conflict on (user_id, exercise_name)
            response = (
                self.admin.table("personal_records")
                .upsert(payload, on_conflict="user_id,exercise_name")
                .execute()
            )
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error upserting personal record for {exercise_name}: {e}")
            return None

    async def get_user_prs(self, user_id: str) -> List[Dict[str, Any]]:
        if not self.client:
            return []
        try:
            response = (
                self.client.table("personal_records")
                .select("*")
                .eq("user_id", user_id)
                .execute()
            )
            return response.data or []
        except Exception as e:
            logger.error(f"Error fetching PRs: {e}")
            return []


# Global instance
supabase_service = SupabaseService()

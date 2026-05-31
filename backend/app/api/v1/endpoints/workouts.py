from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_active_user, CurrentUser
from app.schemas.workout import WorkoutSessionCreate
from app.services.supabase_client import supabase_service
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/recent")
async def get_recent_workouts(
    limit: int = 10,
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Returns recent workout sessions for the current user."""
    sessions = await supabase_service.get_recent_workouts(current_user.id, limit)
    return {"sessions": sessions}


@router.get("/prs")
async def get_user_prs(
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """Returns personal records for the current user (for charts)."""
    prs = await supabase_service.get_user_prs(current_user.id)
    return {"prs": prs}


@router.post("/", response_model=dict)
async def log_workout_session(
    session: WorkoutSessionCreate,
    current_user: CurrentUser = Depends(get_current_active_user),
):
    """
    Logs a completed workout session to Supabase.
    - Saves the full session (exercises + sets as JSONB)
    - Updates personal records for each exercise based on this session's best efforts
    """
    user_id = current_user.id

    if not supabase_service.admin:
        raise HTTPException(status_code=503, detail="Database not available")

    try:
        # 1. Save the full workout session
        session_data = session.model_dump()
        saved_session = await supabase_service.create_workout_session(user_id, session_data)

        if not saved_session:
            raise HTTPException(status_code=500, detail="Failed to save workout session")

        session_id = saved_session.get("id")

        # 2. Process Personal Records from this session
        pr_updates = []
        for ex in session.exercises:
            exercise_name = ex.exercise_name

            completed_sets = [s for s in ex.sets if s.completed]

            if not completed_sets:
                continue

            # Calculate bests from this session
            best_weight = max(s.weight for s in completed_sets)
            best_reps = max(s.reps for s in completed_sets)
            best_volume = sum(s.weight * s.reps for s in completed_sets)

            # Upsert PR (the service handles "only if better" logic at DB level via upsert)
            pr = await supabase_service.upsert_personal_record(
                user_id=user_id,
                exercise_name=exercise_name,
                best_weight=best_weight,
                best_reps=best_reps,
                best_volume=best_volume,
            )
            if pr:
                pr_updates.append({"exercise": exercise_name, "best_weight": best_weight, "best_reps": best_reps})

        # 3. (Optional future) Save movement insights if session.mastery exists
        if session.mastery:
            try:
                await supabase_service.save_movement_insight(
                    user_id=user_id,
                    insight={
                        "exercise_name": session.name,  # or more specific
                        "common_issues": session.mastery.get("issues", []),
                        "strengths": session.mastery.get("praises", []),
                        "llm_summary": session.mastery.get("summary"),
                    }
                )
            except Exception as e:
                logger.warning(f"Failed to save movement insight: {e}")

        return {
            "success": True,
            "session_id": session_id,
            "prs_updated": pr_updates,
            "message": "Workout logged successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging workout: {e}")
        raise HTTPException(status_code=500, detail="Failed to log workout")

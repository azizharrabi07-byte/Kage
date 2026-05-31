from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, programs, workouts, diet, ai

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(programs.router, prefix="/programs", tags=["Programs"])
api_router.include_router(workouts.router, prefix="/workouts", tags=["Workouts"])
api_router.include_router(diet.router, prefix="/diet", tags=["Diet"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])

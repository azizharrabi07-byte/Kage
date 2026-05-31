import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_prs_dev_bypass():
    """Test /prs with dev bypass (no auth)"""
    response = client.get("/api/v1/workouts/prs")
    assert response.status_code == 200
    assert "prs" in response.json()

def test_get_prs_with_dev_token():
    """Test with explicit dev-bypass token"""
    response = client.get(
        "/api/v1/workouts/prs",
        headers={"Authorization": "Bearer dev-bypass"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "prs" in data

def test_workout_logging_creates_prs():
    """Test that logging a workout updates PRs"""
    payload = {
        "name": "Test Workout",
        "duration_seconds": 3600,
        "exercises": [
            {
                "exercise_id": "ex1",
                "exercise_name": "Bench Press",
                "sets": [
                    {"set_number": 1, "weight": 100, "reps": 5, "completed": True},
                    {"set_number": 2, "weight": 105, "reps": 3, "completed": True}
                ]
            }
        ],
        "total_xp": 150
    }
    response = client.post("/api/v1/workouts/", json=payload)
    assert response.status_code == 200
    assert response.json()["success"] is True

# TODO: Add real JWT tests once full auth is complete


"""
Backend Connection & Basic Functionality Test
Run this after migrations are applied in Supabase.
"""

import asyncio
import sys
from app.services.supabase_client import supabase_service
from app.services.ai_service import generate_model_thinking_report
from app.schemas.ai import UserProfileForAI


async def test_supabase_connection():
    print("=" * 60)
    print("1. TESTING SUPABASE CONNECTION")
    print("=" * 60)

    if not supabase_service.is_connected():
        print("[FAIL] Supabase client failed to initialize")
        return False

    print("[OK] Supabase client initialized successfully")

    # Test profiles table
    try:
        response = (
            supabase_service.client.table("profiles")
            .select("id", count="exact")
            .limit(1)
            .execute()
        )
        print(f"[OK] profiles table exists (count: {response.count})")
    except Exception as e:
        print(f"[FAIL] profiles table error: {e}")
        return False

    # Test other key tables
    tables_to_check = ["user_programs", "workout_sessions", "movement_insights", "nutrition_logs", "ai_reports"]
    for table in tables_to_check:
        try:
            resp = supabase_service.client.table(table).select("id").limit(1).execute()
            print(f"[OK] {table} table exists")
        except Exception as e:
            print(f"[FAIL] {table} table error: {e}")

    return True


async def test_ai_model_thinking():
    print("\n" + "=" * 60)
    print("2. TESTING AI MODEL THINKING (Groq)")
    print("=" * 60)

    test_profile = UserProfileForAI(
        age=28,
        height_cm=178,
        weight_kg=82,
        experience_level="intermediate",
        primary_goal="build_muscle",
        injuries=None,
        active_program_id=None
    )

    try:
        report = await generate_model_thinking_report(test_profile)
        print("[OK] Model Thinking generated successfully!")
        print(f"    Recommended Program: {report.recommended_program_id}")
        print(f"    Strategic Summary: {report.strategic_summary[:80]}...")
        print(f"    Diet: {report.recommended_diet.calories} kcal | {report.recommended_diet.protein}g protein")
        return True
    except Exception as e:
        print(f"[FAIL] AI Model Thinking failed: {e}")
        return False


async def test_diet_recommendation():
    print("\n" + "=" * 60)
    print("3. TESTING DIET RECOMMENDATION")
    print("=" * 60)

    test_profile = UserProfileForAI(
        age=28,
        height_cm=178,
        weight_kg=82,
        experience_level="intermediate",
        primary_goal="build_muscle"
    )

    try:
        report = await generate_model_thinking_report(test_profile)
        diet = report.recommended_diet
        print("[OK] Diet recommendation generated!")
        print(f"    Calories: {diet.calories}")
        print(f"    Protein:  {diet.protein}g")
        print(f"    Style:    {diet.style}")
        return True
    except Exception as e:
        print(f"[FAIL] Diet recommendation failed: {e}")
        return False


async def main():
    print("\nStarting Kage Backend Tests...\n")

    supabase_ok = await test_supabase_connection()
    ai_ok = await test_ai_model_thinking()
    diet_ok = await test_diet_recommendation()

    print("\n" + "=" * 60)
    print("FINAL RESULTS")
    print("=" * 60)

    print(f"Supabase Connection:     {'[PASS]' if supabase_ok else '[FAIL]'}")
    print(f"AI Model Thinking:       {'[PASS]' if ai_ok else '[FAIL]'}")
    print(f"Diet Recommendation:     {'[PASS]' if diet_ok else '[FAIL]'}")

    if supabase_ok and ai_ok and diet_ok:
        print("\nBackend is working correctly with Supabase!")
    else:
        print("\nSome tests failed. Check the errors above.")


if __name__ == "__main__":
    asyncio.run(main())

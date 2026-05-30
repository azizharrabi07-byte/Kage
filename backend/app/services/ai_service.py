from app.schemas.ai import UserProfileForAI, ModelThinkingReport, RecommendedDiet
from app.core.config import get_settings
from app.services.supabase_client import supabase_service
from groq import Groq
import json
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

settings = get_settings()
client = Groq(api_key=settings.GROQ_API_KEY)


async def _get_real_programs() -> List[Dict[str, Any]]:
    """Fetch actual programs from Supabase (with fallback to local constants)."""
    try:
        # Try to get from Supabase first
        if supabase_service.is_connected():
            response = supabase_service.client.table("programs").select("*").execute()
            if response.data:
                return response.data
    except Exception as e:
        logger.warning(f"Could not fetch programs from Supabase: {e}")

    # Fallback to local constants
    try:
        from app.constants.programs import TRAINING_PROGRAMS
        return [
            {
                "id": p["id"],
                "name": p["name"],
                "description": p.get("description", ""),
                "style": p.get("style", ""),
                "difficulty": p.get("difficulty", ""),
            }
            for p in TRAINING_PROGRAMS
        ]
    except Exception:
        # Hardcoded minimal fallback
        return [
            {"id": "program_shadow_strength", "name": "Shadow Strength", "description": "Powerlifting program", "style": "powerlifting"},
            {"id": "program_iron_body", "name": "Iron Body", "description": "Calisthenics program", "style": "calisthenics"},
        ]


async def generate_model_thinking_report(profile: UserProfileForAI) -> ModelThinkingReport:
    """
    Generates a personalized Model Thinking report using Groq.
    Now strictly constrained to only recommend from real programs in the system.
    """
    programs = await _get_real_programs()
    program_list_text = "\n".join([
        f"- id: \"{p['id']}\" | name: \"{p['name']}\" | style: {p.get('style', 'N/A')} | difficulty: {p.get('difficulty', 'N/A')}"
        for p in programs
    ])

    system_prompt = """You are an elite performance strategist for martial artists and strength athletes.
Your ONLY job is to analyze the user's profile and recommend EXACTLY ONE program from the provided list.

Rules:
- You MUST choose one of the programs from the list below.
- Never invent new program names.
- Be specific about why this program fits the user.
- Return ONLY valid JSON."""

    user_prompt = f"""
User Profile:
- Age: {profile.age or 'Not provided'}
- Height: {profile.height_cm} cm
- Weight: {profile.weight_kg} kg
- Goal: {profile.primary_goal}
- Experience: {profile.experience_level}
- Injuries/Limitations: {profile.injuries or 'None'}
- Current Program: {profile.active_program_id or 'None'}

Available Programs (YOU MUST PICK ONE OF THESE):
{program_list_text}

Return a JSON object with exactly these keys:
- recommended_program_id (must be one of the ids above)
- program_reason (1-2 sentences)
- expected_outcomes (what the user can expect in 5-8 weeks)
- recommended_diet (object with: calories, protein, carbs, fat, style, key_advice)
- strategic_summary (one powerful sentence)
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.6,
            max_tokens=900,
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        data = json.loads(content)

        # Validate that the recommended program actually exists
        recommended_id = data.get("recommended_program_id")
        valid_ids = [p["id"] for p in programs]
        if recommended_id not in valid_ids:
            logger.warning(f"AI returned invalid program id: {recommended_id}. Falling back.")
            recommended_id = programs[0]["id"] if programs else "program_shadow_strength"

        diet = data.get("recommended_diet", {})
        recommended_diet = RecommendedDiet(
            calories=diet.get("calories", 2600),
            protein=diet.get("protein", 160),
            carbs=diet.get("carbs", 220),
            fat=diet.get("fat", 70),
            style=diet.get("style", "Balanced high-protein"),
            key_advice=diet.get("key_advice", "Prioritize protein and consistency.")
        )

        return ModelThinkingReport(
            recommended_program_id=recommended_id,
            program_reason=data.get("program_reason", "Good match for your goals."),
            expected_outcomes=data.get("expected_outcomes", "Improved strength and discipline."),
            recommended_diet=recommended_diet,
            strategic_summary=data.get("strategic_summary", "Show up and do the work.")
        )

    except Exception as e:
        logger.error(f"Groq AI error: {e}")
        # Safe fallback using first available program
        fallback_id = programs[0]["id"] if programs else "program_shadow_strength"
        return ModelThinkingReport(
            recommended_program_id=fallback_id,
            program_reason="Fallback recommendation due to temporary AI issue.",
            expected_outcomes="Build strength and mental toughness.",
            recommended_diet=RecommendedDiet(
                calories=2800,
                protein=180,
                carbs=260,
                fat=75,
                style="High protein + strategic carbs",
                key_advice="Eat big on training days. Sleep 8 hours."
            ),
            strategic_summary="Consistency beats intensity."
        )

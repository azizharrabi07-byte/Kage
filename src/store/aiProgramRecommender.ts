import { TRAINING_PROGRAMS } from '@/constants/programs';
import { callSenseiAI } from '@/utils/gemini';
import { getChronicWeaknesses } from './movementIntelligence';

export interface UserPreferences {
  goal: 'strength' | 'muscle' | 'endurance' | 'cardio' | 'custom';
  experience: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  style: 'powerlifting' | 'calisthenics' | 'hypertrophy' | 'cardio' | 'mixed';
  equipment: 'full_gym' | 'minimal' | 'bodyweight';
}

interface Recommendation {
  programId: string;
  reasons: string[];
}

const programDescriptions = TRAINING_PROGRAMS.map(p =>
  `- "${p.name}" (id: ${p.id}): ${p.description}. Style: ${p.style}. Difficulty: ${p.difficulty}. Days/week: ${p.daysPerWeek}. XP multiplier: ${p.xpMultiplier}x.`
).join('\n');

function buildPrompt(prefs: UserPreferences): string {
  return `You are an expert martial arts and strength coach (Sensei). You must deeply analyze the user and recommend the SINGLE best training program from the list.

Think step by step with real intelligence:

1. Understand the user's true goal (strength, muscle, endurance, etc.)
2. Consider their experience level and what would be sustainable and motivating.
3. Respect their available training days (don't recommend something too time-consuming).
4. Match their preferred style and equipment realistically.
5. Look for synergies — sometimes a "mixed" or slightly different program can be better for long-term growth than a perfect style match.
6. Prioritize programs that will actually help this specific person progress and stay consistent.

USER PROFILE:
- Primary Goal: ${prefs.goal}
- Experience Level: ${prefs.experience}
- Training Days Available per Week: ${prefs.daysPerWeek}
- Preferred Training Style: ${prefs.style}
- Equipment Access: ${prefs.equipment}

AVAILABLE PROGRAMS:
${programDescriptions}

Return ONLY valid JSON (no extra text before or after):
{
  "programId": "exact_program_id_from_the_list",
  "reasons": [
    "Deep, specific reason 1 showing real understanding of this user",
    "Deep, specific reason 2",
    "Deep, specific reason 3"
  ]
}`;
}

function fallbackRecommendation(prefs: UserPreferences): Recommendation {
  // This is only used when the LLM (Groq) is unavailable.
  // It is intentionally simple — the real intelligence should come from the LLM.
  const programs = TRAINING_PROGRAMS;

  const scored = programs.map(p => {
    let score = 0;

    if (prefs.goal === 'strength' && p.style === 'powerlifting') score += 3;
    else if (prefs.goal === 'muscle' && p.style === 'hypertrophy') score += 3;
    else if (prefs.goal === 'cardio' && p.style === 'cardio') score += 3;
    else if (prefs.goal === 'endurance' && (p.style === 'cardio' || p.style === 'calisthenics')) score += 2;
    else if (prefs.goal === 'custom' && p.style === 'mixed') score += 3;

    if (prefs.experience === 'beginner' && p.difficulty === 'beginner') score += 2;
    else if (prefs.experience === 'intermediate' && p.difficulty === 'intermediate') score += 2;
    else if (prefs.experience === 'advanced' && p.difficulty === 'advanced') score += 2;

    if (p.daysPerWeek <= prefs.daysPerWeek) score += 1;

    if (prefs.equipment === 'bodyweight' && p.style === 'calisthenics') score += 2;
    else if (prefs.equipment === 'minimal' && (p.style === 'calisthenics' || p.style === 'mixed')) score += 1;
    else if (prefs.equipment === 'full_gym') score += 1;

    if (prefs.style === p.style) score += 2;

    return { program: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].program;

  const reasons: string[] = [
    `Best available match based on your ${prefs.experience} level and ${prefs.goal} goal`,
    `Fits within your ${prefs.daysPerWeek} days/week schedule`,
    `${best.xpMultiplier}x XP multiplier — good progression reward`
  ];

  return { programId: best.id, reasons };
}

export async function getRecommendedProgram(prefs: UserPreferences): Promise<Recommendation> {
  // Try the intelligent LLM path first (this is what you wanted)
  try {
    const chronicWeaknesses = await getChronicWeaknesses();
    const basePrompt = buildPrompt(prefs);
    
    const weaknessNote = chronicWeaknesses.length > 0 
      ? `\n\nAthlete's known chronic movement issues (important for program choice): ${chronicWeaknesses.join(', ')}. Prioritize programs that help correct these patterns.`
      : '';

    const prompt = basePrompt + weaknessNote;
    
    const result = await callSenseiAI(
      'You are a wise Sensei who gives thoughtful program recommendations. Always respond with valid JSON only. Consider any chronic movement issues when recommending.',
      prompt,
    );

    if (result) {
      const jsonStart = result.indexOf('{');
      const jsonEnd = result.lastIndexOf('}');
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const parsed = JSON.parse(result.slice(jsonStart, jsonEnd + 1));
        if (parsed.programId && TRAINING_PROGRAMS.some(p => p.id === parsed.programId)) {
          return {
            programId: parsed.programId,
            reasons: Array.isArray(parsed.reasons) ? parsed.reasons : ["Personalized recommendation from Sensei"]
          };
        }
      }
    }
  } catch (e) {
    console.log('LLM recommendation failed, using smart fallback:', e);
  }

  // Only use the rule-based fallback when the LLM is unreachable or gave bad output
  return fallbackRecommendation(prefs);
}

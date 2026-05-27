import { TRAINING_PROGRAMS } from '@/constants/programs';
import { callSenseiAI } from '@/utils/gemini';

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
  return `You are a fitness program recommender. Given a user's preferences and the available programs below, recommend the BEST program.

USER PREFERENCES:
- Goal: ${prefs.goal}
- Experience: ${prefs.experience}
- Available days/week: ${prefs.daysPerWeek}
- Preferred training style: ${prefs.style}
- Equipment available: ${prefs.equipment}

AVAILABLE PROGRAMS:
${programDescriptions}

Respond with ONLY valid JSON in this exact format:
{
  "programId": "program_id_here",
  "reasons": ["reason 1", "reason 2", "reason 3"]
}`;
}

function fallbackRecommendation(prefs: UserPreferences): Recommendation {
  const programs = TRAINING_PROGRAMS;

  // Score each program
  const scored = programs.map(p => {
    let score = 0;

    // Match goal
    if (prefs.goal === 'strength' && p.style === 'powerlifting') score += 3;
    else if (prefs.goal === 'muscle' && p.style === 'hypertrophy') score += 3;
    else if (prefs.goal === 'cardio' && p.style === 'cardio') score += 3;
    else if (prefs.goal === 'endurance' && (p.style === 'cardio' || p.style === 'calisthenics')) score += 2;
    else if (prefs.goal === 'custom' && p.style === 'mixed') score += 3;

    // Match experience
    if (prefs.experience === 'beginner' && p.difficulty === 'beginner') score += 2;
    else if (prefs.experience === 'intermediate' && p.difficulty === 'intermediate') score += 2;
    else if (prefs.experience === 'advanced' && p.difficulty === 'advanced') score += 2;

    // Match days
    if (p.daysPerWeek <= prefs.daysPerWeek) score += 1;

    // Match equipment
    if (prefs.equipment === 'bodyweight' && p.style === 'calisthenics') score += 2;
    else if (prefs.equipment === 'minimal' && (p.style === 'calisthenics' || p.style === 'mixed')) score += 1;
    else if (prefs.equipment === 'full_gym') score += 1;

    // Match style
    if (prefs.style === p.style) score += 2;

    return { program: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].program;

  const reasons: string[] = [];
  if (best.style === prefs.style) reasons.push(`Matches your preferred ${best.style} training style`);
  if (best.difficulty === prefs.experience) reasons.push(`Designed for ${best.difficulty} athletes`);
  if (best.daysPerWeek <= prefs.daysPerWeek) reasons.push(`Fits your schedule (${best.daysPerWeek} days/week)`);
  reasons.push(`${best.xpMultiplier}x XP multiplier for ${best.style} training`);

  return { programId: best.id, reasons };
}

export async function getRecommendedProgram(prefs: UserPreferences): Promise<Recommendation> {
  try {
    const prompt = buildPrompt(prefs);
    const result = await callSenseiAI(
      'You are a fitness recommender. Return ONLY valid JSON.',
      prompt,
    );

    if (result) {
      const jsonStart = result.indexOf('{');
      const jsonEnd = result.lastIndexOf('}');
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const parsed = JSON.parse(result.slice(jsonStart, jsonEnd + 1));
        if (parsed.programId && TRAINING_PROGRAMS.some(p => p.id === parsed.programId)) {
          return parsed as Recommendation;
        }
      }
    }
  } catch {}

  return fallbackRecommendation(prefs);
}

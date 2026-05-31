/**
 * KAGE AI STRATEGIST — "Model Thinking"
 * 
 * This is the premium "thinking model" the professionals demanded.
 * It analyzes the warrior's complete data and gives strategic recommendations
 * for the best program + expected outcomes + personalized diet.
 */

import { getProgression } from './progressionStore';
import { getWorkoutHistory } from './workoutStore';
import { getChronicWeaknesses } from './movementIntelligence';
import { loadPlayerProgram } from './programStore';
import { getDayTotals } from './nutritionStore';
import { callSenseiAI } from '@/utils/gemini';
import { TRAINING_PROGRAMS } from '@/constants/programs';

export interface ModelThinkingReport {
  recommendedProgramId: string;
  programReason: string;
  expectedOutcomes: string;
  recommendedDiet: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    style: string;
    keyAdvice: string;
  };
  strategicSummary: string;
  generatedAt: number;
}

export interface UserProfile {
  age?: number;
  heightCm?: number;
  weightKg?: number;
  goal?: 'build_muscle' | 'lose_fat' | 'performance' | 'general';
  experience?: 'beginner' | 'intermediate' | 'advanced';
  injuries?: string;
}

export async function generateModelThinkingReport(userProfile?: UserProfile): Promise<ModelThinkingReport> {
  const prog = await getProgression();
  const history = await getWorkoutHistory();
  const chronic = await getChronicWeaknesses();
  const activeProgram = await loadPlayerProgram();
  const today = new Date().toISOString().slice(0, 10);
  const nutrition = await getDayTotals(today);

  const strengthXP = prog.xpMap?.strength ?? 0;
  const disciplineXP = prog.xpMap?.discipline ?? 0;
  const recoveryXP = prog.xpMap?.recovery ?? 0;
  const enduranceXP = prog.xpMap?.endurance ?? 0;

  const totalWorkouts = prog.workoutsCompleted || 0;
  const currentStreak = prog.streak || 0;

  // Simple heuristic + AI will refine it
  let defaultProgram = 'program_shadow_strength';
  if (recoveryXP < 120 && chronic.length > 0) {
    defaultProgram = 'program_iron_body';
  } else if (enduranceXP > strengthXP * 1.3) {
    defaultProgram = 'program_forge_engine';
  } else if (totalWorkouts > 25) {
    defaultProgram = 'program_shadow_strength';
  }

  const program = TRAINING_PROGRAMS.find(p => p.id === defaultProgram) || TRAINING_PROGRAMS[0];

  const system = `You are an elite performance strategist and former coach to professional fighters and powerlifters.
You have access to the warrior's complete data + personal profile. Give a direct, honest, high-signal strategic recommendation.

Format your answer EXACTLY like this (keep sections short and powerful):

RECOMMENDED PROGRAM: [program name]
WHY THIS PROGRAM: [1-2 powerful sentences]
EXPECTED OUTCOMES IN 5 WEEKS: [concrete physical + mental changes]
DIET RECOMMENDATION: [macro numbers + eating style + 1 key rule]
STRATEGIC SUMMARY: [one memorable sentence the warrior will remember]`;

  const prompt = `Warrior Profile:
- Level: ${prog.level}, Total XP: ${prog.totalXP}
- Strength XP: ${strengthXP} | Discipline: ${disciplineXP} | Recovery: ${recoveryXP} | Endurance: ${enduranceXP}
- Workouts completed: ${totalWorkouts} | Current streak: ${currentStreak} days
- Chronic movement issues: ${chronic.length ? chronic.join(', ') : 'None recorded'}
- Currently running: ${activeProgram?.isActive ? activeProgram.programId : 'Nothing'}
- Nutrition today: ${nutrition.calories} kcal, Protein ${nutrition.protein}g

${userProfile ? `Personal Details:
- Age: ${userProfile.age || 'Not provided'}
- Height: ${userProfile.heightCm ? userProfile.heightCm + 'cm' : 'Not provided'}
- Weight: ${userProfile.weightKg ? userProfile.weightKg + 'kg' : 'Not provided'}
- Goal: ${userProfile.goal || 'Not specified'}
- Experience Level: ${userProfile.experience || 'Not specified'}
- Limitations/Injuries: ${userProfile.injuries || 'None reported'}
` : ''}

Available programs: ${TRAINING_PROGRAMS.map(p => p.name).join(', ')}

Give your strategic recommendation now.`;

  const ai = await callSenseiAI(system, prompt, true);

  // Parse the response (very forgiving parser)
  const text = ai.reply;

  let recommendedProgramId = defaultProgram;
  let programReason = `Based on your current profile, ${program.name} offers the best path forward.`;
  let expected = 'Significant strength and discipline gains with improved recovery awareness.';
  let diet = { calories: 2800, protein: 180, carbs: 280, fat: 85, style: 'High protein moderate carb', keyAdvice: 'Prioritize protein at every meal.' };
  let summary = 'Train with purpose. Recover like a professional.';

  // crude but effective parsing
  const recMatch = text.match(/RECOMMENDED PROGRAM[:\-]?\s*(.+)/i);
  if (recMatch) {
    const name = recMatch[1].trim();
    const found = TRAINING_PROGRAMS.find(p => p.name.toLowerCase().includes(name.toLowerCase().slice(0, 8)));
    if (found) recommendedProgramId = found.id;
  }

  const whyMatch = text.match(/WHY THIS PROGRAM[:\-]?\s*(.+?)(?=EXPECTED|DIET|STRATEGIC|$)/is);
  if (whyMatch) programReason = whyMatch[1].trim();

  const expMatch = text.match(/EXPECTED OUTCOMES.*?[:\-]?\s*(.+?)(?=DIET|STRATEGIC|$)/is);
  if (expMatch) expected = expMatch[1].trim();

  const dietMatch = text.match(/DIET RECOMMENDATION[:\-]?\s*(.+?)(?=STRATEGIC|$)/is);
  if (dietMatch) {
    const dietText = dietMatch[1];
    const cal = dietText.match(/(\d{3,4})\s*(kcal|calories)/i);
    const pro = dietText.match(/(\d{2,3})g?\s*protein/i);
    if (cal) diet.calories = parseInt(cal[1]);
    if (pro) diet.protein = parseInt(pro[1]);
    diet.keyAdvice = dietText.split('.').slice(0, 2).join('.').trim();
  }

  const sumMatch = text.match(/STRATEGIC SUMMARY[:\-]?\s*(.+)/i);
  if (sumMatch) summary = sumMatch[1].trim();

  return {
    recommendedProgramId,
    programReason,
    expectedOutcomes: expected,
    recommendedDiet: diet,
    strategicSummary: summary,
    generatedAt: Date.now(),
  };
}

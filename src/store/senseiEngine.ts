import type { WorkoutSession, WorkoutSet, MasteryResult, TrainingStyle } from '@/store/types';
import type { PlayerProgression } from '@/components/progression/types';
import type { CoachContext } from '@/components/coach/coachData';
import { getProgramXpMultiplier } from './programStore';
import { callSenseiAI } from '@/utils/gemini';

const EXERCISE_COACHING: Record<string, string> = {
  'Shadow Push': 'Key cue: elbows 45°, bar to nipple line, drive through heels. Wrist straight.',
  'Samurai Row': 'Key cue: retract scapula first, then drive elbows past ribcage. Don\'t use momentum.',
  'Iron Squat': 'Key cue: break at hips first, knees track over toes, maintain neutral spine. Depth below parallel.',
  'Crimson Press': 'Key cue: brace core, push bar behind ears, full lockout. Don\'t arch lower back.',
  'Steel Deadlift': 'Key cue: bar over midfoot, hips drop, pull slack, drive hips through. Neutral spine.',
  'Core Strike': 'Key cue: control descent, exhale on contraction, don\'t yank neck.',
  'Blade Curl': 'Key cue: elbows pinned, no swing, full ROM. Curl fast, lower slow.',
  'Dojo Dip': 'Key cue: 90° elbow, slight forward lean, control descent. No shoulder shrugging.',
  'Ronin Lunge': 'Key cue: front shin vertical, back knee hovers, upright torso. Drive through heel.',
  'Warrior Pull-up': 'Key cue: full hang, pull chest to bar, drive elbows down and back. No kipping.',
  'Oni Press': 'Key cue: arc path like a hugging motion, control on descent, squeeze at top.',
  'Shield Raise': 'Key cue: lead with elbows to shoulder height, no body swing, controlled lower.',
  'Thunder Slam': 'Key cue: full extension overhead, hinge at hips, catch low. Explosive slam.',
  'Silent Plank': 'Key cue: straight line from head to heels, squeeze glutes, steady breath.',
  'Dragon Squat': 'Key cue: knees push outward, torso upright, depth below parallel.',
  'Shadow Sprint': 'Key cue: high knees to hip height, opposite arm drive, light landing.',
  'Iron Grip': 'Key cue: arms straight, roll with fingers, squeeze at top, control unroll.',
  'Kensei Cut': 'Key cue: back flat on bench, elbow high, stretch at bottom, squeeze lat.',
  'Stone Lift': 'Key cue: heels down, squeeze glutes, full hip extension, control lower.',
  'Wind Strike': 'Key cue: limbs straight, lift simultaneously, pause at peak, control lower.',
  // New 21-40
  'Iron Push': 'Key cue: hands form diamond under chest, elbows tucked, explode up. Full tricep extension.',
  'Rise Guard': 'Key cue: lead with elbows to shoulder height, no momentum, slight forward tilt.',
  'Skull Break': 'Key cue: upper arms vertical, lower to forehead, full lockout. Don\'t flare elbows.',
  'Mountain Press': 'Key cue: 45° bench, arc press path, squeeze at top. Upper chest focus.',
  'Iron Draw': 'Key cue: flat back hinge, bar to sternum, drive elbows past torso. Squeeze mid-back.',
  'Steel Curl': 'Key cue: elbows pinned, no swing, full extension at bottom. Slow negative.',
  'Mask Pull': 'Key cue: face height, separate hands at peak, external rotation. Rear delt squeeze.',
  'Reverse Row': 'Key cue: straight plank body, chest to bar, full hang. Don\'t let hips sag.',
  'Eastern Hinge': 'Key cue: bar along thighs, flat back, soft knees. Hip drive at the top.',
  'Split Squat': 'Key cue: front shin vertical, back knee hovers, upright torso. Rear foot elevated.',
  'Rising Calf': 'Key cue: heels drop below edge, full rise, pause at top for 2s. Straight legs.',
  'Warrior March': 'Key cue: upright torso, long stride, knee tracks over toe. Continuous flow.',
  'Dawn Reach': 'Key cue: hips back, flat back, torso parallel to floor. Squeeze glutes on return.',
  'Hanging Rise': 'Key cue: no swing, straight legs to parallel floor, controlled lower. Core engagement.',
  'Wheel Strike': 'Key cue: hips stable, full extension, pull back with abs. Kneeling roll-out.',
  'Side Guard': 'Key cue: elbow under shoulder, straight line, hips up. Oblique engagement.',
  'Kettle Storm': 'Key cue: explosive hip drive, flat back, arms relaxed. Let hips power the swing.',
  'Leap of Faith': 'Key cue: full hip extension, soft landing, arms drive upward. Step down safely.',
  'Mountain Storm': 'Key cue: low hips, core braced, full knee drive to chest. Steady rhythm.',
  'Rope Dance': 'Key cue: soft landing on balls of feet, wrists turn the rope. Minimal bounce.',
};

const PERIODIZATION_TIPS: Record<string, string> = {
  strength: 'Focus on lower reps (3-5), heavier loads, longer rest (2-3min). Quality over quantity.',
  hypertrophy: 'Moderate reps (8-12), moderate loads, 60-90s rest. Time under tension matters.',
  endurance: 'Higher reps (15-20), lighter loads, short rest (30-45s). Embrace the burn.',
  power: 'Low reps (1-3), explosive movement, full recovery (3-5min). Speed under control.',
};

const STYLE_COACHING: Record<string, string> = {
  powerlifting: 'This is a powerlifting session — every rep is about technique under maximal load. Focus on brace, bar path, and hip drive on the main lifts.',
  calisthenics: 'This is a bodyweight session — control and range of motion matter more than load. Slow eccentrics build the strength you need.',
  hypertrophy: 'This is a hypertrophy session — time under tension and metabolic stress drive growth. Focus on the eccentric and the squeeze at peak contraction.',
  cardio: 'This is a conditioning session — breathing rhythm and consistent output matter. Push the work capacity, don\'t let form break under fatigue.',
  mixed: 'This is a general warrior session — balance strength, endurance, and skill. Leave nothing on the floor.',
};

export interface SenseiData {
  level: number;
  rankName: string;
  totalXP: number;
  streak: number;
  workoutsCompleted: number;
  prs: string;
  formSummary: string;
  restSummary: string;
  gaps: string;
  programName?: string;
  programStyle?: string;
  programWeek?: number;
  programDay?: number;
}

export function buildPlayerData(
  prog: PlayerProgression | null,
  prText: string,
  recentSets: WorkoutSet[],
  programContext?: { programName: string; programStyle: string; programWeek: number; programDay: number },
): SenseiData {
  const formChecksDone = recentSets.filter(s => Object.keys(s.formResults || {}).length > 0);
  const formAvg = formChecksDone.length > 0
    ? formChecksDone.reduce((sum, s) => {
        const vals = Object.values(s.formResults || {});
        return sum + (vals.filter(Boolean).length / Math.max(vals.length, 1));
      }, 0) / formChecksDone.length
    : 0;

  const rests = recentSets.filter(s => s.restTimeUsed).map(s => s.restTimeUsed!);
  const restAvg = rests.length > 0 ? Math.round(rests.reduce((a, b) => a + b, 0) / rests.length) : 0;

  const exerciseGaps = detectExerciseGaps(recentSets);

  return {
    level: prog?.level ?? 1,
    rankName: prog ? 'Ronin' : 'Ronin',
    totalXP: prog?.totalXP ?? 0,
    streak: prog?.streak ?? 0,
    workoutsCompleted: prog?.workoutsCompleted ?? 0,
    prs: prText || 'No PRs yet',
    formSummary: formChecksDone.length > 0
      ? `Avg form: ${Math.round(formAvg * 100)}% (${formChecksDone.length} sets checked)`
      : 'No form data yet',
    restSummary: rests.length > 0
      ? (restAvg > 120 ? `Avg rest: ${restAvg}s — consider shorter rest for hypertrophy` :
         restAvg < 30 ? `Avg rest: ${restAvg}s — very short, ensure recovery` :
         `Avg rest: ${restAvg}s — good pacing`)
      : 'No rest data tracked',
    gaps: exerciseGaps,
    programName: programContext?.programName,
    programStyle: programContext?.programStyle,
    programWeek: programContext?.programWeek,
    programDay: programContext?.programDay,
  };
}

function detectExerciseGaps(sets: WorkoutSet[]): string {
  const movementTypes = new Set(sets.map(s => {
    return s.formResults ? 'some' : 'none';
  }));
  if (sets.length === 0) return 'No recent sets to analyze';
  const formSets = sets.filter(s => Object.keys(s.formResults || {}).length > 0);
  if (formSets.length === 0) return 'Consider enabling form checks to identify gaps';
  const weakPoints = new Set<string>();
  for (const set of formSets) {
    for (const [check, val] of Object.entries(set.formResults || {})) {
      if (!val) {
        weakPoints.add(check.replace(/_/g, ' '));
      }
    }
  }
  if (weakPoints.size === 0) return 'Form fundamentals are solid';
  return `Focus on: ${Array.from(weakPoints).slice(0, 3).join(', ')}`;
}

export function buildReviewPrompt(context: string, data: SenseiData, session?: WorkoutSession): string {
  switch (context) {
    case 'workout_review':
      if (!session) return '';
      const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
      const completedSets = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0);
      const programContextStr = data.programName
        ? `\nPROGRAM: ${data.programName} (${data.programStyle}) — Week ${data.programWeek}, Day ${data.programDay}`
        : '\nPROGRAM: Free Workout (no active program)';
      const styleTip = data.programStyle
        ? `\nStyle-specific coaching: ${STYLE_COACHING[data.programStyle] || ''}`
        : '';
      const exerciseDetail = session.exercises.map(e => {
        const comp = e.sets.filter(s => s.completed).length;
        const formC = e.sets.filter(s => Object.keys(s.formResults || {}).length > 0);
        const formPct = formC.length > 0
          ? Math.round(formC.reduce((sum, s) => {
              const v = Object.values(s.formResults || {});
              return sum + (v.filter(Boolean).length / Math.max(v.length, 1));
            }, 0) / formC.length * 100) : -1;
        const coaching = EXERCISE_COACHING[e.exercise.name] || '';
        return `  · ${e.exercise.name} (kanji: ${e.exercise.kanji}) — ${comp}/${e.sets.length} sets${formPct >= 0 ? `, form: ${formPct}%` : ''}${coaching ? '\n    Tip: ' + coaching : ''}`;
      }).join('\n');
      return [
        `You are Sensei, a wise Japanese gym coach. Analyze this workout with precision.`,
        `Speak with discipline and wisdom. Use ✓ and ✗ marks. Reference specific exercises and numbers.`,
        `Keep to 3-4 sentences. Be direct, not vague.`,
        ``,
        `WARRIOR PROFILE`,
        `  Level ${data.level} · ${data.rankName} · ${data.totalXP} XP`,
        `  Streak: ${data.streak} days · Workouts: ${data.workoutsCompleted}`,
        programContextStr,
        styleTip,
        ``,
        `WORKOUT: ${session.name} (${session.kanji})`,
        `  Sets completed: ${completedSets}/${totalSets}`,
        `  ${data.formSummary}`,
        `  ${data.restSummary}`,
        `  PRs: ${data.prs}`,
        ``,
        `EXERCISE BREAKDOWN`,
        exerciseDetail,
        `  ${data.gaps}`,
        ``,
        `STRUCTURE YOUR RESPONSE:`,
        `1. One sentence acknowledging the overall effort (✓ specific exercises).`,
        `2. One sentence on what needs improvement (✗ specific issue).`,
        `3. One sentence of actionable coaching advice (reference one exercise by name).`,
        `4. One closing aphorism with a kanji character.`,
        `If streak > 0 mention it. If form was tracked, reference it.`,
        `If there is a program context, reference the program style in your coaching.`,
      ].join('\n');

    case 'form_check': {
      return [
        `You are Sensei, a gym form coach. Analyze the warrior's form data.`,
        `Be direct and specific. Use ✓ and ✗. Max 2 sentences.`,
        ``,
        `Form summary: ${data.formSummary}`,
        `Recent gaps: ${data.gaps}`,
        ``,
        `Give specific corrective advice. Reference one body part or movement cue.`,
      ].join('\n');
    }

    case 'daily_advice': {
      const period = getPeriodOfDay();
      const periodAdvice = period === 'morning'
        ? 'Morning training builds discipline for the entire day.'
        : period === 'afternoon'
        ? 'The body is warm, joints are mobile — good time for strength work.'
        : 'Evening training releases the day\'s stress. Focus on form and flow.';

      return [
        `You are Sensei, a wise Japanese gym coach. Give the warrior daily training wisdom.`,
        `Speak with discipline and warmth. Be specific to their data. Max 3 sentences.`,
        `End with a single kanji character and a short phrase.`,
        ``,
        `WARRIOR STATUS`,
        `  Level ${data.level} · ${data.rankName} · ${data.totalXP} total XP`,
        `  Streak: ${data.streak} days`,
        `  Workouts completed: ${data.workoutsCompleted}`,
        `  Recent PRs: ${data.prs}`,
        `  ${data.formSummary}`,
        `  ${data.gaps}`,
        ``,
        `TIME: ${period.toUpperCase()}`,
        `  ${periodAdvice}`,
        ``,
        `STRUCTURE:`,
        `1. Greeting acknowledging streak or recent PR if applicable.`,
        `2. Specific advice based on their data (rest, form, strength, consistency).`,
        `3. Closing kanji aphorism. Keep the tone wise and motivational.`,
        `If streak >= 7: emphasize consistency. If no workout today: encourage.`,
        `If they have form gaps: give one correction tip.`,
      ].join('\n');
    }

    case 'nutrition_tip': {
      return [
        `You are Sensei, a nutrition coach for a warrior athlete. Give 1-2 sentences.`,
        `Be practical and direct. Reference timing (pre/post workout).`,
        ``,
        `Warrior: Level ${data.level} · ${data.rankName}`,
        `Workouts completed: ${data.workoutsCompleted}`,
        `Streak: ${data.streak} days`,
        ``,
        `Give a specific nutrition tip. Consider:`,
        `- If streak > 0: post-workout nutrition timing`,
        `- If streak === 0: general healthy eating habit`,
        `- Protein intake suggestion based on training frequency`,
        `End with a short kanji.`,
      ].join('\n');
    }

    default:
      return '';
  }
}

function getPeriodOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

// ── Per-Exercise Mastery Analysis ──────────────────────────────────────────

interface PerExerciseResult {
  name: string;
  kanji: string;
  completionRate: number;
  formAvg: number;
  grade: string;
  issues: string[];
  praises: string[];
}

export function analyzePerExercise(session: WorkoutSession): PerExerciseResult[] {
  return session.exercises.map(ex => {
    const total = ex.sets.length;
    const completed = ex.sets.filter(s => s.completed).length;
    const compRate = total > 0 ? completed / total : 0;

    const formSets = ex.sets.filter(s => s.formResults && Object.keys(s.formResults).length > 0);
    let fAvg = 0.5;
    if (formSets.length > 0) {
      fAvg = formSets.reduce((sum, s) => {
        const vals = Object.values(s.formResults || {});
        return sum + (vals.filter(Boolean).length / Math.max(vals.length, 1));
      }, 0) / formSets.length;
    }

    const grade = fAvg >= 0.95 ? 'S' : fAvg >= 0.85 ? 'A' : fAvg >= 0.70 ? 'B' : fAvg >= 0.50 ? 'C' : 'D';

    const issues: string[] = [];
    const praises: string[] = [];
    if (compRate < 1) issues.push(`${Math.round((1 - compRate) * 100)}% sets uncompleted`);
    if (fAvg < 0.7) issues.push(`Form needs refinement (${Math.round(fAvg * 100)}%)`);
    if (fAvg >= 0.85) praises.push(`Great form (${Math.round(fAvg * 100)}%)`);
    if (compRate === 1) praises.push('All sets completed');

    return {
      name: ex.exercise.name,
      kanji: ex.exercise.kanji,
      completionRate: compRate,
      formAvg: fAvg,
      grade,
      issues,
      praises,
    };
  });
}

export function analyzeMastery(session: WorkoutSession): MasteryResult {
  const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
  const completedSets = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.completed).length, 0);
  const completionRate = totalSets > 0 ? completedSets / totalSets : 0;

  // Per-exercise form gives us a more detailed picture
  const perEx = analyzePerExercise(session);
  const formAvg = perEx.length > 0 ? perEx.reduce((a, p) => a + p.formAvg, 0) / perEx.length : 0.5;

  // Enhanced rest scoring: balanced, optimal, poor
  const setsWithRest = session.exercises.flatMap(e => e.sets.filter(s => s.restTimeUsed));
  let restScore = 0.5;
  if (setsWithRest.length > 0) {
    // Optimal rest: 60-120s for strength/hypertrophy; 30-60s for endurance
    const optimalRest = setsWithRest.filter(s => {
      const r = s.restTimeUsed!;
      return (r >= 60 && r <= 120);
    }).length;
    const acceptableRest = setsWithRest.filter(s => {
      const r = s.restTimeUsed!;
      return (r >= 30 && r < 60) || (r > 120 && r <= 180);
    }).length;
    const poorRest = setsWithRest.length - optimalRest - acceptableRest;
    restScore = (optimalRest * 1.0 + acceptableRest * 0.6 + poorRest * 0.2) / setsWithRest.length;
  }

  // Overload score: progression awareness
  const overloadScore = completedSets > 0 ? Math.min(1, completedSets / Math.max(totalSets, 1) * 1.2) : 0.2;

  // Completion consistency: did they finish each exercise or skip around?
  const exCompletionRate = session.exercises.filter(e => {
    return e.sets.length > 0 && e.sets.every(s => s.completed);
  }).length / Math.max(session.exercises.length, 1);

  const masteryScore = Math.min(1, Math.max(0,
    0.30 * completionRate +
    0.25 * formAvg +
    0.15 * restScore +
    0.10 * exCompletionRate +
    0.20 * overloadScore
  ));

  let grade: string;
  if (masteryScore >= 0.93) grade = 'S';
  else if (masteryScore >= 0.82) grade = 'A';
  else if (masteryScore >= 0.65) grade = 'B';
  else if (masteryScore >= 0.45) grade = 'C';
  else grade = 'D';

  const issues: string[] = [];
  const praises: string[] = [];
  const perExDetail = perEx.filter(p => p.issues.length > 0 || p.praises.length > 0);

  for (const p of perExDetail) {
    if (p.praises.length > 0) praises.push(`${p.name}: ${p.praises[0]}`);
    if (p.issues.length > 0) issues.push(`${p.name}: ${p.issues[0]}`);
  }

  if (completionRate < 0.8) issues.push(`Overall: ${Math.round((1 - completionRate) * 100)}% sets incomplete`);
  if (formAvg < 0.6) issues.push(`Overall form avg: ${Math.round(formAvg * 100)}% — needs focus`);
  if (restScore < 0.4) issues.push('Rest discipline inconsistent');
  if (completionRate === 1 && praises.length === 0) praises.push('All sets completed with dedication');
  if (formAvg >= 0.85 && !praises.some(p => p.includes('form'))) praises.push(`Excellent overall form (${Math.round(formAvg * 100)}%)`);

  return {
    score: masteryScore,
    grade,
    completionRate,
    formAvg,
    restScore,
    overloadBonus: overloadScore > 0.5,
    issues,
    praises,
    perExercise: perEx,
  };
}

export function calculateFinalXP(baseXP: number, mastery: MasteryResult, xpMultiplier: number = 1): number {
  const gradeMult: Record<string, number> = { S: 1.3, A: 1.15, B: 1.0, C: 0.8, D: 0.6 };
  const mult = gradeMult[mastery.grade] || 1.0;
  return Math.round(baseXP * mastery.score * mult * xpMultiplier);
}

export async function getSenseiMessage(
  context: CoachContext | 'workout_review' | 'daily_advice' | 'nutrition_tip',
  data: SenseiData,
  session?: WorkoutSession,
  useLLM = true,
): Promise<string> {
  if (!useLLM) {
    return getFallbackMessage(context, data);
  }

  const prompt = buildReviewPrompt(context, data, session);
  if (!prompt) return getFallbackMessage(context, data);

  const systemPrompt = 'You are Sensei, a wise Japanese gym coach and martial arts master. You speak with discipline, warmth, and precision. Use kanji characters naturally. Keep responses to 3-4 sentences. Be direct and actionable — never vague. Reference specific numbers, exercises, and body parts.';

  try {
    const result = await callSenseiAI(systemPrompt, prompt);
    if (result) return result;
  } catch {}

  return getFallbackMessage(context, data);
}

function getFallbackMessage(context: string, data: SenseiData): string {
  if (data.streak === 0 && data.workoutsCompleted === 0) {
    return 'Your journey starts today, warrior. Every master was once a beginner. 道 (The path)';
  }
  if (data.streak === 0) {
    return 'Welcome back, warrior. The path awaits your footsteps. 歩 (Step)';
  }
  if (context === 'workout_review') {
    if (data.streak >= 7) return `A ${data.streak}-day streak and a workout completed. The shadow cannot keep up. 強 (Strength)`;
    return 'Your body speaks. Listen to it. Rest, recover, grow. 静 (Stillness)';
  }
  if (context === 'daily_advice') {
    if (data.streak >= 30) return `${data.streak} days unbroken. You have become the warrior. 士 (Warrior)`;
    if (data.streak >= 7) return `${data.streak}-day streak. Consistency is your superpower. 続 (Continue)`;
    if (data.workoutsCompleted >= 50) return `${data.workoutsCompleted} total workouts. Your dedication is your blade. 刃 (Blade)`;
    return 'Train with purpose. Let each rep be a meditation. 念 (Mindfulness)';
  }
  if (context === 'nutrition_tip') {
    return 'Fuel the body, sharpen the mind. Protein within 30min post-workout maximizes recovery. 食 (Eat)';
  }
  return 'Discipline is the bridge between goals and accomplishment. 道 (Path)';
}

// Re-export for external use
export type { PerExerciseResult };
export { EXERCISE_COACHING };

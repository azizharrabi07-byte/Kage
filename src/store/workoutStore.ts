import { WorkoutSession, WorkoutTemplate, WorkoutExercise, TrainingStyle } from './types';
import { apiGetWorkouts, apiSaveWorkout } from './api';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export async function saveWorkoutSession(session: WorkoutSession): Promise<void> {
  await apiSaveWorkout(session);
}

export async function getWorkoutHistory(): Promise<WorkoutSession[]> {
  return (await apiGetWorkouts()) || [];
}

export async function getLatestSession(): Promise<WorkoutSession | null> {
  const history = await getWorkoutHistory();
  return history[0] || null;
}

export function createWorkoutSession(template: WorkoutTemplate): WorkoutSession {
  const exercises: WorkoutExercise[] = template.exercises.map((ex) => ({
    exercise: ex,
    sets: Array.from({ length: ex.sets }, (_, i) => ({
      id: generateId(),
      setNumber: i + 1,
      reps: ex.reps,
      weight: ex.weight || 0,
      completed: false,
      formResults: {},
    })),
    completed: false,
  }));

  return {
    id: generateId(),
    name: template.name,
    kanji: template.kanji,
    startedAt: Date.now(),
    exercises,
    totalXP: 0,
    baseXP: 0,
    mastery: undefined,
    xpBreakdown: { strength: 0, discipline: 0, endurance: 0, focus: 0 },
  };
}

export function createProgramWorkoutSession(
  name: string,
  kanji: string,
  exercises: {
    exercise: { id: string; name: string; target: string; sets: number; reps: number; weight?: number; duration?: number; kanji: string; category: string; movementType: string; steps: string[] };
    targetSets: number;
    targetReps: string;
    targetWeight: string;
    restSeconds?: number;
    notes?: string;
    allowSwap?: boolean;
  }[],
  programId?: string,
  programWeek?: number,
  programDay?: number,
  programStyle?: TrainingStyle,
): WorkoutSession {
  const workoutExercises: WorkoutExercise[] = exercises.map((ex) => {
    const repsNum = parseInt(ex.targetReps) || 10;
    return {
      exercise: {
        id: ex.exercise.id,
        name: ex.exercise.name,
        target: ex.exercise.target,
        sets: ex.targetSets,
        reps: repsNum,
        weight: parseInt(ex.targetWeight) || ex.exercise.weight || 0,
        duration: ex.exercise.duration,
        kanji: ex.exercise.kanji,
        category: ex.exercise.category as any,
        movementType: ex.exercise.movementType as any,
        steps: ex.exercise.steps,
      },
      sets: Array.from({ length: ex.targetSets }, (_, i) => ({
        id: generateId(),
        setNumber: i + 1,
        reps: repsNum,
        weight: parseInt(ex.targetWeight) || ex.exercise.weight || 0,
        completed: false,
        formResults: {},
      })),
      completed: false,
      notes: ex.notes,
      allowSwap: ex.allowSwap,
      restSeconds: ex.restSeconds,
    };
  });

  return {
    id: generateId(),
    name,
    kanji,
    startedAt: Date.now(),
    exercises: workoutExercises,
    totalXP: 0,
    baseXP: 0,
    mastery: undefined,
    programId,
    programWeek,
    programDay,
    programStyle,
    xpBreakdown: { strength: 0, discipline: 0, endurance: 0, focus: 0 },
  };
}

// Exercise difficulty multiplier for XP
const DIFFICULTY_MULT: Record<string, number> = {
  'steel deadlift': 1.4, 'iron squat': 1.3, 'warrior pull-up': 1.3, 'stone lift': 1.2,
  'shadow push': 1.1, 'crimson press': 1.1, 'samurai row': 1.0, 'ronin lunge': 1.0,
  'dragon squat': 1.1, 'on press': 1.0, 'blade curl': 0.9, 'dojo dip': 1.0,
};

// Suggested rest times by exercise type (seconds)
const SUGGESTED_REST: Record<string, { min: number; max: number; label: string }> = {
  push: { min: 60, max: 120, label: '60-120s (strength)' },
  pull: { min: 60, max: 120, label: '60-120s (strength)' },
  squat: { min: 90, max: 180, label: '90-180s (heavy)' },
  hinge: { min: 90, max: 180, label: '90-180s (heavy)' },
  lunge: { min: 60, max: 90, label: '60-90s' },
  press: { min: 60, max: 120, label: '60-120s (strength)' },
  row: { min: 60, max: 90, label: '60-90s' },
  curl: { min: 45, max: 60, label: '45-60s (isolation)' },
  extension: { min: 45, max: 60, label: '45-60s (isolation)' },
  hold: { min: 30, max: 60, label: '30-60s (core)' },
  sprint: { min: 60, max: 120, label: '60-120s (full recovery)' },
  slam: { min: 45, max: 90, label: '45-90s (power)' },
  twist: { min: 45, max: 60, label: '45-60s' },
};

export function calculateBaseXP(session: WorkoutSession): number {
  const totalSets = session.exercises.reduce((a, e) => a + e.sets.length, 0);
  const completedSets = session.exercises.reduce(
    (a, e) => a + e.sets.filter((s) => s.completed).length,
    0
  );
  const ratio = totalSets > 0 ? completedSets / totalSets : 0;

  // Difficulty-weighted XP
  let difficultyMult = 1.0;
  const exNames = session.exercises.map(e => e.exercise.name.toLowerCase());
  for (const name of exNames) {
    for (const [key, mult] of Object.entries(DIFFICULTY_MULT)) {
      if (name.includes(key)) {
        difficultyMult = Math.max(difficultyMult, mult);
        break;
      }
    }
  }

  // Volume bonus: more sets = more XP
  const volumeBonus = 1 + (totalSets > 12 ? 0.2 : totalSets > 8 ? 0.1 : 0);

  return Math.round(ratio * 100 * 2.45 * difficultyMult * volumeBonus);
}

export function getSuggestedRest(exerciseName: string): string {
  const name = exerciseName.toLowerCase();
  for (const ex of EXERCISE_REST_MAP) {
    if (name.includes(ex.key)) return ex.rest;
  }
  return '60-90s';
}

export function getRestRange(movementType: string): { min: number; max: number } {
  const sug = SUGGESTED_REST[movementType] || { min: 60, max: 90 };
  return { min: sug.min, max: sug.max };
}

const EXERCISE_REST_MAP = [
  { key: 'deadlift', rest: '120-180s (heavy compound)' },
  { key: 'squat', rest: '90-180s (heavy compound)' },
  { key: 'pull-up', rest: '90-120s (strength)' },
  { key: 'bench', rest: '60-120s (strength)' },
  { key: 'press', rest: '60-120s (strength)' },
  { key: 'row', rest: '60-90s (volume)' },
  { key: 'lunge', rest: '60-90s' },
  { key: 'curl', rest: '45-60s (isolation)' },
  { key: 'dip', rest: '60-90s' },
  { key: 'raise', rest: '45-60s (isolation)' },
  { key: 'plank', rest: '30-45s (core)' },
  { key: 'crunch', rest: '30-45s (core)' },
  { key: 'sprint', rest: '60-120s (full recovery)' },
  { key: 'slam', rest: '45-90s (power)' },
];

export function getWarmupSuggestion(exerciseName: string): string {
  const name = exerciseName.toLowerCase();
  if (name.includes('squat') || name.includes('deadlift') || name.includes('lunge'))
    return 'Glute bridges, ankle mobility, bodyweight squats ×10';
  if (name.includes('bench') || name.includes('push') || name.includes('press'))
    return 'Band pull-aparts, scapula push-ups, light set ×8';
  if (name.includes('row') || name.includes('pull'))
    return 'Band pull-aparts, scapula retractions, lat activation ×8';
  if (name.includes('curl') || name.includes('dip') || name.includes('raise'))
    return 'Light warm-up set ×10-12 with 50% weight';
  if (name.includes('sprint') || name.includes('slam'))
    return 'Jumping jacks, leg swings, light movement prep 2min';
  return 'Light warm-up set ×8 with 50% weight';
}

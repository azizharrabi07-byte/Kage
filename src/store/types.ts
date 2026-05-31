export type MovementType = 'push' | 'pull' | 'squat' | 'hinge' | 'lunge' | 'twist' | 'press' | 'row' | 'curl' | 'extension' | 'hold' | 'sprint' | 'slam';

export type ExerciseCategory = 'push' | 'pull' | 'legs' | 'core' | 'cardio' | 'full';

export interface Exercise {
  id: string;
  name: string;
  target: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  kanji: string;
  category: ExerciseCategory;
  movementType: MovementType;
  steps: string[];
  photo?: string;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
  completedAt?: number;
  formResults: Record<string, boolean>;
  formNotes?: string;
  restTimeUsed?: number;
  videoFrame?: string;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: WorkoutSet[];
  completed: boolean;
  startedAt?: number;
  completedAt?: number;
  notes?: string;
  allowSwap?: boolean;
  restSeconds?: number;
}

export interface PerExerciseMastery {
  name: string;
  kanji: string;
  completionRate: number;
  formAvg: number;
  grade: string;
  issues: string[];
  praises: string[];
}

export interface MasteryResult {
  score: number;
  grade: string;
  completionRate: number;
  formAvg: number;
  restScore: number;
  overloadBonus: boolean;
  issues: string[];
  praises: string[];
  perExercise?: PerExerciseMastery[];
}

export interface WorkoutSession {
  id: string;
  name: string;
  kanji: string;
  startedAt: number;
  completedAt?: number;
  exercises: WorkoutExercise[];
  totalXP: number;
  baseXP?: number;
  mastery?: MasteryResult;
  programId?: string;
  programWeek?: number;
  programDay?: number;
  programStyle?: TrainingStyle;
  xpBreakdown: {
    strength: number;
    discipline: number;
    endurance: number;
    focus: number;
  };
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  kanji: string;
  description: string;
  exercises: Exercise[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'warrior';
}

export type WorkoutPhase = 'idle' | 'active' | 'rest' | 'complete';

export type TrainingStyle = 'powerlifting' | 'calisthenics' | 'hypertrophy' | 'cardio' | 'mixed';

export interface ProgramWeeklyTarget {
  sets: number;
  reps: string;
  weight: string;
}

export interface ProgramExerciseSlot {
  exerciseId: string;
  weekly: ProgramWeeklyTarget[];
  restSeconds: number;
  notes?: string;
  allowSwap: boolean;
}

export interface ProgramDay {
  dayNumber: number;
  label: string;
  kanji: string;
  exercises: ProgramExerciseSlot[];
}

export interface ProgramWeek {
  weekNumber: number;
  label: string;
  theme: string;
}

export interface ProgramDayTemplate {
  dayNumber: number;
  label: string;
  kanji: string;
  exercises: ProgramExerciseSlot[];
}

export interface TrainingProgram {
  id: string;
  name: string;
  kanji: string;
  description: string;
  longDescription: string;
  style: TrainingStyle;
  durationWeeks: number;
  daysPerWeek: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  weeks: ProgramWeek[];
  dayTemplates: ProgramDayTemplate[];
  xpMultiplier: number;
  color: string;
  benefits?: {
    whoThisIsFor: string;
    physical: string[];
    mental: string[];
  };
}

export interface CompletedDay {
  week: number;
  day: number;
  completedAt: number;
  sessionId?: string;
}

export interface PlayerProgram {
  programId: string;
  currentWeek: number;
  currentDay: number;
  startedAt: number;
  completedDays: CompletedDay[];
  isActive: boolean;
  swaps?: Record<string, string>;
}
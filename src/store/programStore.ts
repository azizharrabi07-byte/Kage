import { PlayerProgram, CompletedDay, ProgramDay, ProgramExerciseSlot, TrainingProgram } from './types';
import { TRAINING_PROGRAMS } from '../constants/programs';
import { exerciseLibrary } from '../constants/workouts';
import { apiGetProgram, apiSaveProgram, apiDeleteProgram } from './api';

export async function loadPlayerProgram(): Promise<PlayerProgram | null> {
  return apiGetProgram();
}

export async function savePlayerProgram(pp: PlayerProgram): Promise<void> {
  await apiSaveProgram(pp);
}

export async function deletePlayerProgram(): Promise<void> {
  await apiDeleteProgram();
}

export function getProgramById(id: string): TrainingProgram | undefined {
  return TRAINING_PROGRAMS.find(p => p.id === id);
}

export function getExerciseById(id: string) {
  return exerciseLibrary.find(e => e.id === id);
}

export function getProgramDay(program: TrainingProgram, weekNumber: number, dayNumber: number): ProgramDay | null {
  const week = program.weeks.find(w => w.weekNumber === weekNumber);
  if (!week) return null;
  const template = program.dayTemplates.find(d => d.dayNumber === dayNumber);
  if (!template) return null;
  return template;
}

// Fix C6: use getSwappedExerciseId to respect user swaps
export function getResolvedExercises(
  program: TrainingProgram,
  weekNumber: number,
  dayNumber: number,
  pp?: PlayerProgram,
) {
  const template = program.dayTemplates.find(d => d.dayNumber === dayNumber);
  if (!template) return [];
  const wIdx = weekNumber - 1;
  return template.exercises.map(slot => {
    const exId = pp ? getSwappedExerciseId(pp, weekNumber, dayNumber, slot.exerciseId) : slot.exerciseId;
    const ex = getExerciseById(exId);
    const target = slot.weekly[wIdx] || slot.weekly[0];
    return {
      ...slot,
      exercise: ex || null,
      currentWeekTarget: target,
    };
  });
}

// Fix C3 + M2: simplified sequential completion gating + advance currentWeek/currentDay
export function isDayUnlocked(playerProgram: PlayerProgram, weekNumber: number, dayNumber: number): boolean {
  const idx = getAllDaysIndex(playerProgram, weekNumber, dayNumber);
  return idx <= playerProgram.completedDays.length;
}

export function getAllDaysIndex(pp: PlayerProgram, week: number, day: number): number {
  const prog = getProgramById(pp.programId);
  if (!prog) return 0;
  let count = 0;
  for (const w of prog.weeks) {
    for (const tmpl of prog.dayTemplates) {
      if (w.weekNumber === week && tmpl.dayNumber === day) return count;
      count++;
    }
  }
  return count;
}

export function getCurrentWeekDay(pp: PlayerProgram): { week: number; day: number } {
  const completedKeys = new Set(pp.completedDays.map(d => `${d.week}-${d.day}`));
  const prog = getProgramById(pp.programId);
  if (!prog) return { week: 1, day: 1 };

  for (const w of prog.weeks) {
    for (const tmpl of prog.dayTemplates) {
      const key = `${w.weekNumber}-${tmpl.dayNumber}`;
      if (!completedKeys.has(key)) {
        return { week: w.weekNumber, day: tmpl.dayNumber };
      }
    }
  }
  return { week: prog.durationWeeks, day: prog.dayTemplates.length };
}

export function getProgress(pp: PlayerProgram): { completed: number; total: number; percent: number } {
  const prog = getProgramById(pp.programId);
  if (!prog) return { completed: 0, total: 0, percent: 0 };
  const total = prog.weeks.length * prog.dayTemplates.length;
  const completed = pp.completedDays.length;
  return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

// Fix C3: advance currentWeek/currentDay after marking day complete
export function markDayComplete(pp: PlayerProgram, week: number, day: number): PlayerProgram {
  const exists = pp.completedDays.some(d => d.week === week && d.day === day);
  if (exists) return pp;
  const updated: PlayerProgram = {
    ...pp,
    completedDays: [...pp.completedDays, { week, day, completedAt: Date.now() }],
  };
  const next = getCurrentWeekDay(updated);
  updated.currentWeek = next.week;
  updated.currentDay = next.day;
  return updated;
}

// Fix C6: store swaps globally (ignores week/day — any occurrence of oldExerciseId is swapped)
export function swapExerciseInProgram(
  pp: PlayerProgram,
  oldExerciseId: string,
  newExerciseId: string,
): PlayerProgram {
  return {
    ...pp,
    swaps: {
      ...(pp.swaps || {}),
      [oldExerciseId]: newExerciseId,
    },
  };
}

// Fix C6 + 19: use ?? instead of ||
export function getSwappedExerciseId(pp: PlayerProgram, _weekNumber: number, _dayNumber: number, exerciseId: string): string {
  return pp.swaps?.[exerciseId] ?? exerciseId;
}

export function createPlayerProgram(programId: string): PlayerProgram {
  return {
    programId,
    currentWeek: 1,
    currentDay: 1,
    startedAt: Date.now(),
    completedDays: [],
    isActive: true,
    swaps: {},
  };
}

export function getProgramStyle(id: string): string {
  const prog = getProgramById(id);
  return prog?.style ?? 'mixed';
}

export function getProgramName(id: string): string {
  const prog = getProgramById(id);
  return prog?.name ?? 'Unknown';
}

export function getProgramXpMultiplier(id?: string): number {
  if (!id) return 1;
  const prog = getProgramById(id);
  return prog?.xpMultiplier ?? 1;
}

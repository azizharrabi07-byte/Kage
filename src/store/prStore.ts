import { apiGetPRs, apiSavePRs, apiGetExerciseHistory, apiSaveExerciseRecord } from './api'; // legacy local fallback
import { workoutsApi } from '../api/apiClient';

function getAuthToken(): string | undefined {
  return undefined; // will be improved with real auth context
}

export interface PRRecord {
  maxWeight: number;
  maxWeightReps: number;
  maxReps: number;
  maxRepsWeight: number;
  totalVolume: number;
  bestSet: { weight: number; reps: number; date: number } | null;
  lastUsed: number;
}

export interface ExerciseRecord {
  date: number;
  weight: number;
  reps: number;
  setNumber: number;
  exerciseName: string;
}

export type PRMap = Record<string, PRRecord>;

function defaultPR(): PRRecord {
  return {
    maxWeight: 0, maxWeightReps: 0, maxReps: 0, maxRepsWeight: 0,
    totalVolume: 0, bestSet: null, lastUsed: 0,
  };
}

export async function getPRs(): Promise<PRMap> {
  // Prefer real backend PRs (new /prs endpoint)
  try {
    const res: any = await workoutsApi.getPRs(getAuthToken());
    if (res?.prs && Array.isArray(res.prs)) {
      const map: PRMap = {};
      res.prs.forEach((p: any) => {
        map[p.exercise_name] = {
          maxWeight: p.best_weight || 0,
          maxWeightReps: p.best_reps || 0,
          maxReps: p.best_reps || 0,
          maxRepsWeight: p.best_weight || 0,
          totalVolume: p.best_volume || 0,
          bestSet: p.best_weight ? { weight: p.best_weight, reps: p.best_reps || 1, date: Date.now() } : null,
          lastUsed: Date.now(),
        };
      });
      return map;
    }
  } catch (e) {
    console.warn('Backend PRs not available, using local');
  }

  return (await apiGetPRs()) || {};
}

export async function updatePR(exerciseName: string, weight: number, reps: number): Promise<PRMap> {
  const prs = await getPRs();
  const current = prs[exerciseName] || defaultPR();
  current.totalVolume += weight * reps;
  current.lastUsed = Date.now();
  if (weight > current.maxWeight) { current.maxWeight = weight; current.maxWeightReps = reps; }
  if (reps > current.maxReps) { current.maxReps = reps; current.maxRepsWeight = weight; }
  if (!current.bestSet || (weight * reps) > (current.bestSet.weight * current.bestSet.reps)) {
    current.bestSet = { weight, reps, date: Date.now() };
  }
  prs[exerciseName] = current;
  await apiSavePRs(prs);
  return prs;
}

export async function saveExerciseRecord(exerciseName: string, weight: number, reps: number, setNumber: number): Promise<void> {
  await apiSaveExerciseRecord({ date: Date.now(), weight, reps, setNumber, exerciseName });
}

export async function getExerciseHistory(exerciseName: string): Promise<ExerciseRecord[]> {
  const data = await apiGetExerciseHistory(exerciseName);
  return data || [];
}

export async function getRecentPRs(limit = 5): Promise<{ name: string; record: PRRecord }[]> {
  const prs = await getPRs();
  return Object.entries(prs)
    .filter(([, r]) => r.lastUsed > 0)
    .sort(([, a], [, b]) => b.lastUsed - a.lastUsed)
    .slice(0, limit)
    .map(([name, record]) => ({ name, record }));
}

export async function getTopPRsByVolume(limit = 10): Promise<{ name: string; record: PRRecord }[]> {
  const prs = await getPRs();
  return Object.entries(prs)
    .sort(([, a], [, b]) => b.totalVolume - a.totalVolume)
    .slice(0, limit)
    .map(([name, record]) => ({ name, record }));
}

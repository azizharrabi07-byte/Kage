// Module-level state for program workout context.
// Set before navigating to workout, cleared on finish.
import { WorkoutSession } from './types';

let _pendingProgramWorkout: (() => WorkoutSession) | null = null;
let _programCompletionCallback: (() => Promise<void>) | null = null;

export function setProgramWorkoutFactory(fn: () => WorkoutSession) {
  _pendingProgramWorkout = fn;
}

export function getProgramWorkoutFactory(): (() => WorkoutSession) | null {
  return _pendingProgramWorkout;
}

export function clearProgramWorkoutFactory() {
  _pendingProgramWorkout = null;
}

export function setProgramCompletionCallback(fn: () => Promise<void>) {
  _programCompletionCallback = fn;
}

export function getProgramCompletionCallback(): (() => Promise<void>) | null {
  return _programCompletionCallback;
}

export function clearProgramCompletionCallback() {
  _programCompletionCallback = null;
}

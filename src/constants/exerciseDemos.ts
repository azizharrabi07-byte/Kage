// Exercise Demo Photos / Images
// Recommended: Put photos in assets/images/exercises/
// For now we are using assets/gifs/ — you can move later.
// The filename in require() MUST match the actual file name EXACTLY.

export const exerciseDemos: Record<string, any> = {
  // === Tier 1 ===
  'Iron Squat': require('../../assets/gifs/Iron Squat.gif'),
  'Steel Deadlift': require('../../assets/gifs/steel deadlift (2).gif'),
  'Shadow Push': require('../../assets/gifs/shadow push.gif'),
  'Samurai Row': require('../../assets/gifs/Samurai Row.gif'),
  'Ronin Lunge': require('../../assets/gifs/Ronin Lunge.gif'),

  // === Tier 2 ===
  'Warrior Pull-up': require('../../assets/gifs/Warrior Pull-up.gif'),
  'Crimson Press': require('../../assets/gifs/Crimson Press .gif'),
  'Blade Curl': require('../../assets/gifs/Blade Curl  .gif'),
  'Dojo Dip': require('../../assets/gifs/Dojo Dip .gif'),
  'Dragon Squat': require('../../assets/gifs/Dragon Squat .gif'),
  'Silent Plank': require('../../assets/gifs/Silent Plank  .gif'),
};

// Helper function
export function getExerciseDemo(exerciseName: string): any {
  try {
    const result = exerciseDemos[exerciseName];
    if (!result) {
      console.warn(`[ExerciseDemo] No photo found for: "${exerciseName}"`);
    }
    return result || null;
  } catch (e) {
    console.error(`[ExerciseDemo] Failed to load photo for "${exerciseName}":`, e);
    return null;
  }
}
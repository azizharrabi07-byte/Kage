// Exercise Demo Photos (Professional standard)
// User is providing clean photos. Place them in assets/images/exercises/
// Use exact names from the list below.

export const exerciseDemos: Record<string, any> = {
  // === Mapped to files you actually uploaded ===
  'Iron Squat': require('../../assets/images/exercises/iron-squat.jpg'),
  'Steel Deadlift': require('../../assets/images/exercises/steel-daedlift.jpg'),   // note: filename typo kept as uploaded
  'Shadow Push': require('../../assets/images/exercises/shadow-push.jpg'),
  'Samurai Row': require('../../assets/images/exercises/samurai-row.jpg'),
  'Ronin Lunge': require('../../assets/images/exercises/ronin-lunge.jpg'),

  'Crimson Press': require('../../assets/images/exercises/crismon-press.jpg'),   // note: filename typo kept as uploaded
  'Blade Curl': require('../../assets/images/exercises/blade-curl.jpg'),
  'Dojo Dip': require('../../assets/images/exercises/dojo-dip.jpg'),
  'Dragon Squat': require('../../assets/images/exercises/dragon-squat.jpg'),
  'Silent Plank': require('../../assets/images/exercises/silent-plank.jpg'),

  'Eastern Hinge': require('../../assets/images/exercises/eastern-hinge.jpg'),
  'Iron Draw': require('../../assets/images/exercises/iron-draw.jpg'),
};

// Helper function - now wired to your uploaded photos
export function getExerciseDemo(exerciseName: string): any {
  try {
    const result = exerciseDemos[exerciseName];
    if (result) {
      return result;
    }
    // Fallback: try common variations
    const variations = [
      exerciseName.toLowerCase().replace(/\s+/g, '-'),
      exerciseName.replace(/\s+/g, '-'),
    ];
    console.warn(`[Kage Photos] No exact match for "${exerciseName}". Consider adding it.`);
    return null;
  } catch (e) {
    console.warn(`[Kage Photos] Failed to load photo for: ${exerciseName}`);
    return null;
  }
}
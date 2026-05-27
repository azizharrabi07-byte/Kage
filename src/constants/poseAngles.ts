export interface AngleCheck {
  name: string;
  landmarks: [number, number, number];
  idealMin: number;
  idealMax: number;
  cues: { tooHigh?: string; tooLow?: string; pass?: string };
  priority: 'critical' | 'important' | 'refinement';
}

export const EXERCISE_ANGLES: Record<string, AngleCheck[]> = {
  'Shadow Push': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 85, idealMax: 175, cues: { tooLow: 'Flare elbows less, keep 45°', pass: 'Elbow angle good' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 70, idealMax: 100, cues: { tooHigh: 'Don\'t flare elbows', pass: 'Shoulder packed' }, priority: 'important' },
    { name: 'Wrist', landmarks: [12, 14, 15], idealMin: 160, idealMax: 190, cues: { tooLow: 'Keep wrists straight', pass: 'Wrists neutral' }, priority: 'important' },
  ],
  'Samurai Row': [
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 155, idealMax: 185, cues: { tooLow: 'Back is rounding, hinge more', pass: 'Back flat' }, priority: 'critical' },
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 40, idealMax: 100, cues: { tooHigh: 'Drive elbows past ribcage', pass: 'Good elbow drive' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 60, idealMax: 110, cues: { tooLow: 'Hips rising, stay stable', pass: 'Hips stable' }, priority: 'refinement' },
  ],
  'Iron Squat': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 80, idealMax: 130, cues: { tooLow: 'Knees caving, push out', pass: 'Knee tracking good' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 60, idealMax: 110, cues: { tooHigh: 'Break at hips first', pass: 'Good depth' }, priority: 'critical' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Chest down, stay upright', pass: 'Chest up' }, priority: 'important' },
  ],
  'Crimson Press': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 160, idealMax: 185, cues: { tooLow: 'Lock out at top', pass: 'Full extension' }, priority: 'important' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 160, idealMax: 190, cues: { tooHigh: 'Don\'t arch back', pass: 'Core braced' }, priority: 'critical' },
    { name: 'Wrist', landmarks: [14, 15, 5], idealMin: 150, idealMax: 190, cues: { tooLow: 'Straight wrists, not bent', pass: 'Wrists straight' }, priority: 'refinement' },
  ],
  'Steel Deadlift': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 140, idealMax: 175, cues: { tooLow: 'Knees too bent, raise hips', pass: 'Good knee angle' }, priority: 'important' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 50, idealMax: 100, cues: { tooHigh: 'Drop hips more', pass: 'Good hip position' }, priority: 'critical' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 165, idealMax: 190, cues: { tooLow: 'Round back! Straighten', pass: 'Neutral spine' }, priority: 'critical' },
  ],
  'Core Strike': [
    { name: 'Neck', landmarks: [0, 11, 12], idealMin: 30, idealMax: 70, cues: { tooLow: 'Don\'t yank neck', pass: 'Neck neutral' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 40, idealMax: 80, cues: { tooHigh: 'Lower back pressed into floor', pass: 'Core engaged' }, priority: 'important' },
  ],
  'Blade Curl': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 30, idealMax: 160, cues: { tooHigh: 'Elbows drifting forward, pin them', pass: 'Elbows pinned' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 70, idealMax: 95, cues: { tooLow: 'Don\'t swing shoulders', pass: 'Shoulders stable' }, priority: 'important' },
  ],
  'Dojo Dip': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 80, idealMax: 175, cues: { tooLow: 'Go deeper to 90°', pass: 'Good depth' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 60, idealMax: 90, cues: { tooHigh: 'Don\'t shrug shoulders', pass: 'Shoulders stable' }, priority: 'important' },
  ],
  'Ronin Lunge': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 80, idealMax: 110, cues: { tooLow: 'Knee tracking over toe', pass: 'Knee stable' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 60, idealMax: 100, cues: { tooLow: 'Torso upright, don\'t lean forward', pass: 'Upright posture' }, priority: 'important' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Chest up, straight back', pass: 'Chest proud' }, priority: 'refinement' },
  ],
  'Warrior Pull-up': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 30, idealMax: 160, cues: { tooLow: 'Drive elbows down and back', pass: 'Full range' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 130, idealMax: 180, cues: { tooHigh: 'Don\'t kip, control it', pass: 'Controlled' }, priority: 'important' },
  ],
  'Oni Press': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 80, idealMax: 175, cues: { tooLow: 'Arc the press, don\'t flare', pass: 'Good arc' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 70, idealMax: 95, cues: { tooHigh: 'Don\'t shrug at top', pass: 'Stable shoulders' }, priority: 'important' },
  ],
  'Shield Raise': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 150, idealMax: 180, cues: { tooLow: 'Lead with elbows, raise to shoulder', pass: 'Full raise' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 60, idealMax: 90, cues: { tooHigh: 'Don\'t swing body', pass: 'No momentum' }, priority: 'important' },
  ],
  'Thunder Slam': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 60, idealMax: 120, cues: { tooLow: 'Hinge at hips, squat to catch', pass: 'Good hinge' }, priority: 'critical' },
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 100, idealMax: 150, cues: { tooHigh: 'Soft landing, absorb the catch', pass: 'Cushioned catch' }, priority: 'important' },
  ],
  'Silent Plank': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Hips sagging, lift up', tooHigh: 'Hips too high, lower', pass: 'Straight line' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 85, idealMax: 100, cues: { tooLow: 'Shoulders over elbows', pass: 'Good alignment' }, priority: 'important' },
  ],
  'Dragon Squat': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 80, idealMax: 120, cues: { tooLow: 'Knees push outward, don\'t cave', pass: 'Knees out' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 60, idealMax: 110, cues: { tooLow: 'Torso upright, stay tall', pass: 'Upright' }, priority: 'critical' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Chest up, don\'t round', pass: 'Chest proud' }, priority: 'important' },
  ],
  'Shadow Sprint': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 70, idealMax: 130, cues: { tooLow: 'High knees! Drive up', pass: 'Good knee drive' }, priority: 'critical' },
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 80, idealMax: 120, cues: { tooLow: 'Knee to hip height', pass: 'Explosive' }, priority: 'important' },
  ],
  'Iron Grip': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 160, idealMax: 185, cues: { tooLow: 'Keep arms straight', pass: 'Arms locked' }, priority: 'critical' },
  ],
  'Kensei Cut': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 40, idealMax: 100, cues: { tooLow: 'Drive elbow high, squeeze lat', pass: 'Good lat squeeze' }, priority: 'critical' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 155, idealMax: 185, cues: { tooLow: 'Flat back, don\'t round', pass: 'Flat back' }, priority: 'critical' },
  ],
  'Stone Lift': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 140, idealMax: 185, cues: { tooLow: 'Drive hips higher, full extension', pass: 'Full hip extension' }, priority: 'critical' },
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 80, idealMax: 110, cues: { tooLow: 'Feet flat, drive through heels', pass: 'Good knee angle' }, priority: 'important' },
  ],
  'Wind Strike': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 120, idealMax: 180, cues: { tooLow: 'Lower back on floor, reach higher', pass: 'Great reach' }, priority: 'important' },
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 150, idealMax: 185, cues: { tooLow: 'Legs straight, reach for toes', pass: 'Full extension' }, priority: 'refinement' },
  ],
  'Iron Push': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 80, idealMax: 170, cues: { tooLow: 'Elbows tight, diamond hands', pass: 'Elbows tight' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Body straight, don\'t sag', pass: 'Plank body' }, priority: 'important' },
  ],
  'Rise Guard': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 150, idealMax: 180, cues: { tooLow: 'Raise to shoulder height', pass: 'Full raise' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 70, idealMax: 95, cues: { tooHigh: 'No swing, strict form', pass: 'Strict' }, priority: 'important' },
  ],
  'Skull Break': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 80, idealMax: 175, cues: { tooLow: 'Upper arms vertical, lower to forehead', pass: 'Vertical arms' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 70, idealMax: 95, cues: { tooHigh: 'Don\'t flare elbows', pass: 'Stable shoulders' }, priority: 'important' },
  ],
  'Mountain Press': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 80, idealMax: 175, cues: { tooLow: 'Arc press path, squeeze top', pass: 'Good arc' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 140, idealMax: 180, cues: { tooHigh: 'Don\'t arch back, brace core', pass: 'Core braced' }, priority: 'important' },
  ],
  'Iron Draw': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 40, idealMax: 100, cues: { tooLow: 'Drive elbows past torso', pass: 'Elbows back' }, priority: 'critical' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 155, idealMax: 185, cues: { tooLow: 'Flat back, hinge position', pass: 'Hinge good' }, priority: 'critical' },
  ],
  'Steel Curl': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 30, idealMax: 160, cues: { tooLow: 'Elbows pinned to sides', pass: 'Pinned elbows' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 70, idealMax: 90, cues: { tooHigh: 'No body swing', pass: 'Strict curl' }, priority: 'important' },
  ],
  'Mask Pull': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 40, idealMax: 100, cues: { tooLow: 'Pull face height, separate hands', pass: 'Full pull' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 70, idealMax: 95, cues: { tooHigh: 'Squeeze rear delts at peak', pass: 'Rear delt squeeze' }, priority: 'important' },
  ],
  'Reverse Row': [
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 40, idealMax: 100, cues: { tooLow: 'Chest to bar, squeeze lats', pass: 'Chest to bar' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Plank body, don\'t sag hips', pass: 'Straight plank' }, priority: 'critical' },
  ],
  'Eastern Hinge': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 155, idealMax: 180, cues: { tooLow: 'Soft knees, don\'t lock', pass: 'Soft knees' }, priority: 'important' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 50, idealMax: 100, cues: { tooHigh: 'Hinge at hips, bar along thighs', pass: 'Good hinge' }, priority: 'critical' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 165, idealMax: 190, cues: { tooLow: 'Flat back, neutral spine', pass: 'Neutral spine' }, priority: 'critical' },
  ],
  'Split Squat': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 80, idealMax: 110, cues: { tooLow: 'Front knee over toe, shin vertical', pass: 'Vertical shin' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 60, idealMax: 100, cues: { tooLow: 'Upright torso', pass: 'Upright' }, priority: 'important' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Chest up, straight back', pass: 'Good posture' }, priority: 'refinement' },
  ],
  'Rising Calf': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 170, idealMax: 190, cues: { tooLow: 'Keep legs straight', pass: 'Legs straight' }, priority: 'critical' },
    { name: 'Ankle', landmarks: [26, 28, 30], idealMin: 160, idealMax: 190, cues: { tooLow: 'Full range, heels drop low', pass: 'Full ROM' }, priority: 'important' },
  ],
  'Warrior March': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 80, idealMax: 110, cues: { tooLow: 'Knee tracks over toe', pass: 'Good tracking' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 60, idealMax: 100, cues: { tooLow: 'Upright torso, long stride', pass: 'Upright' }, priority: 'important' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Don\'t lean forward', pass: 'Tall posture' }, priority: 'refinement' },
  ],
  'Dawn Reach': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 40, idealMax: 90, cues: { tooLow: 'Push hips back, chest up', pass: 'Good hinge' }, priority: 'critical' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 165, idealMax: 190, cues: { tooLow: 'Flat back, gaze forward', pass: 'Neutral spine' }, priority: 'critical' },
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 155, idealMax: 180, cues: { tooLow: 'Soft knees throughout', pass: 'Soft knees' }, priority: 'important' },
  ],
  'Hanging Rise': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 60, idealMax: 120, cues: { tooLow: 'Raise legs to parallel', tooHigh: 'Lower controlled, no swing', pass: 'Great raise' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 160, idealMax: 190, cues: { tooLow: 'Full hang, no swing', pass: 'Stable hang' }, priority: 'important' },
  ],
  'Wheel Strike': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 155, idealMax: 185, cues: { tooLow: 'Hips sagging, brace core', tooHigh: 'Don\'t pike, straight line', pass: 'Straight plank' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 70, idealMax: 95, cues: { tooLow: 'Shoulders over hands', pass: 'Good alignment' }, priority: 'important' },
  ],
  'Side Guard': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Hips sagging, lift up', tooHigh: 'Hips too high', pass: 'Straight line' }, priority: 'critical' },
    { name: 'Shoulder', landmarks: [14, 12, 24], idealMin: 85, idealMax: 100, cues: { tooLow: 'Elbow under shoulder', pass: 'Stacked' }, priority: 'important' },
  ],
  'Kettle Storm': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 50, idealMax: 100, cues: { tooLow: 'Hinge, don\'t squat the swing', pass: 'Hip hinge' }, priority: 'critical' },
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 140, idealMax: 175, cues: { tooLow: 'Soft knees, not deep bend', pass: 'Soft knees' }, priority: 'important' },
    { name: 'Back', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Flat back, hips power', pass: 'Neutral spine' }, priority: 'important' },
  ],
  'Leap of Faith': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 90, idealMax: 130, cues: { tooLow: 'Quarter squat then explode', pass: 'Explosive' }, priority: 'critical' },
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 100, idealMax: 160, cues: { tooLow: 'Full hip extension on jump', pass: 'Full extension' }, priority: 'important' },
  ],
  'Mountain Storm': [
    { name: 'Hip', landmarks: [12, 24, 26], idealMin: 160, idealMax: 185, cues: { tooLow: 'Hips low, plank position', pass: 'Low hips' }, priority: 'critical' },
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 60, idealMax: 100, cues: { tooLow: 'Drive knees to chest', pass: 'Explosive knees' }, priority: 'important' },
  ],
  'Rope Dance': [
    { name: 'Knee', landmarks: [24, 26, 28], idealMin: 140, idealMax: 175, cues: { tooLow: 'Soft landing on balls', pass: 'Springy' }, priority: 'important' },
    { name: 'Elbow', landmarks: [12, 14, 16], idealMin: 80, idealMax: 110, cues: { tooLow: 'Elbows close to body', pass: 'Good form' }, priority: 'refinement' },
  ],
};

export function getAngleChecks(exerciseName: string): AngleCheck[] {
  return EXERCISE_ANGLES[exerciseName] || [];
}

export function calcAngle(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
  c: { x: number; y: number; z: number },
): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const v2 = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z) *
              Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
  if (mag === 0) return 0;
  const cos = Math.max(-1, Math.min(1, dot / mag));
  return Math.acos(cos) * 180 / Math.PI;
}

export interface AngleResult {
  name: string;
  angle: number;
  inRange: boolean;
  cue: string;
  priority: 'critical' | 'important' | 'refinement';
}

export function checkAngles(
  exerciseName: string,
  landmarks: Array<{ x: number; y: number; z: number }>,
): AngleResult[] {
  const checks = getAngleChecks(exerciseName);
  return checks.map(check => {
    const a = landmarks[check.landmarks[0]];
    const b = landmarks[check.landmarks[1]];
    const c = landmarks[check.landmarks[2]];
    if (!a || !b || !c) return null;
    const angle = calcAngle(a, b, c);
    const inRange = angle >= check.idealMin && angle <= check.idealMax;
    let cue = check.cues.pass || 'Good form';
    if (!inRange) {
      if (angle < check.idealMin) cue = check.cues.tooLow || 'Adjust form';
      else cue = check.cues.tooHigh || 'Adjust form';
    }
    return { name: check.name, angle: Math.round(angle), inRange, cue, priority: check.priority };
  }).filter(Boolean) as AngleResult[];
}

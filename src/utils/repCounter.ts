export type RepPhase = 'top' | 'bottom' | 'rising' | 'lowering';

export interface RepCounterConfig {
  exerciseName: string;
  topThreshold: number;
  bottomThreshold: number;
  primaryLandmarks: [number, number, number];
  minHipAngle?: number;
  minKneeAngle?: number;
  minElbowAngle?: number;
}

export interface RepState {
  phase: RepPhase;
  count: number;
  lastRepTime: number;
  angles: { time: number; hip?: number; knee?: number; elbow?: number }[];
}

export function createRepCounter(exerciseName: string): { update: (landmarks: any[], timestamp: number) => number; reset: () => void; getCount: () => number } {
  let state: RepState = { phase: 'top', count: 0, lastRepTime: 0, angles: [] };

  function hipAngle(lm: any[]): number | null {
    if (!lm[23] || !lm[24] || !lm[25]) return null;
    return calcAngle(lm[23], lm[24], lm[25]);
  }

  function kneeAngle(lm: any[]): number | null {
    if (!lm[23] || !lm[25] || !lm[27]) return null;
    return calcAngle(lm[23], lm[25], lm[27]);
  }

  function elbowAngle(lm: any[]): number | null {
    if (!lm[11] || !lm[13] || !lm[15]) return null;
    return calcAngle(lm[11], lm[13], lm[15]);
  }

  function calcAngle(a: any, b: any, c: any): number {
    const v1 = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
    const v2 = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };
    const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    const mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z) *
                Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
    if (mag === 0) return 0;
    return Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI;
  }

  const exercise = exerciseName;
  const isSquat = exercise === 'Iron Squat' || exercise === 'Dragon Squat';
  const isPress = exercise === 'Shadow Push' || exercise === 'Oni Press' || exercise === 'Mountain Press' || exercise === 'Crimson Press' || exercise === 'Iron Push';
  const isHinge = exercise === 'Steel Deadlift' || exercise === 'Eastern Hinge' || exercise === 'Dawn Reach';
  const isRow = exercise === 'Samurai Row' || exercise === 'Iron Draw' || exercise === 'Kensei Cut' || exercise === 'Reverse Row';
  const isPullUp = exercise === 'Warrior Pull-up';
  const isLunge = exercise === 'Ronin Lunge' || exercise === 'Warrior March' || exercise === 'Split Squat';
  const isDip = exercise === 'Dojo Dip' || exercise === 'Skull Break';
  const isCurl = exercise === 'Blade Curl' || exercise === 'Steel Curl';
  const isSlam = exercise === 'Thunder Slam' || exercise === 'Kettle Storm';

  return {
    update(landmarks: any[], timestamp: number): number {
      const h = hipAngle(landmarks);
      const k = kneeAngle(landmarks);
      const e = elbowAngle(landmarks);

      state.angles.push({ time: timestamp, hip: h || undefined, knee: k || undefined, elbow: e || undefined });
      if (state.angles.length > 60) state.angles.shift();

      if (isSquat && h !== null && k !== null) {
        if (state.phase === 'top' && h < 90 && k < 100) {
          state.phase = 'bottom';
        } else if (state.phase === 'bottom' && h > 150 && k > 150) {
          state.phase = 'top';
          state.count++;
          state.lastRepTime = timestamp;
        }
      } else if (isPress && e !== null) {
        if (state.phase === 'top' && e < 90) {
          state.phase = 'bottom';
        } else if (state.phase === 'bottom' && e > 160) {
          state.phase = 'top';
          state.count++;
          state.lastRepTime = timestamp;
        }
      } else if (isHinge && h !== null && k !== null) {
        if (state.phase === 'top' && h < 70 && k < 120) {
          state.phase = 'bottom';
        } else if (state.phase === 'bottom' && h > 150 && k > 150) {
          state.phase = 'top';
          state.count++;
          state.lastRepTime = timestamp;
        }
      } else if (isRow && e !== null) {
        if (state.phase === 'top' && e > 160) {
          state.phase = 'bottom';
        } else if (state.phase === 'bottom' && e < 60) {
          state.phase = 'top';
          state.count++;
          state.lastRepTime = timestamp;
        }
      } else if (isPullUp && e !== null) {
        if (state.phase === 'top' && e > 160) {
          state.phase = 'bottom';
        } else if (state.phase === 'bottom' && e < 40) {
          state.phase = 'top';
          state.count++;
          state.lastRepTime = timestamp;
        }
      } else if (isLunge && k !== null) {
        if (state.phase === 'top' && k < 90) {
          state.phase = 'bottom';
        } else if (state.phase === 'bottom' && k > 150) {
          state.phase = 'top';
          state.count++;
          state.lastRepTime = timestamp;
        }
      } else if (isDip && e !== null) {
        if (state.phase === 'top' && e < 85) {
          state.phase = 'bottom';
        } else if (state.phase === 'bottom' && e > 160) {
          state.phase = 'top';
          state.count++;
          state.lastRepTime = timestamp;
        }
      } else if (isCurl && e !== null) {
        if (state.phase === 'top' && e > 150) {
          state.phase = 'bottom';
        } else if (state.phase === 'bottom' && e < 40) {
          state.phase = 'top';
          state.count++;
          state.lastRepTime = timestamp;
        }
      } else if (isSlam && h !== null) {
        if (state.phase === 'top' && h < 80) {
          state.phase = 'bottom';
        } else if (state.phase === 'bottom' && h > 150) {
          state.phase = 'top';
          state.count++;
          state.lastRepTime = timestamp;
        }
      }
      return state.count;
    },
    reset() { state = { phase: 'top', count: 0, lastRepTime: 0, angles: [] }; },
    getCount() { return state.count; },
  };
}

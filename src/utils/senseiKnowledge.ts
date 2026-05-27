// Deep knowledge base for Sensei AI
export const SENSEI_KNOWLEDGE = {
  philosophy: `
You are Sensei, a master trainer who has devoted 40+ years to martial arts, bodybuilding, sports science, and human performance. 
You trained under legendary coaches in Japan, Okinawa, and the United States. You hold black belts in Kyokushin karate, 
Brazilian Jiu-Jitsu, and judo. You have a Master's degree in Exercise Physiology and Sports Nutrition.

Your teaching philosophy combines:
- Eastern martial arts discipline (budo, zazen meditation, ki development)
- Western sports science (biomechanics, periodization, hypertrophy research)
- Ancient warrior traditions (samurai, Spartan, Viking training methods)
- Modern evidence-based fitness (NSCA, NASM, ACSM guidelines)

You speak with authority but warmth. You challenge your students to grow while supporting them. 
You remember details about their training, struggles, and victories. You adapt your coaching style 
based on their personality - some need gentle guidance, others need harsh motivation.
`,

  exerciseLibrary: {
    squat: {
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core', 'Erector spinae'],
      cues: ['Drive knees out', 'Keep chest up', 'Hinge at hips', 'Brace core', 'Depth parallel or below'],
      commonErrors: ['Knees caving in', 'Heels lifting off ground', 'Lower back rounding', 'Shallow depth', 'Head dropping'],
      variations: ['Back squat', 'Front squat', 'Goblet squat', 'Bulgarian split squat', 'Pistol squat', 'Box squat'],
      breathing: 'Inhale on descent, brace, exhale on ascent',
      progression: 'Start with goblet squat → barbell back squat → front squat → advanced variations',
    },
    deadlift: {
      muscles: ['Posterior chain', 'Hamstrings', 'Glutes', 'Lats', 'Traps', 'Forearms'],
      cues: ['Push floor away', 'Keep bar close to body', 'Lockout hips', 'Neutral spine', 'Lat engagement'],
      commonErrors: ['Rounding lower back', 'Hyperextending at top', 'Bar drifting away from legs', 'Squatting the weight up', 'Bending arms early'],
      variations: ['Conventional', 'Sumo', 'Romanian', 'Stiff-leg', 'Trap bar', 'Deficit'],
      breathing: 'Deep breath before pull, hold through rep, exhale at lockout',
      progression: 'Learn hip hinge pattern → Romanian deadlift → conventional deadlift → sumo/stiff-leg variations',
    },
    'bench press': {
      muscles: ['Pectorals', 'Anterior deltoids', 'Triceps', 'Serratus anterior'],
      cues: ['Retract scapula', 'Drive through feet', 'Tuck elbows', 'Bar path to lower chest', 'Leg drive'],
      commonErrors: ['Flared elbows', 'Bouncing bar off chest', 'Hips lifting off bench', 'Loose grip', 'No leg drive'],
      variations: ['Flat bench', 'Incline', 'Decline', 'Close-grip', 'Dumbbell press', 'Spoto press'],
      breathing: 'Inhale on descent, brace, slight exhale on lockout',
      progression: 'Pushups → dumbbell press → barbell bench → incline/close-grip variations',
    },
    pullup: {
      muscles: ['Lats', 'Rhomboids', 'Biceps', 'Forearms', 'Core'],
      cues: ['Dead hang start', 'Drive elbows down', 'Chest to bar', 'Controlled negative', 'Full range of motion'],
      commonErrors: ['Kipping without control', 'Partial range of motion', 'Excessive swinging', 'Shoulder impingement', 'Chin over bar only'],
      variations: ['Standard pull-up', 'Chin-up', 'Wide grip', 'Neutral grip', 'Commando', 'Muscle-up progression'],
      breathing: 'Exhale on pull, inhale on descent',
      progression: 'Dead hangs → assisted pull-ups → strict pull-ups → weighted → muscle-up prep',
    },
    overheadPress: {
      muscles: ['Deltoids', 'Triceps', 'Upper chest', 'Core', 'Serratus'],
      cues: ['Brace core like someone will punch you', 'Head through at lockout', 'Straight bar path', 'Squeeze glutes', 'Tight grip'],
      commonErrors: ['Excessive arching', 'Pressing in front', 'Ignoring leg drive', 'Soft core', 'Incomplete lockout'],
      variations: ['Strict press', 'Push press', 'Jerk', 'Dumbbell press', 'Landmine press', 'Arnold press'],
      breathing: 'Deep breath, brace, exhale after lockout',
      progression: 'Dumbbell shoulder press → strict barbell press → push press → split jerk',
    },
    row: {
      muscles: ['Lats', 'Rhomboids', 'Middle trapezius', 'Biceps', 'Forearms'],
      cues: ['Pull to hip', 'Retract shoulder blade', 'Drive elbow back', 'Keep torso stable', 'Controlled negative'],
      commonErrors: ['Using too much momentum', 'Shrugging shoulders', 'Incomplete retraction', 'Rounded back', 'Jerking the weight'],
      variations: ['Pendlay row', 'Barbell row', 'Dumbbell row', 'Chest-supported row', 'Seal row', 'Inverted row'],
      breathing: 'Exhale on pull, inhale on extension',
      progression: 'Inverted row → dumbbell row → barbell row → Pendlay/seal row',
    },
    lunge: {
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves', 'Core'],
      cues: ['Knee tracks over toes', 'Torso upright', 'Short stride for quads, long for glutes', 'Back knee toward ground', 'Drive through front heel'],
      commonErrors: ['Knee caving inward', 'Front knee past toes excessively', 'Torso leaning forward', 'Short stepping', 'Losing balance'],
      variations: ['Walking lunge', 'Reverse lunge', 'Bulgarian split squat', 'Step-up', 'Lateral lunge', 'Deficit lunge'],
      breathing: 'Inhale on descent, exhale on drive up',
      progression: 'Bodyweight lunge → reverse lunge → walking lunge → Bulgarian split squat → weighted variations',
    },
    plank: {
      muscles: ['Rectus abdominis', 'Transverse abdominis', 'Obliques', 'Erector spinae', 'Shoulders', 'Glutes'],
      cues: ['Body in straight line', 'Squeeze glutes', 'Brace abs', 'Shoulders over elbows', 'Breathe normally'],
      commonErrors: ['Hips sagging', 'Hips too high', 'Holding breath', 'Shoulders by ears', 'Looking up or down'],
      variations: ['Forearm plank', 'High plank', 'Side plank', 'Reverse plank', 'Plank with leg lift', 'Plank with shoulder tap'],
      breathing: 'Slow, steady nasal breathing',
      progression: 'Knee plank → forearm plank → high plank → side plank → dynamic plank variations',
    },
  },

  nutrition: {
    protein: 'Aim for 1.6-2.2g per kg bodyweight for muscle building. Spread across 4-5 meals. Best sources: chicken breast, fish, eggs, Greek yogurt, whey, lean beef, tofu.',
    carbs: 'Prioritize complex carbs around training: oats, rice, potato, sweet potato, fruit. Pre-workout: 30-60g carbs 1-2 hours before. Post-workout: 40-80g within 2 hours.',
    fats: '20-30% of total calories. Prioritize: olive oil, avocado, nuts, fatty fish. Avoid: trans fats, excessive omega-6 from processed oils.',
    hydration: 'Minimum 3-4 liters daily. Add 500ml per hour of training. Electrolytes for sessions over 90 minutes.',
    supplements: 'Evidence-based: Creatine monohydrate (5g daily), Whey protein (convenience), Caffeine (3-6mg/kg pre-workout), Vitamin D3, Omega-3, Magnesium.',
    preWorkout: 'Meal 2-3 hours before: balanced with protein, carbs, moderate fat. Or 30-60 minutes: banana + whey + small coffee.',
    postWorkout: 'Within 2 hours: 20-40g protein + 40-80g carbs. Chocolate milk works great. Whole food preferred over shakes.',
    cutting: '500-calorie deficit. Keep protein high (2.2g/kg). Lift heavy to preserve muscle. Walking for low-intensity cardio. Sleep 8 hours.',
    bulking: '300-500 calorie surplus. Prioritize nutrient timing. Do not dirty bulk. Track body composition, not just scale weight.',
  },

  recovery: {
    sleep: 'Sleep is where muscle grows. 7-9 hours for adults. Deep sleep = GH release. REM = motor pattern consolidation. Cool room (65-68°F). Blackout curtains. No screens 1 hour before bed.',
    activeRecovery: 'Light walking, swimming, yoga, foam rolling on rest days. Promotes blood flow without taxing CNS.',
    deload: 'Every 4-6 weeks, reduce volume by 40-50% for 1 week. Or use auto-regulation: when performance drops for 2+ sessions, deload.',
    injuryPrevention: {
      shoulders: 'Face pulls 2-3x/week. External rotation work. Scapular wall slides. Avoid excessive volume on pressing.',
      lowerBack: 'Bracing practice. McGill Big 3. Hip mobility. Avoid excessive spinal flexion under load.',
      knees: 'Terminal knee extensions. VMO work. Hip mobility. Patellar tracking. Proper squat depth for your anatomy.',
      elbows: 'Forearm strengthening. Avoid excessive gripping volume. Vary grip positions.',
    },
    stretching: 'Dynamic before training (leg swings, arm circles, hip circles). Static after training, 30-60 seconds per muscle. Never static stretch cold.',
    massage: 'Foam rolling, percussion gun, professional massage. Best: 48-72 hours after intense session.',
  },

  periodization: {
    linear: 'Add weight each week. Best for beginners (0-1 year). Simple and effective.',
    undulating: 'Vary volume/intensity daily. Example: heavy Monday, moderate Wednesday, light Friday. Good for intermediate lifters.',
    block: 'Focus on one quality per 2-4 weeks: hypertrophy → strength → peaking. Best for advanced lifters and athletes.',
    conjugate: 'Train multiple qualities simultaneously. Westside Barbell method. Max Effort + Dynamic Effort + Repetition Method. Advanced.',
    rpe: 'Rate of Perceived Exertion (1-10). RPE 7 = 3 reps left. RPE 8 = 2 reps left. RPE 9 = 1 rep left. Autoregulates fatigue.',
  },

  mindset: {
    discipline: 'Motivation is fleeting. Discipline is a choice you make every day. The warrior does not ask "Do I feel like it?" but "What must be done?"',
    consistency: 'One great workout means nothing. One hundred decent workouts change everything. Show up. Do the work. Trust the process.',
    failure: 'Failure is data. Every failed rep, every missed PR tells you something. Analyze it. Adjust. Attack again stronger.',
    patience: 'Strength takes years, not weeks. The body changes on a biological timeline, not your emotional one. Accept this or suffer.',
    ego: 'Leave your ego at the door. Lift what you can control, not what impresses others. A rep with perfect form at 80% is worth more than a sloppy PR.',
  },
};

export function getExerciseKnowledge(exerciseName: string): string {
  const name = exerciseName.toLowerCase();
  if (name.includes('squat')) return JSON.stringify(SENSEI_KNOWLEDGE.exerciseLibrary.squat, null, 2);
  if (name.includes('deadlift')) return JSON.stringify(SENSEI_KNOWLEDGE.exerciseLibrary.deadlift, null, 2);
  if (name.includes('bench') || (name.includes('press') && !name.includes('overhead'))) return JSON.stringify(SENSEI_KNOWLEDGE.exerciseLibrary['bench press'], null, 2);
  if (name.includes('pull') || name.includes('pull-up') || name.includes('chin')) return JSON.stringify(SENSEI_KNOWLEDGE.exerciseLibrary.pullup, null, 2);
  if (name.includes('overhead') || name.includes('shoulder press')) return JSON.stringify(SENSEI_KNOWLEDGE.exerciseLibrary.overheadPress, null, 2);
  if (name.includes('row')) return JSON.stringify(SENSEI_KNOWLEDGE.exerciseLibrary.row, null, 2);
  if (name.includes('lunge')) return JSON.stringify(SENSEI_KNOWLEDGE.exerciseLibrary.lunge, null, 2);
  if (name.includes('plank')) return JSON.stringify(SENSEI_KNOWLEDGE.exerciseLibrary.plank, null, 2);
  return '';
}

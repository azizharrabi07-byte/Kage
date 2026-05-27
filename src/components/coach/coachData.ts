export type CoachContext = 'greeting' | 'workout_start' | 'workout_complete' | 'set_complete' | 'lock_in' | 'lock_in_complete' | 'streak' | 'motivation' | 'recovery' | 'idle' | 'rank_up' | 'pr_achieved' | 'first_workout' | 'comeback';

interface PlayerStats {
  level: number;
  streak: number;
  totalXP: number;
  workoutsCompleted: number;
  rankName: string;
}

interface CoachMessage {
  text: string;
  context: CoachContext;
}

export const coachMessages: CoachMessage[] = [
  // Greetings — 12
  { text: 'Another day, another step toward awakening. The path never ends.', context: 'greeting' },
  { text: 'The dojo awaits. Discipline shapes the warrior within.', context: 'greeting' },
  { text: 'Your journey continues. The shadow grows stronger — so do you.', context: 'greeting' },
  { text: 'The path of the warrior begins with a single step. You have taken many.', context: 'greeting' },
  { text: 'The morning sun honors the disciplined. Rise and train.', context: 'greeting' },
  { text: 'Every master was once a beginner who refused to give up.', context: 'greeting' },
  { text: 'The blade remembers its forging. Every rep leaves its mark.', context: 'greeting' },
  { text: 'Silence the noise. Listen to your spirit. It knows the way.', context: 'greeting' },
  { text: 'Yesterday\'s limits are today\'s warm-up. Push beyond.', context: 'greeting' },
  { text: 'The warrior who trains before the world wakes commands the day.', context: 'greeting' },
  { text: 'Your consistency is the foundation of your evolution.', context: 'greeting' },
  { text: 'Another sunrise. Another opportunity to forge greatness.', context: 'greeting' },

  // Workout start — 12
  { text: 'The body achieves what the mind believes. Believe in this session.', context: 'workout_start' },
  { text: 'There is no growth in the comfort zone. Step into the fire.', context: 'workout_start' },
  { text: 'Today\'s pain is tomorrow\'s power. Embrace it.', context: 'workout_start' },
  { text: 'Steel yourself. The trial begins now.', context: 'workout_start' },
  { text: 'Every rep is a step on the path to mastery.', context: 'workout_start' },
  { text: 'The warrior who trains today conquers tomorrow\'s battles.', context: 'workout_start' },
  { text: 'Your muscles remember. Your spirit leads. Trust both.', context: 'workout_start' },
  { text: 'This is the forge. Let the fire shape you.', context: 'workout_start' },
  { text: 'Before the workout: intention. During: focus. After: peace.', context: 'workout_start' },
  { text: 'The bar does not care about your excuses. Neither does the path.', context: 'workout_start' },
  { text: 'Each workout is a conversation between mind and muscle. Speak clearly.', context: 'workout_start' },
  { text: 'Focus on this moment. The past is gone. The future is forged now.', context: 'workout_start' },

  // Workout complete — 10
  { text: 'Discipline is the bridge between goals and accomplishment. You crossed it.', context: 'workout_complete' },
  { text: 'The pain you feel today is the strength you feel tomorrow.', context: 'workout_complete' },
  { text: 'You have sharpened your blade. Rest well, warrior.', context: 'workout_complete' },
  { text: 'Another step on the path. Your evolution continues.', context: 'workout_complete' },
  { text: 'Victory is not given. It is earned in silence and sweat.', context: 'workout_complete' },
  { text: 'The shadow respects your dedication. It grows.', context: 'workout_complete' },
  { text: 'You did not come this far to come this far. The journey deepens.', context: 'workout_complete' },
  { text: 'Carry this strength into the rest of your day.', context: 'workout_complete' },
  { text: 'The workout is done. The adaptation begins. You are becoming.', context: 'workout_complete' },
  { text: 'Another chapter written. The book of your strength grows thicker.', context: 'workout_complete' },

  // Set complete — 10
  { text: 'Focus. Breath. Control. The fundamentals never fail.', context: 'set_complete' },
  { text: 'The spirit grows stronger with each rep completed.', context: 'set_complete' },
  { text: 'Your consistency sharpens your evolution. Set by set.', context: 'set_complete' },
  { text: 'One rep closer to your awakening. Keep going.', context: 'set_complete' },
  { text: 'The grind does not go unnoticed. The shadow sees every rep.', context: 'set_complete' },
  { text: 'Steady. Strong. Unbroken. This is the warrior\'s way.', context: 'set_complete' },
  { text: 'Each set builds the warrior within. Brick by brick.', context: 'set_complete' },
  { text: 'This effort compounds. Trust the process.', context: 'set_complete' },
  { text: 'That set is complete. The next one is already waiting.', context: 'set_complete' },
  { text: 'Form before weight. Control before speed. Master the basics.', context: 'set_complete' },

  // Lock-in — 8
  { text: 'Clear your mind. Find your center. The noise fades.', context: 'lock_in' },
  { text: 'In silence, the warrior finds strength.', context: 'lock_in' },
  { text: 'Focus is the weapon of the disciplined.', context: 'lock_in' },
  { text: 'The mind must be as sharp as the blade. Hone it.', context: 'lock_in' },
  { text: 'Breathe in discipline. Exhale distraction.', context: 'lock_in' },
  { text: 'The present moment is your only weapon. Use it.', context: 'lock_in' },
  { text: 'Stillness is not emptiness. It is power waiting.', context: 'lock_in' },
  { text: 'The warrior who masters focus has already won.', context: 'lock_in' },

  // Lock-in complete — 6
  { text: 'A focused mind is a powerful weapon. You have sharpened yours.', context: 'lock_in_complete' },
  { text: 'Your discipline grows with every session of stillness.', context: 'lock_in_complete' },
  { text: 'The shadow deepens. Your focus sharpens.', context: 'lock_in_complete' },
  { text: 'Stillness is the highest form of action. You have acted.', context: 'lock_in_complete' },
  { text: 'You have mastered yourself for 25 minutes. Carry that calm.', context: 'lock_in_complete' },
  { text: 'The mind is clear. The spirit is ready. The path is open.', context: 'lock_in_complete' },

  // Streak — 8
  { text: 'Consistency is the mark of a true warrior.', context: 'streak' },
  { text: 'Your streak is your discipline made visible to the world.', context: 'streak' },
  { text: 'The path is long. Your dedication honors it.', context: 'streak' },
  { text: 'Each day you show up, the shadow retreats.', context: 'streak' },
  { text: 'Streaks are not luck. They are choice after choice.', context: 'streak' },
  { text: 'The warrior is defined by what they do daily, not occasionally.', context: 'streak' },
  { text: 'Momentum is real. Each consecutive day compounds your power.', context: 'streak' },
  { text: 'The body adapts. The mind commits. The streak builds the legend.', context: 'streak' },

  // Motivation — 10
  { text: 'Fall down seven times, stand up eight. The eighth is where you grow.', context: 'motivation' },
  { text: 'Your only limit is the one you place on yourself. Remove it.', context: 'motivation' },
  { text: 'The warrior\'s spirit cannot be broken. It can only be forged.', context: 'motivation' },
  { text: 'What lies behind us is nothing compared to what lies ahead.', context: 'motivation' },
  { text: 'The darkest nights produce the brightest stars. Train in darkness.', context: 'motivation' },
  { text: 'You are stronger than you know. Trust the grind.', context: 'motivation' },
  { text: 'The mountain does not care how many have climbed it. Climb anyway.', context: 'motivation' },
  { text: 'Pain is temporary. Quitting lasts forever. Choose wisely.', context: 'motivation' },
  { text: 'The body can endure almost anything. It is the mind that needs convincing.', context: 'motivation' },
  { text: 'Strength does not come from winning. It comes from struggle.', context: 'motivation' },

  // Recovery — 8
  { text: 'Fatigue detected. Recovery is necessary for growth.', context: 'recovery' },
  { text: 'Rest is part of the training. The body rebuilds during stillness.', context: 'recovery' },
  { text: 'A wise warrior knows when to rest. Rest is not weakness.', context: 'recovery' },
  { text: 'Recovery is not weakness. It is preparation for the next battle.', context: 'recovery' },
  { text: 'The blade must be sharpened between battles. Sleep sharpens you.', context: 'recovery' },
  { text: 'Sleep is the brother of death and the father of strength.', context: 'recovery' },
  { text: 'Active recovery moves blood. Passive recovery builds muscle. Both matter.', context: 'recovery' },
  { text: 'Listen to your body. It speaks in soreness and fatigue. Rest now.', context: 'recovery' },

  // Rank up — 5
  { text: 'A new rank awakens. Your path has deepened. Honor it.', context: 'rank_up' },
  { text: 'The shadow recognizes your growth. Rise to meet it.', context: 'rank_up' },
  { text: 'You have transcended your former self. That is the only competition.', context: 'rank_up' },
  { text: 'The dojo bows. A new warrior has ascended.', context: 'rank_up' },
  { text: 'Rank is not a destination. It is a reflection of the journey.', context: 'rank_up' },

  // PR achieved — 4
  { text: 'A personal record. The limits you knew are gone. New ones await.', context: 'pr_achieved' },
  { text: 'Stronger than ever. Your best self is rising.', context: 'pr_achieved' },
  { text: 'That was a warrior\'s effort. Remember this feeling.', context: 'pr_achieved' },
  { text: 'The body is capable of more than the mind admits. You proved it.', context: 'pr_achieved' },

  // First workout — 4
  { text: 'The first step is the bravest. Welcome, warrior.', context: 'first_workout' },
  { text: 'Today marks the beginning of your evolution. Cherish it.', context: 'first_workout' },
  { text: 'Every legend starts with a single training session. Yours begins now.', context: 'first_workout' },
  { text: 'The path opens before you. Step forward with courage.', context: 'first_workout' },

  // Comeback — 4
  { text: 'Welcome back, warrior. The shadow waited for your return.', context: 'comeback' },
  { text: 'Absence makes the spirit stronger. Resume the path.', context: 'comeback' },
  { text: 'You paused. You returned. That is true strength of will.', context: 'comeback' },
  { text: 'The path forgives absence. It rewards return. You are back.', context: 'comeback' },
];

function pick(msgs: CoachMessage[]): string {
  return msgs[Math.floor(Math.random() * msgs.length)].text;
}

export function getCoachMessage(context: CoachContext, stats?: PlayerStats): string {
  const msgs = coachMessages.filter((m) => m.context === context);
  if (msgs.length === 0) {
    return pick(coachMessages.filter((m) => m.context === 'motivation'));
  }

  // Data-aware variations
  if (context === 'greeting' && stats) {
    if (stats.streak === 0) return pick(coachMessages.filter((m) => m.context === 'comeback'));
    if (stats.workoutsCompleted === 0) return pick(coachMessages.filter((m) => m.context === 'first_workout'));
    if (stats.streak >= 30) return `30 days. Your body has changed. Your mind has transformed.`;
    if (stats.streak >= 14) return `Two weeks unbroken. The habit is now your identity. 続`;
    if (stats.streak >= 7) {
      const streakMsgs = [
        `${stats.streak} days strong. The shadow cannot catch you.`,
        `A ${stats.streak}-day streak. Your ancestors honor your discipline.`,
        `${stats.streak} consecutive days. You are not the same warrior.`,
        `One week of discipline. The foundation is laid.`,
      ];
      return streakMsgs[Math.floor(Math.random() * streakMsgs.length)];
    }
    if (stats.totalXP >= 5000) {
      const eliteMsgs = [
        `Level ${stats.level} · ${stats.rankName}. The path deepens with every session.`,
        `${stats.rankName}. Your aura commands respect. Continue.`,
        'The higher the level, the harder the trial. You rise to meet it.',
        `${stats.totalXP} total XP. The numbers reflect your spirit.`,
      ];
      return eliteMsgs[Math.floor(Math.random() * eliteMsgs.length)];
    }
    // Time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning training sharpens the spirit. The day is yours to conquer.';
    if (hour < 17) return 'The sun is high. So is your discipline. Push through the afternoon wall.';
    return 'Evening falls. The shadow grows. Train on in the darkness.';
  }

  if (context === 'workout_complete' && stats) {
    if (stats.workoutsCompleted === 1) return 'Your first workout is complete. A legend begins with a single step.';
    if (stats.workoutsCompleted === 50) return '50 workouts. You are no longer a student. You are forged.';
    if (stats.workoutsCompleted === 100) return '100 workouts. The shadow bows to your discipline.';
    if (stats.workoutsCompleted === 365) return '365 workouts — one year of dedication. You are not the same person.';
    if (stats.workoutsCompleted % 10 === 0) return `${stats.workoutsCompleted} workouts completed. The numbers do not lie.`;
    if (stats.streak >= 7) return `${stats.streak}-day streak intact. Your consistency is your superpower.`;
  }

  if (context === 'streak' && stats) {
    if (stats.streak >= 100) return '100-day streak. You have transcended discipline. You are the discipline.';
    if (stats.streak >= 30) return '30-day streak. You have become the warrior you sought to be.';
    if (stats.streak >= 14) return 'Two weeks unbroken. The habit is now your identity.';
    if (stats.streak >= 7) return 'One full week. The path is now part of you.';
    if (stats.streak >= 3) return 'Three days in a row. Momentum is building.';
    const streakMsgs = [
      `${stats.streak} day streak. Every streak starts with a single day.`,
      'One day of discipline. Tomorrow, do it again.',
    ];
    return streakMsgs[Math.floor(Math.random() * streakMsgs.length)];
  }

  if (context === 'lock_in_complete' && stats) {
    const lockMsgs = [
      `+25 focus XP. Your mind is a temple. Total: ${stats.totalXP} XP`,
      'The shadow respects a focused mind. You have trained well.',
      '25 minutes of stillness. That is true strength. Carry it forward.',
      'Stillness completed. Now take this calm into your workout.',
    ];
    return lockMsgs[Math.floor(Math.random() * lockMsgs.length)];
  }

  if (context === 'pr_achieved' && stats) {
    const totalPRs = stats.totalXP; // approximate
    const prMsgs = [
      'A new PR. The limits you knew are gone.',
      'Stronger than yesterday. That is the only comparison.',
      'Your past self would be proud. Your future self expects more.',
    ];
    return prMsgs[Math.floor(Math.random() * prMsgs.length)];
  }

  return pick(msgs);
}

export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning training sharpens the spirit. The day is yours.';
  if (hour < 17) return 'The sun is high. So is your discipline. Push through.';
  return 'Evening falls. The shadow grows. Train on in the darkness.';
}

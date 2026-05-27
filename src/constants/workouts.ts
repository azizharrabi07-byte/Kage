import { Exercise, WorkoutTemplate } from '../store/types';

export const exerciseLibrary: Exercise[] = [
  {
    id: 'ex1', name: 'Shadow Push', target: 'Chest', sets: 4, reps: 10, kanji: '押', category: 'push', movementType: 'press',
    steps: [
      'Lie flat on bench, feet planted, grip bar slightly wider than shoulder-width',
      'Unrack the bar and lower it slowly to your mid-chest with elbows at 45°',
      'Drive through your heels and press the bar explosively back to start',
      'Lock out at the top, squeeze your chest, then control the descent',
    ],
  },
  {
    id: 'ex2', name: 'Samurai Row', target: 'Back', sets: 4, reps: 10, kanji: '引', category: 'pull', movementType: 'row',
    steps: [
      'Hinge at hips, back flat, knees soft, grasp the bar with overhand grip',
      'Pull the bar toward your lower ribcage, driving elbows back',
      'Squeeze your shoulder blades together at the peak for one count',
      'Extend arms fully under control, maintaining the flat-back position',
    ],
  },
  {
    id: 'ex3', name: 'Iron Squat', target: 'Legs', sets: 4, reps: 12, kanji: '屈', category: 'legs', movementType: 'squat',
    steps: [
      'Stand with feet shoulder-width apart, bar across upper traps, chest proud',
      'Initiate the descent by pushing hips back and bending knees',
      'Descend until thighs are parallel or below, keeping heels grounded',
      'Drive through the full foot to stand up, squeezing glutes at the top',
    ],
  },
  {
    id: 'ex4', name: 'Crimson Press', target: 'Shoulders', sets: 3, reps: 10, kanji: '肩', category: 'push', movementType: 'press',
    steps: [
      'Sit on bench with back support, grip bar at shoulder height, palms forward',
      'Press the bar directly overhead until arms are fully extended',
      'Pause briefly at the top with biceps near your ears',
      'Lower the bar with control back to shoulder height, maintaining tension',
    ],
  },
  {
    id: 'ex5', name: 'Steel Deadlift', target: 'Posterior', sets: 3, reps: 8, kanji: '腰', category: 'pull', movementType: 'hinge',
    steps: [
      'Stand with shins touching the bar, feet hip-width, grip the bar just outside knees',
      'Drop hips, brace your core, keep a neutral spine and chest up',
      'Drive through the floor, extending hips and knees simultaneously',
      'Lock out at the top with hips thrust forward, then hinge back down',
    ],
  },
  {
    id: 'ex6', name: 'Core Strike', target: 'Abs', sets: 3, reps: 15, kanji: '腹', category: 'core', movementType: 'twist',
    steps: [
      'Lie on back with knees bent at 90°, feet flat, hands behind your head',
      'Curl your shoulders off the floor, engaging your core to lift your torso',
      'Twist your right elbow toward your left knee as you rise',
      'Lower under control, then repeat on the opposite side',
    ],
  },
  {
    id: 'ex7', name: 'Blade Curl', target: 'Biceps', sets: 3, reps: 12, kanji: '腕', category: 'pull', movementType: 'curl',
    steps: [
      'Stand with feet shoulder-width, dumbbells at your sides, palms facing forward',
      'Keep your elbows pinned to your ribs throughout the movement',
      'Curl the weights up toward your shoulders, squeezing at the top',
      'Lower slowly over 3 seconds, fully extending at the bottom',
    ],
  },
  {
    id: 'ex8', name: 'Dojo Dip', target: 'Triceps', sets: 3, reps: 12, kanji: '伸', category: 'push', movementType: 'extension',
    steps: [
      'Grip parallel bars, press yourself to full arm extension at the top',
      'Lean your torso slightly forward, bend elbows to lower your body',
      'Descend until your upper arms are parallel to the floor',
      'Press back up explosively, locking out at the top without swinging',
    ],
  },
  {
    id: 'ex9', name: 'Ronin Lunge', target: 'Legs', sets: 3, reps: 10, kanji: '突', category: 'legs', movementType: 'lunge',
    steps: [
      'Stand tall, dumbbells at your sides, take a large step forward with your right leg',
      'Lower your back knee toward the floor, keeping your front shin vertical',
      'Drive through your right heel to return to the starting stance',
      'Repeat on the opposite leg, maintaining a steady, controlled rhythm',
    ],
  },
  {
    id: 'ex10', name: 'Warrior Pull-up', target: 'Back', sets: 3, reps: 8, kanji: '上', category: 'pull', movementType: 'pull',
    steps: [
      'Grip the bar with palms facing away, hands slightly wider than shoulders',
      'Hang dead weight with arms fully extended and shoulders engaged',
      'Pull your chest toward the bar, driving elbows down and back',
      'Lower yourself under control to full hang, avoiding kipping',
    ],
  },
  {
    id: 'ex11', name: 'Oni Press', target: 'Chest', sets: 4, reps: 8, kanji: '鬼', category: 'push', movementType: 'press',
    steps: [
      'Set bench at 30° incline, grip dumbbells at chest height, palms facing forward',
      'Press the dumbbells upward in a controlled arc, bringing them together at the top',
      'Squeeze your upper chest for a full second at peak contraction',
      'Lower the weights slowly, feeling the stretch across your chest',
    ],
  },
  {
    id: 'ex12', name: 'Shield Raise', target: 'Shoulders', sets: 3, reps: 12, kanji: '盾', category: 'push', movementType: 'press',
    steps: [
      'Stand with dumbbells in front of your thighs, palms facing you',
      'Raise the weights forward and up, leading with your elbows',
      'Stop when arms are parallel to the floor, pause briefly',
      'Lower under control, resisting the urge to swing your torso',
    ],
  },
  {
    id: 'ex13', name: 'Thunder Slam', target: 'Full Body', sets: 3, reps: 10, kanji: '雷', category: 'full', movementType: 'slam',
    steps: [
      'Stand with feet shoulder-width, medicine ball held overhead',
      'Slam the ball into the floor as hard as possible, hinging at the hips',
      'Squat down to catch the ball on the rebound',
      'Stand and explode back overhead immediately into the next rep',
    ],
  },
  {
    id: 'ex14', name: 'Silent Plank', target: 'Core', sets: 3, reps: 30, kanji: '静', category: 'core', movementType: 'hold', duration: 60,
    steps: [
      'Start in a forearm plank, elbows directly under shoulders, legs extended',
      'Squeeze your glutes and brace your core as if expecting a punch',
      'Hold your body in a perfectly straight line from head to heels',
      'Breathe steadily and maintain the position without sagging or rising',
    ],
  },
  {
    id: 'ex15', name: 'Dragon Squat', target: 'Legs', sets: 4, reps: 10, kanji: '龍', category: 'legs', movementType: 'squat',
    steps: [
      'Stand with feet in a wide sumo stance, toes pointed out at 45°',
      'Hold a single dumbbell or kettlebell at your chest',
      'Squat down by pushing your knees outward, keeping your torso upright',
      'Drive through your whole foot to stand, squeezing inner thighs',
    ],
  },
  {
    id: 'ex16', name: 'Shadow Sprint', target: 'Legs', sets: 3, reps: 1, kanji: '駆', category: 'cardio', movementType: 'sprint', duration: 120,
    steps: [
      'Stand tall on the spot, arms at running position, core braced',
      'Drive one knee up explosively while pumping the opposite arm',
      'Alternate legs at maximum speed, staying light on your feet',
      'Maintain high knees and controlled breathing throughout the interval',
    ],
  },
  {
    id: 'ex17', name: 'Iron Grip', target: 'Forearms', sets: 3, reps: 15, kanji: '握', category: 'pull', movementType: 'curl',
    steps: [
      'Stand holding a barbell behind your back with an overhand grip',
      'Keeping your arms straight, roll the barbell up using only your fingers',
      'Squeeze the bar at the top and hold for one full second',
      'Slowly unroll your fingers to lower the bar back to the start',
    ],
  },
  {
    id: 'ex18', name: 'Kensei Cut', target: 'Back', sets: 3, reps: 10, kanji: '剣', category: 'pull', movementType: 'row',
    steps: [
      'Hinge forward at the hips, one hand on bench for support, dumbbell in the other',
      'Pull the dumbbell toward your hip, driving your elbow high',
      'Pause and squeeze your lat at the peak for a two-count',
      'Extend the arm fully, feeling the stretch through your lats',
    ],
  },
  {
    id: 'ex19', name: 'Stone Lift', target: 'Glutes', sets: 3, reps: 8, kanji: '石', category: 'legs', movementType: 'hinge',
    steps: [
      'Lie on your back, knees bent, feet flat, barbell across your hips',
      'Drive through your heels to lift your hips toward the ceiling',
      'Squeeze your glutes hard at the top, holding for a moment',
      'Lower your hips under control without touching the floor',
    ],
  },
  {
    id: 'ex20', name: 'Wind Strike', target: 'Core', sets: 3, reps: 20, kanji: '風', category: 'core', movementType: 'twist',
    steps: [
      'Lie flat, arms and legs extended in a straight line',
      'Simultaneously raise your arms and legs, reaching your hands toward your feet',
      'Pause at the top, feeling the compression in your abs',
      'Lower all limbs under control, keeping them off the floor',
    ],
  },
  // New exercises 21-40 — Push (4)
  {
    id: 'ex21', name: 'Iron Push', target: 'Chest', sets: 3, reps: 12, kanji: '錆', category: 'push', movementType: 'press',
    steps: [
      'Start in a low push-up position with hands directly under shoulders, forming a diamond with thumbs and index fingers',
      'Lower your chest toward your hands, keeping elbows close to your body',
      'Pause when your chest is a fist-width from the floor',
      'Explode back up, squeezing your triceps and inner chest at the top',
    ],
  },
  {
    id: 'ex22', name: 'Rise Guard', target: 'Shoulders', sets: 3, reps: 15, kanji: '昇', category: 'push', movementType: 'press',
    steps: [
      'Stand with dumbbells at your sides, palms facing each other',
      'Raise the weights laterally to shoulder height, leading with your elbows',
      'Pause at the top with a slight forward tilt, feeling the lateral delt burn',
      'Lower under control, keeping the motion strict without body swing',
    ],
  },
  {
    id: 'ex23', name: 'Skull Break', target: 'Triceps', sets: 3, reps: 12, kanji: '骨', category: 'push', movementType: 'extension',
    steps: [
      'Lie on a flat bench holding dumbbells or an EZ bar directly above your chest',
      'Bend your elbows to lower the weight toward your forehead, keeping upper arms vertical',
      'Pause just above your head, feeling the triceps stretch',
      'Extend back to start, squeezing your triceps at lockout',
    ],
  },
  {
    id: 'ex24', name: 'Mountain Press', target: 'Upper Chest', sets: 4, reps: 8, kanji: '山', category: 'push', movementType: 'press',
    steps: [
      'Set bench at 45° incline, grip dumbbells at shoulders, palms forward',
      'Press upward in an arc, driving through upper chest',
      'Squeeze at the top and hold for one count',
      'Lower slowly, stopping just below shoulder level',
    ],
  },
  // Pull (4)
  {
    id: 'ex25', name: 'Iron Draw', target: 'Back', sets: 4, reps: 8, kanji: '鋼', category: 'pull', movementType: 'row',
    steps: [
      'Hinge forward with a flat back, overhand grip on barbell just wider than hips',
      'Pull the bar to your sternum, driving elbows past your torso',
      'Squeeze your mid-back for a two-count at the peak',
      'Extend arms fully while maintaining the hinge position',
    ],
  },
  {
    id: 'ex26', name: 'Steel Curl', target: 'Biceps', sets: 3, reps: 10, kanji: '鋼彎', category: 'pull', movementType: 'curl',
    steps: [
      'Stand with feet shoulder-width, barbell in an underhand grip at hip height',
      'Keeping your elbows pinned to your ribs, curl the bar toward your shoulders',
      'Squeeze your biceps hard at the top for a count',
      'Lower the bar slowly over three seconds, feeling the full stretch',
    ],
  },
  {
    id: 'ex27', name: 'Mask Pull', target: 'Rear Delts', sets: 3, reps: 15, kanji: '仮面', category: 'pull', movementType: 'pull',
    steps: [
      'Hold a resistance band or cable at face height with both hands, arms extended',
      'Pull the band toward your face, separating your hands and squeezing your rear delts',
      'Rotate your shoulders externally at the peak for maximum contraction',
      'Slowly release to full extension, maintaining constant tension',
    ],
  },
  {
    id: 'ex28', name: 'Reverse Row', target: 'Back', sets: 3, reps: 10, kanji: '逆引', category: 'pull', movementType: 'row',
    steps: [
      'Set a bar at hip height in a rack, hang underneath with arms extended, heels on floor',
      'Pull your chest toward the bar, keeping your body in a straight plank',
      'Squeeze your lats at the top and touch your chest to the bar',
      'Lower under control to full hang, maintaining a rigid core',
    ],
  },
  // Legs (5)
  {
    id: 'ex29', name: 'Eastern Hinge', target: 'Hamstrings', sets: 3, reps: 10, kanji: '東蝶', category: 'legs', movementType: 'hinge',
    steps: [
      'Stand with bar at hip height, brace core, soft knees, hinge at hips reaching back',
      'Lower the bar along your thighs until you feel a deep hamstring stretch',
      'Keep your spine neutral throughout — gaze forward, chest proud',
      'Drive hips forward to return to standing, squeezing glutes at lockout',
    ],
  },
  {
    id: 'ex30', name: 'Split Squat', target: 'Legs', sets: 3, reps: 8, kanji: '分屈', category: 'legs', movementType: 'lunge',
    steps: [
      'Stand with one foot forward on a bench behind you, rear foot on the floor',
      'Lower your back knee toward the floor, keeping your front shin vertical',
      'Descend until your front thigh is parallel to the floor',
      'Drive through your front heel to stand, isolating the front leg',
    ],
  },
  {
    id: 'ex31', name: 'Rising Calf', target: 'Calves', sets: 4, reps: 15, kanji: '上脹', category: 'legs', movementType: 'extension',
    steps: [
      'Stand with the balls of your feet on a raised edge, heels hanging off',
      'Lower your heels slowly below the edge for a deep calf stretch',
      'Push through the balls of your feet to rise as high as possible',
      'Pause at the top for two seconds, then repeat',
    ],
  },
  {
    id: 'ex32', name: 'Warrior March', target: 'Legs', sets: 3, reps: 10, kanji: '武歩', category: 'legs', movementType: 'lunge',
    steps: [
      'Stand tall with dumbbells at your sides, step forward with your right leg',
      'Lower into a lunge, then drive forward into the next step with your left leg',
      'Walk continuously, maintaining an upright torso and controlled breathing',
      'Keep your front knee tracking over your toes, never collapsing inward',
    ],
  },
  {
    id: 'ex33', name: 'Dawn Reach', target: 'Posterior', sets: 3, reps: 10, kanji: '暁', category: 'legs', movementType: 'hinge',
    steps: [
      'Stand with bar across your upper back (as in a squat), feet hip-width',
      'Hinge at the hips, pushing them back, keeping a flat back and gaze forward',
      'Lower your torso until it is nearly parallel to the floor',
      'Drive your hips forward to return upright, squeezing glutes and hamstrings',
    ],
  },
  // Core (3)
  {
    id: 'ex34', name: 'Hanging Rise', target: 'Lower Abs', sets: 3, reps: 10, kanji: '懸上', category: 'core', movementType: 'hold',
    steps: [
      'Hang from a pull-up bar with arms fully extended, legs straight',
      'Without swinging, raise your legs until they are parallel to the floor',
      'Pause at the top, feeling the deep burn in your lower abs',
      'Lower your legs under control, resisting the urge to kip',
    ],
  },
  {
    id: 'ex35', name: 'Wheel Strike', target: 'Core', sets: 3, reps: 8, kanji: '輪打', category: 'core', movementType: 'hold',
    steps: [
      'Kneel on the floor holding an ab wheel or barbell with plates under your hands',
      'Roll the wheel forward, extending your body into a straight plank',
      'Go as far as you can without letting your hips sag or back arch',
      'Use your abs to pull the wheel back to the starting kneeling position',
    ],
  },
  {
    id: 'ex36', name: 'Side Guard', target: 'Obliques', sets: 3, reps: 30, kanji: '側守', category: 'core', movementType: 'hold', duration: 45,
    steps: [
      'Lie on your side, forearm on the floor, elbow directly under shoulder',
      'Stack your feet and lift your hips until your body forms a straight line',
      'Hold the position, keeping your core braced and hips high',
      'Breathe steadily and switch sides after the hold',
    ],
  },
  // Cardio / Full (4)
  {
    id: 'ex37', name: 'Kettle Storm', target: 'Full Body', sets: 3, reps: 15, kanji: '嵐振', category: 'full', movementType: 'slam',
    steps: [
      'Stand with feet wider than hips, kettlebell on the floor, hinge at the hips',
      'Hike the bell between your legs, then drive your hips forward explosively',
      'Let the bell float to chest height, arms relaxed — the hips do the work',
      'Hinge again to absorb the descent and repeat without pausing',
    ],
  },
  {
    id: 'ex38', name: 'Leap of Faith', target: 'Legs', sets: 3, reps: 8, kanji: '跳信', category: 'full', movementType: 'sprint',
    steps: [
      'Stand facing a sturdy box or platform, feet shoulder-width apart',
      'Sink into a quarter squat, then explode onto the box, driving your arms up',
      'Land softly on the box with both feet, absorbing the impact',
      'Step down carefully and reset for the next rep',
    ],
  },
  {
    id: 'ex39', name: 'Mountain Storm', target: 'Full Body', sets: 3, reps: 30, kanji: '山嵐', category: 'cardio', movementType: 'sprint', duration: 45,
    steps: [
      'Start in a high plank, hands under shoulders, body in a straight line',
      'Drive your right knee toward your chest, then explosively switch legs',
      'Keep your hips low and your core braced throughout the movement',
      'Maintain a steady rhythm, breathing in through your nose and out through your mouth',
    ],
  },
  {
    id: 'ex40', name: 'Rope Dance', target: 'Cardio', sets: 3, reps: 1, kanji: '縄舞', category: 'cardio', movementType: 'sprint', duration: 60,
    steps: [
      'Hold a jump rope handle in each hand, elbows close to your body',
      'Swing the rope overhead and jump with both feet as it passes under',
      'Land softly on the balls of your feet, maintaining a spring in your step',
      'Keep a steady pace and breathe rhythmically — relax your shoulders',
    ],
  },
];

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'w1',
    name: 'Path of the Ronin',
    kanji: '浪人',
    description: 'Full body awakening',
    difficulty: 'beginner',
    duration: 30,
    exercises: [exerciseLibrary[0], exerciseLibrary[2], exerciseLibrary[5], exerciseLibrary[13]],
  },
  {
    id: 'w2',
    name: 'Shadow Strike',
    kanji: '影撃',
    description: 'Upper body power',
    difficulty: 'intermediate',
    duration: 40,
    exercises: [exerciseLibrary[0], exerciseLibrary[1], exerciseLibrary[3], exerciseLibrary[6], exerciseLibrary[9]],
  },
  {
    id: 'w3',
    name: 'Oni Legion',
    kanji: '鬼軍',
    description: 'Full body intensity',
    difficulty: 'warrior',
    duration: 50,
    exercises: [exerciseLibrary[0], exerciseLibrary[4], exerciseLibrary[2], exerciseLibrary[10], exerciseLibrary[5], exerciseLibrary[14]],
  },
  {
    id: 'w4',
    name: 'Dragon Path',
    kanji: '龍道',
    description: 'Explosive leg power',
    difficulty: 'intermediate',
    duration: 35,
    exercises: [exerciseLibrary[2], exerciseLibrary[8], exerciseLibrary[14], exerciseLibrary[15], exerciseLibrary[18]],
  },
  {
    id: 'w5',
    name: 'Kensei Ritual',
    kanji: '剣儀',
    description: 'Total warrior conditioning',
    difficulty: 'warrior',
    duration: 55,
    exercises: [exerciseLibrary[12], exerciseLibrary[17], exerciseLibrary[10], exerciseLibrary[18], exerciseLibrary[19], exerciseLibrary[13], exerciseLibrary[15]],
  },
];
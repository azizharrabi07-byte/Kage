import { TrainingProgram } from '../store/types';

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'program_shadow_strength',
    name: 'Shadow Strength',
    kanji: '影力',
    description: '5-week powerlifting — volume, intensity, deload',
    longDescription: 'Modeled after elite powerlifting periodization. Weeks 1-2 accumulate volume for hypertrophy. Weeks 3-4 build intensity for peak strength. Week 5 deloads for supercompensation. 4 days/week of heavy compounds + accessories.',
    benefits: {
      whoThisIsFor: "Warriors who want raw strength, better technique under heavy load, and the mental toughness that comes from grinding through real barbell work.",
      physical: [
        "Significant increases in squat, bench, and deadlift strength",
        "Thicker back, legs, and traps from heavy compound volume",
        "Improved bracing, posture, and core stability under load",
        "Better tendon and connective tissue resilience",
        "Clear progressive overload tracking across 5 weeks"
      ],
      mental: [
        "Builds unbreakable confidence from moving heavy weight",
        "Teaches patience and long-term thinking (deload week)",
        "Develops the ability to stay calm and tight under pressure",
        "Creates pride in disciplined, technical lifting",
        "Prepares the mind for competition or high-stakes training"
      ]
    },
    style: 'powerlifting',
    durationWeeks: 5,
    daysPerWeek: 4,
    difficulty: 'intermediate',
    xpMultiplier: 1.3,
    color: '#C8102E',
    weeks: [
      { weekNumber: 1, label: 'Foundation', theme: 'Volume accumulation — build the base' },
      { weekNumber: 2, label: 'Building', theme: 'Intensity bump — load increases' },
      { weekNumber: 3, label: 'Intensity', theme: 'Lower reps, heavier weight' },
      { weekNumber: 4, label: 'Peak', theme: 'Maximal intensity — low reps, heavy' },
      { weekNumber: 5, label: 'Deload', theme: 'Recovery — light loads, technique' },
    ],
    dayTemplates: [
      {
        dayNumber: 1, label: 'Heavy Lower', kanji: '重下',
        exercises: [
          { exerciseId: 'ex3', weekly: [{sets:3,reps:'8',weight:'70%'},{sets:4,reps:'8',weight:'72%'},{sets:4,reps:'6',weight:'77%'},{sets:5,reps:'3',weight:'85%'},{sets:3,reps:'5',weight:'60%'}], restSeconds:180, notes:'Focus on depth and bracing', allowSwap:false },
          { exerciseId: 'ex5', weekly: [{sets:3,reps:'8',weight:'70%'},{sets:3,reps:'8',weight:'72%'},{sets:4,reps:'5',weight:'80%'},{sets:5,reps:'3',weight:'87%'},{sets:3,reps:'5',weight:'60%'}], restSeconds:180, notes:'Drag bar against shins', allowSwap:false },
          { exerciseId: 'ex29', weekly: [{sets:3,reps:'10',weight:'55%'},{sets:3,reps:'10',weight:'60%'},{sets:3,reps:'8',weight:'65%'},{sets:3,reps:'6',weight:'70%'},{sets:2,reps:'8',weight:'50%'}], restSeconds:120, notes:'Soft knees, stretch at bottom', allowSwap:true },
          { exerciseId: 'ex14', weekly: [{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'50s',weight:'BW'},{sets:3,reps:'55s',weight:'BW'},{sets:3,reps:'60s',weight:'BW'},{sets:2,reps:'45s',weight:'BW'}], restSeconds:60, notes:'Core finisher', allowSwap:true },
        ],
      },
      {
        dayNumber: 2, label: 'Heavy Upper', kanji: '重上',
        exercises: [
          { exerciseId: 'ex1', weekly: [{sets:3,reps:'8',weight:'70%'},{sets:4,reps:'8',weight:'72%'},{sets:4,reps:'6',weight:'78%'},{sets:5,reps:'3',weight:'87%'},{sets:3,reps:'5',weight:'60%'}], restSeconds:180, notes:'45° elbows, bar to mid-chest', allowSwap:false },
          { exerciseId: 'ex4', weekly: [{sets:3,reps:'8',weight:'70%'},{sets:3,reps:'8',weight:'72%'},{sets:4,reps:'6',weight:'77%'},{sets:4,reps:'4',weight:'82%'},{sets:2,reps:'6',weight:'60%'}], restSeconds:150, notes:'Straight bar path', allowSwap:false },
          { exerciseId: 'ex25', weekly: [{sets:3,reps:'10',weight:'65%'},{sets:3,reps:'10',weight:'68%'},{sets:4,reps:'8',weight:'72%'},{sets:4,reps:'6',weight:'77%'},{sets:2,reps:'10',weight:'55%'}], restSeconds:120, notes:'Pull to sternum', allowSwap:true },
          { exerciseId: 'ex23', weekly: [{sets:3,reps:'12',weight:'55%'},{sets:3,reps:'12',weight:'58%'},{sets:3,reps:'10',weight:'62%'},{sets:3,reps:'8',weight:'67%'},{sets:2,reps:'12',weight:'50%'}], restSeconds:90, notes:'Upper arms vertical', allowSwap:true },
        ],
      },
      {
        dayNumber: 3, label: 'Volume Lower', kanji: '量下',
        exercises: [
          { exerciseId: 'ex15', weekly: [{sets:3,reps:'10',weight:'60%'},{sets:3,reps:'10',weight:'65%'},{sets:4,reps:'8',weight:'70%'},{sets:4,reps:'6',weight:'75%'},{sets:2,reps:'10',weight:'55%'}], restSeconds:120, notes:'Wide stance, knees out', allowSwap:true },
          { exerciseId: 'ex29', weekly: [{sets:3,reps:'12',weight:'50%'},{sets:3,reps:'12',weight:'55%'},{sets:3,reps:'10',weight:'60%'},{sets:3,reps:'8',weight:'65%'},{sets:2,reps:'12',weight:'45%'}], restSeconds:90, notes:'Eccentric focus', allowSwap:true },
          { exerciseId: 'ex30', weekly: [{sets:3,reps:'8',weight:'50%'},{sets:3,reps:'10',weight:'55%'},{sets:3,reps:'10',weight:'58%'},{sets:3,reps:'8',weight:'62%'},{sets:2,reps:'10',weight:'45%'}], restSeconds:90, notes:'Front shin vertical', allowSwap:true },
          { exerciseId: 'ex19', weekly: [{sets:3,reps:'12',weight:'50%'},{sets:3,reps:'12',weight:'55%'},{sets:3,reps:'10',weight:'60%'},{sets:3,reps:'8',weight:'65%'},{sets:2,reps:'12',weight:'45%'}], restSeconds:90, notes:'2s squeeze at peak', allowSwap:true },
        ],
      },
      {
        dayNumber: 4, label: 'Volume Upper', kanji: '量上',
        exercises: [
          { exerciseId: 'ex24', weekly: [{sets:3,reps:'10',weight:'60%'},{sets:3,reps:'10',weight:'65%'},{sets:4,reps:'8',weight:'70%'},{sets:4,reps:'6',weight:'75%'},{sets:2,reps:'10',weight:'55%'}], restSeconds:120, notes:'Arc path press', allowSwap:true },
          { exerciseId: 'ex2', weekly: [{sets:3,reps:'10',weight:'65%'},{sets:3,reps:'10',weight:'68%'},{sets:4,reps:'8',weight:'72%'},{sets:4,reps:'6',weight:'77%'},{sets:2,reps:'10',weight:'55%'}], restSeconds:120, notes:'Elbows past ribcage', allowSwap:true },
          { exerciseId: 'ex22', weekly: [{sets:3,reps:'12',weight:'40%'},{sets:3,reps:'12',weight:'42%'},{sets:3,reps:'10',weight:'45%'},{sets:3,reps:'10',weight:'48%'},{sets:2,reps:'12',weight:'35%'}], restSeconds:60, notes:'Lateral raise strict', allowSwap:true },
          { exerciseId: 'ex17', weekly: [{sets:3,reps:'15',weight:'30%'},{sets:3,reps:'15',weight:'35%'},{sets:3,reps:'12',weight:'38%'},{sets:3,reps:'12',weight:'40%'},{sets:2,reps:'15',weight:'25%'}], restSeconds:60, notes:'Forearm finisher', allowSwap:true },
        ],
      },
    ],
  },
  {
    id: 'program_iron_body',
    name: 'Iron Body',
    kanji: '鋼体',
    description: '5-week calisthenics — bodyweight mastery',
    longDescription: 'Progressive calisthenics program. Weeks 1-2 build muscular endurance. Weeks 3-4 introduce harder variations. Week 5 skill-focused deload. No equipment required.',
    benefits: {
      whoThisIsFor: "Warriors who train with minimal equipment, want functional strength, body control, and the discipline that comes from mastering your own bodyweight.",
      physical: [
        "Dramatic improvements in pull-ups, dips, pistol squats, and handstand work",
        "Stronger joints, shoulders, and connective tissue",
        "Better muscle endurance and work capacity",
        "Improved body awareness and movement quality",
        "Visible muscle definition without heavy weights"
      ],
      mental: [
        "Builds extreme body control and focus",
        "Teaches patience through slow, technical progressions",
        "Creates deep pride in owning your own body",
        "Develops mental toughness through high-rep endurance work",
        "Gives the satisfaction of achieving impressive skills"
      ]
    },
    style: 'calisthenics',
    durationWeeks: 5,
    daysPerWeek: 4,
    difficulty: 'beginner',
    xpMultiplier: 1.0,
    color: '#C9A84C',
    weeks: [
      { weekNumber: 1, label: 'Foundation', theme: 'Build muscular endurance' },
      { weekNumber: 2, label: 'Building', theme: 'Increase reps' },
      { weekNumber: 3, label: 'Advancing', theme: 'Harder variations' },
      { weekNumber: 4, label: 'Peaking', theme: 'Max volume' },
      { weekNumber: 5, label: 'Deload', theme: 'Skill practice, recovery' },
    ],
    dayTemplates: [
      {
        dayNumber: 1, label: 'Upper Strength', kanji: '上力',
        exercises: [
          { exerciseId: 'ex10', weekly: [{sets:3,reps:'5',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:3,reps:'5',weight:'BW'},{sets:2,reps:'5',weight:'BW'}], restSeconds:90, notes:'Full hang each rep', allowSwap:false },
          { exerciseId: 'ex28', weekly: [{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:2,reps:'8',weight:'BW'}], restSeconds:60, notes:'Chest to bar', allowSwap:true },
          { exerciseId: 'ex21', weekly: [{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'12',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:2,reps:'10',weight:'BW'}], restSeconds:60, notes:'Diamond push-up, elbows tucked', allowSwap:true },
          { exerciseId: 'ex14', weekly: [{sets:3,reps:'30s',weight:'BW'},{sets:3,reps:'35s',weight:'BW'},{sets:3,reps:'40s',weight:'BW'},{sets:3,reps:'45s',weight:'BW'},{sets:2,reps:'30s',weight:'BW'}], restSeconds:45, notes:'Core finisher', allowSwap:true },
        ],
      },
      {
        dayNumber: 2, label: 'Lower Strength', kanji: '下力',
        exercises: [
          { exerciseId: 'ex3', weekly: [{sets:3,reps:'15',weight:'BW'},{sets:3,reps:'15',weight:'BW'},{sets:3,reps:'20',weight:'BW'},{sets:3,reps:'15',weight:'BW'},{sets:2,reps:'15',weight:'BW'}], restSeconds:60, notes:'Full depth bodyweight squat', allowSwap:false },
          { exerciseId: 'ex32', weekly: [{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:2,reps:'8',weight:'BW'}], restSeconds:60, notes:'Long strides, upright torso', allowSwap:true },
          { exerciseId: 'ex19', weekly: [{sets:3,reps:'15',weight:'BW'},{sets:3,reps:'15',weight:'BW'},{sets:3,reps:'20',weight:'BW'},{sets:3,reps:'15',weight:'BW'},{sets:2,reps:'15',weight:'BW'}], restSeconds:60, notes:'Glute bridge — squeeze at peak', allowSwap:true },
          { exerciseId: 'ex31', weekly: [{sets:3,reps:'15',weight:'BW'},{sets:3,reps:'15',weight:'BW'},{sets:3,reps:'20',weight:'BW'},{sets:3,reps:'15',weight:'BW'},{sets:2,reps:'15',weight:'BW'}], restSeconds:45, notes:'Raise on edge of step', allowSwap:true },
        ],
      },
      {
        dayNumber: 3, label: 'Skill & Core', kanji: '技腹',
        exercises: [
          { exerciseId: 'ex34', weekly: [{sets:3,reps:'5',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:2,reps:'5',weight:'BW'}], restSeconds:90, notes:'No swinging', allowSwap:true },
          { exerciseId: 'ex36', weekly: [{sets:3,reps:'30s',weight:'BW'},{sets:3,reps:'35s',weight:'BW'},{sets:3,reps:'40s',weight:'BW'},{sets:3,reps:'45s',weight:'BW'},{sets:2,reps:'30s',weight:'BW'}], restSeconds:45, notes:'Each side', allowSwap:true },
          { exerciseId: 'ex35', weekly: [{sets:3,reps:'6',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:2,reps:'6',weight:'BW'}], restSeconds:60, notes:'Kneeling ab wheel', allowSwap:true },
          { exerciseId: 'ex14', weekly: [{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'50s',weight:'BW'},{sets:3,reps:'55s',weight:'BW'},{sets:3,reps:'60s',weight:'BW'},{sets:2,reps:'45s',weight:'BW'}], restSeconds:45, notes:'Straight line, brace', allowSwap:true },
        ],
      },
      {
        dayNumber: 4, label: 'Endurance Circuit', kanji: '耐環',
        exercises: [
          { exerciseId: 'ex39', weekly: [{sets:3,reps:'30s',weight:'BW'},{sets:3,reps:'35s',weight:'BW'},{sets:3,reps:'40s',weight:'BW'},{sets:3,reps:'45s',weight:'BW'},{sets:2,reps:'30s',weight:'BW'}], restSeconds:30, notes:'Mountain climbers', allowSwap:true },
          { exerciseId: 'ex40', weekly: [{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'50s',weight:'BW'},{sets:3,reps:'55s',weight:'BW'},{sets:3,reps:'60s',weight:'BW'},{sets:2,reps:'45s',weight:'BW'}], restSeconds:30, notes:'Jump rope steady pace', allowSwap:true },
          { exerciseId: 'ex38', weekly: [{sets:3,reps:'6',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:2,reps:'6',weight:'BW'}], restSeconds:60, notes:'Low box jumps', allowSwap:true },
        ],
      },
    ],
  },
  {
    id: 'program_samurai_hypertrophy',
    name: 'Samurai Hypertrophy',
    kanji: '侍筋',
    description: '5-week bodybuilding — volume, intensity, growth',
    longDescription: 'Classic bodybuilding periodization. Weeks 1-3 accumulate volume for muscle protein synthesis. Week 4 spikes intensity. Week 5 deloads for supercompensation. 5 days per week of targeted bro-split training.',
    benefits: {
      whoThisIsFor: "Warriors who want to build noticeable muscle size, improve their physique, and enjoy the pump and aesthetic side of training.",
      physical: [
        "Clear muscle hypertrophy in chest, back, shoulders, arms and legs",
        "Improved mind-muscle connection across all major muscle groups",
        "Better muscle pumps and vascularity",
        "Stronger isolation work that fixes weak points",
        "Visible changes in the mirror within 5 weeks"
      ],
      mental: [
        "Builds the satisfaction of seeing your body change",
        "Teaches the importance of recovery and nutrition alongside training",
        "Creates a strong sense of ownership over your physique",
        "Develops consistency through high-volume work",
        "Gives the confidence that comes from looking stronger"
      ]
    },
    style: 'hypertrophy',
    durationWeeks: 5,
    daysPerWeek: 5,
    difficulty: 'intermediate',
    xpMultiplier: 1.2,
    color: '#E8A838',
    weeks: [
      { weekNumber: 1, label: 'Volume', theme: 'Accumulate volume for growth' },
      { weekNumber: 2, label: 'Volume+', theme: 'Increase volume' },
      { weekNumber: 3, label: 'Peak Volume', theme: 'Maximum volume' },
      { weekNumber: 4, label: 'Intensity', theme: 'Heavier loads, lower reps' },
      { weekNumber: 5, label: 'Deload', theme: 'Recovery' },
    ],
    dayTemplates: [
      {
        dayNumber: 1, label: 'Chest & Triceps', kanji: '胸腕',
        exercises: [
          { exerciseId: 'ex1', weekly: [{sets:4,reps:'10',weight:'70%'},{sets:4,reps:'10',weight:'72%'},{sets:4,reps:'8',weight:'75%'},{sets:3,reps:'6',weight:'80%'},{sets:2,reps:'10',weight:'60%'}], restSeconds:90, notes:'Flat bench, stretch at bottom', allowSwap:false },
          { exerciseId: 'ex11', weekly: [{sets:4,reps:'10',weight:'65%'},{sets:4,reps:'10',weight:'68%'},{sets:4,reps:'8',weight:'72%'},{sets:3,reps:'6',weight:'77%'},{sets:2,reps:'10',weight:'55%'}], restSeconds:90, notes:'Incline dumbbell press', allowSwap:true },
          { exerciseId: 'ex23', weekly: [{sets:3,reps:'12',weight:'55%'},{sets:3,reps:'12',weight:'58%'},{sets:3,reps:'10',weight:'62%'},{sets:3,reps:'8',weight:'67%'},{sets:2,reps:'12',weight:'50%'}], restSeconds:60, notes:'Skull crushers', allowSwap:true },
          { exerciseId: 'ex21', weekly: [{sets:3,reps:'15',weight:'BW'},{sets:3,reps:'15',weight:'BW'},{sets:3,reps:'12',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:2,reps:'15',weight:'BW'}], restSeconds:60, notes:'Diamond push-up to failure', allowSwap:true },
        ],
      },
      {
        dayNumber: 2, label: 'Back & Biceps', kanji: '背腕',
        exercises: [
          { exerciseId: 'ex2', weekly: [{sets:4,reps:'10',weight:'70%'},{sets:4,reps:'10',weight:'72%'},{sets:4,reps:'8',weight:'75%'},{sets:3,reps:'6',weight:'80%'},{sets:2,reps:'10',weight:'60%'}], restSeconds:90, notes:'Barbell row to ribcage', allowSwap:false },
          { exerciseId: 'ex18', weekly: [{sets:3,reps:'10',weight:'65%'},{sets:3,reps:'10',weight:'68%'},{sets:3,reps:'8',weight:'72%'},{sets:3,reps:'6',weight:'77%'},{sets:2,reps:'10',weight:'55%'}], restSeconds:90, notes:'Single-arm dumbbell row', allowSwap:true },
          { exerciseId: 'ex26', weekly: [{sets:3,reps:'12',weight:'55%'},{sets:3,reps:'12',weight:'58%'},{sets:3,reps:'10',weight:'62%'},{sets:3,reps:'8',weight:'67%'},{sets:2,reps:'12',weight:'50%'}], restSeconds:60, notes:'Barbell curl, elbows pinned', allowSwap:true },
          { exerciseId: 'ex7', weekly: [{sets:3,reps:'12',weight:'50%'},{sets:3,reps:'12',weight:'52%'},{sets:3,reps:'10',weight:'55%'},{sets:3,reps:'8',weight:'60%'},{sets:2,reps:'12',weight:'45%'}], restSeconds:60, notes:'Dumbbell curl, 3s lower', allowSwap:true },
        ],
      },
      {
        dayNumber: 3, label: 'Legs & Glutes', kanji: '脚尻',
        exercises: [
          { exerciseId: 'ex3', weekly: [{sets:4,reps:'10',weight:'70%'},{sets:4,reps:'10',weight:'72%'},{sets:4,reps:'8',weight:'75%'},{sets:3,reps:'6',weight:'80%'},{sets:2,reps:'10',weight:'60%'}], restSeconds:120, notes:'ATG squat depth', allowSwap:false },
          { exerciseId: 'ex29', weekly: [{sets:3,reps:'12',weight:'60%'},{sets:3,reps:'12',weight:'62%'},{sets:3,reps:'10',weight:'65%'},{sets:3,reps:'8',weight:'70%'},{sets:2,reps:'12',weight:'55%'}], restSeconds:90, notes:'Romanian deadlift', allowSwap:true },
          { exerciseId: 'ex30', weekly: [{sets:3,reps:'10',weight:'50%'},{sets:3,reps:'10',weight:'55%'},{sets:3,reps:'8',weight:'58%'},{sets:3,reps:'6',weight:'62%'},{sets:2,reps:'10',weight:'45%'}], restSeconds:90, notes:'Bulgarian split squat', allowSwap:true },
          { exerciseId: 'ex31', weekly: [{sets:4,reps:'15',weight:'40%'},{sets:4,reps:'15',weight:'42%'},{sets:4,reps:'12',weight:'45%'},{sets:3,reps:'10',weight:'50%'},{sets:2,reps:'15',weight:'35%'}], restSeconds:45, notes:'Calf raises, 3s lower', allowSwap:true },
        ],
      },
      {
        dayNumber: 4, label: 'Shoulders & Arms', kanji: '肩腕',
        exercises: [
          { exerciseId: 'ex4', weekly: [{sets:4,reps:'10',weight:'65%'},{sets:4,reps:'10',weight:'68%'},{sets:4,reps:'8',weight:'72%'},{sets:3,reps:'6',weight:'77%'},{sets:2,reps:'10',weight:'55%'}], restSeconds:90, notes:'Overhead press', allowSwap:false },
          { exerciseId: 'ex22', weekly: [{sets:3,reps:'12',weight:'40%'},{sets:3,reps:'12',weight:'42%'},{sets:3,reps:'10',weight:'45%'},{sets:3,reps:'10',weight:'48%'},{sets:2,reps:'12',weight:'35%'}], restSeconds:60, notes:'Lateral raise, lead with elbows', allowSwap:true },
          { exerciseId: 'ex12', weekly: [{sets:3,reps:'12',weight:'40%'},{sets:3,reps:'12',weight:'42%'},{sets:3,reps:'10',weight:'45%'},{sets:3,reps:'10',weight:'48%'},{sets:2,reps:'12',weight:'35%'}], restSeconds:60, notes:'Front raise, pause at top', allowSwap:true },
          { exerciseId: 'ex27', weekly: [{sets:3,reps:'15',weight:'Light'},{sets:3,reps:'15',weight:'Light'},{sets:3,reps:'12',weight:'Light'},{sets:3,reps:'12',weight:'Light'},{sets:2,reps:'15',weight:'Light'}], restSeconds:60, notes:'Face pull, external rotation', allowSwap:true },
        ],
      },
      {
        dayNumber: 5, label: 'Full Body Pump', kanji: '全鼓',
        exercises: [
          { exerciseId: 'ex37', weekly: [{sets:3,reps:'15',weight:'Light'},{sets:3,reps:'15',weight:'Light'},{sets:3,reps:'15',weight:'Light'},{sets:3,reps:'12',weight:'Light'},{sets:2,reps:'15',weight:'Light'}], restSeconds:60, notes:'KB swings, hip driven', allowSwap:true },
          { exerciseId: 'ex9', weekly: [{sets:3,reps:'10',weight:'50%'},{sets:3,reps:'10',weight:'55%'},{sets:3,reps:'10',weight:'58%'},{sets:3,reps:'8',weight:'62%'},{sets:2,reps:'10',weight:'45%'}], restSeconds:60, notes:'Walking lunges', allowSwap:true },
          { exerciseId: 'ex34', weekly: [{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:2,reps:'8',weight:'BW'}], restSeconds:60, notes:'Hanging leg raises', allowSwap:true },
          { exerciseId: 'ex14', weekly: [{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'50s',weight:'BW'},{sets:3,reps:'55s',weight:'BW'},{sets:3,reps:'60s',weight:'BW'},{sets:2,reps:'45s',weight:'BW'}], restSeconds:45, notes:'Plank finisher', allowSwap:true },
        ],
      },
    ],
  },
  {
    id: 'program_wind_conditioning',
    name: 'Wind Conditioning',
    kanji: '風調',
    description: '5-week cardio/mixed — build the engine',
    longDescription: 'Mixed conditioning program: HIIT, strength-endurance, agility, and steady-state. Weeks 1-2 build base. Weeks 3-4 raise intensity. Week 5 tests limits. 4 days/week.',
    benefits: {
      whoThisIsFor: "Warriors who feel their conditioning is weak, want better work capacity, and need to build the engine that supports all other training.",
      physical: [
        "Dramatically improved conditioning and recovery between sets",
        "Better fat loss and metabolic health",
        "Stronger heart and lungs",
        "Improved ability to handle high-intensity efforts",
        "More explosive power and speed endurance"
      ],
      mental: [
        "Builds the ability to suffer and keep going",
        "Teaches mental resilience through brutal conditioning",
        "Creates confidence in your engine under fatigue",
        "Develops the 'never quit' mentality",
        "Makes everything else in training feel easier"
      ]
    },
    style: 'cardio',
    durationWeeks: 5,
    daysPerWeek: 4,
    difficulty: 'intermediate',
    xpMultiplier: 0.9,
    color: '#4A90D9',
    weeks: [
      { weekNumber: 1, label: 'Base Building', theme: 'Build aerobic base' },
      { weekNumber: 2, label: 'Building', theme: 'Increase volume' },
      { weekNumber: 3, label: 'Intensity', theme: 'Shorter rest, more rounds' },
      { weekNumber: 4, label: 'Peak', theme: 'Max output' },
      { weekNumber: 5, label: 'Test', theme: 'Push your limits' },
    ],
    dayTemplates: [
      {
        dayNumber: 1, label: 'HIIT', kanji: '高間',
        exercises: [
          { exerciseId: 'ex16', weekly: [{sets:6,reps:'30s',weight:'BW'},{sets:6,reps:'30s',weight:'BW'},{sets:8,reps:'30s',weight:'BW'},{sets:8,reps:'30s',weight:'BW'},{sets:4,reps:'30s',weight:'BW'}], restSeconds:30, notes:'Max effort shadow sprints', allowSwap:false },
          { exerciseId: 'ex39', weekly: [{sets:6,reps:'30s',weight:'BW'},{sets:6,reps:'30s',weight:'BW'},{sets:8,reps:'30s',weight:'BW'},{sets:8,reps:'30s',weight:'BW'},{sets:4,reps:'30s',weight:'BW'}], restSeconds:30, notes:'Mountain climbers fast', allowSwap:true },
        ],
      },
      {
        dayNumber: 2, label: 'Strength-Endurance', kanji: '強耐',
        exercises: [
          { exerciseId: 'ex37', weekly: [{sets:3,reps:'15',weight:'Light'},{sets:3,reps:'15',weight:'Light'},{sets:4,reps:'15',weight:'Light'},{sets:4,reps:'12',weight:'Light'},{sets:2,reps:'15',weight:'Light'}], restSeconds:45, notes:'Hip-driven swings', allowSwap:true },
          { exerciseId: 'ex38', weekly: [{sets:3,reps:'6',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:4,reps:'6',weight:'BW'},{sets:2,reps:'6',weight:'BW'}], restSeconds:60, notes:'Box jumps, soft landings', allowSwap:true },
          { exerciseId: 'ex13', weekly: [{sets:3,reps:'10',weight:'Light'},{sets:3,reps:'10',weight:'Light'},{sets:3,reps:'12',weight:'Light'},{sets:3,reps:'10',weight:'Light'},{sets:2,reps:'10',weight:'Light'}], restSeconds:45, notes:'Medicine ball slams', allowSwap:true },
        ],
      },
      {
        dayNumber: 3, label: 'Agility & Power', kanji: '敏力',
        exercises: [
          { exerciseId: 'ex38', weekly: [{sets:3,reps:'6',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:4,reps:'8',weight:'BW'},{sets:2,reps:'6',weight:'BW'}], restSeconds:90, notes:'Explosive box jumps', allowSwap:false },
          { exerciseId: 'ex32', weekly: [{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:2,reps:'8',weight:'BW'}], restSeconds:60, notes:'Explosive walking lunges', allowSwap:true },
          { exerciseId: 'ex40', weekly: [{sets:3,reps:'60s',weight:'BW'},{sets:3,reps:'60s',weight:'BW'},{sets:3,reps:'75s',weight:'BW'},{sets:3,reps:'90s',weight:'BW'},{sets:2,reps:'60s',weight:'BW'}], restSeconds:30, notes:'Speed rope', allowSwap:true },
        ],
      },
      {
        dayNumber: 4, label: 'Endurance', kanji: '持久',
        exercises: [
          { exerciseId: 'ex40', weekly: [{sets:1,reps:'3min',weight:'BW'},{sets:1,reps:'4min',weight:'BW'},{sets:1,reps:'5min',weight:'BW'},{sets:1,reps:'6min',weight:'BW'},{sets:1,reps:'3min',weight:'BW'}], restSeconds:60, notes:'Steady pace jump rope', allowSwap:true },
          { exerciseId: 'ex39', weekly: [{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'50s',weight:'BW'},{sets:3,reps:'55s',weight:'BW'},{sets:3,reps:'60s',weight:'BW'},{sets:2,reps:'45s',weight:'BW'}], restSeconds:20, notes:'Mtn climbers, low hips', allowSwap:true },
          { exerciseId: 'ex16', weekly: [{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'50s',weight:'BW'},{sets:3,reps:'55s',weight:'BW'},{sets:3,reps:'60s',weight:'BW'},{sets:2,reps:'45s',weight:'BW'}], restSeconds:20, notes:'High knees finisher', allowSwap:true },
        ],
      },
    ],
  },
  {
    id: 'program_ronin_path',
    name: "Ronin's Path",
    kanji: '浪人道',
    description: '5-week custom — your way, your pace',
    longDescription: 'Flexible program for experienced warriors. Choose your exercises each day. App provides structure (sets/reps/rest) based on goal. No locked exercises — full freedom. 5 days/week.',
    benefits: {
      whoThisIsFor: "Experienced warriors who know what they need, want full freedom, and like designing their own path while still having smart structure.",
      physical: [
        "Complete freedom to target your specific weaknesses",
        "Ability to train around injuries or equipment limitations",
        "Perfect for advanced lifters who need customization",
        "Can combine strength, hypertrophy, and conditioning as needed",
        "Maximum ownership over your own training"
      ],
      mental: [
        "Builds deep self-awareness about your own training",
        "Develops the ability to program intelligently for yourself",
        "Creates strong sense of autonomy and responsibility",
        "Allows you to train what actually excites you",
        "Prepares you to eventually coach others"
      ]
    },
    style: 'mixed',
    durationWeeks: 5,
    daysPerWeek: 5,
    difficulty: 'advanced',
    xpMultiplier: 1.5,
    color: '#9B59B6',
    weeks: [
      { weekNumber: 1, label: 'Foundation', theme: 'Establish baseline' },
      { weekNumber: 2, label: 'Building', theme: 'Add load' },
      { weekNumber: 3, label: 'Advancing', theme: 'Push harder' },
      { weekNumber: 4, label: 'Peaking', theme: 'Test limits' },
      { weekNumber: 5, label: 'Deload', theme: 'Recover and reflect' },
    ],
    dayTemplates: [
      {
        dayNumber: 1, label: 'Day 1', kanji: '一日',
        exercises: [
          { exerciseId: 'ex1', weekly: [{sets:4,reps:'8-10',weight:'Choose'},{sets:4,reps:'8-10',weight:'Choose'},{sets:4,reps:'6-8',weight:'Choose'},{sets:3,reps:'4-6',weight:'Choose'},{sets:3,reps:'8',weight:'Choose'}], restSeconds:90, notes:'Pick a main press', allowSwap:true },
          { exerciseId: 'ex10', weekly: [{sets:3,reps:'6-8',weight:'BW'},{sets:3,reps:'6-8',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:3,reps:'5',weight:'BW'},{sets:2,reps:'8',weight:'BW'}], restSeconds:90, notes:'Pick a main pull', allowSwap:true },
          { exerciseId: 'ex9', weekly: [{sets:3,reps:'10',weight:'Choose'},{sets:3,reps:'10',weight:'Choose'},{sets:3,reps:'8',weight:'Choose'},{sets:3,reps:'6',weight:'Choose'},{sets:2,reps:'10',weight:'Choose'}], restSeconds:60, notes:'Pick an accessory', allowSwap:true },
          { exerciseId: 'ex14', weekly: [{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'45s',weight:'BW'},{sets:2,reps:'45s',weight:'BW'}], restSeconds:45, notes:'Core finisher', allowSwap:true },
        ],
      },
      {
        dayNumber: 2, label: 'Day 2', kanji: '二日',
        exercises: [
          { exerciseId: 'ex5', weekly: [{sets:3,reps:'8',weight:'Choose'},{sets:3,reps:'8',weight:'Choose'},{sets:3,reps:'6',weight:'Choose'},{sets:3,reps:'5',weight:'Choose'},{sets:2,reps:'8',weight:'Choose'}], restSeconds:120, notes:'Pick a hinge', allowSwap:true },
          { exerciseId: 'ex3', weekly: [{sets:3,reps:'10',weight:'Choose'},{sets:4,reps:'8',weight:'Choose'},{sets:4,reps:'6',weight:'Choose'},{sets:3,reps:'5',weight:'Choose'},{sets:3,reps:'8',weight:'Choose'}], restSeconds:120, notes:'Pick a squat', allowSwap:true },
          { exerciseId: 'ex37', weekly: [{sets:3,reps:'12',weight:'Choose'},{sets:3,reps:'12',weight:'Choose'},{sets:3,reps:'10',weight:'Choose'},{sets:3,reps:'8',weight:'Choose'},{sets:2,reps:'12',weight:'Choose'}], restSeconds:60, notes:'Pick a power movement', allowSwap:true },
          { exerciseId: 'ex36', weekly: [{sets:3,reps:'30s',weight:'BW'},{sets:3,reps:'30s',weight:'BW'},{sets:3,reps:'30s',weight:'BW'},{sets:3,reps:'30s',weight:'BW'},{sets:2,reps:'30s',weight:'BW'}], restSeconds:45, notes:'Side plank each side', allowSwap:true },
        ],
      },
      {
        dayNumber: 3, label: 'Day 3', kanji: '三日',
        exercises: [
          { exerciseId: 'ex8', weekly: [{sets:3,reps:'10',weight:'BW-10'},{sets:3,reps:'10',weight:'BW-10'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:2,reps:'10',weight:'BW-10'}], restSeconds:90, notes:'Dips with assistance if needed', allowSwap:true },
          { exerciseId: 'ex28', weekly: [{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:2,reps:'8',weight:'BW'}], restSeconds:90, notes:'Inverted rows', allowSwap:true },
          { exerciseId: 'ex34', weekly: [{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'10',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:2,reps:'8',weight:'BW'}], restSeconds:60, notes:'Hanging leg raises', allowSwap:true },
          { exerciseId: 'ex40', weekly: [{sets:3,reps:'60s',weight:'BW'},{sets:3,reps:'60s',weight:'BW'},{sets:3,reps:'75s',weight:'BW'},{sets:3,reps:'90s',weight:'BW'},{sets:2,reps:'60s',weight:'BW'}], restSeconds:30, notes:'Jump rope finisher', allowSwap:true },
        ],
      },
      {
        dayNumber: 4, label: 'Day 4', kanji: '四日',
        exercises: [
          { exerciseId: 'ex29', weekly: [{sets:3,reps:'10',weight:'Choose'},{sets:3,reps:'10',weight:'Choose'},{sets:3,reps:'8',weight:'Choose'},{sets:3,reps:'6',weight:'Choose'},{sets:2,reps:'10',weight:'Choose'}], restSeconds:90, notes:'Posterior chain', allowSwap:true },
          { exerciseId: 'ex32', weekly: [{sets:3,reps:'8',weight:'Choose'},{sets:3,reps:'10',weight:'Choose'},{sets:3,reps:'10',weight:'Choose'},{sets:3,reps:'8',weight:'Choose'},{sets:2,reps:'10',weight:'Choose'}], restSeconds:60, notes:'Unilateral leg work', allowSwap:true },
          { exerciseId: 'ex22', weekly: [{sets:3,reps:'12',weight:'Choose'},{sets:3,reps:'12',weight:'Choose'},{sets:3,reps:'10',weight:'Choose'},{sets:3,reps:'10',weight:'Choose'},{sets:2,reps:'12',weight:'Choose'}], restSeconds:60, notes:'Shoulder accessory', allowSwap:true },
          { exerciseId: 'ex35', weekly: [{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'8',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:3,reps:'6',weight:'BW'},{sets:2,reps:'8',weight:'BW'}], restSeconds:60, notes:'Ab wheel', allowSwap:true },
        ],
      },
      {
        dayNumber: 5, label: 'Day 5', kanji: '五日',
        exercises: [
          { exerciseId: 'ex5', weekly: [{sets:3,reps:'8',weight:'Choose'},{sets:3,reps:'8',weight:'Choose'},{sets:3,reps:'6',weight:'Choose'},{sets:3,reps:'5',weight:'Choose'},{sets:2,reps:'8',weight:'Choose'}], restSeconds:120, notes:'Pick compound A', allowSwap:true },
          { exerciseId: 'ex1', weekly: [{sets:3,reps:'8',weight:'Choose'},{sets:3,reps:'8',weight:'Choose'},{sets:3,reps:'6',weight:'Choose'},{sets:3,reps:'5',weight:'Choose'},{sets:2,reps:'8',weight:'Choose'}], restSeconds:120, notes:'Pick compound B', allowSwap:true },
          { exerciseId: 'ex39', weekly: [{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'45s',weight:'BW'},{sets:3,reps:'45s',weight:'BW'},{sets:2,reps:'45s',weight:'BW'}], restSeconds:30, notes:'Mtn climber finisher', allowSwap:true },
        ],
      },
    ],
  },
];

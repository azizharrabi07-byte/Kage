import type { ExerciseCategory } from '@/store/types';

export interface CategoryInfo {
  name: string;
  kanji: string;
  description: string;
  benefits: string[];
  style: 'calisthenics' | 'powerlifting' | 'bodyweight' | 'functional' | 'cardio' | 'hybrid';
}

export const categoryInfo: Record<ExerciseCategory, CategoryInfo> = {
  push: {
    name: 'Push',
    kanji: '押',
    description: 'Upper body pushing movements that build chest, shoulders, and triceps.',
    benefits: [
      'Builds upper body pushing power and muscular endurance',
      'Strengthens the chest, anterior deltoids, and triceps',
      'Improves bone density in the upper extremities',
      'Enhances athletic performance in throwing and striking sports',
    ],
    style: 'hybrid',
  },
  pull: {
    name: 'Pull',
    kanji: '引',
    description: 'Upper body pulling movements that develop back, biceps, and grip strength.',
    benefits: [
      'Creates the V-taper physique with a wide, strong back',
      'Improves posture by strengthening the posterior chain',
      'Builds grip strength and forearm endurance',
      'Essential for balancing pushing movements to prevent injury',
    ],
    style: 'powerlifting',
  },
  legs: {
    name: 'Legs',
    kanji: '脚',
    description: 'Lower body compound movements that build explosive power and stability.',
    benefits: [
      'Largest muscle group — stimulates the most muscle growth',
      'Boosts natural testosterone and growth hormone production',
      'Builds functional strength for daily movement and athletics',
      'Improves balance, stability, and joint health',
    ],
    style: 'powerlifting',
  },
  core: {
    name: 'Core',
    kanji: '芯',
    description: 'Core stability and rotational strength for a powerful midline.',
    benefits: [
      'Builds a strong foundation for all other movements',
      'Improves posture and spinal health',
      'Enhances athletic performance through better force transfer',
      'Reduces risk of lower back injury',
    ],
    style: 'calisthenics',
  },
  cardio: {
    name: 'Cardio',
    kanji: '駆',
    description: 'High-intensity cardiovascular conditioning for endurance and fat loss.',
    benefits: [
      'Improves cardiovascular health and lung capacity',
      'Accelerates fat loss through high calorie burn',
      'Builds mental toughness and discipline',
      'Enhances recovery between strength sets',
    ],
    style: 'cardio',
  },
  full: {
    name: 'Full Body',
    kanji: '全',
    description: 'Explosive compound movements that engage the entire body.',
    benefits: [
      'Maximum calorie burn and metabolic activation',
      'Improves coordination and neuromuscular efficiency',
      'Builds functional athleticism for real-world performance',
      'Efficient training — works every muscle in minimal time',
    ],
    style: 'functional',
  },
};

export const styleDescriptions: Record<string, string> = {
  calisthenics: 'Calisthenics — bodyweight mastery. Builds control, endurance, and functional strength using your own body as resistance.',
  powerlifting: 'Powerlifting — maximal strength. The three main lifts develop raw power, bone density, and neural drive.',
  bodyweight: 'Bodyweight — foundational movement. Perfect for building stability and control before adding external load.',
  functional: 'Functional — real-world strength. Compound movements that transfer directly to athletic and daily performance.',
  cardio: 'Cardiovascular — heart and lungs. Builds endurance, burns calories, and improves overall work capacity.',
  hybrid: 'Hybrid — the best of both. Combines strength and control for balanced, sustainable development.',
};
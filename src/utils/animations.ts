import {
  withTiming,
  withSpring,
  type AnimatableValue,
  type AnimationCallback,
  Easing,
} from 'react-native-reanimated';

export const timingConfig = {
  fast: { duration: 200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  normal: { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  slow: { duration: 600, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  cinematic: { duration: 800, easing: Easing.bezier(0.16, 1, 0.3, 1) },
  dramatic: { duration: 1200, easing: Easing.bezier(0.16, 1, 0.3, 1) },
};

export const springConfig = {
  gentle: { damping: 20, stiffness: 100, mass: 1 },
  snappy: { damping: 14, stiffness: 200, mass: 0.5 },
  energetic: { damping: 12, stiffness: 150, mass: 0.8 },
  soft: { damping: 25, stiffness: 80, mass: 1 },
};

export function fadeIn(duration: number = 400) {
  return withTiming(1, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
}

export function fadeOut(duration: number = 400) {
  return withTiming(0, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) });
}

export function slideUp(distance: number = 30, duration: number = 400) {
  return {
    opacity: withTiming(1, { duration, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
    translateY: withTiming(0, { duration, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
  };
}

export function scaleIn(duration: number = 400) {
  return withSpring(1, springConfig.energetic);
}

export function pulse(scale: AnimatableValue) {
  return withTiming(scale as number, {
    duration: 1500,
    easing: Easing.inOut(Easing.sin),
  });
}
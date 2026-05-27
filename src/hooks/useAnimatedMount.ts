import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  type WithTimingConfig,
} from 'react-native-reanimated';

type AnimationType = 'fadeIn' | 'slideUp' | 'scaleIn' | 'slideDown';

interface AnimatedMountConfig {
  type?: AnimationType;
  delay?: number;
  duration?: number;
  distance?: number;
}

export function useAnimatedMount(config: AnimatedMountConfig = {}) {
  const {
    type = 'fadeIn',
    delay = 0,
    duration = 500,
    distance = 30,
  } = config;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(type === 'slideUp' || type === 'slideDown' ? distance : 0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(type === 'scaleIn' ? 0.8 : 1);

  const timingConfig: WithTimingConfig = {
    duration,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, timingConfig);
      translateY.value = withTiming(0, timingConfig);
      translateX.value = withTiming(0, timingConfig);
      scale.value = withTiming(1, timingConfig);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return animatedStyle;
}
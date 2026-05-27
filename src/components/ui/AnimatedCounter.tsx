import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withSpring } from 'react-native-reanimated';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  size?: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export function AnimatedCounter({ value, size = 28, color, prefix = '', suffix = '', delay = 0 }: AnimatedCounterProps) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      animatedValue.value = withSpring(value, { damping: 12, stiffness: 100 });
    }, delay);
    return () => clearTimeout(timeout);
  }, [value]);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${prefix}${Math.round(animatedValue.value)}${suffix}`,
    } as any;
  });

  return (
    <AnimatedText
      animatedProps={animatedProps}
      style={{ fontSize: size, color: color || '#F5F0E8', fontFamily: 'monospace', fontVariant: ['tabular-nums'] as any }}
    />
  );
}

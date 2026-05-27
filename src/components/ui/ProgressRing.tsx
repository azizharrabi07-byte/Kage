import React, { useEffect } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withSpring, withTiming } from 'react-native-reanimated';
import { KageText } from './KageText';
import { useColors, spacing } from '@/theme';

interface ProgressRingProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  subtitle?: string;
  style?: ViewStyle;
  format?: 'percent' | 'number';
  animate?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressRing({
  value,
  maxValue = 100,
  size = 72,
  strokeWidth = 5,
  color: propColor,
  label,
  subtitle,
  style,
  format = 'percent',
  animate = true,
}: ProgressRingProps) {
  const colors = useColors();
  const ringColor = propColor || colors.accent.primary;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / maxValue, 1);
  const targetOffset = circumference * (1 - percentage);

  const progress = useSharedValue(animate ? circumference : targetOffset);

  useEffect(() => {
    if (animate) {
      progress.value = withSpring(targetOffset, { damping: 15, stiffness: 80 });
    } else {
      progress.value = targetOffset;
    }
  }, [value, maxValue]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: progress.value,
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={colors.glass.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <AnimatedCircle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
            animatedProps={animatedProps}
          />
        </Svg>
        <View style={styles.centerContent}>
          <KageText variant="mono" color={ringColor} style={{ fontSize: size * 0.26, lineHeight: size * 0.3 }}>
            {format === 'percent' ? `${Math.round(percentage * 100)}%` : Math.round(value).toString()}
          </KageText>
        </View>
      </View>
      {label && <KageText variant="caption" align="center" style={{ marginTop: spacing.xs }}>{label}</KageText>}
      {subtitle && <KageText variant="caption" align="center" style={{ fontSize: 9, marginTop: 1, opacity: 0.4 }}>{subtitle}</KageText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  centerContent: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});

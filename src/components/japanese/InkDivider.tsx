import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '@/theme';

interface InkDividerProps {
  width?: number;
  color?: string;
  thickness?: 'thin' | 'medium' | 'thick';
  style?: any;
}

export function InkDivider({
  width = 280,
  color = colors.accent.primary,
  thickness = 'medium',
  style,
}: InkDividerProps) {
  const strokeWidth = { thin: 1, medium: 1.5, thick: 2.5 }[thickness];
  const pathVariants = [
    `M0,${thickness === 'thin' ? 0 : 1} Q${width * 0.15},${-strokeWidth * 2} ${width * 0.25},${strokeWidth} T${width * 0.5},${-strokeWidth} T${width * 0.75},${strokeWidth} T${width},${-strokeWidth * 0.5}`,
    `M0,${thickness === 'thin' ? 0 : 1} Q${width * 0.2},${strokeWidth * 3} ${width * 0.35},${-strokeWidth} T${width * 0.6},${strokeWidth * 1.5} T${width * 0.85},${-strokeWidth} T${width},0`,
  ];

  const path = pathVariants[Math.floor(Math.random() * pathVariants.length)];

  return (
    <View style={[styles.container, style]}>
      <Svg width={width} height={8} viewBox={`0 0 ${width} 8`}>
        <Path
          d={pathVariants[0]}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.6}
          strokeLinecap="round"
        />
        <Path
          d={pathVariants[1]}
          stroke={color}
          strokeWidth={strokeWidth * 0.5}
          fill="none"
          opacity={0.3}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
});
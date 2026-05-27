import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors, spacing } from '@/theme';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'light' | 'medium' | 'heavy';
  glow?: 'none' | 'subtle' | 'red' | 'gold' | 'cyan';
  padding?: number;
  accentTop?: boolean;
  accentColor?: string;
}

export function GlassContainer({
  children,
  style,
  intensity = 'medium',
  glow = 'none',
  padding = spacing.lg,
  accentTop = true,
  accentColor,
}: GlassContainerProps) {
  const colors = useColors();
  const g = gradientConfig(intensity, colors);
  const gl = glowStyle(glow, colors);
  const col = accentColor || colors.accent.primary;

  const gradColors: [string, string, ...string[]] = [g[0], g[1]];

  return (
    <View style={[gl, style]}>
      <LinearGradient
        colors={gradColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.base,
          { padding, borderColor: colors.glass.border, borderRadius: 14 },
        ]}
      >
        {accentTop && (
          <View style={[styles.accentLine, { backgroundColor: col }]} />
        )}
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
});

function gradientConfig(intensity: string, colors: any): [string, string] {
  switch (intensity) {
    case 'light': return [colors.glass.light, colors.glass.light];
    case 'heavy': return ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'];
    default: return [colors.glass.medium, 'rgba(255,255,255,0.02)'];
  }
}

function glowStyle(glow: string, colors: any): ViewStyle {
  switch (glow) {
    case 'subtle':
      return { shadowColor: '#FFFFFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.03, shadowRadius: 8 };
    case 'red':
      return { shadowColor: colors.accent.redGlow || colors.accent.glow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 12 };
    case 'gold':
      return { shadowColor: colors.accent.goldGlow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 12 };
    case 'cyan':
      return { shadowColor: colors.accent.cyanGlow || colors.accent.glow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 16 };
    default: return {};
  }
}
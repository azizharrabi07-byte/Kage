import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { GlassContainer } from './GlassContainer';
import { spacing } from '@/theme';

interface KageCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: 'none' | 'subtle' | 'red';
  padding?: number;
}

export function KageCard({
  children,
  style,
  glow = 'subtle',
  padding = spacing.lg,
}: KageCardProps) {
  return (
    <GlassContainer
      intensity="medium"
      glow={glow}
      padding={padding}
      style={style}
    >
      {children}
    </GlassContainer>
  );
}
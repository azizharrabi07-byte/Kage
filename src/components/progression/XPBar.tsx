import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';
import { KageText } from '@/components/ui/KageText';
import { useColors, spacing } from '@/theme';

interface XPBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export function XPBar({ label, value, maxValue = 1000, color }: XPBarProps) {
  const colors = useColors();
  const barColor = color || colors.accent.neon;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(value / maxValue, 1), { duration: 1200, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  }, [value, maxValue]);

  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` as any }));

  return (
    <View style={{ gap: 4, marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <KageText variant="bodyBold" style={{ fontSize: 13, color: colors.text.primary }}>{label}</KageText>
        <KageText variant="mono" style={{ fontSize: 12, color: colors.text.muted }}>{value}/{maxValue}</KageText>
      </View>
      <View style={{ height: 4, backgroundColor: colors.glass.border, borderRadius: 2, overflow: 'hidden' }}>
        <Animated.View style={[{ height: '100%', backgroundColor: barColor, borderRadius: 2 }, barStyle]} />
      </View>
    </View>
  );
}

interface XPOverviewProps {
  xpMap: Record<string, number>;
}

export function XPOverview({ xpMap }: XPOverviewProps) {
  const colors = useColors();
  const categories = [
    { key: 'strength', label: 'Strength', color: '#FF1A1A' },
    { key: 'discipline', label: 'Discipline', color: '#FFAA00' },
    { key: 'endurance', label: 'Endurance', color: '#00FF88' },
    { key: 'focus', label: 'Focus', color: '#4488FF' },
    { key: 'recovery', label: 'Recovery', color: '#FF44FF' },
  ];
  const maxVal = Math.max(...categories.map((c) => xpMap[c.key] || 0), 100);

  return (
    <View style={{ gap: 12 }}>
      <KageText variant="caption" letterSpacing={4} style={{ marginBottom: 4, opacity: 0.4, color: colors.text.secondary }}>
        ATTRIBUTES
      </KageText>
      {categories.map((cat) => (
        <XPBar key={cat.key} label={cat.label} value={xpMap[cat.key] || 0} maxValue={maxVal} color={cat.color} />
      ))}
    </View>
  );
}
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSequence, Easing,
} from 'react-native-reanimated';
import { KageText } from '@/components/ui/KageText';
import { useColors, spacing } from '@/theme';
import { getCoachMessage, getTimeBasedGreeting, type CoachContext } from './coachData';

export interface PlayerStats {
  level: number;
  streak: number;
  totalXP: number;
  workoutsCompleted: number;
  rankName: string;
}

interface SenseiProps {
  context?: CoachContext;
  streak?: number;
  message?: string;
  compact?: boolean;
  stats?: PlayerStats;
}

export function Sensei({ context = 'greeting', streak, message, compact = false, stats }: SenseiProps) {
  const colors = useColors();
  const [text, setText] = useState('');
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    if (!message) {
      const timer = setTimeout(() => {
        const msg = context === 'greeting'
          ? getTimeBasedGreeting()
          : getCoachMessage(context, stats);
        setText(msg);
        opacity.value = withSequence(
          withTiming(0, { duration: 200 }),
          withTiming(1, { duration: 600, easing: Easing.bezier(0.16, 1, 0.3, 1) })
        );
        translateY.value = withSequence(
          withTiming(5, { duration: 200 }),
          withTiming(0, { duration: 600, easing: Easing.bezier(0.16, 1, 0.3, 1) })
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [context, message, streak, stats]);

  useEffect(() => {
    if (message) setText(message);
    else setText(getTimeBasedGreeting());
    opacity.value = withTiming(1, { duration: 800, easing: Easing.bezier(0.16, 1, 0.3, 1) });
    translateY.value = withTiming(0, { duration: 800, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (compact) {
    return (
      <Animated.View style={[styles.compactContainer, animStyle]}>
        <View style={[styles.quoteLine, { backgroundColor: colors.accent.primary }]} />
        <KageText
          variant="body"
          color={colors.text.secondary}
          style={styles.compactText}
        >
          {text}
        </KageText>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <View style={[styles.avatar, { borderColor: colors.accent.primary, backgroundColor: colors.glass.medium }]}>
        <KageText variant="kanji" style={{ fontSize: 22, color: colors.accent.neon }}>先</KageText>
      </View>
      <View style={[styles.bubble, { backgroundColor: colors.glass.medium, borderColor: colors.glass.border }]}>
        <KageText variant="caption" letterSpacing={2} style={{ marginBottom: 4, color: colors.accent.neon }}>
          SENSEI
        </KageText>
        <KageText variant="body" color={colors.text.primary} style={styles.messageText}>
          "{text}"
        </KageText>
        {stats && (
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.glass.border }}>
            <KageText variant="caption" style={{ fontSize: 7, color: colors.text.muted, letterSpacing: 1 }}>LV.{stats.level}</KageText>
            <KageText variant="caption" style={{ fontSize: 7, color: colors.text.muted, letterSpacing: 1 }}>{stats.totalXP} XP</KageText>
            <KageText variant="caption" style={{ fontSize: 7, color: colors.text.muted, letterSpacing: 1 }}>🔥 {stats.streak}</KageText>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  bubble: {
    flex: 1,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  compactText: {
    fontSize: 12,
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 18,
    opacity: 0.8,
  },
  quoteLine: {
    width: 3,
    height: 24,
    borderRadius: 1.5,
  },
});
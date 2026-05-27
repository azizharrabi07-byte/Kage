import React from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { useColors, spacing } from '@/theme';
import type { MasteryResult, PerExerciseMastery } from '@/store/types';

interface SenseiReviewProps {
  sessionName: string;
  baseXP: number;
  finalXP: number;
  mastery: MasteryResult;
  senseiMessage: string;
  onContinue: () => void;
}

function getGradeColor(grade: string, colors: any): string {
  switch (grade) {
    case 'S': return '#FFD700';
    case 'A': return '#00FF88';
    case 'B': return '#3B82F6';
    case 'C': return '#FFAA00';
    default: return '#FF1A1A';
  }
}

export function SenseiReview({ sessionName, baseXP, finalXP, mastery, senseiMessage, onContinue }: SenseiReviewProps) {
  const colors = useColors();
  const gradeColor = getGradeColor(mastery.grade, colors);
  const xpLost = baseXP - finalXP;

  const stats = [
    { label: 'Completion', value: `${Math.round(mastery.completionRate * 100)}%`, color: colors.status.ready },
    { label: 'Form Avg', value: `${Math.round(mastery.formAvg * 100)}%`, color: mastery.formAvg >= 0.7 ? colors.status.ready : colors.accent.gold },
    { label: 'Rest Score', value: `${Math.round(mastery.restScore * 100)}%`, color: mastery.restScore >= 0.5 ? colors.status.ready : colors.accent.gold },
    { label: 'Overload', value: mastery.overloadBonus ? 'YES' : 'NO', color: mastery.overloadBonus ? colors.status.ready : colors.text.muted },
  ];

  const perEx = mastery.perExercise as PerExerciseMastery[] | undefined;

  return (
    <Animated.View entering={FadeIn.duration(600)} style={{ flex: 1, paddingTop: 50 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 40 }}>
        {/* Grade */}
        <Animated.View entering={FadeInDown.delay(80).duration(600)} style={{ alignItems: 'center', marginBottom: 20 }}>
          <KageText variant="caption" letterSpacing={3} color={colors.accent.gold} style={{ fontSize: 8, textTransform: 'uppercase', marginBottom: 8 }}>
            Sensei Review
          </KageText>
          <KageText variant="kanji" style={{ fontSize: 40, color: gradeColor, opacity: 0.3, marginBottom: 4 }}>審</KageText>
          <KageText variant="display" style={{ fontSize: 56, letterSpacing: 4, color: gradeColor }}>
            {mastery.grade}
          </KageText>
          <KageText variant="bodyBold" style={{ fontSize: 12, color: colors.text.secondary, letterSpacing: 2, marginTop: 4 }}>
            {Math.round(mastery.score * 100)}% Mastery
          </KageText>
        </Animated.View>

        {/* Session info */}
        <Animated.View entering={FadeInDown.delay(160).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer padding={spacing.md} intensity="medium" style={{ borderRadius: 10, alignItems: 'center', gap: 4 }}>
            <KageText variant="bodyBold" style={{ fontSize: 13, color: colors.text.primary }}>{sessionName}</KageText>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <KageText variant="caption" style={{ fontSize: 9, color: colors.text.muted }}>Base XP: +{baseXP}</KageText>
              {xpLost > 0 && (
                <KageText variant="caption" style={{ fontSize: 9, color: colors.accent.neon }}>-{xpLost}</KageText>
              )}
            </View>
            <KageText variant="mono" style={{ fontSize: 20, color: colors.accent.gold }}>+{finalXP} XP</KageText>
          </GlassContainer>
        </Animated.View>

        {/* Stats grid */}
        <Animated.View entering={FadeInDown.delay(240).duration(600)} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {stats.map((s, i) => (
              <View key={i} style={{
                flex: 1, minWidth: '45%', padding: 12, borderRadius: 8,
                backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.border,
                alignItems: 'center', gap: 4,
              }}>
                <KageText variant="caption" style={{ fontSize: 7, letterSpacing: 1, color: colors.text.muted, textTransform: 'uppercase' }}>{s.label}</KageText>
                <KageText variant="mono" style={{ fontSize: 16, color: s.color }}>{s.value}</KageText>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Per-exercise breakdown */}
        {perEx && perEx.length > 0 && (
          <Animated.View entering={FadeInDown.delay(280).duration(600)} style={{ marginBottom: 16 }}>
            <GlassContainer padding={spacing.md} intensity="medium" style={{ borderRadius: 10 }}>
              <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 7.5, textTransform: 'uppercase', marginBottom: 8 }}>
                Per Exercise
              </KageText>
              {perEx.map((ex, i) => (
                <View key={i} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 8,
                  paddingVertical: 6, borderBottomWidth: i < perEx.length - 1 ? 1 : 0,
                  borderBottomColor: colors.glass.border, marginBottom: i < perEx.length - 1 ? 4 : 0,
                }}>
                  <View style={{
                    width: 28, height: 28, borderRadius: 14,
                    backgroundColor: colors.glass.medium, borderWidth: 1.5,
                    borderColor: getGradeColor(ex.grade, colors),
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <KageText variant="bodyBold" style={{ fontSize: 9, color: getGradeColor(ex.grade, colors) }}>{ex.grade}</KageText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <KageText variant="bodyBold" style={{ fontSize: 10, letterSpacing: 1, color: colors.text.primary }}>{ex.name}</KageText>
                    {ex.issues.map((iss, j) => (
                      <KageText key={j} variant="caption" style={{ fontSize: 7.5, color: colors.accent.neon }}>! {iss}</KageText>
                    ))}
                  </View>
                  {ex.completionRate === 1 && (
                    <KageText variant="caption" style={{ fontSize: 7, color: colors.status.ready, letterSpacing: 1 }}>DONE</KageText>
                  )}
                </View>
              ))}
            </GlassContainer>
          </Animated.View>
        )}

        {/* Issues & Praises */}
        <Animated.View entering={FadeInDown.delay(360).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer padding={spacing.md} intensity="medium" style={{ borderRadius: 10 }}>
            {mastery.praises.length > 0 && (
              <View style={{ marginBottom: mastery.issues.length > 0 ? 10 : 0 }}>
                {mastery.praises.map((p, i) => (
                  <View key={`p-${i}`} style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
                    <KageText variant="mono" style={{ fontSize: 10, color: colors.status.ready }}>✓</KageText>
                    <KageText variant="body" style={{ fontSize: 10, color: colors.text.secondary, flex: 1 }}>{p}</KageText>
                  </View>
                ))}
              </View>
            )}
            {mastery.issues.length > 0 && (
              <View>
                {mastery.issues.map((p, i) => (
                  <View key={`i-${i}`} style={{ flexDirection: 'row', gap: 6, marginBottom: 2 }}>
                    <KageText variant="mono" style={{ fontSize: 10, color: colors.accent.neon }}>!</KageText>
                    <KageText variant="body" style={{ fontSize: 10, color: colors.text.secondary, flex: 1 }}>{p}</KageText>
                  </View>
                ))}
              </View>
            )}
          </GlassContainer>
        </Animated.View>

        {/* Sensei message */}
        {senseiMessage && (
          <Animated.View entering={FadeInDown.delay(440).duration(600)} style={{ marginBottom: 24 }}>
            <GlassContainer padding={spacing.md} intensity="heavy" glow="red" style={{ borderRadius: 10 }}>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                <View style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.accent.primary,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <KageText variant="kanji" style={{ fontSize: 14, color: colors.accent.neon }}>先</KageText>
                </View>
                <KageText variant="body" style={{ fontSize: 12, color: colors.text.secondary, flex: 1, fontStyle: 'italic', lineHeight: 18 }}>
                  "{senseiMessage}"
                </KageText>
              </View>
            </GlassContainer>
          </Animated.View>
        )}

        <KageButton title="CONTINUE" variant="primary" size="lg" fullWidth onPress={onContinue} />
      </ScrollView>
    </Animated.View>
  );
}

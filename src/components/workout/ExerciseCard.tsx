import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { ExerciseIllustration, exerciseImgs } from '@/components/exercises/ExerciseIllustration';
import { movementPhotos } from '@/constants/exerciseImages';
import { useColors, spacing } from '@/theme';
import { categoryInfo } from '@/constants/categories';
import { EXERCISE_COACHING } from '@/store/senseiEngine';
import type { Exercise } from '@/store/types';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  active?: boolean;
  completed?: boolean;
}

export function ExerciseCard({ exercise, index, active, completed }: ExerciseCardProps) {
  const colors = useColors();
  const router = useRouter();
  const target = exerciseImgs[exercise.name] || 'full';
  const [showBenefits, setShowBenefits] = useState(false);
  const [showSteps, setShowSteps] = useState(!active);
  const cat = categoryInfo[exercise.category];

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(500)} style={{ marginBottom: spacing.md }}>
      <GlassContainer
        intensity={active ? 'heavy' : 'medium'}
        glow={active ? 'red' : completed ? 'subtle' : 'none'}
        padding={spacing.lg}
        accentTop={active}
        accentColor={colors.accent.primary}
      >
        {/* Header row: illustration + name */}
        <View style={{ flexDirection: 'row', gap: 14, marginBottom: 14 }}>
          <View style={{
            width: 76, height: 100,
            borderRadius: 10,
            backgroundColor: colors.glass.light,
            borderWidth: 1,
            borderColor: colors.glass.borderLight,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <ExerciseIllustration target={target} movementType={active ? exercise.movementType : undefined} size={62} photo={movementPhotos[exercise.movementType]} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <KageText variant="kanji" style={{ fontSize: 16, color: colors.accent.primary }}>{exercise.kanji}</KageText>
              <KageText variant="bodyBold" style={{ fontSize: 15, color: colors.text.primary }}>{exercise.name}</KageText>
            </View>
            <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 10, marginBottom: 6 }}>{exercise.target}</KageText>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <View style={{ alignItems: 'center', gap: 2 }}>
                <KageText variant="mono" color={colors.accent.primary} style={{ fontSize: 15 }}>{exercise.sets}</KageText>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase' }}>Sets</KageText>
              </View>
              <View style={{ width: 1, height: 20, backgroundColor: colors.glass.border, alignSelf: 'center' }} />
              <View style={{ alignItems: 'center', gap: 2 }}>
                <KageText variant="mono" color={colors.accent.primary} style={{ fontSize: 15 }}>{exercise.reps}</KageText>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase' }}>Reps</KageText>
              </View>
              {exercise.duration && (
                <>
                  <View style={{ width: 1, height: 20, backgroundColor: colors.glass.border, alignSelf: 'center' }} />
                  <View style={{ alignItems: 'center', gap: 2 }}>
                    <KageText variant="mono" color={colors.accent.primary} style={{ fontSize: 15 }}>{exercise.duration}s</KageText>
                    <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase' }}>Time</KageText>
                  </View>
                </>
              )}
            </View>
            {/* Category badge */}
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
              <View style={{
                paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
                backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.borderLight,
              }}>
                <KageText variant="caption" style={{ fontSize: 6.5, letterSpacing: 1, color: colors.accent.gold, textTransform: 'uppercase' }}>
                  {cat.name}
                </KageText>
              </View>
              <View style={{
                paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
                backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.borderLight,
              }}>
                <KageText variant="caption" style={{ fontSize: 6.5, letterSpacing: 1, color: colors.text.muted, textTransform: 'uppercase' }}>
                  {exercise.movementType}
                </KageText>
              </View>
            </View>
          </View>
          {completed && (
            <View style={{ alignSelf: 'center' }}>
              <KageText variant="mono" color={colors.status.ready} style={{ fontSize: 22 }}>✓</KageText>
            </View>
          )}
        </View>

        {/* Coaching Tip — visible during active workout */}
        {active && EXERCISE_COACHING[exercise.name] && (
          <View style={{
            flexDirection: 'row', alignItems: 'flex-start', gap: 6,
            paddingVertical: 8, paddingHorizontal: 10,
            borderRadius: 8,
            backgroundColor: 'rgba(201,168,76,0.08)',
            borderWidth: 1, borderColor: 'rgba(201,168,76,0.2)',
            marginBottom: 8,
          }}>
            <KageText variant="mono" style={{ fontSize: 14, color: colors.accent.gold, marginTop: 1 }}>🗡</KageText>
            <View style={{ flex: 1 }}>
              <KageText variant="caption" style={{ fontSize: 7, color: colors.accent.gold, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>
                Sensei Tip
              </KageText>
              <KageText variant="body" style={{ fontSize: 10, color: colors.text.secondary, lineHeight: 14 }}>
                {EXERCISE_COACHING[exercise.name]}
              </KageText>
            </View>
          </View>
        )}

        {/* Steps — collapsed by default during workout */}
        <View
          onTouchEnd={() => setShowSteps(!showSteps)}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            paddingVertical: 6, paddingHorizontal: 8,
            borderRadius: 6,
            backgroundColor: colors.glass.light,
            borderWidth: 1, borderColor: colors.glass.borderLight,
            marginBottom: 8,
          }}
        >
          <KageText variant="mono" style={{ fontSize: 10, color: showSteps ? colors.accent.primary : colors.text.muted }}>
            {showSteps ? '▾' : '▸'}
          </KageText>
          <KageText variant="caption" style={{ fontSize: 8, color: colors.text.muted, letterSpacing: 1, textTransform: 'uppercase', flex: 1 }}>
            Technique Steps
          </KageText>
          <KageText variant="caption" style={{ fontSize: 7, color: colors.accent.gold, letterSpacing: 1 }}>
            {exercise.steps.length} steps
          </KageText>
        </View>
        {showSteps && (
          <View style={{
            backgroundColor: colors.glass.light,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.glass.borderLight,
            padding: spacing.md,
            marginBottom: 8,
          }}>
            {exercise.steps.map((step, i) => (
              <View key={i} style={{
                flexDirection: 'row',
                gap: 8,
                marginBottom: i < exercise.steps.length - 1 ? 6 : 0,
              }}>
                <View style={{
                  width: 18, height: 18, borderRadius: 9,
                  backgroundColor: colors.glass.medium,
                  borderWidth: 1,
                  borderColor: colors.glass.border,
                  alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  <KageText variant="mono" color={colors.accent.primary} style={{ fontSize: 8 }}>{i + 1}</KageText>
                </View>
                <KageText variant="body" style={{ fontSize: 11.5, color: colors.text.secondary, flex: 1, lineHeight: 16 }}>
                  {step}
                </KageText>
              </View>
            ))}
          </View>
        )}

        {/* Benefits toggle */}
        <View
          onTouchEnd={() => setShowBenefits(!showBenefits)}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            paddingVertical: 6, paddingHorizontal: 8,
            borderRadius: 6,
            backgroundColor: colors.glass.light,
            borderWidth: 1, borderColor: colors.glass.borderLight,
            marginBottom: completed ? 6 : 0,
          }}
        >
          <KageText variant="mono" style={{ fontSize: 10, color: showBenefits ? colors.accent.primary : colors.text.muted }}>
            {showBenefits ? '▾' : '▸'}
          </KageText>
          <KageText variant="caption" style={{ fontSize: 8, color: colors.text.muted, letterSpacing: 1, textTransform: 'uppercase', flex: 1 }}>
            {cat.name} Benefits — {cat.style}
          </KageText>
          <KageText variant="caption" style={{ fontSize: 7, color: colors.accent.gold, letterSpacing: 1, textTransform: 'uppercase' }}>
            {cat.kanji}
          </KageText>
        </View>
        {showBenefits && (
          <View style={{ marginTop: 8, gap: 4, paddingHorizontal: 4 }}>
            {cat.benefits.map((b, i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
                <KageText variant="mono" style={{ fontSize: 8, color: colors.accent.gold, marginTop: 2 }}>·</KageText>
                <KageText variant="body" style={{ fontSize: 10, color: colors.text.secondary, lineHeight: 14, flex: 1 }}>
                  {b}
                </KageText>
              </View>
            ))}
          </View>
        )}

        {completed && (
          <View
            onTouchEnd={() => router.push(`/(modals)/exercise-progress?name=${encodeURIComponent(exercise.name)}`)}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              paddingVertical: 6, paddingHorizontal: 8,
              borderRadius: 6,
              backgroundColor: colors.glass.light,
              borderWidth: 1, borderColor: colors.glass.borderLight,
              marginTop: 4,
            }}
          >
            <KageText variant="mono" style={{ fontSize: 10, color: colors.accent.gold }}>📊</KageText>
            <KageText variant="caption" style={{ fontSize: 8, color: colors.text.muted, letterSpacing: 1, textTransform: 'uppercase', flex: 1 }}>
              View Progress History
            </KageText>
          </View>
        )}
      </GlassContainer>
    </Animated.View>
  );
}
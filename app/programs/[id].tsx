import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { KageCard } from '@/components/ui/KageCard';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { useColors, spacing } from '@/theme';
import { InkDivider } from '@/components/japanese/InkDivider';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { TRAINING_PROGRAMS } from '@/constants/programs';
import { exerciseLibrary } from '@/constants/workouts';
import {
  loadPlayerProgram,
  getProgramById,
  getCurrentWeekDay,
  getProgress,
  getResolvedExercises,
  isDayUnlocked,
  savePlayerProgram,
  markDayComplete,
  getExerciseById,
  getSwappedExerciseId,
  getProgramStyle,
  getProgramName,
  getProgramXpMultiplier,
} from '@/store/programStore';
import { createProgramWorkoutSession } from '@/store/workoutStore';
import { setProgramWorkoutFactory, setProgramCompletionCallback } from '@/store/programWorkoutContext';
import type { TrainingProgram, PlayerProgram, ProgramDay } from '@/store/types';

const STYLE_COLORS: Record<string, string> = {
  powerlifting: '#C8102E',
  calisthenics: '#C9A84C',
  hypertrophy: '#E8A838',
  cardio: '#4A90D9',
  mixed: '#9B59B6',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: '#00CC88',
  intermediate: '#C9A84C',
  advanced: '#C8102E',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();

  const [playerProgram, setPlayerProgram] = useState<PlayerProgram | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  const program = getProgramById(id);

  useEffect(() => {
    loadPlayerProgram().then(setPlayerProgram);
  }, []);

  useEffect(() => {
    if (playerProgram) {
      setSelectedWeek(playerProgram.currentWeek);
    }
  }, [playerProgram]);

  const progress = playerProgram ? getProgress(playerProgram) : null;
  const currentWeekDay = playerProgram ? getCurrentWeekDay(playerProgram) : null;

  const allDaysComplete = playerProgram && progress ? progress.completed >= progress.total : false;

  const selectedWeekData = program?.weeks.find(w => w.weekNumber === selectedWeek);

  const isDayCompleted = useCallback((week: number, day: number): boolean => {
    if (!playerProgram) return false;
    return playerProgram.completedDays.some(d => d.week === week && d.day === day);
  }, [playerProgram]);

  const handleStartDay = useCallback((dayNumber: number) => {
    const template = program?.dayTemplates.find(d => d.dayNumber === dayNumber);
    if (!template || !playerProgram || !program) return;
    const wIdx = selectedWeek - 1;
    const resolved = template.exercises.map(slot => {
      const exId = getSwappedExerciseId(playerProgram, selectedWeek, dayNumber, slot.exerciseId);
      const ex = getExerciseById(exId);
      if (!ex) return null;
      const target = slot.weekly[wIdx] || slot.weekly[0];
      return { exercise: ex, targetSets: target.sets, targetReps: target.reps, targetWeight: target.weight, restSeconds: slot.restSeconds, notes: slot.notes, allowSwap: slot.allowSwap };
    }).filter(Boolean) as {
      exercise: NonNullable<ReturnType<typeof getExerciseById>>;
      targetSets: number;
      targetReps: string;
      targetWeight: string;
      restSeconds: number;
      notes?: string;
      allowSwap: boolean;
    }[];

    const dayLabel = `${template.label} (W${selectedWeek}D${dayNumber})`;
    setProgramWorkoutFactory(() =>
      createProgramWorkoutSession(dayLabel, template.kanji, resolved, program.id, selectedWeek, dayNumber, program.style as any)
    );
    setProgramCompletionCallback(async () => {
      const prog = await loadPlayerProgram();
      if (prog) {
        const updated = markDayComplete(prog, selectedWeek, dayNumber);
        await savePlayerProgram(updated);
      }
    });
    router.push('/(tabs)/workout');
  }, [id, selectedWeek, playerProgram, program, router]);

  if (!program) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
          <KageText variant="h2" color={colors.text.secondary}>Program not found</KageText>
          <KageButton title="GO BACK" variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.lg }} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingTop: 50, paddingHorizontal: spacing.lg, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: spacing.md, alignSelf: 'flex-start' }}>
          <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 11, letterSpacing: 2 }}>
            ← BACK
          </KageText>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(80).duration(600).springify()}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.xs }}>
            <KageText variant="h1" style={{ fontSize: 26, letterSpacing: 4 }}>
              {program.name}
            </KageText>
            <KageText variant="kanji" color={colors.accent.gold} style={{ fontSize: 16, opacity: 0.6 }}>
              {program.kanji}
            </KageText>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
            <View style={[styles.badge, { backgroundColor: `${STYLE_COLORS[program.style]}22`, borderColor: STYLE_COLORS[program.style] }]}>
              <KageText variant="caption" color={STYLE_COLORS[program.style]} style={{ fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {program.style}
              </KageText>
            </View>
            <View style={[styles.badge, { backgroundColor: `${DIFFICULTY_COLORS[program.difficulty]}22`, borderColor: DIFFICULTY_COLORS[program.difficulty] }]}>
              <KageText variant="caption" color={DIFFICULTY_COLORS[program.difficulty]} style={{ fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {program.difficulty}
              </KageText>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.glass.medium, borderColor: colors.glass.border }]}>
              <KageText variant="caption" color={colors.text.secondary} style={{ fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                {program.daysPerWeek}/wk
              </KageText>
            </View>
          </View>

          <KageText variant="body" color={colors.text.secondary} style={{ fontSize: 12, lineHeight: 18, marginBottom: spacing.sm }}>
            {program.description}
          </KageText>

          <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9, letterSpacing: 2, marginBottom: spacing.lg }}>
            Weeks 1–{program.durationWeeks}
          </KageText>
        </Animated.View>

        <InkDivider width={100} thickness="thin" color={colors.accent.gold} />

        {program.xpMultiplier !== 1 && (
          <Animated.View entering={FadeInDown.delay(120).duration(600)} style={[styles.xpBadge, { borderColor: colors.accent.gold }]}>
            <KageText variant="bodyBold" color={colors.accent.gold} style={{ fontSize: 11, letterSpacing: 2 }}>
              {program.xpMultiplier}x XP
            </KageText>
          </Animated.View>
        )}

        {playerProgram && progress && (
          <Animated.View entering={FadeInDown.delay(160).duration(600)} style={{ marginBottom: spacing.lg }}>
            <KageCard padding={spacing.md}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <ProgressRing
                  value={progress.completed}
                  maxValue={progress.total}
                  size={56}
                  strokeWidth={4}
                  color={colors.accent.gold}
                  format="percent"
                />
                <View style={{ flex: 1 }}>
                  <KageText variant="bodyBold" style={{ fontSize: 13 }}>
                    {progress.completed} / {progress.total} days
                  </KageText>
                  <View style={[styles.progressBarContainer, { marginTop: spacing.xs }]}>
                    <View style={[styles.progressBarFill, { width: `${progress.percent}%`, backgroundColor: colors.accent.gold }]} />
                  </View>
                  <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9, marginTop: spacing.xs }}>
                    {progress.percent}% complete
                  </KageText>
                </View>
              </View>
            </KageCard>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={{ marginBottom: spacing.md }}>
          <KageText variant="caption" color={colors.text.secondary} style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: spacing.sm }}>
            Select Week
          </KageText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {program.weeks.map(week => {
              const isActive = selectedWeek === week.weekNumber;
              return (
                <TouchableOpacity
                  key={week.weekNumber}
                  onPress={() => setSelectedWeek(week.weekNumber)}
                  activeOpacity={0.7}
                  style={[
                    styles.weekPill,
                    {
                      backgroundColor: isActive ? colors.accent.gold : colors.glass.medium,
                      borderColor: isActive ? colors.accent.gold : colors.glass.border,
                    },
                  ]}
                >
                  <KageText
                    variant="bodyBold"
                    color={isActive ? colors.text.inverse : colors.text.secondary}
                    style={{ fontSize: 10, letterSpacing: 1.5 }}
                  >
                    W{week.weekNumber}
                  </KageText>
                  <KageText
                    variant="caption"
                    color={isActive ? colors.text.inverse : colors.text.muted}
                    style={{ fontSize: 7, letterSpacing: 1, opacity: isActive ? 0.8 : 0.6 }}
                  >
                    {week.label}
                  </KageText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {selectedWeekData && (
          <Animated.View entering={FadeInDown.delay(240).duration(600)} style={{ marginBottom: spacing.lg }}>
            <GlassContainer intensity="light" padding={spacing.md} accentTop={false}>
              <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', marginBottom: spacing.xs }}>
                Week Theme
              </KageText>
              <KageText variant="body" style={{ fontSize: 13, lineHeight: 18 }}>
                {selectedWeekData.theme}
              </KageText>
            </GlassContainer>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(280).duration(600)} style={{ marginBottom: spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <KageText variant="caption" color={colors.text.secondary} style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' }}>
              {showCalendar ? 'Calendar' : 'Days'}
            </KageText>
            <View onTouchEnd={() => setShowCalendar(!showCalendar)} style={{
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
              backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.border,
            }}>
              <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 1 }}>
                {showCalendar ? '📋 LIST' : '📅 CALENDAR'}
              </KageText>
            </View>
          </View>
        </Animated.View>

        {showCalendar ? (
          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={{ marginBottom: spacing.lg }}>
            <GlassContainer intensity="medium" padding={spacing.md}>
              <View style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                    <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7, letterSpacing: 1 }}>{d}</KageText>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNum = i + 1;
                  const dayTemplate = program.dayTemplates.find(d => d.dayNumber === dayNum);
                  const completed = dayTemplate ? isDayCompleted(selectedWeek, dayTemplate.dayNumber) : false;
                  const unlocked = dayTemplate ? (playerProgram ? isDayUnlocked(playerProgram, selectedWeek, dayTemplate.dayNumber) : false) : false;
                  const isToday = dayTemplate?.dayNumber === playerProgram?.currentDay && selectedWeek === playerProgram?.currentWeek;
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        if (dayTemplate && unlocked) {
                          handleStartDay(dayTemplate.dayNumber);
                        }
                      }}
                      disabled={!dayTemplate || !unlocked}
                      style={{
                        width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
                        borderRadius: 6,
                        backgroundColor: completed ? 'rgba(0,204,136,0.15)' : isToday ? 'rgba(200,16,46,0.15)' : 'transparent',
                        borderWidth: isToday ? 1 : 0,
                        borderColor: colors.accent.primary,
                      }}
                    >
                      {dayTemplate && (
                        <>
                          <KageText variant="mono" style={{
                            fontSize: 10,
                            color: completed ? colors.status.ready : unlocked ? colors.text.primary : colors.text.muted,
                          }}>
                            {dayTemplate.dayNumber}
                          </KageText>
                          {completed && (
                            <KageText variant="mono" style={{ fontSize: 6, color: colors.status.ready }}>✓</KageText>
                          )}
                          {isToday && !completed && (
                            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent.primary, marginTop: 1 }} />
                          )}
                        </>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </GlassContainer>
          </Animated.View>
        ) : (
          <>
            {program.dayTemplates.map((day, index) => {
            const completed = isDayCompleted(selectedWeek, day.dayNumber);
            const unlocked = playerProgram ? isDayUnlocked(playerProgram, selectedWeek, day.dayNumber) : false;
            const delay = 320 + index * 60;

            return (
              <Animated.View
                key={day.dayNumber}
                entering={FadeInDown.delay(delay).duration(600)}
                style={{ marginBottom: spacing.md }}
              >
                <KageCard padding={spacing.md} glow={completed ? 'none' : unlocked ? 'subtle' : 'none'}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginBottom: spacing.xs }}>
                        <KageText variant="h3" style={{ fontSize: 16 }}>
                          {day.label}
                        </KageText>
                        <KageText variant="kanji" color={colors.accent.gold} style={{ fontSize: 11, opacity: 0.5 }}>
                          {day.kanji}
                        </KageText>
                      </View>
                      <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9, letterSpacing: 1 }}>
                        {day.exercises.length} exercises
                      </KageText>
                    </View>

                    <View style={{ alignItems: 'center', gap: spacing.sm }}>
                      {completed ? (
                        <View style={[styles.statusIcon, { backgroundColor: `${colors.status.ready}22`, borderColor: colors.status.ready }]}>
                          <KageText variant="bodyBold" color={colors.status.ready} style={{ fontSize: 14 }}>✓</KageText>
                        </View>
                      ) : unlocked ? (
                        <>
                          <View style={[styles.statusIcon, { backgroundColor: `${colors.accent.gold}22`, borderColor: colors.accent.gold }]}>
                            <KageText variant="bodyBold" color={colors.accent.gold} style={{ fontSize: 14 }}>?</KageText>
                          </View>
                          <KageButton
                            title="START"
                            variant="gold"
                            size="sm"
                            onPress={() => handleStartDay(day.dayNumber)}
                          />
                        </>
                      ) : (
                        <View style={[styles.statusIcon, { backgroundColor: colors.glass.medium, borderColor: colors.glass.border }]}>
                          <KageText variant="bodyBold" color={colors.text.muted} style={{ fontSize: 14 }}>🔒</KageText>
                        </View>
                      )}
                    </View>
                  </View>
                </KageCard>
              </Animated.View>
            );
          })}
          </>
        )}

        {allDaysComplete && (
          <Animated.View entering={FadeInDown.delay(400).duration(800)} style={{ marginVertical: spacing.xxl }}>
            <KageCard glow="subtle" padding={spacing.xl}>
              <View style={{ alignItems: 'center' }}>
                <KageText variant="kanji" color={colors.accent.gold} style={{ fontSize: 28, marginBottom: spacing.sm }}>
                  完了
                </KageText>
                <KageText variant="h2" style={{ fontSize: 20, letterSpacing: 3, marginBottom: spacing.xs }}>
                  PROGRAM COMPLETE
                </KageText>
                <KageText variant="body" color={colors.text.secondary} style={{ fontSize: 12, textAlign: 'center', lineHeight: 18 }}>
                  You have conquered {program.name}. The way of the warrior continues.
                </KageText>
              </View>
            </KageCard>
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  xpBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(201,168,76,0.08)',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  weekPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 60,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

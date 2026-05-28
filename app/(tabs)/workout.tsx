import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { KageCard } from '@/components/ui/KageCard';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { SetRow } from '@/components/workout/SetRow';
import { FormCheckCard } from '@/components/workout/FormCheckCard';
import { PoseAnalyzer } from '@/components/workout/PoseAnalyzer';
import { SenseiReview } from '@/components/workout/SenseiReview';
import { RestTimer } from '@/components/workout/Timer';
import { WorkoutComplete } from '@/components/workout/WorkoutComplete';
import { CustomPlanCreator } from '@/components/workout/CustomPlanCreator';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { Sensei } from '@/components/coach/Sensei';
import { InkDivider } from '@/components/japanese/InkDivider';
import { useColors, spacing } from '@/theme';
import { workoutTemplates } from '@/constants/workouts';
import { TRAINING_PROGRAMS } from '@/constants/programs';
import { createWorkoutSession, saveWorkoutSession, calculateBaseXP, getSuggestedRest, getRestRange, getWarmupSuggestion } from '@/store/workoutStore';
import { addXP, incrementWorkouts, getProgression, getRankByIndex } from '@/store/progressionStore';
import { updatePR, saveExerciseRecord, getTopPRsByVolume } from '@/store/prStore';
import { autoPostWorkout } from '@/store/socialStore';
import { analyzeMastery, analyzePerExercise, calculateFinalXP, buildPlayerData, getSenseiMessage } from '@/store/senseiEngine';
import { loadPlayerProgram, deletePlayerProgram, createPlayerProgram, savePlayerProgram, getProgress, getCurrentWeekDay, getProgramById, getProgramXpMultiplier } from '@/store/programStore';
import { playSound } from '@/utils/sound';
import {
  getProgramWorkoutFactory,
  clearProgramWorkoutFactory,
  getProgramCompletionCallback,
  clearProgramCompletionCallback,
} from '@/store/programWorkoutContext';
import type { WorkoutSession, WorkoutTemplate, WorkoutPhase, WorkoutSet, PlayerProgram } from '@/store/types';

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
};

function useResponsive() {
  const { width } = useWindowDimensions();
  const isMobile = width < BREAKPOINTS.tablet;
  const isTablet = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isDesktop = width >= BREAKPOINTS.desktop;
  const isWide = width >= BREAKPOINTS.wide;
  
  return { isMobile, isTablet, isDesktop, isWide, width };
}

export default function WorkoutScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isMobile, isTablet, isDesktop, isWide, width } = useResponsive();
  const [phase, setPhase] = useState<WorkoutPhase>('idle');
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [completedSetId, setCompletedSetId] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<{ baseXP: number; finalXP: number; mastery: any; message: string } | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showCustomPlan, setShowCustomPlan] = useState(false);
  const [analyzingEx, setAnalyzingEx] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef<WorkoutSession | null>(null);
  const [playerProgram, setPlayerProgram] = useState<PlayerProgram | null>(null);

  useEffect(() => { loadPlayerProgram().then(setPlayerProgram); }, []);

  // Fix C1 + C5: useFocusEffect runs every time tab gains focus; also clears stale callbacks
  useFocusEffect(
    useCallback(() => {
      clearProgramCompletionCallback();
      const factory = getProgramWorkoutFactory();
      if (factory) {
        clearProgramWorkoutFactory();
        const s = factory();
        sessionRef.current = s;
        setSession(s);
        setCurrentExIndex(0);
        setSessionDuration(0);
        setCompletedSetId(null);
        setReviewData(null);
        setShowComplete(false);
        setPhase('active');
      }
      return () => {
        clearProgramCompletionCallback();
      };
    }, [])
  );

  useEffect(() => {
    if (phase === 'active' && !intervalRef.current) {
      intervalRef.current = setInterval(() => setSessionDuration((d) => d + 1), 1000);
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [phase]);

  function startWorkout(template: WorkoutTemplate) {
    setSession(createWorkoutSession(template));
    setCurrentExIndex(0);
    setSessionDuration(0);
    setCompletedSetId(null);
    setReviewData(null);
    setShowComplete(false);
    setPhase('active');
  }

  const currentExercise = session?.exercises[currentExIndex];
  const isLastExercise = currentExIndex >= (session?.exercises.length ?? 1) - 1;

  function completeSet(setId: string) {
    if (!session) return;
    const updated = { ...session };
    const ex = updated.exercises[currentExIndex];
    const set = ex.sets.find((s) => s.id === setId);
    if (!set || set.completed) return;
    set.completed = true;
    set.completedAt = Date.now();
    playSound('set_done');
    saveExerciseRecord(ex.exercise.name, set.weight, set.reps, set.setNumber);
    updatePR(ex.exercise.name, set.weight, set.reps);
    if (ex.sets.every((s) => s.completed)) { ex.completed = true; ex.completedAt = Date.now(); }
    setSession(updated);
  }

  function checkForm(setId: string) {
    setCompletedSetId(setId);
  }

  function handleFormDone() {
    setCompletedSetId(null);
  }

  function handleFormChange(setId: string, checkId: string, value: boolean) {
    if (!session) return;
    const updated = { ...session };
    for (const ex of updated.exercises) {
      const set = ex.sets.find(s => s.id === setId);
      if (set) {
        if (value === undefined) {
          const { [checkId]: _, ...rest } = set.formResults;
          set.formResults = rest;
        } else {
          set.formResults = { ...set.formResults, [checkId]: value };
        }
        setSession(updated);
        return;
      }
    }
  }

  function handleVideoFrame(setId: string, base64: string) {
    if (!session) return;
    const updated = { ...session };
    for (const ex of updated.exercises) {
      const set = ex.sets.find(s => s.id === setId);
      if (set) { set.videoFrame = base64; setSession(updated); return; }
    }
  }

  function handleVideoAnalysis(setId: string, text: string) {
    if (!session) return;
    const updated = { ...session };
    for (const ex of updated.exercises) {
      const set = ex.sets.find(s => s.id === setId);
      if (set) { set.formNotes = text; setSession(updated); return; }
    }
  }

  function handleUpdateSet(setId: string, weight: number, reps: number) {
    if (!session) return;
    const updated = { ...session };
    for (const ex of updated.exercises) {
      const set = ex.sets.find((s) => s.id === setId);
      if (set) { set.weight = weight; set.reps = reps; break; }
    }
    setSession(updated);
  }

  function nextExercise() {
    if (!session) return;
    if (isLastExercise) launchReview();
    else setPhase('rest');
  }

  function finishRest() {
    setCurrentExIndex((i) => i + 1);
    setCompletedSetId(null);
    setPhase('active');
  }

  function skipRest() { finishRest(); }

  async function launchReview() {
    if (!session) return;
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    const baseXP = calculateBaseXP(session);
    const mastery = analyzeMastery(session);
    const xpMult = getProgramXpMultiplier(session.programId);
    const finalXP = calculateFinalXP(baseXP, mastery, xpMult);
    const prog = await getProgression();
    const rankName = getRankByIndex(prog.rankIndex).name;
    const prs = await getTopPRsByVolume(3);
    const prText = prs.map(p => `${p.name}: ${p.record.bestSet?.weight}kg×${p.record.bestSet?.reps}`).join(', ');
    const data = buildPlayerData(prog, prText, session.exercises.flatMap(e => e.sets), {
      programName: session.programId ? (await import('@/store/programStore')).getProgramName(session.programId) : '',
      programStyle: session.programStyle || '',
      programWeek: session.programWeek || 0,
      programDay: session.programDay || 0,
    });
    const msg = await getSenseiMessage('workout_review', data, session);
    setReviewData({ baseXP, finalXP, mastery, message: msg });
    setPhase('complete');
  }

  async function handleFinish() {
    if (!session || !reviewData) return;
    const final = {
      ...session,
      completedAt: Date.now(),
      totalXP: reviewData.finalXP,
      baseXP: reviewData.baseXP,
      mastery: reviewData.mastery,
      xpBreakdown: {
        strength: Math.round(reviewData.finalXP * 0.4),
        discipline: Math.round(reviewData.finalXP * 0.3),
        endurance: Math.round(reviewData.finalXP * 0.2),
        focus: Math.round(reviewData.finalXP * 0.1),
      },
    };
    await saveWorkoutSession(final);
    const m = reviewData.mastery.score;
    await addXP('strength', Math.round(final.totalXP * 0.4), m);
    await addXP('discipline', Math.round(final.totalXP * 0.3), m);
    await addXP('endurance', Math.round(final.totalXP * 0.2), m);
    await addXP('focus', Math.round(final.totalXP * 0.1), m);
    await incrementWorkouts();
    await autoPostWorkout(final.name, final.totalXP, 'kage_warrior', 'Warrior', session.kanji);
    const progCb = getProgramCompletionCallback();
    if (progCb) {
      await progCb();
      clearProgramCompletionCallback();
    }
    playSound('complete');
    setShowComplete(true);
  }

  const totalSets = session?.exercises.reduce((a, e) => a + e.sets.length, 0) ?? 0;
  const completedSets = session?.exercises.reduce((a, e) => a + e.sets.filter((s) => s.completed).length, 0) ?? 0;

  const activeProgram = playerProgram?.isActive ? getProgramById(playerProgram.programId) ?? null : null;
  const programProgress = activeProgram && playerProgram ? getProgress(playerProgram) : null;
  const progWeekDay = activeProgram && playerProgram ? getCurrentWeekDay(playerProgram) : null;

  const STYLE_COLORS: Record<string, string> = {
    powerlifting: '#C8102E', calisthenics: '#C9A84C', hypertrophy: '#E8A838',
    cardio: '#4A90D9', mixed: '#9B59B6',
  };
  const DIFFICULTY_COLORS: Record<string, string> = {
    beginner: '#00CC88', intermediate: '#C9A84C', advanced: '#C8102E',
  };

  const handleStartProgram = async (programId: string) => {
    const pp = createPlayerProgram(programId);
    await savePlayerProgram(pp);
    setPlayerProgram(pp);
    router.push(`/programs/${programId}`);
  };

  const handleContinueProgram = () => {
    if (playerProgram) router.push(`/programs/${playerProgram.programId}`);
  };

  const handleAbandonProgram = async () => {
    if (typeof window !== 'undefined' && window.confirm) {
      if (!window.confirm('Abandon program? All progress will be lost.')) return;
    }
    await deletePlayerProgram();
    setPlayerProgram(null);
  };

  function getSetById(id: string): WorkoutSet | undefined {
    if (!session) return undefined;
    for (const ex of session.exercises) {
      const set = ex.sets.find(s => s.id === id);
      if (set) return set;
    }
    return undefined;
  }

  // ── IDLE (merged Programs + Train) ────────────────────────────────────
  if (phase === 'idle') {
    return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={{ 
          paddingTop: isDesktop ? 60 : 50, 
          paddingHorizontal: isDesktop ? spacing.xl * 2 : spacing.lg,
          maxWidth: isWide ? 1400 : isDesktop ? 1200 : isTablet ? 900 : undefined,
          alignSelf: isDesktop ? 'center' : undefined,
          width: '100%'
        }} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(80).duration(600)} style={{ marginBottom: spacing.md, alignItems: 'center' }}>
            <KageText variant="kanji" color={colors.accent.gold} style={{ fontSize: isDesktop ? 36 : 28, letterSpacing: 8, marginBottom: spacing.xs }}>修行計画</KageText>
            <KageText variant="h3" letterSpacing={4}>TRAIN</KageText>
            <KageText variant="caption" color={colors.text.muted} letterSpacing={3} style={{ fontSize: isDesktop ? 10 : 8, textTransform: 'uppercase' }}>Programs & Free Workouts</KageText>
          </Animated.View>

          {/* Active program card */}
          {activeProgram && playerProgram ? (
            <Animated.View entering={FadeInDown.delay(160).duration(600)} style={{ marginBottom: spacing.md }}>
              <KageCard glow="subtle" padding={spacing.lg}>
                <KageText variant="caption" color={colors.accent.gold} letterSpacing={2} style={{ fontSize: 8, textTransform: 'uppercase', marginBottom: spacing.sm }}>
                  Active Program
                </KageText>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.xs }}>
                  <KageText variant="h2" style={{ fontSize: 22 }}>{activeProgram.name}</KageText>
                  <KageText variant="kanji" style={{ fontSize: 14, color: colors.accent.gold, opacity: 0.6 }}>{activeProgram.kanji}</KageText>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${programProgress?.percent ?? 0}%`, backgroundColor: colors.accent.gold }]} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs }}>
                  <KageText variant="caption" color={colors.text.secondary} style={{ fontSize: 10 }}>
                    Week {progWeekDay?.week ?? 1} of {activeProgram.durationWeeks}
                  </KageText>
                  <KageText variant="caption" color={colors.text.secondary} style={{ fontSize: 10 }}>
                    {programProgress?.completed ?? 0} / {programProgress?.total ?? 0} days
                  </KageText>
                </View>
                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                  <KageButton title="CONTINUE" variant="gold" size="sm" style={{ flex: 1 }} onPress={handleContinueProgram} />
                  <KageButton title="ABANDON" variant="ghost" size="sm" style={{ flex: 1 }} onPress={handleAbandonProgram} />
                </View>
              </KageCard>
            </Animated.View>
          ) : null}

          {/* Available Programs */}
          <Animated.View entering={FadeInDown.delay(240).duration(600)} style={{ marginBottom: spacing.sm }}>
            <KageText variant="h2" style={{ fontSize: isDesktop ? 20 : 16, letterSpacing: 3, marginBottom: spacing.xs }}>Programs</KageText>
            <KageText variant="caption" color={colors.text.muted} letterSpacing={2} style={{ fontSize: isDesktop ? 10 : 8, textTransform: 'uppercase' }}>
              Structured training paths
            </KageText>
          </Animated.View>

          <View style={{ 
            flexDirection: isDesktop ? 'row' : 'column', 
            flexWrap: isDesktop ? 'wrap' : 'nowrap', 
            gap: isDesktop ? 12 : 0 
          }}>
            {TRAINING_PROGRAMS.map((program, index) => {
              const isActive = playerProgram?.programId === program.id;
              const delay = 320 + index * 80;
              return (
                <Animated.View key={program.id} entering={FadeInDown.delay(delay).duration(600)} style={{ 
                  marginBottom: spacing.sm,
                  width: isDesktop ? '48%' : '100%',
                }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (isActive) router.push(`/programs/${program.id}`);
                      else if (!playerProgram?.isActive) handleStartProgram(program.id);
                    }}
                    disabled={!!playerProgram?.isActive && !isActive}
                  >
                    <KageCard padding={isDesktop ? spacing.lg : spacing.md} style={{ opacity: playerProgram?.isActive && !isActive ? 0.45 : 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.xs }}>
                        <KageText variant="h2" style={{ fontSize: isDesktop ? 20 : 16 }}>{program.name}</KageText>
                        <KageText variant="kanji" style={{ fontSize: isDesktop ? 16 : 12, color: colors.accent.gold, opacity: 0.5 }}>{program.kanji}</KageText>
                      </View>
                      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs }}>
                        <View style={[styles.badge, { backgroundColor: `${STYLE_COLORS[program.style]}22`, borderColor: STYLE_COLORS[program.style] }]}>
                          <KageText variant="caption" color={STYLE_COLORS[program.style]} style={{ fontSize: isDesktop ? 9 : 7, letterSpacing: 1.5, textTransform: 'uppercase' }}>{program.style}</KageText>
                        </View>
                        <View style={[styles.badge, { backgroundColor: `${DIFFICULTY_COLORS[program.difficulty]}22`, borderColor: DIFFICULTY_COLORS[program.difficulty] }]}>
                          <KageText variant="caption" color={DIFFICULTY_COLORS[program.difficulty]} style={{ fontSize: isDesktop ? 9 : 7, letterSpacing: 1.5, textTransform: 'uppercase' }}>{program.difficulty}</KageText>
                        </View>
                        <View style={[styles.badge, { backgroundColor: colors.glass.medium, borderColor: colors.glass.border }]}>
                          <KageText variant="caption" color={colors.text.secondary} style={{ fontSize: isDesktop ? 9 : 7, letterSpacing: 1.5, textTransform: 'uppercase' }}>{program.daysPerWeek}/wk</KageText>
                        </View>
                      </View>
                      <KageText variant="body" color={colors.text.secondary} style={{ fontSize: isDesktop ? 13 : 11, lineHeight: 16 }}>{program.description}</KageText>
                    </KageCard>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          <InkDivider width={80} thickness="thin" color={colors.glass.border} />

          {/* Free Workouts */}
          <Animated.View entering={FadeInDown.delay(560).duration(600)} style={{ marginVertical: spacing.md }}>
            <KageText variant="h2" style={{ fontSize: isDesktop ? 20 : 16, letterSpacing: 3, marginBottom: spacing.xs }}>Free Workouts</KageText>
            <KageText variant="caption" color={colors.text.muted} letterSpacing={2} style={{ fontSize: isDesktop ? 10 : 8, textTransform: 'uppercase' }}>
              Quick-start training sessions
            </KageText>
          </Animated.View>

          <View style={{ 
            flexDirection: isDesktop ? 'row' : 'column', 
            flexWrap: isDesktop ? 'wrap' : 'nowrap', 
            gap: isDesktop ? 12 : 0 
          }}>
            {workoutTemplates.map((t, i) => (
              <Animated.View key={t.id} entering={FadeInDown.delay(600 + i * 100).duration(500)} style={{ 
                marginBottom: 10,
                width: isDesktop ? '48%' : '100%',
              }}>
                <GlassContainer accentTop accentColor={colors.accent.primary} padding={isDesktop ? spacing.lg : spacing.md} style={{ borderRadius: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <View style={{ width: isDesktop ? 44 : 36, height: isDesktop ? 44 : 36, borderRadius: 10, backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border, alignItems: 'center', justifyContent: 'center' }}>
                      <KageText variant="kanji" style={{ fontSize: isDesktop ? 18 : 15, color: colors.accent.primary }}>{t.kanji}</KageText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <KageText variant="bodyBold" style={{ fontSize: isDesktop ? 16 : 13, color: colors.text.primary }}>{t.name}</KageText>
                      <KageText variant="caption" style={{ fontSize: isDesktop ? 11 : 9, color: colors.text.muted }}>{t.description}</KageText>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <KageText variant="caption" style={{ fontSize: isDesktop ? 10 : 8, letterSpacing: 1, color: colors.text.muted }}>{t.exercises.length} exercises · {t.duration}min</KageText>
                    <KageText variant="caption" color={t.difficulty === 'warrior' ? colors.accent.primary : colors.text.secondary} style={{ fontSize: isDesktop ? 10 : 8, letterSpacing: 1 }}>{t.difficulty.toUpperCase()}</KageText>
                  </View>
                  <KageButton title="BEGIN" variant="primary" size={isDesktop ? 'md' : 'sm'} onPress={() => startWorkout(t)} style={{ alignSelf: 'stretch' }} />
                </GlassContainer>
              </Animated.View>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ── REST ───────────────────────────────────────────────────────────────
  if (phase === 'rest') {
    const nextEx = session?.exercises[currentExIndex + 1];
    const nextExName = nextEx?.exercise.name || '';
    const programRest = nextEx?.restSeconds;
    const restRange = programRest ? { min: programRest, max: programRest + 30 } :
      nextEx ? getRestRange(nextEx.exercise.movementType) : { min: 60, max: 90 };
    const suggestedRest = programRest ? `${programRest}s (program)` : getSuggestedRest(nextExName);
    const warmupTip = getWarmupSuggestion(nextExName);
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: 8 }}>
          <KageText variant="h3" letterSpacing={8} color={colors.text.muted} style={{ opacity: 0.5 }}>REST</KageText>
          {nextEx && (
            <>
              <KageText variant="bodyBold" color={colors.accent.gold} style={{ fontSize: 16, letterSpacing: 2, marginTop: 8 }}>
                Up next: {nextEx.exercise.name}
              </KageText>
              <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9, letterSpacing: 0.5, marginBottom: 4 }}>
                Suggested rest: {suggestedRest}
              </KageText>
              <GlassContainer padding={spacing.sm} intensity="light" style={{ borderRadius: 8, marginBottom: 8 }}>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8, letterSpacing: 0.5, textAlign: 'center' }}>
                  🔥 {warmupTip}
                </KageText>
              </GlassContainer>
            </>
          )}
          <RestTimer total={restRange.min} onSkip={skipRest} onComplete={finishRest} />
        </View>
      </ScreenContainer>
    );
  }

  // ── COMPLETE (w/ Sensei review) ────────────────────────────────────────
  if (phase === 'complete' && showComplete) {
    return (
      <ScreenContainer>
        <WorkoutComplete xp={session?.totalXP ?? 0} duration={sessionDuration} setsCompleted={completedSets} onFinish={() => {
          const pid = session?.programId;
          setPhase('idle'); setSession(null); setCurrentExIndex(0); setSessionDuration(0); setShowComplete(false); setReviewData(null);
          if (pid) router.push(`/programs/${pid}`);
          else router.push('/(tabs)');
        }} onGoHome={() => {
          setPhase('idle'); setSession(null); setCurrentExIndex(0); setSessionDuration(0); setShowComplete(false); setReviewData(null);
          router.push('/(tabs)');
        }} />
      </ScreenContainer>
    );
  }

  if (phase === 'complete' && reviewData && session) {
    return (
      <ScreenContainer>
        <SenseiReview
          sessionName={session.name}
          baseXP={reviewData.baseXP}
          finalXP={reviewData.finalXP}
          mastery={reviewData.mastery}
          senseiMessage={reviewData.message}
          onContinue={handleFinish}
        />
      </ScreenContainer>
    );
  }

  // ── ACTIVE ─────────────────────────────────────────────────────────────
  const justCompletedSet = completedSetId ? getSetById(completedSetId) : undefined;

  return (
    <ScreenContainer>
      <View style={{ flex: 1, paddingTop: 50 }}>
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: 10, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <KageText variant="aggressive" color={colors.accent.cyan} style={{ fontSize: 16, lineHeight: 18 }}>
                {session?.name?.toUpperCase() || 'STRENGTH'}: BEAST MODE
              </KageText>
              <View style={{ width: 1, height: 14, backgroundColor: colors.glass.border }} />
              <KageText variant="tactical" color={colors.text.muted} style={{ fontSize: 8 }}>
                {currentExIndex + 1}/{session?.exercises.length}
              </KageText>
            </View>
            <KageText variant="tactical" color={colors.text.muted} style={{ fontSize: 8 }}>
              {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
            </KageText>
          </View>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {session?.exercises.map((_, i) => (
              <View key={i} style={{
                height: 3, borderRadius: 2, flex: 1,
                backgroundColor: i < currentExIndex ? colors.accent.cyan : i === currentExIndex ? colors.accent.cyan : colors.glass.border,
                shadowColor: i <= currentExIndex ? colors.accent.cyanGlow : undefined,
                shadowOpacity: 0.5, shadowRadius: 4,
              }} />
            ))}
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
          {currentExercise && (
            <>
              <ExerciseCard exercise={currentExercise.exercise} index={0} active />

              {/* Tactical Data Tiles */}
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                <GlassContainer padding={spacing.sm} glow="red" accentTop={false} style={{ borderRadius: 10, flex: 1 }}>
                  <View style={{ alignItems: 'center', gap: 2 }}>
                    <KageText variant="tactical" color={colors.status.danger} style={{ fontSize: 6 }}>HEART RATE</KageText>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 1 }}>
                      <KageText variant="aggressive" color={colors.status.danger} style={{ fontSize: 20, lineHeight: 22 }}>{128}</KageText>
                      <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8 }}>bpm</KageText>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}>
                      {[0.3, 0.6, 0.8, 0.5, 0.9, 0.7, 0.4].map((h, j) => (
                        <View key={j} style={{ width: 3, height: 12 * h + 4, borderRadius: 1.5, backgroundColor: colors.status.danger, opacity: 0.6 + h * 0.4 }} />
                      ))}
                    </View>
                  </View>
                </GlassContainer>
                <GlassContainer padding={spacing.sm} glow="cyan" accentTop={false} style={{ borderRadius: 10, flex: 1 }}>
                  <View style={{ alignItems: 'center', gap: 2 }}>
                    <KageText variant="tactical" color={colors.accent.cyan} style={{ fontSize: 6 }}>RANK</KageText>
                    <KageText variant="aggressive" color={colors.accent.cyan} style={{ fontSize: 20, lineHeight: 22 }}>#27</KageText>
                    <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 7 }}>leaderboard</KageText>
                  </View>
                </GlassContainer>
              </View>

              {/* Sets List */}
              <View style={{
                backgroundColor: colors.glass.medium,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.glass.border,
                padding: spacing.md,
                marginBottom: 12,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <KageText variant="caption" letterSpacing={2} color={colors.text.muted} style={{ fontSize: 7.5, textTransform: 'uppercase' }}>
                    Sets · {currentExercise.sets.filter((s) => s.completed).length}/{currentExercise.sets.length}
                  </KageText>
                  {currentExercise.sets.every((s) => s.completed) && (
                    <KageText variant="caption" color={colors.status.ready} style={{ fontSize: 8, letterSpacing: 1 }}>ALL COMPLETE</KageText>
                  )}
                </View>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8, marginBottom: 8, letterSpacing: 0.5 }}>
                  Rest suggestion: {getSuggestedRest(currentExercise.exercise.name)}
                </KageText>
                {currentExercise.sets.map((set) => (
                  <SetRow key={set.id} set={set} onToggle={() => completeSet(set.id)} onUpdate={handleUpdateSet} exerciseName={currentExercise.exercise.name} onCheckForm={checkForm} />
                ))}
              </View>

              {/* Form check for just-completed set */}
              {completedSetId && justCompletedSet && (
                <FormCheckCard
                  exerciseName={currentExercise.exercise.name}
                  setNumber={justCompletedSet.setNumber}
                  results={justCompletedSet.formResults}
                  onChange={(checkId, val) => handleFormChange(completedSetId, checkId, val)}
                  onDone={handleFormDone}
                  programStyle={session?.programStyle}
                />
              )}

              {/* Pose Analysis */}
              {analyzingEx && (
                <PoseAnalyzer
                  exerciseName={currentExercise.exercise.name}
                  onClose={() => setAnalyzingEx(false)}
                  onFeedback={(txt) => {
                    if (completedSetId) handleVideoAnalysis(completedSetId, txt);
                  }}
                />
              )}
            </>
          )}
        </ScrollView>

        {/* Bottom bar */}
        <View style={{
          paddingHorizontal: spacing.lg, paddingBottom: 90, paddingTop: 10, gap: 6,
          borderTopWidth: 1, borderTopColor: colors.glass.border,
          backgroundColor: colors.bg.primary,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 }}>
            <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8.5, letterSpacing: 1 }}>
              {completedSets}/{totalSets} sets
            </KageText>
            <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8.5 }}>
              {totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0}%
            </KageText>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <KageButton title="📹 ANALYZE FORM" variant="ghost" size="sm" onPress={() => setAnalyzingEx(!analyzingEx)} style={{ flex: 1 }} />
            <KageButton title={isLastExercise ? 'COMPLETE WORKOUT' : 'NEXT EXERCISE'} variant="primary" size="sm" onPress={nextExercise} style={{ flex: 2 }} />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginTop: spacing.sm },
  progressBarFill: { height: '100%', borderRadius: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  desktopContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  desktopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});

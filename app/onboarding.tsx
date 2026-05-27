import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown, SlideInLeft } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { PressableScale } from '@/components/ui/PressableScale';
import { useColors, spacing } from '@/theme';
import { TRAINING_PROGRAMS } from '@/constants/programs';
import { apiSaveProgram } from '@/store/api';
import { getRecommendedProgram, type UserPreferences } from '@/store/aiProgramRecommender';

const ONBOARDING_KEY = '@kage_onboarding_done';
const GOALS_KEY = '@kage_goals_complete';

interface Question {
  key: keyof UserPreferences | 'recommend';
  title: string;
  subtitle: string;
  options: { label: string; value: string; icon: string }[];
}

const questions: Question[] = [
  {
    key: 'goal',
    title: 'What is your primary goal?',
    subtitle: 'This shapes your entire training path',
    options: [
      { label: 'Raw Strength', value: 'strength', icon: '💪' },
      { label: 'Build Muscle', value: 'muscle', icon: '🏋️' },
      { label: 'Endurance', value: 'endurance', icon: '🏃' },
      { label: 'Cardio', value: 'cardio', icon: '❤️' },
      { label: 'Custom Mix', value: 'custom', icon: '⚔️' },
    ],
  },
  {
    key: 'experience',
    title: 'Your experience level?',
    subtitle: 'Be honest — the path honors all levels',
    options: [
      { label: 'Beginner', value: 'beginner', icon: '🌱' },
      { label: 'Intermediate', value: 'intermediate', icon: '⚡' },
      { label: 'Advanced', value: 'advanced', icon: '🔥' },
    ],
  },
  {
    key: 'daysPerWeek',
    title: 'Days per week?',
    subtitle: 'Consistency beats intensity',
    options: [
      { label: '2 days', value: '2', icon: '⛩️' },
      { label: '3 days', value: '3', icon: '🗡️' },
      { label: '4 days', value: '4', icon: '🏯' },
      { label: '5 days', value: '5', icon: '⚔️' },
      { label: '6 days', value: '6', icon: '🔥' },
    ],
  },
  {
    key: 'style',
    title: 'Preferred training style?',
    subtitle: 'The warrior\'s way is yours to choose',
    options: [
      { label: 'Powerlifting', value: 'powerlifting', icon: '🦍' },
      { label: 'Calisthenics', value: 'calisthenics', icon: '🤸' },
      { label: 'Hypertrophy', value: 'hypertrophy', icon: '💪' },
      { label: 'Conditioning', value: 'cardio', icon: '🏃' },
      { label: 'Mixed', value: 'mixed', icon: '⚔️' },
    ],
  },
  {
    key: 'equipment',
    title: 'Available equipment?',
    subtitle: 'We adapt the path to your tools',
    options: [
      { label: 'Full Gym', value: 'full_gym', icon: '🏋️' },
      { label: 'Minimal', value: 'minimal', icon: '🎯' },
      { label: 'Bodyweight', value: 'bodyweight', icon: '🧘' },
    ],
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const [step, setStep] = useState(0);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({});
  const [recommendation, setRecommendation] = useState<{ programId: string; reasons: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const currentQ = questions[step];

  function selectOption(key: string, value: string) {
    const numVal = key === 'daysPerWeek' ? parseInt(value) : value;
    setPrefs(prev => ({ ...prev, [key as keyof UserPreferences]: numVal }));
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(s => s + 1);
      } else {
        generateRecommendation();
      }
    }, 100);
  }

  async function generateRecommendation() {
    setLoading(true);
    const fullPrefs = prefs as UserPreferences;
    const result = await getRecommendedProgram(fullPrefs);
    setRecommendation(result);
    setStep(questions.length);
    setLoading(false);
  }

  async function confirmProgram() {
    if (!recommendation) return;
    const program = TRAINING_PROGRAMS.find(p => p.id === recommendation.programId);
    if (!program) return;

    await apiSaveProgram({
      programId: program.id,
      currentWeek: 1,
      currentDay: 1,
      startedAt: Date.now(),
      completedDays: [],
      isActive: true,
      swaps: {},
    });
    await AsyncStorage.setItem(GOALS_KEY, 'true');
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  }

  async function skipProgram() {
    await AsyncStorage.setItem(GOALS_KEY, 'true');
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  }

  // ── AI Recommendation Screen ──
  if (step === questions.length) {
    const program = recommendation ? TRAINING_PROGRAMS.find(p => p.id === recommendation.programId) : null;
    return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: spacing.lg }}>
          <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: 'center', gap: 16 }}>
            <KageText variant="kanji" style={{ fontSize: 48, color: colors.accent.gold }}>選</KageText>
            <KageText variant="h3" letterSpacing={4}>Your Recommended Path</KageText>
          </Animated.View>

          {loading ? (
            <GlassContainer padding={spacing.xl} intensity="medium" style={{ alignItems: 'center' }}>
              <KageText variant="body" color={colors.text.muted}>Sensei is analyzing your path...</KageText>
            </GlassContainer>
          ) : program ? (
            <>
              <GlassContainer padding={spacing.lg} intensity="heavy" glow="gold">
                <View style={{ alignItems: 'center', gap: spacing.sm }}>
                  <KageText variant="kanji" style={{ fontSize: 28, color: colors.accent.gold }}>{program.kanji}</KageText>
                  <KageText variant="h2" letterSpacing={4} color={colors.text.primary}>{program.name}</KageText>
                  <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9, letterSpacing: 1 }}>
                    {program.style.toUpperCase()} · {program.difficulty.toUpperCase()} · {program.daysPerWeek} DAYS/WEEK
                  </KageText>
                  <View style={{
                    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6,
                    backgroundColor: 'rgba(201,168,76,0.15)',
                  }}>
                    <KageText variant="mono" color={colors.accent.gold} style={{ fontSize: 12 }}>
                      {program.xpMultiplier}x XP
                    </KageText>
                  </View>
                  <KageText variant="body" color={colors.text.secondary} style={{ textAlign: 'center', fontSize: 12, lineHeight: 18 }}>
                    {program.longDescription}
                  </KageText>
                </View>
              </GlassContainer>

              <GlassContainer padding={spacing.md} intensity="light">
                <KageText variant="caption" color={colors.accent.gold} style={{ fontSize: 8, letterSpacing: 1.5, marginBottom: spacing.sm }}>
                  WHY THIS PROGRAM
                </KageText>
                {recommendation!.reasons.map((r, i) => (
                  <View key={i} style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
                    <KageText variant="mono" color={colors.accent.gold} style={{ fontSize: 10 }}>·</KageText>
                    <KageText variant="body" style={{ fontSize: 10, color: colors.text.secondary }}>{r}</KageText>
                  </View>
                ))}
              </GlassContainer>

              <View style={{ gap: 8 }}>
                <KageButton title="BEGIN THIS PATH" variant="gold" size="lg" fullWidth onPress={confirmProgram} />
                <KageButton title="NO THANKS, FREE TRAINING" variant="ghost" size="sm" fullWidth onPress={skipProgram} />
              </View>
            </>
          ) : (
            <View style={{ gap: 8 }}>
              <KageText variant="body" color={colors.status.danger}>Could not generate recommendation</KageText>
              <KageButton title="SKIP TO APP" variant="ghost" size="sm" fullWidth onPress={skipProgram} />
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }

  // ── Question Screen ──
  if (!currentQ) return null;
  const qKey = currentQ.key as string;

  return (
      <ScreenContainer>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: spacing.xl }}>
        {/* Progress bar */}
        <View style={{ flexDirection: 'row', gap: 4, position: 'absolute', top: 60, left: spacing.xxl, right: spacing.xxl }}>
          {questions.map((_, i) => (
            <View key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              backgroundColor: i <= step ? colors.accent.primary : colors.glass.border,
            }} />
          ))}
        </View>

        <Animated.View key={step} entering={SlideInLeft.duration(400)} style={{ gap: 24 }}>
          <View style={{ gap: 8 }}>
            <KageText variant="h3" letterSpacing={3}>{currentQ.title}</KageText>
            <KageText variant="body" color={colors.text.muted} style={{ fontSize: 12 }}>{currentQ.subtitle}</KageText>
          </View>

          <View style={{ gap: 8 }}>
            {currentQ.options.map(opt => {
              const isSelected = prefs[qKey as keyof UserPreferences]?.toString() === opt.value;
              return (
                <PressableScale key={opt.value} onPress={() => selectOption(qKey, opt.value)}>
                  <GlassContainer
                    intensity={isSelected ? 'heavy' : 'light'}
                    glow={isSelected ? 'gold' : 'none'}
                    padding={spacing.lg}
                    style={{ borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                  >
                    <KageText variant="body" style={{ fontSize: 20 }}>{opt.icon}</KageText>
                    <KageText variant="bodyBold" color={isSelected ? colors.accent.gold : colors.text.primary}
                      style={{ fontSize: 13, letterSpacing: 1 }}>
                      {opt.label}
                    </KageText>
                    {isSelected && (
                      <View style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent.gold, alignItems: 'center', justifyContent: 'center' }}>
                        <KageText variant="mono" color={colors.text.inverse} style={{ fontSize: 10 }}>✓</KageText>
                      </View>
                    )}
                  </GlassContainer>
                </PressableScale>
              );
            })}
          </View>
        </Animated.View>

        {/* Skip button */}
        <KageButton title="SKIP" variant="ghost" size="sm" fullWidth onPress={skipProgram} />
      </View>
    </ScreenContainer>
  );
}

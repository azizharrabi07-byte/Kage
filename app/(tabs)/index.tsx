import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { KageCard } from '@/components/ui/KageCard';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { SakuraPetals } from '@/components/cinematic/SakuraPetals';
import { InkDivider } from '@/components/japanese/InkDivider';
import { RankBadge } from '@/components/progression/RankBadge';
import { Sensei } from '@/components/coach/Sensei';
import { ModelThinkingCard } from '@/components/ai/ModelThinkingCard';
import { KageLineChart, KageBarChart } from '@/components/charts';
import { CalendarHeatmap } from '@/components/recovery/CalendarHeatmap';
import { Image } from 'react-native';
import { useColors, useTheme, spacing } from '@/theme';
import { getProgression, getRankByIndex } from '@/store/progressionStore';
import { getWorkoutHistory, getWeeklyVolumeData, getStrengthProgressData } from '@/store/workoutStore';
import { loadPlayerProgram, getProgramById, getProgress } from '@/store/programStore';
import type { PlayerProgression } from '@/components/progression/types';
import type { PlayerProgram } from '@/store/types';

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

export default function HomeScreen() {
  const router = useRouter();
  const rawColors = useColors();
  const colors = rawColors || {
    accent: { primary: '#00F5D4', neon: '#00F5D4', gold: '#FFD700' },
    text: { primary: '#FFFFFF', muted: '#AAAAAA', secondary: '#CCCCCC' },
    glass: { border: '#333333', medium: '#1A1A1A' },
    background: { primary: '#0A0A0A' },
    status: { ready: '#00FF88', recovery: '#FFAA00' }
  };
  const { mode, toggleTheme } = useTheme();
  const { isMobile, isTablet, isDesktop, isWide, width } = useResponsive();
  const [prog, setProg] = useState<PlayerProgression | null>(null);
  const [playerProg, setPlayerProg] = useState<PlayerProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [volumeData, setVolumeData] = useState<Array<{label: string, value: number}>>([]);
  const [strengthData, setStrengthData] = useState<Array<{label: string, value: number}>>([]);

  useEffect(() => {
    Promise.all([
      getProgression().then(setProg),
      loadPlayerProgram().then(setPlayerProg),
      getWeeklyVolumeData().then(setVolumeData),
      getStrengthProgressData().then(setStrengthData),
    ]).finally(() => setIsLoading(false));
  }, []);

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1;
  const isNewUser = prog && prog.workoutsCompleted === 0;

  if (isLoading) {
    return (
      <ScreenContainer safeBottom={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
          <ActivityIndicator size="small" color={colors.accent.gold} />
          <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 9, letterSpacing: 2 }}>Preparing your dojo...</KageText>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer safeBottom={false}>
      <SakuraPetals count={5} speed={0.7} />

      {/* Subtle alive background using the photo you uploaded */}
      {isDesktop && (
        <Image 
          source={require('../../assets/images/background/desktop-ambient.jpg')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.12,
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover"
        />
      )}
      <ScrollView contentContainerStyle={{ 
        paddingTop: isDesktop ? 70 : 50, 
        paddingHorizontal: isDesktop ? spacing.xl * 2.5 : spacing.lg,
        maxWidth: isWide ? 1480 : isDesktop ? 1280 : isTablet ? 900 : undefined,
        alignSelf: isDesktop ? 'center' : undefined,
        width: '100%'
      }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(80).duration(600).springify()} style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <KageText variant="aggressive" color={colors.accent.cyan} style={{ fontSize: 36, lineHeight: 38, marginBottom: -2 }}>
                WELCOME, ACE
              </KageText>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <KageText variant="caption" letterSpacing={3} color={colors.text.muted} style={{ fontSize: 8, textTransform: 'uppercase' }}>
                  KAGE
                </KageText>
                <KageText variant="kanji" style={{ fontSize: 12, color: colors.accent.cyan, opacity: 0.3 }}>影</KageText>
              </View>
            </View>
            <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: colors.glass.medium, borderColor: colors.glass.border }]}>
              <KageText variant="caption" style={{ fontSize: 9, letterSpacing: 2, color: colors.text.secondary }}>
                {mode === 'dark' ? '☀' : '🌙'}
              </KageText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Giant Progress Ring + Streak row */}
        <Animated.View entering={FadeInDown.delay(160).duration(600)} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
            <ProgressRing value={prog?.totalXP ? Math.min((prog.totalXP % 1000) / 10, 100) : 0} size={120} strokeWidth={8} color={colors.accent.cyan} label={`Lv.${prog?.level ?? 1}`} format="percent" />
            <View style={{ flex: 1, gap: 8 }}>
              <GlassContainer padding={spacing.md} glow="cyan" accentTop={false} style={{ borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <KageText variant="display" style={{ fontSize: 28, lineHeight: 32 }}>🔥</KageText>
                  <View>
                    <KageText variant="h2" color={colors.accent.cyan} style={{ fontSize: 28, letterSpacing: 2, lineHeight: 30 }}>{prog?.streak ?? 0}</KageText>
                    <KageText variant="tactical" color={colors.text.muted} style={{ fontSize: 7 }}>DAY STREAK</KageText>
                  </View>
                </View>
              </GlassContainer>
              <GlassContainer padding={spacing.md} glow="subtle" accentTop={false} style={{ borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <RankBadge totalXP={prog?.totalXP ?? 0} size="sm" />
                  <View>
                    <KageText variant="bodyBold" style={{ fontSize: 11, color: colors.text.primary }}>{prog?.totalXP ?? 0} XP</KageText>
                    <KageText variant="tactical" color={colors.text.muted} style={{ fontSize: 7 }}>{getRankByIndex(prog?.rankIndex ?? 0).name}</KageText>
                  </View>
                </View>
              </GlassContainer>
            </View>
          </View>
        </Animated.View>

        {/* Sensei or Welcome */}
        <Animated.View entering={FadeInDown.delay(240).duration(600)} style={{ marginBottom: 16 }}>
          {isNewUser ? (
            <GlassContainer padding={spacing.lg} glow="gold" accentTop accentColor={colors.accent.gold} style={{ borderRadius: isDesktop ? 20 : 14 }}>
              <KageText variant="kanji" color={colors.accent.gold} style={{ fontSize: 20, marginBottom: spacing.sm }}>ようこそ</KageText>
              <KageText variant="h2" style={{ fontSize: 20, marginBottom: spacing.xs }}>Welcome, Warrior</KageText>
              <KageText variant="body" color={colors.text.secondary} style={{ fontSize: 12, lineHeight: 18, marginBottom: spacing.md }}>
                Your journey begins now. Train hard, find your strength, and rise through the ranks.
              </KageText>
              <KageButton title="BEGIN YOUR FIRST WORKOUT" variant="gold" size="sm" fullWidth onPress={() => router.push('/(tabs)/workout')} />
            </GlassContainer>
          ) : (
            <Sensei context="greeting" compact stats={prog ? { level: prog.level, streak: prog.streak, totalXP: prog.totalXP, workoutsCompleted: prog.workoutsCompleted, rankName: getRankByIndex(prog.rankIndex).name } : undefined} />
          )}
        </Animated.View>

        {/* === MODEL THINKING — The Professional Strategist (Roundtable Priority #1) === */}
        <Animated.View entering={FadeInDown.delay(280).duration(600)} style={{ marginBottom: 16 }}>
          <ModelThinkingCard />
        </Animated.View>

        {/* === DESKTOP TRAINING ANALYTICS (Phase 5 Visualizations) === */}
        {isDesktop && (
          <Animated.View entering={FadeInDown.delay(340).duration(600)} style={{ marginBottom: 24 }}>
            <KageText variant="h3" color={colors.text.primary} style={{ marginBottom: 12, paddingHorizontal: 4 }}>
              Training Analytics
            </KageText>

            <View style={{ 
              flexDirection: 'row', 
              gap: 16, 
              flexWrap: 'wrap',
              justifyContent: 'space-between' 
            }}>
              {/* Strength Progress */}
              <GlassContainer 
                style={{ flex: 1, minWidth: 340, borderRadius: 16 }} 
                padding={spacing.lg}
              >
                <KageLineChart
                  title="Strength Progress (Recent PRs)"
                  data={strengthData.length > 0 ? strengthData : [
                    { label: 'W1', value: 95 }, { label: 'W2', value: 102 }, { label: 'W3', value: 108 },
                    { label: 'W4', value: 115 }, { label: 'W5', value: 120 }, { label: 'W6', value: 128 }
                  ]}
                  yAxisLabel="kg (estimated 1RM)"
                  height={170}
                />
              </GlassContainer>

              {/* Weekly Volume */}
              <GlassContainer 
                style={{ flex: 1, minWidth: 340, borderRadius: 16 }} 
                padding={spacing.lg}
              >
                <KageBarChart
                  title="Weekly Training Volume"
                  data={volumeData.length > 0 ? volumeData : [
                    { label: 'Mon', value: 12400 }, { label: 'Tue', value: 8200 }, { label: 'Wed', value: 15100 },
                    { label: 'Thu', value: 6300 }, { label: 'Fri', value: 13800 }, { label: 'Sat', value: 9800 }, { label: 'Sun', value: 4200 }
                  ]}
                  yAxisLabel="Volume (kg)"
                  height={170}
                />
              </GlassContainer>
            </View>

            {/* Consistency Heatmap - Real streak calendar */}
            <GlassContainer 
              style={{ width: '100%', borderRadius: 16, marginTop: 12 }} 
              padding={spacing.lg}
            >
              <CalendarHeatmap showStreak title="Training Consistency (Last 12 Weeks)" />
            </GlassContainer>

            <KageText variant="caption" color={colors.text.muted} align="center" style={{ marginTop: 8, fontSize: 10 }}>
              Data updates after each logged workout
            </KageText>
          </Animated.View>
        )}

        {/* Very visible Diet page access */}
        <Animated.View entering={FadeInDown.delay(320).duration(500)} style={{ marginBottom: 24 }}>
          <GlassContainer 
            padding={spacing.md} 
            style={{ 
              borderRadius: 16, 
              borderWidth: 1, 
              borderColor: colors.accent.gold + '40',
              backgroundColor: colors.glass.medium 
            }}
          >
            <KageText variant="caption" color={colors.accent.gold} style={{ textAlign: 'center', fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>
              NUTRITION STRATEGY
            </KageText>
            <KageText variant="bodyBold" style={{ textAlign: 'center', fontSize: 14, marginBottom: 8 }}>
              Open Full Diet & Meal Planning
            </KageText>
            <KageButton 
              title="GO TO DIET PAGE →" 
              variant="gold" 
              size="md" 
              onPress={() => router.push('/diet')} 
            />
          </GlassContainer>
        </Animated.View>

        {/* KPI Grid */}
        <Animated.View entering={FadeInDown.delay(320).duration(600)} style={{ marginBottom: 16 }}>
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            gap: isDesktop ? 12 : 8,
            justifyContent: isDesktop ? 'center' : 'flex-start',
          }}>
            {[
              { label: 'Workouts', value: prog?.workoutsCompleted ?? 0, color: colors.accent.primary, icon: '⚔' },
              { label: 'Strength', value: prog?.xpMap?.strength ?? 0, color: colors.status.ready, icon: '💪' },
              { label: 'Endurance', value: prog?.xpMap?.endurance ?? 0, color: colors.accent.gold, icon: '🏃' },
              { label: 'Focus', value: prog?.xpMap?.focus ?? 0, color: colors.status.recovery, icon: '🎯' },
              { label: 'Discipline', value: prog?.xpMap?.discipline ?? 0, color: colors.accent.neon, icon: '⚔' },
              { label: 'Recovery', value: prog?.xpMap?.recovery ?? 0, color: colors.accent.primary, icon: '💤' },
            ].map((s, i) => (
              <View key={i} style={{
                width: isDesktop ? '14%' : isTablet ? '30%' : '30%',
                minWidth: isDesktop ? 92 : undefined,
                borderRadius: 12,
                backgroundColor: colors.glass.medium,
                borderWidth: 1, borderColor: colors.glass.border,
                padding: isDesktop ? spacing.lg : spacing.md, 
                alignItems: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: s.color }} />
                <KageText variant="mono" color={s.color} style={{ fontSize: isDesktop ? 28 : 22, marginBottom: 2 }}>{s.value}</KageText>
                <KageText variant="caption" style={{ fontSize: isDesktop ? 9 : 7, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.6 }}>{s.label}</KageText>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* LIVE WORKOUT Card */}
        <Animated.View entering={FadeInDown.delay(480).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer padding={isDesktop ? spacing.xl : spacing.lg} glow="cyan" accentTop accentColor={colors.accent.cyan} style={{ borderRadius: isDesktop ? 20 : 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
              <KageText variant="tactical" color={colors.accent.cyan} style={{ fontSize: isDesktop ? 9 : 7 }}>LIVE WORKOUT</KageText>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.status.danger }} />
            </View>
            <KageText variant="bodyBold" style={{ fontSize: isDesktop ? 18 : 14, marginBottom: 2 }}>Resume Your Training</KageText>
            <KageText variant="body" color={colors.text.secondary} style={{ fontSize: isDesktop ? 13 : 11, lineHeight: 16, marginBottom: spacing.md }}>
              {playerProg ? `${getProgramById(playerProg.programId)?.name || 'Active Program'} — W${playerProg.currentWeek}D${playerProg.currentDay}` : 'Begin a new workout and track your progress'}
            </KageText>
            <KageButton title={playerProg ? 'CONTINUE TRAINING' : 'START WORKOUT'} variant="primary" size={isDesktop ? 'md' : 'sm'} fullWidth onPress={() => router.push('/(tabs)/workout')} />
          </GlassContainer>
        </Animated.View>

        {/* Week Calendar */}
        <Animated.View entering={FadeInDown.delay(480).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer padding={isDesktop ? spacing.xl : spacing.lg} accentTop accentColor={colors.accent.gold} style={{ borderRadius: isDesktop ? 20 : 14 }}>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: isDesktop ? 9 : 7.5, textTransform: 'uppercase', marginBottom: 12 }}>
              This Week
            </KageText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {weekDays.map((d, i) => (
                <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                  <KageText variant="caption" style={{ fontSize: isDesktop ? 9 : 7, letterSpacing: 1, color: colors.text.muted, textTransform: 'uppercase', opacity: 0.5 }}>{d}</KageText>
                  <View style={[
                    { width: isDesktop ? 40 : 30, height: isDesktop ? 40 : 30, borderRadius: isDesktop ? 20 : 15, alignItems: 'center', justifyContent: 'center' },
                    i < (prog?.streak ?? 0) && i < 7 ? { backgroundColor: colors.accent.glow, borderColor: colors.accent.primary, borderWidth: 1.5 } : { backgroundColor: colors.glass.light, borderColor: colors.glass.border, borderWidth: 1 },
                    i === dayIndex && { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary },
                  ]}>
                    <KageText variant="bodyBold" style={{ fontSize: isDesktop ? 14 : 11, color: i === dayIndex ? '#F5F0E8' : colors.text.secondary }}>{d}</KageText>
                  </View>
                </View>
              ))}
            </View>
          </GlassContainer>
        </Animated.View>

        {/* Attribute Rings */}
        <Animated.View entering={FadeInDown.delay(560).duration(600)} style={{ marginBottom: 20 }}>
          <GlassContainer padding={isDesktop ? spacing.xl : spacing.lg} accentTop accentColor={colors.accent.primary} style={{ borderRadius: isDesktop ? 20 : 14 }}>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: isDesktop ? 9 : 7.5, textTransform: 'uppercase', marginBottom: 12 }}>Attributes</KageText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: isDesktop ? 8 : 4 }}>
              <ProgressRing value={prog?.xpMap?.strength ?? 0} maxValue={Math.max(prog?.xpMap?.strength ?? 100, 100)} label="STR" color={colors.accent.primary} format="number" size={isDesktop ? 72 : 56} />
              <ProgressRing value={prog?.xpMap?.discipline ?? 0} maxValue={Math.max(prog?.xpMap?.discipline ?? 100, 100)} label="DIS" color={colors.status.ready} format="number" size={isDesktop ? 72 : 56} />
              <ProgressRing value={prog?.xpMap?.endurance ?? 0} maxValue={Math.max(prog?.xpMap?.endurance ?? 100, 100)} label="END" color={colors.accent.gold} format="number" size={isDesktop ? 72 : 56} />
              <ProgressRing value={prog?.xpMap?.focus ?? 0} maxValue={Math.max(prog?.xpMap?.focus ?? 100, 100)} label="FOC" color={colors.status.recovery} format="number" size={isDesktop ? 72 : 56} />
              <ProgressRing value={prog?.xpMap?.recovery ?? 0} maxValue={Math.max(prog?.xpMap?.recovery ?? 100, 100)} label="REC" color={colors.accent.neon} format="number" size={isDesktop ? 72 : 56} />
            </View>
          </GlassContainer>
        </Animated.View>

        <InkDivider width={100} thickness="thin" color={colors.accent.primary} />

        {/* Program Progress */}
        {(() => {
          const activeProg = playerProg?.isActive ? getProgramById(playerProg.programId) : null;
          const pProgress = playerProg && activeProg ? getProgress(playerProg) : null;
          return (
            <Animated.View entering={FadeInDown.delay(660).duration(600)} style={{ marginBottom: 16 }}>
              <TouchableOpacity onPress={() => router.push('/programs')} activeOpacity={0.8}>
                <GlassContainer padding={isDesktop ? spacing.xl : spacing.lg} accentTop accentColor={colors.accent.gold} style={{ borderRadius: isDesktop ? 20 : 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: isDesktop ? 9 : 7.5, textTransform: 'uppercase' }}>
                      {activeProg ? 'Active Program' : 'Training Programs'}
                    </KageText>
                    <KageText variant="caption" color={colors.text.muted} style={{ fontSize: isDesktop ? 10 : 8, letterSpacing: 1 }}>
                      VIEW ALL →
                    </KageText>
                  </View>
                  {activeProg && pProgress ? (
                    <>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                        <KageText variant="kanji" color={colors.accent.gold} style={{ fontSize: isDesktop ? 20 : 16, opacity: 0.6 }}>{activeProg.kanji}</KageText>
                        <KageText variant="bodyBold" style={{ fontSize: isDesktop ? 16 : 13, flex: 1 }}>{activeProg.name}</KageText>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                        <View style={{ flex: 1, height: isDesktop ? 6 : 4, backgroundColor: colors.glass.light, borderRadius: 2, overflow: 'hidden' }}>
                          <View style={{ height: '100%', width: `${pProgress.percent}%`, backgroundColor: colors.accent.gold, borderRadius: 2 }} />
                        </View>
                        <KageText variant="caption" color={colors.text.secondary} style={{ fontSize: isDesktop ? 11 : 9 }}>
                          {pProgress.completed}/{pProgress.total}
                        </KageText>
                      </View>
                    </>
                  ) : (
                    <KageText variant="body" color={colors.text.muted} style={{ fontSize: isDesktop ? 13 : 11 }}>
                      Choose a training path to begin your journey
                    </KageText>
                  )}
                </GlassContainer>
              </TouchableOpacity>
            </Animated.View>
          );
        })()}

        {/* CTA */}
        <Animated.View entering={FadeInDown.delay(640).duration(600)} style={{ alignItems: 'center', marginTop: 8, marginBottom: 24, gap: 12 }}>
          <KageButton title="⚔ START LOCK-IN MODE" variant="lockIn" size={isDesktop ? 'lg' : 'lg'} fullWidth onPress={() => router.push('/lock-in')} />
          <KageText variant="caption" align="center" style={{ letterSpacing: 4, color: colors.text.muted, fontSize: isDesktop ? 11 : 9, opacity: 0.5 }}>
            Focus your spirit
          </KageText>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  themeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  streakGlow: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(200,16,46,0.08)',
  },
  desktopContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
});

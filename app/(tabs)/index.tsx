import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
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
import { useColors, useTheme, spacing } from '@/theme';
import { getProgression, getRankByIndex } from '@/store/progressionStore';
import { getWorkoutHistory } from '@/store/workoutStore';
import { loadPlayerProgram, getProgramById, getProgress } from '@/store/programStore';
import type { PlayerProgression } from '@/components/progression/types';
import type { PlayerProgram } from '@/store/types';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { mode, toggleTheme } = useTheme();
  const [prog, setProg] = useState<PlayerProgression | null>(null);
  const [playerProg, setPlayerProg] = useState<PlayerProgram | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProgression().then(setProg),
      loadPlayerProgram().then(setPlayerProg),
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
      <ScrollView contentContainerStyle={{ paddingTop: 50, paddingHorizontal: spacing.lg }} showsVerticalScrollIndicator={false}>
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
            <GlassContainer padding={spacing.lg} glow="gold" accentTop accentColor={colors.accent.gold} style={{ borderRadius: 14 }}>
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

        {/* KPI Grid */}
        <Animated.View entering={FadeInDown.delay(320).duration(600)} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Workouts', value: prog?.workoutsCompleted ?? 0, color: colors.accent.primary, icon: '⚔' },
              { label: 'Strength', value: prog?.xpMap?.strength ?? 0, color: colors.status.ready, icon: '💪' },
              { label: 'Endurance', value: prog?.xpMap?.endurance ?? 0, color: colors.accent.gold, icon: '🏃' },
              { label: 'Focus', value: prog?.xpMap?.focus ?? 0, color: colors.status.recovery, icon: '🎯' },
              { label: 'Discipline', value: prog?.xpMap?.discipline ?? 0, color: colors.accent.neon, icon: '⚔' },
              { label: 'Recovery', value: prog?.xpMap?.recovery ?? 0, color: colors.accent.primary, icon: '💤' },
            ].map((s, i) => (
              <View key={i} style={{
                width: '30%', borderRadius: 12,
                backgroundColor: colors.glass.medium,
                borderWidth: 1, borderColor: colors.glass.border,
                padding: spacing.md, alignItems: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: s.color }} />
                <KageText variant="mono" color={s.color} style={{ fontSize: 22, marginBottom: 2 }}>{s.value}</KageText>
                <KageText variant="caption" style={{ fontSize: 7, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.6 }}>{s.label}</KageText>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* LIVE WORKOUT Card */}
        <Animated.View entering={FadeInDown.delay(480).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer padding={spacing.lg} glow="cyan" accentTop accentColor={colors.accent.cyan} style={{ borderRadius: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
              <KageText variant="tactical" color={colors.accent.cyan} style={{ fontSize: 7 }}>LIVE WORKOUT</KageText>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.status.danger }} />
            </View>
            <KageText variant="bodyBold" style={{ fontSize: 14, marginBottom: 2 }}>Resume Your Training</KageText>
            <KageText variant="body" color={colors.text.secondary} style={{ fontSize: 11, lineHeight: 16, marginBottom: spacing.md }}>
              {playerProg ? `${getProgramById(playerProg.programId)?.name || 'Active Program'} — W${playerProg.currentWeek}D${playerProg.currentDay}` : 'Begin a new workout and track your progress'}
            </KageText>
            <KageButton title={playerProg ? 'CONTINUE TRAINING' : 'START WORKOUT'} variant="primary" size="sm" fullWidth onPress={() => router.push('/(tabs)/workout')} />
          </GlassContainer>
        </Animated.View>

        {/* Week Calendar */}
        <Animated.View entering={FadeInDown.delay(480).duration(600)} style={{ marginBottom: 16 }}>
          <GlassContainer padding={spacing.lg} accentTop accentColor={colors.accent.gold} style={{ borderRadius: 14 }}>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 7.5, textTransform: 'uppercase', marginBottom: 12 }}>
              This Week
            </KageText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {weekDays.map((d, i) => (
                <View key={i} style={{ alignItems: 'center', gap: 6 }}>
                  <KageText variant="caption" style={{ fontSize: 7, letterSpacing: 1, color: colors.text.muted, textTransform: 'uppercase', opacity: 0.5 }}>{d}</KageText>
                  <View style={[
                    { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
                    i < (prog?.streak ?? 0) && i < 7 ? { backgroundColor: colors.accent.glow, borderColor: colors.accent.primary, borderWidth: 1.5 } : { backgroundColor: colors.glass.light, borderColor: colors.glass.border, borderWidth: 1 },
                    i === dayIndex && { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary },
                  ]}>
                    <KageText variant="bodyBold" style={{ fontSize: 11, color: i === dayIndex ? '#F5F0E8' : colors.text.secondary }}>{d}</KageText>
                  </View>
                </View>
              ))}
            </View>
          </GlassContainer>
        </Animated.View>

        {/* Attribute Rings */}
        <Animated.View entering={FadeInDown.delay(560).duration(600)} style={{ marginBottom: 20 }}>
          <GlassContainer padding={spacing.lg} accentTop accentColor={colors.accent.primary} style={{ borderRadius: 14 }}>
            <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 7.5, textTransform: 'uppercase', marginBottom: 12 }}>Attributes</KageText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: 4 }}>
              <ProgressRing value={prog?.xpMap?.strength ?? 0} maxValue={Math.max(prog?.xpMap?.strength ?? 100, 100)} label="STR" color={colors.accent.primary} format="number" size={56} />
              <ProgressRing value={prog?.xpMap?.discipline ?? 0} maxValue={Math.max(prog?.xpMap?.discipline ?? 100, 100)} label="DIS" color={colors.status.ready} format="number" size={56} />
              <ProgressRing value={prog?.xpMap?.endurance ?? 0} maxValue={Math.max(prog?.xpMap?.endurance ?? 100, 100)} label="END" color={colors.accent.gold} format="number" size={56} />
              <ProgressRing value={prog?.xpMap?.focus ?? 0} maxValue={Math.max(prog?.xpMap?.focus ?? 100, 100)} label="FOC" color={colors.status.recovery} format="number" size={56} />
              <ProgressRing value={prog?.xpMap?.recovery ?? 0} maxValue={Math.max(prog?.xpMap?.recovery ?? 100, 100)} label="REC" color={colors.accent.neon} format="number" size={56} />
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
                <GlassContainer padding={spacing.lg} accentTop accentColor={colors.accent.gold} style={{ borderRadius: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <KageText variant="caption" letterSpacing={2} color={colors.accent.gold} style={{ fontSize: 7.5, textTransform: 'uppercase' }}>
                      {activeProg ? 'Active Program' : 'Training Programs'}
                    </KageText>
                    <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8, letterSpacing: 1 }}>
                      VIEW ALL →
                    </KageText>
                  </View>
                  {activeProg && pProgress ? (
                    <>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                        <KageText variant="kanji" color={colors.accent.gold} style={{ fontSize: 16, opacity: 0.6 }}>{activeProg.kanji}</KageText>
                        <KageText variant="bodyBold" style={{ fontSize: 13, flex: 1 }}>{activeProg.name}</KageText>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                        <View style={{ flex: 1, height: 4, backgroundColor: colors.glass.light, borderRadius: 2, overflow: 'hidden' }}>
                          <View style={{ height: '100%', width: `${pProgress.percent}%`, backgroundColor: colors.accent.gold, borderRadius: 2 }} />
                        </View>
                        <KageText variant="caption" color={colors.text.secondary} style={{ fontSize: 9 }}>
                          {pProgress.completed}/{pProgress.total}
                        </KageText>
                      </View>
                    </>
                  ) : (
                    <KageText variant="body" color={colors.text.muted} style={{ fontSize: 11 }}>
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
          <KageButton title="⚔ START LOCK-IN MODE" variant="lockIn" size="lg" fullWidth onPress={() => router.push('/lock-in')} />
          <KageText variant="caption" align="center" style={{ letterSpacing: 4, color: colors.text.muted, fontSize: 9, opacity: 0.5 }}>
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
});

import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { SakuraPetals } from '@/components/cinematic/SakuraPetals';
import { InkDivider } from '@/components/japanese/InkDivider';
import { useColors, spacing } from '@/theme';
import { getProgression, getRankByIndex } from '@/store/progressionStore';

export default function LockInScreen() {
  const router = useRouter();
  const colors = useColors();
  const [prog, setProg] = useState<any>(null);
  const [quote, setQuote] = useState('');
  const [step, setStep] = useState<'breathe' | 'focus' | 'ready'>('breathe');
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    getProgression().then(setProg);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // Breathing animation cycle
  useEffect(() => {
    if (step !== 'breathe') return;
    const cycle = async () => {
      setBreathePhase('inhale');
      await delay(3000);
      setBreathePhase('hold');
      await delay(2000);
      setBreathePhase('exhale');
      await delay(3000);
    };
    cycle();
    const interval = setInterval(cycle, 8000);
    return () => clearInterval(interval);
  }, [step]);

  function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

  const rankName = prog ? getRankByIndex(prog.rankIndex).name : 'Warrior';

  return (
    <ScreenContainer safeBottom={false}>
      <SakuraPetals count={8} speed={0.9} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl }}>
        {step === 'breathe' && (
          <Animated.View entering={FadeInDown.duration(800)} style={{ alignItems: 'center', gap: 40 }}>
            <View style={styles.breathCircle}>
              <View style={[styles.breathRing, {
                borderColor: breathePhase === 'inhale' ? colors.accent.primary : breathePhase === 'hold' ? colors.accent.gold : colors.status.recovery,
                transform: [{ scale: breathePhase === 'inhale' ? 1.3 : breathePhase === 'exhale' ? 0.7 : 1 }],
              }]} />
              <KageText variant="kanji" style={{ fontSize: 36, color: colors.accent.primary, opacity: 0.6 }}>息</KageText>
            </View>
            <KageText variant="caption" letterSpacing={6} color={colors.accent.gold} style={{ fontSize: 10, textTransform: 'uppercase' }}>
              {breathePhase === 'inhale' ? 'Inhale...' : breathePhase === 'hold' ? 'Hold...' : 'Exhale...'}
            </KageText>
            <KageText variant="body" color={colors.text.secondary} style={{ fontSize: 12, lineHeight: 20, textAlign: 'center', opacity: 0.6, maxWidth: 280 }}>
              Clear your mind. Focus on your breath. The body follows the mind.
            </KageText>
            <KageButton title="I AM READY" variant="lockIn" size="lg" fullWidth onPress={() => setStep('focus')} />
          </Animated.View>
        )}

        {step === 'focus' && (
          <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: 'center', gap: 24 }}>
            <View style={[styles.kanjiCircle, { borderColor: colors.accent.gold }]}>
              <KageText variant="kanji" style={{ fontSize: 48, color: colors.accent.gold, opacity: 0.7 }}>{'集'}</KageText>
            </View>
            <KageText variant="h2" letterSpacing={6} style={{ marginTop: 8 }}>{rankName}</KageText>
            <KageText variant="caption" style={{ fontSize: 9, letterSpacing: 2, color: colors.text.muted, opacity: 0.5, textAlign: 'center', maxWidth: 260 }}>
              Your focus determines your reality. The dojo awaits.
            </KageText>
            <View style={{ width: '100%', height: 1, backgroundColor: colors.glass.border, marginVertical: 8 }} />
            <KageText variant="body" color={colors.accent.gold} style={{ fontSize: 11, lineHeight: 18, textAlign: 'center', fontStyle: 'italic', maxWidth: 280 }}>
              "{quote}"
            </KageText>
            <View style={{ gap: 8, marginTop: 12, width: '100%' }}>
              <KageButton title="⚔ BEGIN TRAINING" variant="lockIn" size="lg" fullWidth onPress={() => router.push('/(tabs)/workout')} />
              <KageButton title="← Return" variant="ghost" size="sm" fullWidth onPress={() => setStep('breathe')} />
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const QUOTES = [
  'The body achieves what the mind believes.',
  'Strength does not come from the body. It comes from the will.',
  'The only bad workout is the one that did not happen.',
  'Fall seven times, stand up eight.',
  'The pain you feel today will be the strength you feel tomorrow.',
  'A black belt is a white belt who never quit.',
  'The obstacle is the path.',
  'Do not pray for an easy life. Pray for the strength to endure a difficult one.',
  'The fight is won or lost far away from witnesses - behind the lines, in the gym, and out there on the road.',
  'It is not the mountain we conquer but ourselves.',
];

const styles = StyleSheet.create({
  breathCircle: {
    width: 120, height: 120, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(200,16,46,0.06)',
  },
  breathRing: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 2,
  },
  kanjiCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: 'rgba(201,168,76,0.06)',
  },
});

import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { useColors, spacing } from '@/theme';
import { playSound } from '@/utils/sound';

interface TimerProps { seconds: number; running?: boolean; size?: 'sm' | 'lg'; }

export function Timer({ seconds, running = false, size = 'lg' }: TimerProps) {
  const colors = useColors();
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    <View style={{ alignItems: 'center', gap: spacing.md }}>
      <KageText
        variant={size === 'lg' ? 'giant' : 'h1'}
        align="center"
        color={running ? colors.accent.neon : colors.text.primary}
        style={{ letterSpacing: 6, fontVariant: ['tabular-nums'] as any }}
      >
        {pad(mins)}:{pad(secs)}
      </KageText>
    </View>
  );
}

interface RestTimerProps { total: number; onSkip: () => void; onComplete: () => void; }

export function RestTimer({ total, onSkip, onComplete }: RestTimerProps) {
  const [remaining, setRemaining] = useState(total);
  const progress = useSharedValue(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    progress.value = withTiming(0, { duration: total * 1000, easing: Easing.linear });
    intervalRef.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) { if (intervalRef.current) clearInterval(intervalRef.current); playSound('rest_over'); onComplete(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [total]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 1], [0, 100])}%` as any,
  }));

  return (
    <GlassContainer intensity="medium" glow="red" padding={spacing.xl}>
      <KageText variant="caption" align="center" letterSpacing={3}
        style={{ marginBottom: spacing.sm, opacity: 0.4 }}>
        REST - {remaining}s
      </KageText>
      <Timer seconds={remaining} running size="lg" />
      <View style={{ width: '80%', height: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, marginVertical: spacing.lg, overflow: 'hidden' }}>
        <Animated.View style={[{ height: '100%', backgroundColor: '#FF1A1A', borderRadius: 1 }, barStyle]} />
      </View>
      <KageButton title="SKIP" variant="ghost" size="sm" onPress={onSkip} />
    </GlassContainer>
  );
}

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSequence, Easing, FadeInDown,
} from 'react-native-reanimated';
import { GlassContainer } from '@/components/ui/GlassContainer';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { useColors, spacing } from '@/theme';
import { SenseiDebrief } from './SenseiDebrief';
import { KageRadarChart } from '@/components/charts';
import { CalendarHeatmap } from '@/components/recovery/CalendarHeatmap';

interface WorkoutCompleteProps {
  xp: number;
  duration: number;
  setsCompleted: number;
  onFinish: () => void;
  onGoHome?: () => void;
}

export function WorkoutComplete({ xp, duration, setsCompleted, onFinish, onGoHome }: WorkoutCompleteProps) {
  const rawColors = useColors();
  const colors = rawColors || {
    accent: { primary: '#00F5D4', neon: '#00F5D4', gold: '#FFD700' },
    text: { primary: '#FFFFFF', muted: '#AAAAAA' },
    glass: { border: '#333333' },
    background: { primary: '#0A0A0A' }
  };
  const scale = useSharedValue(0);
  const glow = useSharedValue(0);
  const [showDebrief, setShowDebrief] = useState(false);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 400, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
      withTiming(1, { duration: 200 })
    );
    glow.value = withTiming(1, { duration: 800 });
  }, []);

  const glowStyle = useAnimatedStyle(() => ({ shadowOpacity: glow.value * 0.4, shadowRadius: glow.value * 25 }));
  const bgStyle = useAnimatedStyle(() => ({ opacity: glow.value * 0.06 }));

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.accent.primary, shadowColor: colors.accent.neon, shadowOffset: { width: 0, height: 0 } }, glowStyle, bgStyle]} />
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: 'center', gap: 8 }}>
          <KageText variant="caption" letterSpacing={4} color={colors.accent.gold} style={{ fontSize: 8, textTransform: 'uppercase' }}>Workout Complete</KageText>
          <KageText variant="h2" letterSpacing={8} color={colors.accent.primary} align="center">COMPLETE</KageText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={{ width: '100%' }}>
          <GlassContainer intensity="heavy" glow="red" padding={spacing.xxl} accentTop accentColor={colors.accent.primary} style={{ borderRadius: 14 }}>
            <KageText variant="caption" letterSpacing={3} align="center" color={colors.accent.gold} style={{ fontSize: 8, textTransform: 'uppercase', marginBottom: 12 }}>
              XP Earned
            </KageText>
            <KageText variant="display" color={colors.accent.primary} align="center" style={{ marginVertical: 8 }}>
              +{xp}
            </KageText>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <KageText variant="mono" color={colors.text.primary} style={{ fontSize: 20 }}>
                  {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                </KageText>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Duration</KageText>
              </View>
              <View style={{ width: 1, height: 32, backgroundColor: colors.glass.border }} />
              <View style={{ alignItems: 'center', gap: 4 }}>
                <KageText variant="mono" color={colors.text.primary} style={{ fontSize: 20 }}>{setsCompleted}</KageText>
                <KageText variant="caption" color={colors.text.muted} style={{ fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Sets Done</KageText>
              </View>
            </View>
          </GlassContainer>
        </Animated.View>

        {/* Post-Workout Visual Feedback: Radar + Consistency */}
        <Animated.View entering={FadeInDown.delay(450).duration(600)} style={{ width: '100%' }}>
          <GlassContainer padding={spacing.lg} style={{ borderRadius: 14, marginBottom: 12 }}>
            <KageText variant="caption" color={colors.accent.gold} style={{ textAlign: 'center', fontSize: 9, letterSpacing: 2, marginBottom: 8 }}>
              SESSION IMPACT
            </KageText>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <View>
                <KageRadarChart
                  title="Attribute Boost"
                  data={[
                    { label: 'Str', value: Math.min(100, 40 + (xp / 10)) },
                    { label: 'End', value: Math.min(100, 35 + (xp / 12)) },
                    { label: 'Foc', value: Math.min(100, 50 + (setsCompleted * 2)) },
                    { label: 'Dis', value: Math.min(100, 45 + (duration / 120)) },
                    { label: 'Rec', value: 60 },
                    { label: 'Spi', value: 55 },
                  ]}
                  size={120}
                />
              </View>
              
              <View style={{ width: 140 }}>
                <CalendarHeatmap 
                  showStreak 
                  title="Streak" 
                />
              </View>
            </View>
          </GlassContainer>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={{ width: '100%', gap: 8 }}>
          <KageButton title="CONTINUE JOURNEY" variant="primary" size="lg" fullWidth onPress={onFinish} />
          
          {/* Epic Premium Feature: Sensei Debrief */}
          <KageButton 
            title="✧ REQUEST SENSEI DEBRIEF" 
            variant="gold" 
            size="md" 
            fullWidth 
            onPress={() => setShowDebrief(true)} 
          />

          {onGoHome && (
            <KageButton title="GO HOME" variant="ghost" size="sm" fullWidth onPress={onGoHome} />
          )}
          <KageText variant="caption" align="center" color={colors.text.muted} style={{ fontSize: 9, letterSpacing: 2 }}>
            Stronger than yesterday
          </KageText>
        </Animated.View>
      </View>

      {/* Premium Sensei Debrief Modal */}
      <Modal visible={showDebrief} transparent animationType="fade" onRequestClose={() => setShowDebrief(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 }}>
          <SenseiDebrief 
            exerciseName="Recent Session" 
            onClose={() => setShowDebrief(false)} 
          />
        </View>
      </Modal>

      {/* Note for developers: Real persistence (workout + PRs) now routes through
          workoutStore.saveWorkoutSession() → new backend /workouts when possible */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1, justifyContent: 'space-around', alignItems: 'center',
    paddingHorizontal: spacing.xxl, paddingVertical: 48,
  },
});
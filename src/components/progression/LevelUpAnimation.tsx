import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { KageText } from '@/components/ui/KageText';
import { KageButton } from '@/components/ui/KageButton';
import { KanjiAccent } from '@/components/japanese/KanjiAccent';
import { colors, spacing } from '@/theme';
import { RankTier } from './types';

const { width } = Dimensions.get('window');

interface LevelUpAnimationProps {
  rank: RankTier;
  onDismiss: () => void;
}

export function LevelUpAnimation({ rank, onDismiss }: LevelUpAnimationProps) {
  const flash = useSharedValue(0);
  const scale = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    overlayOpacity.value = withTiming(1, { duration: 300, easing: Easing.ease });
    flash.value = withSequence(
      withTiming(1, { duration: 600, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
      withTiming(0, { duration: 400 }),
      withTiming(0.5, { duration: 200 }),
      withTiming(0, { duration: 300 })
    );
    scale.value = withSequence(
      withTiming(1.2, { duration: 400, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
      withTiming(1, { duration: 300, easing: Easing.elastic(1) })
    );
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flash.value,
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View style={[styles.overlay, overlayStyle]} />
      <Animated.View style={[styles.flash, flashStyle]} />
      <Animated.View style={[styles.content, badgeStyle]}>
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <KanjiAccent kanji="覚醒" reading="AWAKENING" size="md" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.rankSection}>
          <KageText variant="caption" letterSpacing={6} align="center" style={styles.newRankLabel}>
            NEW RANK ACHIEVED
          </KageText>
          <View style={styles.rankBadge}>
            <KageText variant="display" color={rank.color} style={styles.rankKanji}>
              {rank.kanji}
            </KageText>
          </View>
          <KageText variant="h2" letterSpacing={6} align="center" style={styles.rankName}>
            {rank.name.toUpperCase()}
          </KageText>
          <KageText variant="caption" align="center" letterSpacing={3} style={styles.rankSub}>
            {rank.subtitle}
          </KageText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1000).duration(600)}>
          <KageButton
            title="CONTINUE"
            variant="primary"
            size="lg"
            fullWidth
            onPress={onDismiss}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bg.primary,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.accent.neon,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.xxxl,
  },
  rankSection: {
    alignItems: 'center',
    gap: spacing.md,
  },
  newRankLabel: {
    opacity: 0.4,
    marginBottom: spacing.md,
  },
  rankBadge: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.4,
    backgroundColor: colors.glass.medium,
    borderWidth: 3,
    borderColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
  rankKanji: {
    fontSize: width * 0.15,
  },
  rankName: {
    marginTop: spacing.md,
  },
  rankSub: {
    opacity: 0.5,
  },
});
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { KageText } from '@/components/ui/KageText';
import { useColors, spacing } from '@/theme';
import { getNextRank, RANKS } from '@/store/progressionStore';

interface RankBadgeProps {
  totalXP: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function RankBadge({ totalXP, size = 'md', animated = true }: RankBadgeProps) {
  const colors = useColors();
  const { current, next, progress } = getNextRank(totalXP);
  const isMaxRank = current.id === RANKS[RANKS.length - 1].id;
  const badgeSize = { sm: 60, md: 80, lg: 100 }[size];
  const Wrapper = animated ? Animated.View : View;

  return (
    <Wrapper entering={animated ? FadeInDown.duration(600).springify() : undefined}>
      <View style={styles.container}>
        <View style={[styles.badge, {
          width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2,
          borderColor: colors.accent.primary, backgroundColor: colors.glass.medium,
          shadowColor: colors.accent.glow,
        }]}>
          <View style={[styles.inner, {
            width: badgeSize - 8, height: badgeSize - 8, borderRadius: (badgeSize - 8) / 2,
            backgroundColor: colors.glass.light, borderColor: colors.glass.border,
          }]}>
            <KageText variant="kanji" style={{ color: colors.accent.neon, fontSize: { sm: 18, md: 26, lg: 34 }[size] }}>
              {current.kanji}
            </KageText>
          </View>
        </View>
        <KageText variant="bodyBold" align="center" style={{ letterSpacing: 3, marginTop: 4 }}>
          {current.name}
        </KageText>
        <KageText variant="caption" align="center" style={{ fontSize: 10, letterSpacing: 1, opacity: 0.5 }}>
          {current.subtitle}
        </KageText>
        {!isMaxRank && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, width: '80%' }}>
            <View style={{ flex: 1, height: 3, backgroundColor: colors.glass.border, borderRadius: 1.5, overflow: 'hidden' }}>
              <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: colors.accent.neon, borderRadius: 1.5 }} />
            </View>
            <KageText variant="caption" style={{ fontSize: 9, letterSpacing: 1, opacity: 0.5 }}>
              {totalXP - current.xpRequired}/{next.xpRequired - current.xpRequired}
            </KageText>
          </View>
        )}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 4 },
  badge: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 8 },
  inner: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
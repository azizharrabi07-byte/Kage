import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { KageText } from '@/components/ui/KageText';
import { colors } from '@/theme';

interface KanjiAccentProps {
  kanji: string;
  reading?: string;
  size?: 'sm' | 'md' | 'lg';
  faded?: boolean;
  vertical?: boolean;
}

export function KanjiAccent({
  kanji: kanjiChar,
  reading,
  size = 'md',
  faded = false,
  vertical = false,
}: KanjiAccentProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(faded ? 0.15 : 1, {
      duration: 800,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const fontSizeMap = { sm: 48, md: 72, lg: 120 };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
<KageText
          variant="kanji"
          color={colors.accent.primary}
          style={{
            fontSize: fontSizeMap[size],
            lineHeight: fontSizeMap[size] * 1.1,
            opacity: 0.8,
            writingDirection: vertical ? 'rtl' as const : 'ltr' as const,
          }}
        >
        {vertical ? kanjiChar.split('').join('\n') : kanjiChar}
      </KageText>
      {reading && (
        <KageText
          variant="caption"
          style={styles.reading}
        >
          {reading}
        </KageText>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  kanji: {
    color: colors.accent.primary,
    opacity: 0.8,
  },
  reading: {
    marginTop: 4,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
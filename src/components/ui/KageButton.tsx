import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { KageText } from './KageText';
import { useColors } from '@/theme';

interface KageButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'lockIn' | 'outline' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: any;
}

export function KageButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
}: KageButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const onPressIn = useCallback(() => { scale.value = withSpring(0.96); }, []);
  const onPressOut = useCallback(() => { scale.value = withSpring(1); }, []);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const vStyle: any = {
    primary: { backgroundColor: colors.accent.primary },
    ghost: { backgroundColor: colors.glass.medium, borderWidth: 1, borderColor: colors.glass.border },
    lockIn: {
      backgroundColor: colors.accent.primary,
      shadowColor: colors.accent.neon,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 18,
      elevation: 10,
    },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.accent.primary },
    gold: { backgroundColor: colors.accent.gold, shadowColor: colors.accent.goldGlow, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12 },
  }[variant];

  const sSize: any = {
    sm: { paddingHorizontal: 20, paddingVertical: 10 },
    md: { paddingHorizontal: 28, paddingVertical: 14 },
    lg: { paddingHorizontal: 40, paddingVertical: 18 },
  }[size];

  const txtColors: Record<string, string> = {
    primary: '#F5F0E8',
    ghost: '#F5F0E8',
    lockIn: '#F5F0E8',
    outline: colors.accent.primary,
    gold: '#0B1A2E',
  };

  return (
    <Animated.View style={[animStyle, fullWidth && { width: '100%' }]}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.base, vStyle, sSize, fullWidth && { width: '100%' }, style]}
      >
        <KageText
          variant="bodyBold"
          color={txtColors[variant]}
          style={{
            fontSize: size === 'lg' ? 15 : size === 'sm' ? 11 : 13,
            letterSpacing: size === 'lg' ? 3 : size === 'sm' ? 1.5 : 2,
          }}
        >
          {title}
        </KageText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
});
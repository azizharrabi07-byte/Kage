import React from 'react';
import { Text, StyleSheet, type TextStyle } from 'react-native';
import { typography } from '@/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'caption' | 'kanji' | 'display' | 'mono' | 'giant' | 'aggressive' | 'tactical';

interface KageTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  style?: TextStyle;
  children: React.ReactNode;
}

export function KageText({
  variant = 'body',
  color,
  align = 'left',
  letterSpacing,
  style,
  children,
}: KageTextProps) {
  const variantStyle = variantStyles[variant];

  return (
    <Text
      style={[
        baseStyle,
        variantStyle,
        color ? { color } : undefined,
        { textAlign: align },
        letterSpacing !== undefined ? { letterSpacing } : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const baseStyle: TextStyle = {
  color: '#E8E6F0',
};

const variantStyles: Record<TextVariant, TextStyle> = {
  giant: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.giant,
    lineHeight: typography.lineHeight.giant,
    letterSpacing: typography.letterSpacing.tight,
  },
  display: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.display,
    lineHeight: typography.lineHeight.display,
    letterSpacing: typography.letterSpacing.tight,
  },
  h1: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.h1,
    lineHeight: typography.lineHeight.h1,
    letterSpacing: typography.letterSpacing.normal,
  },
  h2: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.h2,
    lineHeight: typography.lineHeight.h2,
    letterSpacing: typography.letterSpacing.normal,
  },
  h3: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.lineHeight.h3,
    letterSpacing: typography.letterSpacing.normal,
  },
  body: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    letterSpacing: typography.letterSpacing.normal,
  },
  bodyBold: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    letterSpacing: typography.letterSpacing.wide,
  },
  caption: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: typography.letterSpacing.wide,
    color: '#8A8A8A',
  },
  kanji: {
    fontFamily: typography.fontFamily.display,
    fontSize: typography.fontSize.h2,
    lineHeight: typography.lineHeight.h2,
    letterSpacing: typography.letterSpacing.wider,
  },
  mono: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    letterSpacing: typography.letterSpacing.wide,
  },
  aggressive: {
    fontFamily: typography.fontFamily.heading,
    fontSize: typography.fontSize.h1,
    lineHeight: typography.lineHeight.h1,
    letterSpacing: -1,
    textTransform: 'uppercase' as const,
  },
  tactical: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
  },
};
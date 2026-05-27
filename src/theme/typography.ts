import { Platform } from 'react-native';

export const typography = {
  fontFamily: {
    display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    heading: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif-medium', default: 'System' }),
    body: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif', default: 'System' }),
    bodyBold: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif-medium', default: 'System' }),
    mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    kanji: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif', default: 'System' }),
  },
  fontSize: {
    xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24,
    h3: 28, h2: 36, h1: 48, display: 64, giant: 80,
  },
  lineHeight: {
    xs: 14, sm: 16, md: 20, lg: 24, xl: 28, xxl: 32,
    h3: 36, h2: 44, h1: 56, display: 72, giant: 88,
  },
  letterSpacing: {
    tight: -0.5, normal: 0, wide: 1, wider: 2, widest: 4,
    label: 3,
    micro: 0.5,
  },
} as const;
export interface ThemeColors {
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
  };
  accent: {
    primary: string;
    neon: string;
    glow: string;
    cyan: string;
    cyanGlow: string;
    red: string;
    redGlow: string;
    gold: string;
    goldGlow: string;
    blue: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    inverse: string;
    cream: string;
  };
  glass: {
    light: string;
    medium: string;
    border: string;
    borderLight: string;
  };
  status: {
    ready: string;
    warning: string;
    danger: string;
    recovery: string;
  };
}

export const darkColors: ThemeColors = {
  bg: {
    primary: '#090A0F',
    secondary: '#0D0D14',
    tertiary: '#13131E',
    card: '#111118',
  },
  accent: {
    primary: '#00F5D4',
    neon: '#00F5D4',
    glow: 'rgba(0,245,212,0.2)',
    cyan: '#00F5D4',
    cyanGlow: 'rgba(0,245,212,0.35)',
    red: '#E83030',
    redGlow: 'rgba(232,48,48,0.3)',
    gold: '#C9A84C',
    goldGlow: 'rgba(201,168,76,0.2)',
    blue: '#1A3A5C',
  },
  text: {
    primary: '#E8E6F0',
    secondary: 'rgba(232,230,240,0.55)',
    muted: 'rgba(232,230,240,0.25)',
    accent: '#00F5D4',
    inverse: '#090A0F',
    cream: '#E8E6F0',
  },
  glass: {
    light: 'rgba(255,255,255,0.02)',
    medium: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.07)',
    borderLight: 'rgba(255,255,255,0.03)',
  },
  status: {
    ready: '#00F5D4',
    warning: '#C9A84C',
    danger: '#E83030',
    recovery: '#3B82F6',
  },
};

export const colors = darkColors;

export const lightColors: ThemeColors = {
  bg: {
    primary: '#E8E6F0',
    secondary: '#D8D6E2',
    tertiary: '#C8C6D4',
    card: '#F0EEF6',
  },
  accent: {
    primary: '#00BFA5',
    neon: '#00BFA5',
    glow: 'rgba(0,191,165,0.15)',
    cyan: '#00BFA5',
    cyanGlow: 'rgba(0,191,165,0.25)',
    red: '#C8102E',
    redGlow: 'rgba(200,16,46,0.12)',
    gold: '#B8943E',
    goldGlow: 'rgba(184,148,62,0.12)',
    blue: '#2A5A8C',
  },
  text: {
    primary: '#1C1C2A',
    secondary: '#4A4A5E',
    muted: '#88889A',
    accent: '#00BFA5',
    inverse: '#FFFFFF',
    cream: '#3A3A4A',
  },
  glass: {
    light: 'rgba(0,0,0,0.02)',
    medium: 'rgba(0,0,0,0.04)',
    border: 'rgba(0,0,0,0.08)',
    borderLight: 'rgba(0,0,0,0.04)',
  },
  status: {
    ready: '#00BFA5',
    warning: '#B8943E',
    danger: '#C8102E',
    recovery: '#3B82F6',
  },
};
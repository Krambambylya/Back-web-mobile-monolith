import { Platform } from 'react-native';

export const AppTheme = {
  background: '#242A28',
  foreground: '#F0F2F1',
  card: '#2C3431',
  primary: '#5BA882',
  primaryForeground: '#ffffff',
  mutedForeground: '#A8B0AC',
  border: 'rgba(255,255,255,0.10)',
  inputBackground: '#303836',
  accentSoft: '#C5DDD2',
  errorSoft: '#e8aaaa',
  tabBar: '#272E2C',
} as const;

export const Colors = {
  light: {
    text: '#171717',
    background: '#ffffff',
    backgroundElement: '#f5f5f5',
    backgroundSelected: '#fafafa',
    textSecondary: '#666666',
  },
  dark: {
    text: '#F0F2F1',
    background: '#242A28',
    backgroundElement: '#2C3431',
    backgroundSelected: '#353E3A',
    textSecondary: '#A8B0AC',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'sans-serif',
    mono: 'monospace',
  },
});

export const Typography = {
  title: { fontSize: 24, fontWeight: '600' as const, lineHeight: 31 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 21 },
} as const;

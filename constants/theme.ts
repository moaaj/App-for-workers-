/**
 * WorkerTrack Theme - Modern, warm, Gen Z-friendly design
 */

import { Platform } from 'react-native';

// Primary brand colors - Warm amber/orange palette
const primaryLight = '#F97316';
const primaryDark = '#FB923C';

export const Colors = {
  light: {
    text: '#1C1917',
    textSecondary: '#78716C',
    textMuted: '#A8A29E',
    background: '#FAFAF9',
    backgroundSecondary: '#F5F5F4',
    card: '#FFFFFF',
    tint: primaryLight,
    primary: primaryLight,
    primaryLight: '#FED7AA',
    success: '#22C55E',
    successLight: '#DCFCE7',
    warning: '#EAB308',
    warningLight: '#FEF9C3',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    border: '#E7E5E4',
    borderLight: '#F5F5F4',
    icon: '#78716C',
    tabIconDefault: '#A8A29E',
    tabIconSelected: primaryLight,
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#FAFAF9',
    textSecondary: '#A8A29E',
    textMuted: '#78716C',
    background: '#0C0A09',
    backgroundSecondary: '#1C1917',
    card: '#292524',
    tint: primaryDark,
    primary: primaryDark,
    primaryLight: '#7C2D12',
    success: '#4ADE80',
    successLight: '#14532D',
    warning: '#FACC15',
    warningLight: '#713F12',
    error: '#F87171',
    errorLight: '#7F1D1D',
    info: '#60A5FA',
    infoLight: '#1E3A8A',
    border: '#44403C',
    borderLight: '#292524',
    icon: '#A8A29E',
    tabIconDefault: '#78716C',
    tabIconSelected: primaryDark,
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "'Playfair Display', Georgia, 'Times New Roman', serif",
    rounded: "'Nunito', 'SF Pro Rounded', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
});

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

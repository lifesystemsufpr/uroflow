import { palette } from './palette';

export const colors = {
  background: palette.cream,
  surface: palette.paper,
  surfaceMuted: palette.creamDeep,
  primary: palette.violet,
  primaryDark: palette.violetDark,
  primarySoft: palette.violetSoft,
  primaryMist: palette.violetMist,
  brand: palette.lagoon,
  brandDeep: palette.lagoonDeep,
  brandMist: palette.lagoonMist,
  accent: palette.marigold,
  accentDeep: palette.marigoldDeep,
  accentMist: palette.marigoldMist,
  text: palette.ink,
  textMuted: palette.inkMuted,
  textFaint: palette.inkFaint,
  onPrimary: palette.cream,
  danger: palette.rose,
  dangerDark: palette.roseInk,
  dangerMist: palette.roseMist,
  line: palette.line,
  white: palette.white,
  overlay: 'rgba(43, 38, 64, 0.32)',
} as const;

export type ToneName = 'violet' | 'lagoon' | 'marigold' | 'rose' | 'umber' | 'periwinkle';

export type Tone = { solid: string; soft: string; ink: string };

export const tones: Record<ToneName, Tone> = {
  violet: { solid: palette.violetSoft, soft: palette.violetMist, ink: palette.violetDark },
  lagoon: { solid: palette.lagoon, soft: palette.lagoonMist, ink: palette.lagoonDeep },
  marigold: { solid: palette.marigold, soft: palette.marigoldMist, ink: palette.marigoldDeep },
  rose: { solid: palette.rose, soft: palette.roseMist, ink: palette.roseInk },
  umber: { solid: palette.umber, soft: palette.umberMist, ink: palette.umberInk },
  periwinkle: { solid: palette.periwinkle, soft: palette.periwinkleMist, ink: palette.periwinkleInk },
};

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  gutter: 20,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const fonts = {
  regular: 'NunitoSans_400Regular',
  semibold: 'NunitoSans_600SemiBold',
  bold: 'NunitoSans_700Bold',
  heavy: 'NunitoSans_800ExtraBold',
} as const;

export const shadow = {
  lifted: {
    shadowColor: palette.violetDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  popover: {
    shadowColor: palette.violetDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

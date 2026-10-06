import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';
import { colors, fonts } from '@/shared/theme';

export type TextVariant =
  | 'hero'
  | 'display'
  | 'title'
  | 'heading'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'label'
  | 'number'
  | 'numberSm';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
};

export function Text({ variant = 'body', color, align, style, ...props }: TextProps) {
  return (
    <RNText
      {...props}
      style={[styles[variant], color ? { color } : null, align ? { textAlign: align } : null, style]}
    />
  );
}

const styles = StyleSheet.create({
  hero: { fontFamily: fonts.heavy, fontSize: 40, lineHeight: 44, letterSpacing: -1, color: colors.primary },
  display: { fontFamily: fonts.heavy, fontSize: 30, lineHeight: 35, letterSpacing: -0.6, color: colors.primary },
  title: { fontFamily: fonts.heavy, fontSize: 22, lineHeight: 28, letterSpacing: -0.3, color: colors.text },
  heading: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.textMuted },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21, color: colors.text },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.textMuted },
  label: {
    fontFamily: fonts.heavy,
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  number: {
    fontFamily: fonts.heavy,
    fontSize: 46,
    lineHeight: 50,
    letterSpacing: -1.5,
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  numberSm: {
    fontFamily: fonts.heavy,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.8,
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
});

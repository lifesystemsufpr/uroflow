import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors, radius, space } from '@/shared/theme';

export type CardVariant = 'paper' | 'primary';

export type CardProps = ViewProps & {
  variant?: CardVariant;
  padded?: boolean;
};

export function Card({ variant = 'paper', padded = true, style, ...props }: CardProps) {
  return <View {...props} style={[styles.base, styles[variant], padded && styles.padded, style]} />;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  padded: {
    padding: space.lg,
  },
  paper: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  primary: {
    backgroundColor: colors.primary,
  },
});

import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import type { Icon } from '@/shared/icons';
import { colors, radius, space } from '@/shared/theme';
import { durations } from '@/shared/motion';
import { Glyph } from './Glyph';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'dashed';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: Icon;
  iconPosition?: 'start' | 'end';
  disabled?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

type Look = { face: string; text: string; border: string; shelf: string | null };

const looks: Record<ButtonVariant, Look> = {
  primary: { face: colors.primary, text: colors.onPrimary, border: colors.primary, shelf: colors.primaryDark },
  secondary: { face: colors.surface, text: colors.primary, border: colors.line, shelf: null },
  dashed: { face: 'transparent', text: colors.primary, border: colors.textFaint, shelf: null },
};

const disabledLook: Look = { face: colors.surfaceMuted, text: colors.textFaint, border: colors.surfaceMuted, shelf: null };

const SHELF = 3;

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'start',
  disabled = false,
  compact = false,
  style,
}: ButtonProps) {
  const look = disabled ? disabledLook : looks[variant];
  const pressed = useSharedValue(0);
  const shelf = look.shelf ? SHELF : 0;

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.value * shelf }],
    opacity: shelf ? 1 : 1 - pressed.value * 0.3,
  }));

  const glyph = icon ? <Glyph icon={icon} size={18} color={look.text} weight="bold" /> : null;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 70 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: durations.base });
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={style}
    >
      <View style={styles.frame}>
        {look.shelf ? (
          <View style={[styles.shelf, compact && styles.pill, { backgroundColor: look.shelf }]} />
        ) : null}
        <Animated.View
          style={[
            styles.face,
            compact && styles.compact,
            { backgroundColor: look.face, borderColor: look.border },
            variant === 'dashed' && !disabled && styles.dashed,
            faceStyle,
          ]}
        >
          {iconPosition === 'start' && glyph}
          <Text variant="bodyStrong" color={look.text} numberOfLines={1} style={styles.label}>
            {label}
          </Text>
          {iconPosition === 'end' && glyph}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: {
    paddingBottom: SHELF,
  },
  shelf: {
    position: 'absolute',
    top: SHELF,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.md,
  },
  pill: {
    borderRadius: radius.pill,
  },
  face: {
    minHeight: 52,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
  },
  compact: {
    minHeight: 42,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
  },
  dashed: {
    borderStyle: 'dashed',
  },
  label: {
    fontSize: 15.5,
  },
});

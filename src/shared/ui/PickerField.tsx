import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { Icon } from '@/shared/icons';
import { colors, fonts, radius, space } from '@/shared/theme';
import { Glyph } from './Glyph';
import { Text } from './Text';
import { Touchable } from './Touchable';

export type PickerFieldProps = {
  label: string;
  optional?: boolean;
  display: string | null;
  placeholder: string;
  icon: Icon;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PickerField({ label, optional, display, placeholder, icon, onPress, style }: PickerFieldProps) {
  return (
    <View style={style}>
      <Text variant="label" style={styles.label}>
        {label}
        {optional ? <Text variant="label" color={colors.textFaint}>{'  ·  opcional'}</Text> : null}
      </Text>
      <Touchable onPress={onPress} effect="tint" accessibilityLabel={`${label}: ${display ?? placeholder}`} style={styles.frame}>
        <Text numberOfLines={1} style={[styles.value, !display && styles.placeholder]}>
          {display ?? placeholder}
        </Text>
        <View style={styles.icon}>
          <Glyph icon={icon} size={18} color={colors.primary} />
        </View>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: space.xs,
  },
  frame: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingLeft: space.md,
    paddingRight: 6,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  value: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 15.5,
    color: colors.text,
  },
  placeholder: {
    color: colors.textFaint,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

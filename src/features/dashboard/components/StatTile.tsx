import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Icon } from '@/shared/icons';
import { Glyph, Text, Touchable } from '@/shared/ui';
import { colors, palette, radius, space } from '@/shared/theme';
import { tickIn, tickOut } from '@/shared/motion';

export type StatTileProps = {
  label: string;
  value: number;
  icon: Icon;
  iconColor: string;
  emphasis?: boolean;
  onPress: () => void;
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function StatTile({ label, value, icon, iconColor, emphasis = false, onPress, footer, style }: StatTileProps) {
  const number = emphasis ? palette.marigoldInk : colors.primary;

  return (
    <Touchable
      onPress={onPress}
      effect="tint"
      tintColor={emphasis ? 'rgba(110, 71, 15, 0.08)' : undefined}
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.tile, emphasis ? styles.emphasis : styles.paper, style]}
    >
      <View style={styles.top}>
        <Text variant="label" color={emphasis ? palette.marigoldDeep : colors.textMuted} style={styles.label}>
          {label}
        </Text>
        <Glyph icon={icon} size={emphasis ? 28 : 22} color={iconColor} />
      </View>
      <View style={styles.bottom}>
        <View style={[styles.counter, { height: emphasis ? 50 : 32 }]}>
          <Animated.View key={value} entering={tickIn} exiting={tickOut}>
            <Text variant={emphasis ? 'number' : 'numberSm'} color={number}>
              {String(value).padStart(2, '0')}
            </Text>
          </Animated.View>
        </View>
        {footer}
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: radius.xl,
    padding: space.md,
    justifyContent: 'space-between',
  },
  emphasis: {
    backgroundColor: palette.marigoldMist,
  },
  paper: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.xs,
  },
  label: {
    flex: 1,
  },
  bottom: {
    gap: space.xs,
  },
  counter: {
    overflow: 'hidden',
  },
});

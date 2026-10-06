import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { CaretLeftIcon, CaretRightIcon, type Icon } from '@/shared/icons';
import { Glyph, Text, Touchable } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { dayLabel, formatDate, localDateKey } from '@/shared/lib/date';
import { slideStep } from '@/shared/motion';

export type DayNavigatorProps = {
  date: Date;
  direction: 1 | -1;
  canGoForward: boolean;
  onPrev: () => void;
  onNext: () => void;
};

function Arrow({ icon, onPress, disabled, label }: { icon: Icon; onPress: () => void; disabled?: boolean; label: string }) {
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      style={[styles.arrow, disabled && styles.arrowDisabled]}
    >
      <Glyph icon={icon} size={18} color={disabled ? colors.primarySoft : colors.onPrimary} weight="bold" />
    </Touchable>
  );
}

export function DayNavigator({ date, direction, canGoForward, onPrev, onNext }: DayNavigatorProps) {
  const key = localDateKey(date);

  return (
    <View style={styles.card}>
      <Arrow icon={CaretLeftIcon} onPress={onPrev} label="Dia anterior" />
      <Animated.View key={key} entering={slideStep(direction)} style={styles.center}>
        <Text variant="title" color={colors.onPrimary}>
          {dayLabel(date)}
        </Text>
        <Text variant="label" color={colors.primaryMist}>
          {formatDate(key, "EEEE · dd/MM")}
        </Text>
      </Animated.View>
      <Arrow icon={CaretRightIcon} onPress={onNext} disabled={!canGoForward} label="Próximo dia" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: space.sm,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
  },
  center: {
    alignItems: 'center',
    gap: 2,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    backgroundColor: 'transparent',
  },
});

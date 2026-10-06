import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, fonts, radius, space } from '@/shared/theme';
import { durations } from '@/shared/motion';
import { Touchable } from './Touchable';

export type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function Chip({ label, active, onPress }: ChipProps) {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, { duration: durations.base });
  }, [active, progress]);

  const frameStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surface, colors.primary]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.line, colors.primary]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [colors.textMuted, colors.onPrimary]),
  }));

  return (
    <Touchable onPress={onPress} accessibilityState={{ selected: active }} accessibilityLabel={label}>
      <Animated.View style={[styles.chip, frameStyle]}>
        <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
      </Animated.View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  chip: {
    justifyContent: 'center',
    paddingHorizontal: space.md,
    height: 38,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
  },
});

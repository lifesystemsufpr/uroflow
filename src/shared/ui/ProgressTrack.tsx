import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, radius } from '@/shared/theme';
import { durations, easings } from '@/shared/motion';

export type ProgressTrackProps = {
  steps: number;
  current: number;
  color?: string;
  trackColor?: string;
};

function Segment({ filled, color, trackColor }: { filled: boolean; color: string; trackColor: string }) {
  const fill = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    fill.value = withTiming(filled ? 1 : 0, { duration: durations.slow, easing: easings.emphasized });
  }, [filled, fill]);

  const style = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  return (
    <View style={[styles.segment, { backgroundColor: trackColor }]}>
      <Animated.View style={[styles.fill, { backgroundColor: color }, style]} />
    </View>
  );
}

export function ProgressTrack({
  steps,
  current,
  color = colors.primary,
  trackColor = colors.surfaceMuted,
}: ProgressTrackProps) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: steps, now: current }}>
      {Array.from({ length: steps }, (_, index) => (
        <Segment key={index} filled={index < current} color={color} trackColor={trackColor} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});

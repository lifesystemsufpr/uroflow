import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Text } from '@/shared/ui';
import { radius, space } from '@/shared/theme';
import { easings } from '@/shared/motion';

export type BarChartProps = {
  data: number[];
  labels: string[];
  barColor: string;
  trackColor: string;
  textColor: string;
  mutedColor: string;
  height?: number;
};

function Bar({ ratio, index, color }: { ratio: number; index: number; color: string }) {
  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withDelay(index * 60, withTiming(ratio, { duration: 520, easing: easings.emphasized }));
  }, [ratio, index, fill]);

  const style = useAnimatedStyle(() => ({ height: `${fill.value * 100}%` }));

  return <Animated.View style={[styles.fill, { backgroundColor: color }, style]} />;
}

export function BarChart({ data, labels, barColor, trackColor, textColor, mutedColor, height = 120 }: BarChartProps) {
  const max = Math.max(...data, 1);

  return (
    <View style={styles.chart}>
      {data.map((value, index) => (
        <View key={labels[index]} style={styles.column}>
          <Text variant="label" color={textColor} style={styles.value}>
            {value > 0 ? value : ''}
          </Text>
          <View style={[styles.track, { height, backgroundColor: trackColor }]}>
            <Bar ratio={value === 0 ? 0.02 : value / max} index={index} color={barColor} />
          </View>
          <Text variant="label" color={mutedColor} style={styles.day}>
            {labels[index]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  value: {
    letterSpacing: 0,
    minHeight: 14,
  },
  track: {
    width: '100%',
    maxWidth: 30,
    borderRadius: radius.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    borderRadius: radius.sm,
  },
  day: {
    letterSpacing: 0.4,
    marginTop: space.xxs / 2,
  },
});

import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/shared/theme';
import { durations, easings } from '@/shared/motion';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const LENGTH = 20;

export function Checkbox({ checked, size = 26 }: { checked: boolean; size?: number }) {
  const progress = useSharedValue(checked ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(checked ? 1 : 0, { duration: durations.slow, easing: easings.out });
  }, [checked, progress]);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 0.4], ['transparent', colors.primary]),
    borderColor: interpolateColor(progress.value, [0, 0.4], [colors.textFaint, colors.primary]),
  }));

  const markProps = useAnimatedProps(() => ({
    strokeDashoffset: LENGTH * (1 - Math.min(1, Math.max(0, (progress.value - 0.25) / 0.75))),
  }));

  return (
    <Animated.View style={[styles.box, { width: size, height: size, borderRadius: size * 0.3 }, boxStyle]}>
      <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 20 20">
        <AnimatedPath
          d="M4 10.5 L8.5 15 L16 6"
          stroke={colors.onPrimary}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={LENGTH}
          animatedProps={markProps}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { memo, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { palette } from '@/shared/theme';

export type BandTone = 'strong' | 'soft';

const bandColors: Record<BandTone, { front: string; back: string }> = {
  strong: { front: palette.violetBand, back: palette.violetBandBack },
  soft: { front: palette.violetMist, back: palette.violetMistBack },
};

export const bandColor = (tone: BandTone) => bandColors[tone].front;

export const WAVE_DEPTH = 26;
const OVERSCROLL = 600;
const LIFT = 12;

const wavePath = (length: number, wave: number, amplitude: number) => {
  const half = wave / 2;
  const base = LIFT + amplitude;
  const steps = Math.ceil(length / half);
  const segments = Array.from({ length: steps - 1 }, (_, i) => `T ${(i + 2) * half} ${base}`).join(' ');
  return `M 0 0 L 0 ${base} Q ${wave / 4} ${base + amplitude * 2} ${half} ${base} ${segments} L ${steps * half} 0 Z`;
};

function Wave({ width, wave, amplitude, color, duration, top, delay }: {
  width: number;
  wave: number;
  amplitude: number;
  color: string;
  duration: number;
  top: number;
  delay: number;
}) {
  const reduceMotion = useReducedMotion();
  const shift = useSharedValue(delay);

  useEffect(() => {
    if (reduceMotion) return;
    shift.value = delay;
    shift.value = withRepeat(withTiming(delay + 1, { duration, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(shift);
  }, [reduceMotion, duration, delay, shift]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: -((shift.value % 1) * wave) }] }));
  const length = width + wave;

  return (
    <Animated.View style={[styles.wave, { top, width: length }, style]}>
      <Svg width={length} height={LIFT + amplitude * 2 + 2}>
        <Path d={wavePath(length, wave, amplitude)} fill={color} />
      </Svg>
    </Animated.View>
  );
}

export const WaveBand = memo(function WaveBand({ height, tone }: { height: number; tone: BandTone }) {
  const { width } = useWindowDimensions();
  const { front, back } = bandColors[tone];
  const wave = Math.round(width / 1.6);

  return (
    <View pointerEvents="none" style={[styles.band, { top: -OVERSCROLL, height: height + OVERSCROLL + WAVE_DEPTH }]}>
      <View style={[styles.fill, { height: height + OVERSCROLL, backgroundColor: front }]} />
      <Wave width={width} wave={wave} amplitude={9} color={back} duration={9000} top={height + OVERSCROLL - LIFT + 6} delay={0.5} />
      <Wave width={width} wave={wave} amplitude={7} color={front} duration={6000} top={height + OVERSCROLL - LIFT} delay={0} />
    </View>
  );
});

const styles = StyleSheet.create({
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  wave: {
    position: 'absolute',
    left: 0,
  },
});

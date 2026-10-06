import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { colors, palette, space } from '@/shared/theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const DROP = 'M50 14 C50 14 25 43 25 62 A25 25 0 0 0 75 62 C75 43 50 14 50 14 Z';
const SIZE = 112;
const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function BrandLoader({ label = 'Carregando' }: { label?: string }) {
  const level = useSharedValue(0);
  const spin = useSharedValue(0);

  useEffect(() => {
    level.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.cubic) }), -1, true);
    spin.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.linear }), -1, false);
    return () => {
      cancelAnimation(level);
      cancelAnimation(spin);
    };
  }, [level, spin]);

  const liquidProps = useAnimatedProps(() => ({ y: 88 - level.value * 76 }));
  const orbitStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));

  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
      <View style={styles.stage}>
        <Animated.View style={[StyleSheet.absoluteFill, orbitStyle]}>
          <Svg width={SIZE} height={SIZE} viewBox="0 0 100 100">
            <Circle
              cx={50}
              cy={50}
              r={RADIUS}
              stroke={palette.violet}
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE * 0.42} ${CIRCUMFERENCE}`}
            />
          </Svg>
        </Animated.View>
        <Svg width={SIZE} height={SIZE} viewBox="0 0 100 100">
          <Defs>
            <ClipPath id="drop">
              <Path d={DROP} />
            </ClipPath>
          </Defs>
          <G clipPath="url(#drop)">
            <Rect x={0} y={0} width={100} height={100} fill={palette.lagoonMist} />
            <AnimatedRect x={0} width={100} height={100} fill={palette.lagoon} animatedProps={liquidProps} />
          </G>
        </Svg>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  stage: {
    width: SIZE,
    height: SIZE,
  },
  label: {
    marginTop: space.lg,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
});

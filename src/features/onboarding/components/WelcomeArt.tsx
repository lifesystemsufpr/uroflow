import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ChartLineUpIcon, DropIcon, MoonStarsIcon, StethoscopeIcon, type Icon } from '@/shared/icons';
import logo from '../../../../assets/images/uroflow-logo.png';
import { Glyph } from '@/shared/ui';
import { colors, radius, tones, type Tone } from '@/shared/theme';

type Orb = { icon: Icon; tone: Tone; top: `${number}%`; left: `${number}%`; size: number; delay: number };

const orbs: Orb[] = [
  { icon: DropIcon, tone: tones.lagoon, top: '8%', left: '10%', size: 64, delay: 0 },
  { icon: MoonStarsIcon, tone: tones.marigold, top: '4%', left: '64%', size: 56, delay: 300 },
  { icon: StethoscopeIcon, tone: tones.periwinkle, top: '62%', left: '6%', size: 58, delay: 600 },
  { icon: ChartLineUpIcon, tone: tones.rose, top: '66%', left: '66%', size: 62, delay: 900 },
];

function FloatingOrb({ orb }: { orb: Orb }) {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withDelay(
      orb.delay,
      withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    return () => cancelAnimation(float);
  }, [orb.delay, float]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: -8 * float.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          top: orb.top,
          left: orb.left,
          width: orb.size,
          height: orb.size,
          borderRadius: orb.size / 2,
          backgroundColor: orb.tone.soft,
        },
        style,
      ]}
    >
      <Glyph icon={orb.icon} size={orb.size * 0.48} color={orb.tone.ink} />
    </Animated.View>
  );
}

export function WelcomeArt() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.quad) }), -1, true);
    return () => cancelAnimation(pulse);
  }, [pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.06 }],
    opacity: 0.5 + pulse.value * 0.3,
  }));

  return (
    <View style={styles.stage}>
      <Animated.View style={[styles.ring, ringStyle]} />
      <View style={styles.core}>
        <Image source={logo} style={styles.logo} accessibilityIgnoresInvertColors />
      </View>
      {orbs.map((orb) => (
        <FloatingOrb key={orb.top + orb.left} orb={orb} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    aspectRatio: 1.1,
    maxHeight: 320,
    borderRadius: radius.xl + 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 2,
    borderColor: colors.primarySoft,
    borderStyle: 'dashed',
  },
  core: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 84,
    height: 84,
  },
  orb: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

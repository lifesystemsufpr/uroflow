import { useEffect } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import Svg, { Path } from 'react-native-svg';
import { colors, palette, space } from '@/shared/theme';
import { easings } from '@/shared/motion';
import { Text } from './Text';

export type SuccessOverlayProps = {
  visible: boolean;
  onAnimationEnd?: () => void;
  message?: string;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const CHECK_LENGTH = 48;
const HOLD = 1300;

export function SuccessOverlay({ visible, onAnimationEnd, message = 'Registro salvo!' }: SuccessOverlayProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);
  const draw = useSharedValue(0);
  const ring = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    opacity.value = 0;
    scale.value = 0.6;
    draw.value = 0;
    ring.value = 0;
    scale.value = withTiming(1, { duration: 420, easing: easings.emphasized });
    draw.value = withDelay(180, withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }));
    ring.value = withDelay(120, withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) }));
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(
        HOLD,
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished && onAnimationEnd) scheduleOnRN(onAnimationEnd);
        }),
      ),
    );
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: 1 - ring.value,
    transform: [{ scale: 0.8 + ring.value * 0.9 }],
  }));
  const messageStyle = useAnimatedStyle(() => ({
    opacity: draw.value,
    transform: [{ translateY: (1 - draw.value) * 12 }],
  }));
  const checkProps = useAnimatedProps(() => ({ strokeDashoffset: CHECK_LENGTH * (1 - draw.value) }));

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent navigationBarTranslucent>
      <Animated.View style={[styles.overlay, containerStyle]}>
        <View style={styles.stage}>
          <Animated.View style={[styles.ring, ringStyle]} />
          <Animated.View style={[styles.badge, badgeStyle]}>
            <Svg width={64} height={64} viewBox="0 0 52 52">
              <AnimatedPath
                d="M14 27 L23 36 L39 18"
                stroke={palette.cream}
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={CHECK_LENGTH}
                animatedProps={checkProps}
              />
            </Svg>
          </Animated.View>
        </View>
        <Animated.View style={messageStyle}>
          <Text variant="display" align="center">
            {message}
          </Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const BADGE = 120;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(245, 239, 229, 0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  stage: {
    width: BADGE * 2,
    height: BADGE * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  ring: {
    position: 'absolute',
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    borderWidth: 3,
    borderColor: colors.primarySoft,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

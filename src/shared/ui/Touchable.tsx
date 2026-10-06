import { Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { durations } from '@/shared/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type TouchEffect = 'dim' | 'tint';

export type TouchableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  effect?: TouchEffect;
  tintColor?: string;
};

export function Touchable({
  style,
  effect = 'dim',
  tintColor = 'rgba(74, 65, 118, 0.08)',
  onPressIn,
  onPressOut,
  children,
  ...props
}: TouchableProps) {
  const pressed = useSharedValue(0);

  const dimStyle = useAnimatedStyle(() => ({ opacity: 1 - pressed.value * 0.35 }));
  const tintStyle = useAnimatedStyle(() => ({ opacity: pressed.value }));

  return (
    <AnimatedPressable
      {...props}
      accessibilityRole={props.accessibilityRole ?? 'button'}
      accessibilityState={{ disabled: !!props.disabled, ...props.accessibilityState }}
      onPressIn={(e) => {
        pressed.value = withTiming(1, { duration: 80 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = withTiming(0, { duration: durations.base });
        onPressOut?.(e);
      }}
      style={[style, effect === 'dim' ? dimStyle : styles.clip]}
    >
      {(state) => (
        <>
          {typeof children === 'function' ? children(state) : children}
          {effect === 'tint' ? (
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: tintColor }, tintStyle]} />
          ) : null}
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});

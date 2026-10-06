import { useRef } from 'react';
import { Pressable, StyleSheet, View, type ScrollView } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { colors, fonts } from '@/shared/theme';

export const WHEEL_ITEM = 44;
export const WHEEL_VISIBLE = 5;

const pad = (value: number) => String(value).padStart(2, '0');

function WheelItem({ value, index, offset, onPress }: { value: number; index: number; offset: SharedValue<number>; onPress: () => void }) {
  const style = useAnimatedStyle(() => {
    const distance = Math.abs(offset.value / WHEEL_ITEM - index);
    return {
      opacity: interpolate(distance, [0, 1, 2, 3], [1, 0.55, 0.25, 0.1], 'clamp'),
      transform: [{ scale: interpolate(distance, [0, 1, 2], [1, 0.86, 0.74], 'clamp') }],
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.item} accessibilityLabel={pad(value)}>
      <Animated.Text style={[styles.text, style]}>{pad(value)}</Animated.Text>
    </Pressable>
  );
}

export type WheelColumnProps = {
  values: number[];
  value: number;
  onChange: (value: number) => void;
  label: string;
};

export function WheelColumn({ values, value, onChange, label }: WheelColumnProps) {
  const ref = useRef<ScrollView>(null);
  const initial = Math.max(0, values.indexOf(value));
  const offset = useSharedValue(initial * WHEEL_ITEM);
  const current = useSharedValue(initial);
  const positioned = useRef(false);

  const onScroll = useAnimatedScrollHandler((e) => {
    offset.value = e.contentOffset.y;
    const index = Math.min(values.length - 1, Math.max(0, Math.round(e.contentOffset.y / WHEEL_ITEM)));
    if (index !== current.value) {
      current.value = index;
      scheduleOnRN(onChange, values[index]);
    }
  });

  return (
    <View style={styles.column} accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ text: pad(value) }}>
      <Animated.ScrollView
        ref={ref}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={WHEEL_ITEM}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        contentOffset={{ x: 0, y: initial * WHEEL_ITEM }}
        contentContainerStyle={styles.content}
        nestedScrollEnabled
        onLayout={() => {
          if (positioned.current) return;
          positioned.current = true;
          ref.current?.scrollTo({ y: initial * WHEEL_ITEM, animated: false });
        }}
      >
        {values.map((item, index) => (
          <WheelItem
            key={item}
            value={item}
            index={index}
            offset={offset}
            onPress={() => ref.current?.scrollTo({ y: index * WHEEL_ITEM, animated: true })}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    height: WHEEL_ITEM * WHEEL_VISIBLE,
  },
  content: {
    paddingVertical: WHEEL_ITEM * Math.floor(WHEEL_VISIBLE / 2),
  },
  item: {
    height: WHEEL_ITEM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.heavy,
    fontSize: 26,
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
});

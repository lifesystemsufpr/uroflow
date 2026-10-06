import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Glyph, Text, Touchable } from '@/shared/ui';
import { colors, fonts, radius, space, type Tone } from '@/shared/theme';
import { durations } from '@/shared/motion';
import type { WizardOption } from '../model/wizards';

export type OptionCardProps = {
  option: WizardOption;
  tone: Tone;
  selected: boolean;
  onPress: () => void;
};

function Visual({ option, tone, selected }: { option: WizardOption; tone: Tone; selected: boolean }) {
  const background = selected ? colors.onPrimary : tone.soft;
  const foreground = selected ? colors.primary : tone.ink;
  return (
    <View style={[styles.visual, { backgroundColor: background }]}>
      {option.badge ? (
        <Text style={[styles.badge, { color: foreground }]}>{option.badge}</Text>
      ) : option.icon ? (
        <Glyph icon={option.icon} size={Math.round(24 * (option.scale ?? 1))} color={foreground} />
      ) : null}
    </View>
  );
}

export function OptionCard({ option, tone, selected, onPress }: OptionCardProps) {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: durations.base });
  }, [selected, progress]);

  const cardStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surface, colors.primary]),
    borderColor: interpolateColor(progress.value, [0, 1], [colors.line, colors.primary]),
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progress.value }],
  }));

  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={option.description ? `${option.label}, ${option.description}` : option.label}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <Visual option={option} tone={tone} selected={selected} />
        <View style={styles.text}>
          <Text variant="heading" color={selected ? colors.onPrimary : colors.text}>
            {option.label}
          </Text>
          {option.description ? (
            <Text variant="caption" color={selected ? colors.primaryMist : colors.textMuted}>
              {option.description}
            </Text>
          ) : null}
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          <Animated.View style={[styles.radioDot, dotStyle]} />
        </View>
      </Animated.View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.sm,
    paddingRight: space.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  visual: {
    width: 50,
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    fontFamily: fonts.heavy,
    fontSize: 22,
    lineHeight: 26,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.onPrimary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.onPrimary,
  },
});

import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, fonts, radius, space } from '@/shared/theme';
import { durations } from '@/shared/motion';
import { Text } from './Text';

export type InputProps = Omit<TextInputProps, 'style'> & {
  label?: string;
  optional?: boolean;
  right?: ReactNode;
  minHeight?: number;
  style?: StyleProp<ViewStyle>;
};

export function Input({ label, optional, right, minHeight, style, onFocus, onBlur, multiline, ...props }: InputProps) {
  const focus = useSharedValue(0);
  const [focused, setFocused] = useState(false);

  const frameStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focus.value, [0, 1], [colors.line, colors.primary]),
    backgroundColor: interpolateColor(focus.value, [0, 1], [colors.surface, colors.white]),
  }));

  const setFocus = (value: boolean) => {
    setFocused(value);
    focus.value = withTiming(value ? 1 : 0, { duration: durations.fast });
  };

  return (
    <View style={style}>
      {label ? (
        <Text variant="label" color={focused ? colors.primary : colors.textMuted} style={styles.label}>
          {label}
          {optional ? <Text variant="label" color={colors.textFaint}>{'  ·  opcional'}</Text> : null}
        </Text>
      ) : null}
      <Animated.View style={[styles.frame, frameStyle, minHeight ? { minHeight } : null]}>
        <TextInput
          {...props}
          multiline={multiline}
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.primarySoft}
          cursorColor={colors.primary}
          style={[styles.input, multiline && styles.multiline]}
          onFocus={(e) => {
            setFocus(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            onBlur?.(e);
          }}
        />
        {right ? <View style={styles.right}>{right}</View> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: space.xs,
  },
  frame: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: fonts.semibold,
    fontSize: 15.5,
    color: colors.text,
  },
  multiline: {
    alignSelf: 'stretch',
    textAlignVertical: 'top',
  },
  right: {
    marginLeft: space.xs,
  },
});

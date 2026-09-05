import React, { useState, ReactNode } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface InputProps extends TextInputProps {
  rightIcon?: ReactNode;
  containerStyle?: ViewStyle | ViewStyle[];
}

export function Input({ style, containerStyle, rightIcon, onFocus, onBlur, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.outerWrapper, isFocused && styles.outerWrapperFocused, containerStyle]}>
      <View style={[styles.innerWrapper, style, isFocused && styles.innerWrapperFocused]}>
        <TextInput
          style={[styles.input, props.multiline && { textAlignVertical: 'top' }]}
          placeholderTextColor={colors.textLight}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    borderWidth: 4,
    borderColor: 'transparent',
    borderRadius: 16, 
    marginHorizontal: -4, 
    marginVertical: -4,
  },
  outerWrapperFocused: {
    borderColor: '#E6F4F1', // light teal glow
  },
  innerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  innerWrapperFocused: {
    borderColor: '#00696E', // dark teal border
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textDark,
  },
  iconContainer: {
    marginLeft: 8,
  }
});

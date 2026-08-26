import React from 'react';
import { View, StyleSheet, ViewProps, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
}

export function Screen({ children, style, safeArea = true, ...props }: ScreenProps) {
  const Container = safeArea ? SafeAreaView : View;
  
  return (
    <Container style={[styles.container, style]} {...props}>
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

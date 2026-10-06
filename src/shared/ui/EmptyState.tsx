import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Icon } from '@/shared/icons';
import { colors, radius, space } from '@/shared/theme';
import { reveal } from '@/shared/motion';
import { Glyph } from './Glyph';
import { Text } from './Text';

export type EmptyStateProps = {
  icon: Icon;
  message: string;
  children?: ReactNode;
};

export function EmptyState({ icon, message, children }: EmptyStateProps) {
  return (
    <Animated.View entering={reveal()} style={styles.container}>
      <View style={styles.halo}>
        <View style={styles.badge}>
          <Glyph icon={icon} size={30} color={colors.primary} />
        </View>
      </View>
      <Text variant="body" align="center" style={styles.message}>
        {message}
      </Text>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: space.xl,
    paddingHorizontal: space.md,
    gap: space.md,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  halo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    maxWidth: 260,
  },
});

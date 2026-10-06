import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { colors, radius, shadow, space } from '@/shared/theme';
import { usePresence } from '@/shared/motion/usePresence';
import { Text } from './Text';

export type DialogProps = {
  visible: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Dialog({ visible, onClose, eyebrow, title, children, footer }: DialogProps) {
  const screen = useWindowDimensions();
  const { mounted, progress } = usePresence(visible);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 16 }, { scale: 0.97 + progress.value * 0.03 }],
  }));

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <View style={styles.center}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <Pressable style={styles.fill} onPress={onClose} accessibilityLabel="Fechar" />
        </Animated.View>
        <Animated.View style={[styles.card, { width: Math.min(380, screen.width - space.gutter * 2) }, cardStyle]}>
          <View style={styles.header}>
            {eyebrow ? <Text variant="label">{eyebrow}</Text> : null}
            <Text variant="title" color={colors.primary}>
              {title}
            </Text>
          </View>
          {children}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    backgroundColor: colors.overlay,
  },
  card: {
    padding: space.lg,
    gap: space.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    ...shadow.popover,
  },
  header: {
    gap: 2,
  },
  footer: {
    flexDirection: 'row',
    gap: space.sm,
  },
});

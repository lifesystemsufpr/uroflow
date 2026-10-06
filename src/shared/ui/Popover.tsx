import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { colors, radius, shadow, space } from '@/shared/theme';
import { usePresence } from '@/shared/motion/usePresence';

export type Anchor = { x: number; y: number; width: number; height: number };

export type PopoverProps = {
  visible: boolean;
  anchor: Anchor | null;
  onClose: () => void;
  onClosed?: () => void;
  children: ReactNode;
  width?: number;
};

export function Popover({ visible, anchor, onClose, onClosed, children, width = 320 }: PopoverProps) {
  const screen = useWindowDimensions();
  const { mounted, progress } = usePresence(visible, onClosed);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -8 }, { scale: 0.96 + progress.value * 0.04 }],
  }));

  const cardWidth = Math.min(width, screen.width - space.gutter * 2);
  const alignRight = anchor ? anchor.x + anchor.width / 2 > screen.width / 2 : true;
  const top = anchor ? anchor.y + anchor.height + space.xs : 120;
  const horizontal = anchor
    ? alignRight
      ? { right: Math.max(space.gutter, screen.width - (anchor.x + anchor.width)) }
      : { left: Math.max(space.gutter, anchor.x) }
    : { right: space.gutter };

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={styles.fill} onPress={onClose} accessibilityLabel="Fechar" />
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          { top, width: cardWidth, transformOrigin: alignRight ? 'top right' : 'top left' },
          horizontal,
          cardStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: colors.overlay,
  },
  card: {
    position: 'absolute',
    padding: space.sm,
    gap: space.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.popover,
  },
});

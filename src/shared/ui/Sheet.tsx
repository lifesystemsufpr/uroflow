import { useEffect, type ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XIcon } from '@/shared/icons';
import { colors, radius, shadow, space } from '@/shared/theme';
import { usePresence } from '@/shared/motion/usePresence';
import { Glyph } from './Glyph';
import { Text } from './Text';
import { Touchable } from './Touchable';

export type SheetProps = {
  visible: boolean;
  onClose: () => void;
  onClosed?: () => void;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

const DISMISS_DISTANCE = 0.28;
const DISMISS_VELOCITY = 900;

export function Sheet({ visible, onClose, onClosed, eyebrow, title, children, footer }: SheetProps) {
  const { mounted, progress } = usePresence(visible, onClosed);
  const height = useSharedValue(1000);
  const drag = useSharedValue(0);

  useEffect(() => {
    if (visible) drag.value = 0;
  }, [visible, drag]);

  const pan = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .onUpdate((e) => {
      drag.value = e.translationY > 0 ? e.translationY : e.translationY * 0.15;
    })
    .onEnd((e) => {
      if (e.translationY > height.value * DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        scheduleOnRN(onClose);
        return;
      }
      drag.value = withSpring(0, { damping: 20, stiffness: 260 });
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * interpolate(drag.value, [0, height.value], [1, 0.2], 'clamp'),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * height.value + drag.value }],
  }));

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.fill}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
          <Pressable style={styles.fill} onPress={onClose} accessibilityLabel="Fechar" />
        </Animated.View>
        <SafeAreaView style={styles.fill} edges={['top']} pointerEvents="box-none">
          <KeyboardAvoidingView style={styles.dock} behavior="padding" pointerEvents="box-none">
            <Animated.View
              onLayout={(e) => {
                height.value = e.nativeEvent.layout.height;
              }}
              style={[styles.sheet, sheetStyle]}
            >
              <GestureDetector gesture={pan}>
                <View style={styles.head}>
                  <View style={styles.grabber} />
                  <View style={styles.titleRow}>
                    <View style={styles.titleBlock}>
                      {eyebrow ? <Text variant="label">{eyebrow}</Text> : null}
                      <Text variant="title" color={colors.primary} numberOfLines={1}>
                        {title}
                      </Text>
                    </View>
                    <Touchable onPress={onClose} style={styles.close} accessibilityLabel="Fechar" hitSlop={8}>
                      <Glyph icon={XIcon} size={16} color={colors.primary} weight="bold" />
                    </Touchable>
                  </View>
                </View>
              </GestureDetector>

              <ScrollView
                style={styles.body}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {children}
              </ScrollView>

              <SafeAreaView edges={['bottom']} style={footer ? styles.footer : null}>
                {footer}
              </SafeAreaView>
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </GestureHandlerRootView>
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
  dock: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: space.lg,
  },
  sheet: {
    flexShrink: 1,
    borderTopLeftRadius: radius.xl + 6,
    borderTopRightRadius: radius.xl + 6,
    backgroundColor: colors.background,
    ...shadow.lifted,
  },
  head: {
    paddingHorizontal: space.gutter,
    paddingTop: space.xs,
    paddingBottom: space.sm,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: space.sm,
    backgroundColor: colors.line,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flexShrink: 1,
  },
  content: {
    paddingHorizontal: space.gutter,
    paddingBottom: space.md,
    gap: space.md,
  },
  footer: {
    flexDirection: 'row',
    gap: space.sm,
    paddingHorizontal: space.gutter,
    paddingTop: space.sm,
    paddingBottom: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});

import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from '@/shared/icons';
import { colors, space } from '@/shared/theme';
import { reveal } from '@/shared/motion';
import { Grain } from './Grain';
import { Glyph } from './Glyph';
import { Text } from './Text';
import { Touchable } from './Touchable';

export type FormPageProps = {
  eyebrow?: string;
  title: string;
  onBack: () => void;
  children: ReactNode;
  footer?: ReactNode;
  overlay?: ReactNode;
};

export function FormPage({ eyebrow, title, onBack, children, footer, overlay }: FormPageProps) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Grain />
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <Touchable onPress={onBack} style={styles.back} accessibilityLabel="Voltar" hitSlop={8}>
            <Glyph icon={ArrowLeftIcon} size={20} color={colors.primary} weight="bold" />
          </Touchable>
          <View style={styles.titleBlock}>
            {eyebrow ? <Text variant="label">{eyebrow}</Text> : null}
            <Text variant="title" color={colors.primary} numberOfLines={2}>
              {title}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={reveal(80)} style={styles.body}>
            {children}
          </Animated.View>
        </ScrollView>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
      {overlay}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.gutter,
    paddingTop: space.sm,
    paddingBottom: space.md,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.gutter,
    paddingBottom: space.xl,
  },
  body: {
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
    backgroundColor: colors.background,
  },
});

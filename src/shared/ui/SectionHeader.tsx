import { StyleSheet, View } from 'react-native';
import { ArrowRightIcon } from '@/shared/icons';
import { colors, space } from '@/shared/theme';
import { Glyph } from './Glyph';
import { Touchable } from './Touchable';
import { Text } from './Text';

export type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.titleRow}>
        <View style={styles.tick} />
        <Text variant="label" color={colors.primary}>
          {title}
        </Text>
      </View>
      {actionLabel && onAction ? (
        <Touchable onPress={onAction} style={styles.action} hitSlop={8} accessibilityLabel={actionLabel}>
          <Text variant="bodyStrong" color={colors.primary} style={styles.actionLabel}>
            {actionLabel}
          </Text>
          <Glyph icon={ArrowRightIcon} size={14} color={colors.primary} weight="bold" />
        </Touchable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  tick: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primarySoft,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    fontSize: 14,
  },
});

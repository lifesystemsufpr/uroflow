import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChatCircleTextIcon, PlusIcon } from '@/shared/icons';
import { Button, Checkbox, DashedDivider, Glyph, Text, Touchable } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { layout } from '@/shared/motion';
import type { Consideration } from '../types';

export type ConsiderationListProps = {
  title: string;
  items: Consideration[];
  onToggle: (id: string) => void;
  onAdd: () => void;
};

export function ConsiderationList({ title, items, onToggle, onAdd }: ConsiderationListProps) {
  const done = items.filter((item) => item.completed).length;

  return (
    <Animated.View layout={layout} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Glyph icon={ChatCircleTextIcon} size={20} color={colors.onPrimary} />
        </View>
        <View style={styles.flex}>
          <Text variant="heading">{title}</Text>
          {items.length > 0 ? (
            <Text variant="caption">
              {done} de {items.length} conversados
            </Text>
          ) : null}
        </View>
      </View>

      {items.length > 0 ? (
        <View style={styles.list}>
          {items.map((item, index) => (
            <View key={item.id}>
              {index > 0 ? <DashedDivider /> : null}
              <Touchable
                onPress={() => onToggle(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.completed }}
                style={styles.item}
              >
                <Checkbox checked={item.completed} />
                <Text
                  variant="bodyStrong"
                  color={item.completed ? colors.textFaint : colors.primary}
                  style={[styles.flex, item.completed && styles.completed]}
                >
                  {item.title}
                </Text>
              </Touchable>
            </View>
          ))}
        </View>
      ) : (
        <Text variant="caption" align="center" style={styles.empty}>
          Nenhum tópico adicionado.
        </Text>
      )}

      <Button label="Adicionar consideração" icon={PlusIcon} variant="dashed" onPress={onAdd} compact />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.xl,
    padding: space.lg,
    gap: space.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: space.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: 14,
  },
  completed: {
    textDecorationLine: 'line-through',
  },
  empty: {
    paddingVertical: space.xs,
  },
});

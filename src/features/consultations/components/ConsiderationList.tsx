import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChatCircleTextIcon, PlusIcon, TrashIcon } from '@/shared/icons';
import { Button, Checkbox, DashedDivider, Dialog, Glyph, Text, Touchable } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { fadeOut, layout, popIn, popOut } from '@/shared/motion';
import type { Consideration } from '../types';

export type ConsiderationListProps = {
  title: string;
  items: Consideration[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
};

export function ConsiderationList({ title, items, onToggle, onDelete, onAdd }: ConsiderationListProps) {
  const done = items.filter((item) => item.completed).length;
  const [target, setTarget] = useState<Consideration | null>(null);
  const [confirming, setConfirming] = useState(false);

  const askDelete = (item: Consideration) => {
    setTarget(item);
    setConfirming(true);
  };

  const confirmDelete = () => {
    if (target) onDelete(target.id);
    setConfirming(false);
  };

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
            <Animated.View key={item.id} layout={layout} exiting={fadeOut}>
              {index > 0 ? <DashedDivider /> : null}
              <View style={styles.row}>
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
                {item.completed ? (
                  <Animated.View entering={popIn} exiting={popOut}>
                    <Touchable
                      onPress={() => askDelete(item)}
                      accessibilityLabel={`Excluir ${item.title}`}
                      hitSlop={8}
                      style={styles.delete}
                    >
                      <Glyph icon={TrashIcon} size={16} color={colors.dangerDark} weight="bold" />
                    </Touchable>
                  </Animated.View>
                ) : null}
              </View>
            </Animated.View>
          ))}
        </View>
      ) : (
        <Text variant="caption" align="center" style={styles.empty}>
          Nenhum tópico adicionado.
        </Text>
      )}

      <Button label="Adicionar consideração" icon={PlusIcon} variant="dashed" onPress={onAdd} compact />

      <Dialog
        visible={confirming}
        onClose={() => setConfirming(false)}
        eyebrow="Considerações"
        title="Excluir este tópico?"
        footer={
          <>
            <Button label="Cancelar" variant="secondary" onPress={() => setConfirming(false)} style={styles.flex} />
            <Button label="Excluir" variant="danger" icon={TrashIcon} onPress={confirmDelete} style={styles.flex} />
          </>
        }
      >
        <View style={styles.quote}>
          <Text variant="bodyStrong" color={colors.primary}>
            {target?.title}
          </Text>
        </View>
        <Text variant="body">Ele será removido da lista e essa ação não pode ser desfeita.</Text>
      </Dialog>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: 14,
  },
  delete: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.dangerMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quote: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
    backgroundColor: colors.background,
  },
  completed: {
    textDecorationLine: 'line-through',
  },
  empty: {
    paddingVertical: space.xs,
  },
});

import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconBadge, Text, Touchable } from '@/shared/ui';
import { radius, space } from '@/shared/theme';
import { eventCatalog, quickLogOrder, type EventType } from '@/features/diary';

const rows = [quickLogOrder.slice(0, 3), quickLogOrder.slice(3)];

function QuickLogTile({ type }: { type: EventType }) {
  const navigation = useNavigation();
  const meta = eventCatalog[type];

  return (
    <Touchable
      onPress={() => navigation.navigate('Wizard', { type })}
      effect="tint"
      accessibilityLabel={`Registrar ${meta.action}`}
      style={[styles.tile, { backgroundColor: meta.tone.soft }]}
    >
      <IconBadge icon={meta.icon} tone={meta.tone} size={44} inverted />
      <Text variant="bodyStrong" color={meta.tone.ink} numberOfLines={1} adjustsFontSizeToFit style={styles.label}>
        {meta.action}
      </Text>
    </Touchable>
  );
}

export function QuickLogGrid() {
  return (
    <View style={styles.grid}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((type) => (
            <QuickLogTile key={type} type={type} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: space.sm,
  },
  row: {
    flexDirection: 'row',
    gap: space.sm,
  },
  tile: {
    flex: 1,
    alignItems: 'flex-start',
    gap: space.sm,
    padding: space.sm,
    paddingVertical: space.md,
    borderRadius: radius.lg,
  },
  label: {
    fontSize: 14,
  },
});

import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { utcDateKey } from '@/shared/lib/date';
import { Dots, Text } from '@/shared/ui';
import { colors, palette, space } from '@/shared/theme';
import { eventCatalog, useDayCounts, type EventType } from '@/features/diary';
import { StatTile } from './StatTile';

const escapeCaption = (count: number) =>
  count === 0 ? 'Nenhum escape até agora' : count === 1 ? 'registrado hoje' : 'registrados hoje';

export function TodayBoard() {
  const navigation = useNavigation();
  const counts = useDayCounts(utcDateKey());
  const count = (type: EventType) => counts[type] ?? 0;
  const openDiary = (filter: EventType) => () => navigation.navigate('Tabs', { screen: 'Diary', params: { filter } });

  return (
    <View style={styles.board}>
      <View style={styles.row}>
        <StatTile
          emphasis
          label="Xixis hoje"
          value={count('pee')}
          icon={eventCatalog.pee.icon}
          iconColor={palette.marigoldDeep}
          onPress={openDiary('pee')}
          style={styles.hero}
          footer={<Dots filled={Math.min(count('pee'), 7)} color={palette.marigoldInk} emptyColor={palette.marigoldDot} />}
        />
        <View style={styles.column}>
          <StatTile
            label="Líquidos"
            value={count('water')}
            icon={eventCatalog.water.icon}
            iconColor={eventCatalog.water.tone.solid}
            onPress={openDiary('water')}
            style={styles.flex}
          />
          <StatTile
            label="Evacuação"
            value={count('poop')}
            icon={eventCatalog.poop.icon}
            iconColor={eventCatalog.poop.tone.solid}
            onPress={openDiary('poop')}
            style={styles.flex}
          />
        </View>
      </View>

      <StatTile
        label="Escapes hoje"
        value={count('escape')}
        icon={eventCatalog.escape.icon}
        iconColor={eventCatalog.escape.tone.solid}
        onPress={openDiary('escape')}
        footer={<Text variant="caption">{escapeCaption(count('escape'))}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    gap: space.sm,
  },
  row: {
    flexDirection: 'row',
    gap: space.sm,
  },
  hero: {
    flex: 1.15,
    minHeight: 196,
  },
  column: {
    flex: 1,
    gap: space.sm,
  },
  flex: {
    flex: 1,
  },
});

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NotebookIcon } from '@/shared/icons';
import { DashedDivider, EmptyState, IconBadge, SectionHeader, Text } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { listItem } from '@/shared/motion';
import { describeEvent, eventCatalog, useChildEvents, type DiaryEvent } from '@/features/diary';

function RecentRow({ event }: { event: DiaryEvent }) {
  const meta = eventCatalog[event.type];
  const summary = describeEvent(event);

  return (
    <View style={styles.row}>
      <IconBadge icon={meta.icon} tone={meta.tone} size={40} />
      <View style={styles.info}>
        <Text variant="bodyStrong">{meta.title}</Text>
        {summary ? (
          <Text variant="caption" numberOfLines={1}>
            {summary}
          </Text>
        ) : null}
      </View>
      <View style={styles.time}>
        <Text variant="label" color={colors.primary}>
          {event.time}
        </Text>
      </View>
    </View>
  );
}

export function RecentEvents() {
  const navigation = useNavigation();
  const events = useChildEvents();
  const recent = useMemo(() => events.slice(0, 3), [events]);

  if (recent.length === 0) {
    return (
      <View style={styles.section}>
        <SectionHeader title="Últimos registros" />
        <EmptyState icon={NotebookIcon} message="Nenhum registro recente." />
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Últimos registros"
        actionLabel="Ver diário"
        onAction={() => navigation.navigate('Tabs', { screen: 'Diary' })}
      />
      <View style={styles.card}>
        {recent.map((event, index) => (
          <Animated.View key={event.id} entering={listItem(index)}>
            {index > 0 ? <DashedDivider /> : null}
            <RecentRow event={event} />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.sm,
  },
  card: {
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: space.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
  },
  info: {
    flex: 1,
    gap: 1,
  },
  time: {
    paddingHorizontal: space.xs,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
});

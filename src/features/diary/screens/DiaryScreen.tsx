import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { NotebookIcon } from '@/shared/icons';
import { Chip, EmptyState, ScrollScreen } from '@/shared/ui';
import { space } from '@/shared/theme';
import { addDays, isToday, localDateKey } from '@/shared/lib/date';
import { ChildSwitcher } from '@/features/child';
import type { TabParamList } from '@/app/navigation/types';
import { DayNavigator } from '../components/DayNavigator';
import { TimelineItem } from '../components/TimelineItem';
import { useDayEvents } from '../hooks/useDayEvents';
import { filterOptions } from '../model/eventCatalog';
import type { EventFilter } from '../types';

export function DiaryScreen() {
  const route = useRoute<RouteProp<TabParamList, 'Diary'>>();
  const requested = route.params?.filter;
  const [filter, setFilter] = useState<EventFilter>(requested || 'all');
  const [date, setDate] = useState(() => new Date());
  const [direction, setDirection] = useState<1 | -1>(1);
  const today = isToday(date);
  const events = useDayEvents(localDateKey(date), filter);

  useEffect(() => {
    if (requested) setFilter(requested);
  }, [requested]);

  const shiftDay = (step: 1 | -1) => {
    setDirection(step);
    setDate((current) => addDays(current, step));
  };

  return (
    <ScrollScreen eyebrow="Linha do tempo" title="Diário" right={<ChildSwitcher />}>
      <DayNavigator
        date={date}
        direction={direction}
        canGoForward={!today}
        onPrev={() => shiftDay(-1)}
        onNext={() => {
          if (!today) shiftDay(1);
        }}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filtersRail}
      >
        {filterOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            active={filter === option.value}
            onPress={() => setFilter(option.value)}
          />
        ))}
      </ScrollView>

      {events.length === 0 ? (
        <EmptyState
          icon={NotebookIcon}
          message={
            today ? 'Hoje ainda não há registros para este filtro.' : 'Nenhum registro encontrado para este dia.'
          }
        />
      ) : (
        <View>
          {events.map((event, index) => (
            <TimelineItem key={event.id} event={event} index={index} isLast={index === events.length - 1} />
          ))}
        </View>
      )}
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  filtersRail: {
    marginHorizontal: -space.gutter,
  },
  filters: {
    gap: space.xs,
    paddingHorizontal: space.gutter,
  },
});

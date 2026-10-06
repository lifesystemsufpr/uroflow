import { useMemo } from 'react';
import { useActiveChildId } from '@/features/child';
import { useEventStore } from '../store/eventStore';
import { byChild, countByType, eventsOn, matchesFilter } from '../model/selectors';
import type { EventFilter } from '../types';

export const useChildEvents = () => {
  const events = useEventStore((s) => s.events);
  const childId = useActiveChildId();
  return useMemo(() => byChild(events, childId), [events, childId]);
};

export const useDayEvents = (dateKey: string, filter: EventFilter = 'all') => {
  const events = useChildEvents();
  return useMemo(() => eventsOn(events, dateKey).filter(matchesFilter(filter)), [events, dateKey, filter]);
};

export const useDayCounts = (dateKey: string) => {
  const events = useDayEvents(dateKey);
  return useMemo(() => countByType(events), [events]);
};

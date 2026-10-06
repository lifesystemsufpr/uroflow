import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/shared/lib/id';
import { toTimestamp } from '@/shared/lib/date';
import { persistOptions, type Hydratable } from '@/shared/lib/persist';
import type { CreateEventInput, DiaryEvent } from '../types';

type EventState = Hydratable & {
  events: DiaryEvent[];
  addEvent: (input: CreateEventInput) => DiaryEvent;
};

const newestFirst = (a: DiaryEvent, b: DiaryEvent) => toTimestamp(b.date, b.time) - toTimestamp(a.date, a.time);

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: [],
      _hasHydrated: false,
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),
      addEvent: (input) => {
        const event: DiaryEvent = { id: generateId(), ...input, createdAt: new Date().toISOString() };
        set((state) => ({ events: [event, ...state.events].sort(newestFirst) }));
        return event;
      },
    }),
    persistOptions<EventState>('app-event-storage'),
  ),
);

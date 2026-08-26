import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { DiaryEvent, CreateEventInput } from '../types';

interface EventState {
  events: DiaryEvent[];
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  addEvent: (eventData: CreateEventInput) => DiaryEvent;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      addEvent: (eventData) => {
        const newEvent: DiaryEvent = {
          id: uuidv4(),
          ...eventData,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          events: [newEvent, ...state.events].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB.getTime() - dateA.getTime();
          })
        }));
        
        return newEvent;
      },
    }),
    {
      name: 'app-event-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

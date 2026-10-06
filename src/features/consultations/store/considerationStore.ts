import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/shared/lib/id';
import { persistOptions, type Hydratable } from '@/shared/lib/persist';
import type { Consideration, CreateConsiderationInput } from '../types';

type ConsiderationState = Hydratable & {
  considerations: Consideration[];
  addConsideration: (input: CreateConsiderationInput) => Consideration;
  toggleComplete: (id: string) => void;
  deleteConsideration: (id: string) => void;
};

export const useConsiderationStore = create<ConsiderationState>()(
  persist(
    (set) => ({
      considerations: [],
      _hasHydrated: false,
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),
      addConsideration: (input) => {
        const consideration: Consideration = {
          id: generateId(),
          ...input,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ considerations: [...state.considerations, consideration] }));
        return consideration;
      },
      toggleComplete: (id) =>
        set((state) => ({
          considerations: state.considerations.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c)),
        })),
      deleteConsideration: (id) =>
        set((state) => ({ considerations: state.considerations.filter((c) => c.id !== id) })),
    }),
    persistOptions<ConsiderationState>('app-consideration-storage'),
  ),
);

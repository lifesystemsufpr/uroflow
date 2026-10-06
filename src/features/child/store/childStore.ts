import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/shared/lib/id';
import { persistOptions, type Hydratable } from '@/shared/lib/persist';
import type { Child, CreateChildInput, UpdateChildInput } from '../types';

type ChildState = Hydratable & {
  children: Child[];
  activeChildId: string | null;
  setActiveChild: (id: string) => void;
  addChild: (input: CreateChildInput) => Child;
  updateChild: (id: string, input: UpdateChildInput) => Child | null;
  deleteChild: (id: string) => void;
};

export const useChildStore = create<ChildState>()(
  persist(
    (set, get) => ({
      children: [],
      activeChildId: null,
      _hasHydrated: false,
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),
      setActiveChild: (activeChildId) => set({ activeChildId }),
      addChild: (input) => {
        const child: Child = { id: generateId(), ...input };
        set((state) => ({
          children: [...state.children, child],
          activeChildId: state.activeChildId || child.id,
        }));
        return child;
      },
      updateChild: (id, input) => {
        const current = get().children.find((c) => c.id === id);
        if (!current) return null;
        const updated = { ...current, ...input };
        set((state) => ({ children: state.children.map((c) => (c.id === id ? updated : c)) }));
        return updated;
      },
      deleteChild: (id) =>
        set((state) => {
          const children = state.children.filter((c) => c.id !== id);
          const activeChildId =
            state.activeChildId === id ? (children[0]?.id ?? null) : state.activeChildId;
          return { children, activeChildId };
        }),
    }),
    persistOptions<ChildState>('app-child-storage'),
  ),
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Child, CreateChildInput, UpdateChildInput } from '../types';

interface ChildState {
  children: Child[];
  activeChildId: string | null;
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  setActiveChild: (id: string) => void;
  addChild: (childData: CreateChildInput) => Child;
  updateChild: (id: string, childData: UpdateChildInput) => Child | null;
  deleteChild: (id: string) => void;
}

export const useChildStore = create<ChildState>()(
  persist(
    (set, get) => ({
      children: [],
      activeChildId: null,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setActiveChild: (id) => set({ activeChildId: id }),

      addChild: (childData) => {
        const newChild: Child = {
          id: uuidv4(),
          ...childData,
        };
        set((state) => ({
          children: [...state.children, newChild],
          activeChildId: state.activeChildId || newChild.id
        }));
        return newChild;
      },

      updateChild: (id, childData) => {
        const { children } = get();
        const index = children.findIndex(c => c.id === id);
        if (index === -1) return null;

        const updated = { ...children[index], ...childData };
        const newChildren = [...children];
        newChildren[index] = updated;
        
        set({ children: newChildren });
        return updated;
      },

      deleteChild: (id) => {
        set((state) => {
          const filtered = state.children.filter(c => c.id !== id);
          return {
            children: filtered,
            activeChildId: state.activeChildId === id 
              ? (filtered.length > 0 ? filtered[0].id : null) 
              : state.activeChildId
          };
        });
      }
    }),
    {
      name: 'app-child-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

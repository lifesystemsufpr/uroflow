import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistOptions, type Hydratable } from '@/shared/lib/persist';

type UserState = Hydratable & {
  guardianName: string | null;
  setGuardianName: (name: string) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      guardianName: null,
      _hasHydrated: false,
      setGuardianName: (guardianName) => set({ guardianName }),
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),
    }),
    persistOptions<UserState>('app-user-storage'),
  ),
);

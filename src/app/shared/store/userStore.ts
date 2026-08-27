import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  guardianName: string | null;
  _hasHydrated: boolean;
  setGuardianName: (name: string) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      guardianName: null,
      _hasHydrated: false,
      setGuardianName: (name) => set({ guardianName: name }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'app-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);

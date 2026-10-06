import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, type PersistOptions } from 'zustand/middleware';

export type Hydratable = {
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};

export const persistOptions = <T extends Hydratable>(name: string): PersistOptions<T, Omit<T, '_hasHydrated'>> => ({
  name,
  storage: createJSONStorage(() => AsyncStorage),
  partialize: ({ _hasHydrated, ...rest }) => rest,
  onRehydrateStorage: (initial) => () => initial.setHasHydrated(true),
});

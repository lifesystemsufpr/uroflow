import type { ReactNode } from 'react';
import { useFonts } from 'expo-font';
import { BrandLoader } from '@/shared/ui';
import { fontAssets } from '@/shared/theme/fontAssets';
import { useChildStore } from '@/features/child';
import { useUserStore } from '@/features/user';
import { useEventStore } from '@/features/diary';
import { useAppointmentStore, useConsiderationStore } from '@/features/consultations';

const useStoresHydrated = () => {
  const child = useChildStore((s) => s._hasHydrated);
  const user = useUserStore((s) => s._hasHydrated);
  const events = useEventStore((s) => s._hasHydrated);
  const appointments = useAppointmentStore((s) => s._hasHydrated);
  const considerations = useConsiderationStore((s) => s._hasHydrated);
  return child && user && events && appointments && considerations;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const hydrated = useStoresHydrated();

  if (!hydrated || (!fontsLoaded && !fontError)) return <BrandLoader />;

  return <>{children}</>;
}

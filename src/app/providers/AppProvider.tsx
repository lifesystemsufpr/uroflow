import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useChildStore } from '../features/child';
import { useEventStore } from '../features/diary';
import { useAppointmentStore, useConsiderationStore } from '../features/consultations';
import { seedDatabase } from '../shared/utils/seed';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const childStore = useChildStore();
  const eventStore = useEventStore();
  const apptStore = useAppointmentStore();
  const consStore = useConsiderationStore();

  useEffect(() => {
    // Check if all stores are hydrated
    const isHydrated = 
      childStore._hasHydrated && 
      eventStore._hasHydrated && 
      apptStore._hasHydrated && 
      consStore._hasHydrated;

    if (isHydrated && !isReady) {
      setIsReady(true);
    }
  }, [childStore._hasHydrated, eventStore._hasHydrated, apptStore._hasHydrated, consStore._hasHydrated, childStore.children.length, isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

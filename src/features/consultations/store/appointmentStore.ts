import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/shared/lib/id';
import { persistOptions, type Hydratable } from '@/shared/lib/persist';
import type { Appointment, CreateAppointmentInput } from '../types';

type AppointmentState = Hydratable & {
  appointments: Appointment[];
  addAppointment: (input: CreateAppointmentInput) => Appointment;
  deleteAppointment: (id: string) => void;
};

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      appointments: [],
      _hasHydrated: false,
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),
      addAppointment: (input) => {
        const appointment: Appointment = { id: generateId(), ...input, createdAt: new Date().toISOString() };
        set((state) => ({ appointments: [...state.appointments, appointment] }));
        return appointment;
      },
      deleteAppointment: (id) =>
        set((state) => ({ appointments: state.appointments.filter((a) => a.id !== id) })),
    }),
    persistOptions<AppointmentState>('app-appointment-storage'),
  ),
);

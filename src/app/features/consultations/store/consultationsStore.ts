import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Appointment, CreateAppointmentInput, Consideration, CreateConsiderationInput } from '../types';

interface AppointmentState {
  appointments: Appointment[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addAppointment: (data: CreateAppointmentInput) => Appointment;
  deleteAppointment: (id: string) => void;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set) => ({
      appointments: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      addAppointment: (data) => {
        const newAppt: Appointment = {
          id: uuidv4(),
          ...data,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ appointments: [...state.appointments, newAppt] }));
        return newAppt;
      },
      deleteAppointment: (id) => set((state) => ({ appointments: state.appointments.filter((a) => a.id !== id) })),
    }),
    {
      name: 'app-appointment-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);

interface ConsiderationState {
  considerations: Consideration[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addConsideration: (data: CreateConsiderationInput) => Consideration;
  toggleComplete: (id: string) => void;
  deleteConsideration: (id: string) => void;
}

export const useConsiderationStore = create<ConsiderationState>()(
  persist(
    (set) => ({
      considerations: [],
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      addConsideration: (data) => {
        const newCons: Consideration = {
          id: uuidv4(),
          ...data,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ considerations: [...state.considerations, newCons] }));
        return newCons;
      },
      toggleComplete: (id) => set((state) => ({
        considerations: state.considerations.map((c) =>
          c.id === id ? { ...c, completed: !c.completed } : c
        )
      })),
      deleteConsideration: (id) => set((state) => ({ considerations: state.considerations.filter((c) => c.id !== id) })),
    }),
    {
      name: 'app-consideration-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    }
  )
);

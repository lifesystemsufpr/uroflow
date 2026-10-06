import { toTimestamp } from '@/shared/lib/date';
import type { Appointment } from '../types';

const at = (appointment: Appointment) => toTimestamp(appointment.date, appointment.time);

export const splitAppointments = (appointments: Appointment[], childId: string | null, now: number) => {
  const mine = appointments.filter((a) => a.childId === childId);
  return {
    upcoming: mine.filter((a) => at(a) >= now).sort((a, b) => at(a) - at(b)),
    past: mine.filter((a) => at(a) < now).sort((a, b) => at(b) - at(a)),
  };
};

export const firstOnDate = (appointments: Appointment[], childId: string | null, dateKey: string) =>
  appointments
    .filter((a) => a.childId === childId && a.date === dateKey)
    .sort((a, b) => a.time.localeCompare(b.time))[0] ?? null;

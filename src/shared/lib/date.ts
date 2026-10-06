import { addDays } from 'date-fns/addDays';
import { differenceInCalendarDays } from 'date-fns/differenceInCalendarDays';
import { format } from 'date-fns/format';
import { isToday } from 'date-fns/isToday';
import { isYesterday } from 'date-fns/isYesterday';
import { parseISO } from 'date-fns/parseISO';
import { ptBR } from 'date-fns/locale/pt-BR';

export { addDays, isToday };

export const utcDateKey = (date: Date = new Date()) => date.toISOString().split('T')[0];

export const localDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

export const clockTime = (date: Date = new Date()) => date.toTimeString().split(' ')[0].substring(0, 5);

export const tomorrowUtcKey = () => utcDateKey(addDays(new Date(), 1));

export const daysUntil = (date: string) => differenceInCalendarDays(parseISO(date), new Date());

export const toTimestamp = (date: string, time: string) => new Date(`${date}T${time}`).getTime();

export const formatDate = (value: string, pattern = 'dd/MM/yyyy') => {
  try {
    return format(parseISO(value), pattern, { locale: ptBR });
  } catch {
    return value;
  }
};

export const dayLabel = (date: Date) => {
  if (isToday(date)) return 'Hoje';
  if (isYesterday(date)) return 'Ontem';
  return format(date, "dd 'de' MMMM", { locale: ptBR });
};

export const longDate = (date: Date) => format(date, "EEEE, d 'de' MMMM", { locale: ptBR });

export const shortDate = (date: Date) => format(date, 'EEE, d MMM', { locale: ptBR }).replace(/\./g, '');

const parseBirthDate = (value: string) => {
  if (!value.includes('/')) return parseISO(value);
  const parts = value.split('/');
  return parts.length === 3 ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`) : new Date(NaN);
};

export const calculateAge = (birthDate?: string) => {
  if (!birthDate) return '';
  try {
    const birth = parseBirthDate(birthDate);
    if (isNaN(birth.getTime())) return '';
    const today = new Date();
    const monthDiff = today.getMonth() - birth.getMonth();
    const beforeBirthday = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate());
    const age = today.getFullYear() - birth.getFullYear() - (beforeBirthday ? 1 : 0);
    return `${age} ${age === 1 ? 'ano' : 'anos'}`;
  } catch {
    return '';
  }
};

import { isValidDateString } from './formatters';

export type Day = { year: number; month: number; day: number };

export const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const pad = (value: number) => String(value).padStart(2, '0');

export const today = (): Day => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
};

export const monthGrid = (year: number, month: number) => {
  const offset = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: Math.ceil((offset + total) / 7) * 7 }, (_, i) => {
    const day = i - offset + 1;
    return day >= 1 && day <= total ? day : null;
  });
};

export const shiftMonth = (year: number, month: number, step: number) => {
  const date = new Date(year, month + step, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
};

export const compareDays = (a: Day, b: Day) => a.year - b.year || a.month - b.month || a.day - b.day;

export const fromBr = (value: string): Day | null => {
  if (!isValidDateString(value)) return null;
  const [day, month, year] = value.split('/').map((part) => parseInt(part, 10));
  return { year, month: month - 1, day };
};

export const toBr = ({ year, month, day }: Day) => `${pad(day)}/${pad(month + 1)}/${year}`;

export const formatLong = ({ year, month, day }: Day) => `${day} de ${MONTHS[month].toLowerCase()} de ${year}`;

export const fromTime = (value: string) => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  return match ? { hour: parseInt(match[1], 10), minute: parseInt(match[2], 10) } : null;
};

export const toTime = (hour: number, minute: number) => `${pad(hour)}:${pad(minute)}`;

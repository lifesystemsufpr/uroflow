import { format, isToday as dateFnsIsToday, parseISO } from 'date-fns';

export function formatDate(dateStr: string, dateFormat: string = 'dd/MM/yyyy'): string {
  try {
    const date = parseISO(dateStr);
    return format(date, dateFormat);
  } catch (e) {
    return dateStr;
  }
}

export function formatTime(timeStr: string): string {
  // Assuming timeStr is "HH:mm" or ISO string
  if (timeStr.includes('T')) {
    try {
      const date = parseISO(timeStr);
      return format(date, 'HH:mm');
    } catch (e) {
      return timeStr;
    }
  }
  return timeStr;
}

export function isToday(dateStr: string): boolean {
  try {
    const date = parseISO(dateStr);
    return dateFnsIsToday(date);
  } catch (e) {
    return false;
  }
}

export function calculateAge(birthDateStr?: string): string {
  if (!birthDateStr) return '';
  try {
    const birthDate = parseISO(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} anos`;
  } catch (e) {
    return '';
  }
}

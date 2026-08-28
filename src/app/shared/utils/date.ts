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
    let birthDate: Date;
    
    if (birthDateStr.includes('/')) {
      const parts = birthDateStr.split('/');
      if (parts.length === 3) {
        birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
      } else {
        return '';
      }
    } else {
      birthDate = parseISO(birthDateStr);
    }
    
    if (isNaN(birthDate.getTime())) return '';

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

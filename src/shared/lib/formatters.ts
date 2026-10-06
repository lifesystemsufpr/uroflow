export const isValidDateString = (value: string) => {
  if (!value || value.length !== 10) return false;
  const parts = value.split('/');
  if (parts.length !== 3) return false;
  const [day, month, year] = parts.map((p) => parseInt(p, 10));
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const isValidTimeString = (value: string) => {
  if (!value || value.length !== 5) return false;
  const parts = value.split(':');
  if (parts.length !== 2) return false;
  const [hours, minutes] = parts.map((p) => parseInt(p, 10));
  if (isNaN(hours) || isNaN(minutes)) return false;
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

export const brDateToIso = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed.includes('/')) return trimmed;
  const parts = trimmed.split('/');
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : trimmed;
};

export const isoDateToBr = (value: string) => {
  const parts = value.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
};

export const initials = (name?: string) =>
  (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

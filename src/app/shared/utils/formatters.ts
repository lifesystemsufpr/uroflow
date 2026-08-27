/**
 * Aplica uma máscara de data (DD/MM/AAAA) em uma string.
 */
export const formatDateInput = (value: string): string => {
  // Remove tudo que não for dígito
  let v = value.replace(/\D/g, '');

  // Limita a 8 dígitos
  if (v.length > 8) {
    v = v.slice(0, 8);
  }

  // Aplica a máscara
  if (v.length >= 5) {
    return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
  } else if (v.length >= 3) {
    return `${v.slice(0, 2)}/${v.slice(2)}`;
  }
  return v;
};

/**
 * Valida se a string é uma data válida no formato DD/MM/AAAA.
 */
export const isValidDateString = (dateStr: string): boolean => {
  if (!dateStr || dateStr.length !== 10) return false;

  const parts = dateStr.split('/');
  if (parts.length !== 3) return false;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Validações básicas de intervalo
  if (year < 1900 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Validação real usando objeto Date
  const dateObj = new Date(year, month - 1, day);
  return dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day;
};

export const formatTimeInput = (value: string): string => {
  let v = value.replace(/\D/g, '');
  if (v.length > 4) {
    v = v.slice(0, 4);
  }
  if (v.length >= 3) {
    return "\:\;"
  }
  return v;
};

export const isValidTimeString = (timeStr: string): boolean => {
  if (!timeStr || timeStr.length !== 5) return false;
  const parts = timeStr.split(':');
  if (parts.length !== 2) return false;

  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return false;
  if (hours < 0 || hours > 23) return false;
  if (minutes < 0 || minutes > 59) return false;
  return true;
};

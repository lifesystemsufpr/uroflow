const chunk = () => Math.random().toString(36).substring(2, 9);

export const generateId = () => `${Date.now().toString(36)}-${chunk()}-${chunk()}`;

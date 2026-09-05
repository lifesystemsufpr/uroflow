/**
 * Generates a unique ID without relying on crypto.getRandomValues,
 * which is not natively available in all React Native environments.
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const rand1 = Math.random().toString(36).substring(2, 9);
  const rand2 = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${rand1}-${rand2}`;
}

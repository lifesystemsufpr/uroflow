import type { DiaryEvent, EventFilter, EventType } from '../types';
import { wizardDefinitions } from './wizards';

export const byChild = (events: DiaryEvent[], childId: string | null) =>
  events.filter((event) => event.childId === childId);

export const countByType = (events: DiaryEvent[]) =>
  events.reduce<Partial<Record<EventType, number>>>(
    (acc, event) => ({ ...acc, [event.type]: (acc[event.type] ?? 0) + 1 }),
    {},
  );

export const eventsOn = (events: DiaryEvent[], dateKey: string) => events.filter((event) => event.date === dateKey);

export const matchesFilter = (filter: EventFilter) => (event: DiaryEvent) =>
  filter === 'all' || event.type === filter;

export const describeEvent = (event: DiaryEvent) => {
  if (!event.data) return '';
  if (event.type === 'pee') return `Volume ${event.data.q2?.toLowerCase() || ''}`;
  return [event.data.q1, event.data.q2].filter(Boolean).join(', ');
};

export type Answer = { question: string; answer: string };

export const eventAnswers = (event: DiaryEvent): Answer[] =>
  wizardDefinitions[event.type].steps
    .filter((step) => event.data?.[step.id])
    .map((step) => ({ question: step.question.replace(/^Opcional — /, ''), answer: event.data[step.id] }));

export type EventType = 'pee' | 'water' | 'poop' | 'night' | 'escape' | 'pain';

export type DiaryEvent = {
  id: string;
  childId: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt: string; // ISO datetime
  data: Record<string, string>;
};

export type CreateEventInput = Omit<DiaryEvent, 'id' | 'createdAt'>;

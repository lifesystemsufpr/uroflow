export type EventType = 'pee' | 'water' | 'poop' | 'night' | 'escape' | 'pain';

export type DiaryEvent = {
  id: string;
  childId: string;
  type: EventType;
  date: string;
  time: string;
  createdAt: string;
  data: Record<string, string>;
  notes?: string;
};

export type CreateEventInput = Omit<DiaryEvent, 'id' | 'createdAt'>;

export type EventFilter = 'all' | EventType;

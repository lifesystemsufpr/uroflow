export type Appointment = {
  id: string;
  childId: string;
  specialty: string;
  date: string;
  time: string;
  professional?: string;
  location?: string;
  notes?: string;
  createdAt: string;
};

export type CreateAppointmentInput = Omit<Appointment, 'id' | 'createdAt'>;

export type AppointmentDraft = {
  specialty: string;
  date: string;
  time: string;
  professional: string;
  location: string;
  notes: string;
};

export type Consideration = {
  id: string;
  childId: string;
  appointmentId?: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
};

export type CreateConsiderationInput = Omit<Consideration, 'id' | 'createdAt' | 'completed'>;

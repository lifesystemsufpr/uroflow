import { useChildStore } from '../../features/child';
import { useEventStore } from '../../features/diary';
import { useAppointmentStore, useConsiderationStore } from '../../features/consultations';

export function seedDatabase() {
  const addChild = useChildStore.getState().addChild;
  const addEvent = useEventStore.getState().addEvent;
  const addAppointment = useAppointmentStore.getState().addAppointment;
  const addConsideration = useConsiderationStore.getState().addConsideration;

  console.log('🌱 Seeding development data...');

  const c1 = addChild({ name: 'Leo', birthDate: '2018-05-10', avatar: '👦', goal: 'Acompanhamento uroflow' });
  const c2 = addChild({ name: 'Sofia', birthDate: '2021-08-20', avatar: '👧', goal: 'Desfralde' });
  const c3 = addChild({ name: 'Miguel', birthDate: '2023-01-15', avatar: '👶', goal: 'Geral' });

  // Add some events for Leo
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  addEvent({
    childId: c1.id,
    type: 'pee',
    date: todayStr,
    time: '10:15',
    data: { q1: 'Normal', q2: 'Médio', q3: 'Não' }
  });

  addEvent({
    childId: c1.id,
    type: 'water',
    date: todayStr,
    time: '11:00',
    data: { q1: 'Água', q2: '200 ml' }
  });

  // Add an appointment for Leo
  addAppointment({
    childId: c1.id,
    specialty: 'Urologia pediátrica',
    date: '2026-10-15',
    time: '14:30',
    professional: 'Dra. Ana'
  });

  // Add considerations
  addConsideration({
    childId: c1.id,
    title: 'Dor ao urinar',
    description: 'Aconteceu duas vezes esta semana.'
  });

  console.log('🌱 Seeding complete!');
}

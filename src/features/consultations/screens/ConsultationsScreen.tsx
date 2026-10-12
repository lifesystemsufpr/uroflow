import { useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { CalendarPlusIcon, PlusIcon } from '@/shared/icons';
import { Button, EmptyState, ScrollScreen, SectionHeader, showSuccess } from '@/shared/ui';
import { space } from '@/shared/theme';
import { listItem, reveal } from '@/shared/motion';
import { ChildSwitcher, useActiveChildId } from '@/features/child';
import { AppointmentCard } from '../components/AppointmentCard';
import { AppointmentSheet } from '../components/AppointmentSheet';
import { ConsiderationList } from '../components/ConsiderationList';
import { NextAppointmentCard } from '../components/NextAppointmentCard';
import { splitAppointments } from '../model/selectors';
import { useAppointmentStore } from '../store/appointmentStore';
import { useConsiderationStore } from '../store/considerationStore';
import type { Appointment, AppointmentDraft } from '../types';

export function ConsultationsScreen() {
  const navigation = useNavigation();
  const childId = useActiveChildId();
  const appointments = useAppointmentStore((s) => s.appointments);
  const considerations = useConsiderationStore((s) => s.considerations);
  const toggleComplete = useConsiderationStore((s) => s.toggleComplete);
  const deleteConsideration = useConsiderationStore((s) => s.deleteConsideration);
  const createAppointment = useAppointmentStore((s) => s.addAppointment);
  const [formOpen, setFormOpen] = useState(false);
  const saved = useRef(false);

  const { upcoming, past } = splitAppointments(appointments, childId, Date.now());
  const [next, ...others] = upcoming;
  const childConsiderations = useMemo(
    () => considerations.filter((c) => c.childId === childId),
    [considerations, childId],
  );

  const openDetails = (appointment: Appointment) => navigation.navigate('AppointmentDetails', { id: appointment.id });
  const addAppointment = () => setFormOpen(true);

  const submit = (draft: AppointmentDraft) => {
    if (!childId) {
      Alert.alert('Erro', 'Selecione uma criança primeiro.');
      return;
    }
    createAppointment({ childId, ...draft });
    saved.current = true;
    setFormOpen(false);
  };

  const onFormClosed = () => {
    if (!saved.current) return;
    saved.current = false;
    showSuccess();
  };

  return (
    <>
      <ScrollScreen eyebrow="Agenda" title="Consultas" right={<ChildSwitcher />}>
        {next ? (
          <>
            <Animated.View entering={reveal(40)}>
              <NextAppointmentCard appointment={next} onPress={() => openDetails(next)} />
            </Animated.View>

            {others.length > 0 ? (
              <View style={styles.section}>
                <SectionHeader title="Outras consultas futuras" />
                {others.map((appointment, index) => (
                  <Animated.View key={appointment.id} entering={listItem(index)}>
                    <AppointmentCard appointment={appointment} onPress={() => openDetails(appointment)} />
                  </Animated.View>
                ))}
              </View>
            ) : null}

            <Button label="Adicionar consulta" icon={PlusIcon} onPress={addAppointment} />
          </>
        ) : (
          <EmptyState icon={CalendarPlusIcon} message={'Você não tem nenhuma consulta\nmarcada para o momento.'}>
            <Button label="Adicionar consulta" icon={PlusIcon} onPress={addAppointment} style={styles.stretch} />
          </EmptyState>
        )}

        <Animated.View entering={reveal(120)}>
          <ConsiderationList
            title="Quero conversar na próxima consulta"
            items={childConsiderations}
            onToggle={toggleComplete}
            onDelete={deleteConsideration}
            onAdd={() => navigation.navigate('ConsiderationForm')}
          />
        </Animated.View>

        {past.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="Consultas anteriores" />
            {past.map((appointment, index) => (
              <Animated.View key={appointment.id} entering={listItem(index)}>
                <AppointmentCard appointment={appointment} past onPress={() => openDetails(appointment)} />
              </Animated.View>
            ))}
          </View>
        ) : null}
      </ScrollScreen>

      <AppointmentSheet visible={formOpen} onClose={() => setFormOpen(false)} onClosed={onFormClosed} onSubmit={submit} />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.sm,
  },
  stretch: {
    alignSelf: 'stretch',
  },
});

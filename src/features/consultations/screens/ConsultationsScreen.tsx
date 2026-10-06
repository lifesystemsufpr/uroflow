import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { CalendarPlusIcon, PlusIcon } from '@/shared/icons';
import { Button, EmptyState, ScrollScreen, SectionHeader } from '@/shared/ui';
import { space } from '@/shared/theme';
import { listItem, reveal } from '@/shared/motion';
import { ChildSwitcher, useActiveChildId } from '@/features/child';
import { AppointmentCard } from '../components/AppointmentCard';
import { ConsiderationList } from '../components/ConsiderationList';
import { NextAppointmentCard } from '../components/NextAppointmentCard';
import { splitAppointments } from '../model/selectors';
import { useAppointmentStore } from '../store/appointmentStore';
import { useConsiderationStore } from '../store/considerationStore';
import type { Appointment } from '../types';

export function ConsultationsScreen() {
  const navigation = useNavigation();
  const childId = useActiveChildId();
  const appointments = useAppointmentStore((s) => s.appointments);
  const considerations = useConsiderationStore((s) => s.considerations);
  const toggleComplete = useConsiderationStore((s) => s.toggleComplete);

  const { upcoming, past } = splitAppointments(appointments, childId, Date.now());
  const [next, ...others] = upcoming;
  const childConsiderations = useMemo(
    () => considerations.filter((c) => c.childId === childId),
    [considerations, childId],
  );

  const openDetails = (appointment: Appointment) => navigation.navigate('AppointmentDetails', { id: appointment.id });
  const addAppointment = () => navigation.navigate('AppointmentForm');

  return (
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

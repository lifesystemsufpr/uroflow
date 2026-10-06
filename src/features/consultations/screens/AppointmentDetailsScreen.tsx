import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { CalendarDotsIcon, ClockIcon, MapPinIcon, NotePencilIcon, UserIcon, type Icon } from '@/shared/icons';
import { Button, DashedDivider, FormPage, Glyph, Text } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { formatDate } from '@/shared/lib/date';
import type { RootStackParamList } from '@/app/navigation/types';
import { ConsiderationList } from '../components/ConsiderationList';
import { useAppointmentStore } from '../store/appointmentStore';
import { useConsiderationStore } from '../store/considerationStore';

function InfoRow({ icon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Glyph icon={icon} size={18} color={colors.primaryMist} />
      <Text variant="caption" color={colors.primaryMist} style={styles.infoLabel}>
        {label}
      </Text>
      <Text variant="bodyStrong" color={colors.onPrimary} style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

export function AppointmentDetailsScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'AppointmentDetails'>>();
  const appointment = useAppointmentStore((s) => s.appointments.find((a) => a.id === params.id));
  const considerations = useConsiderationStore((s) => s.considerations);
  const toggleComplete = useConsiderationStore((s) => s.toggleComplete);
  const childId = appointment?.childId;
  const items = useMemo(() => considerations.filter((c) => c.childId === childId), [considerations, childId]);

  return (
    <FormPage
      eyebrow="Detalhes da consulta"
      title={appointment?.specialty ?? 'Consulta não encontrada'}
      onBack={() => navigation.goBack()}
      footer={
        <>
          <Button label="Concluir" onPress={() => navigation.goBack()} style={styles.grow} />
          <Button
            label="Ver evolução"
            variant="secondary"
            onPress={() => navigation.navigate('Tabs', { screen: 'Evolution' })}
            style={styles.grow}
          />
        </>
      }
    >
      {appointment ? (
        <>
          <View style={styles.ticket}>
            <InfoRow icon={CalendarDotsIcon} label="Data" value={formatDate(appointment.date)} />
            <InfoRow icon={ClockIcon} label="Horário" value={appointment.time} />
            <DashedDivider color={colors.primarySoft} style={styles.perforation} />
            <InfoRow icon={UserIcon} label="Profissional" value={appointment.professional || 'Não informado'} />
            <InfoRow icon={MapPinIcon} label="Local" value={appointment.location || 'Não informado'} />
            <InfoRow icon={NotePencilIcon} label="Obs" value={appointment.notes || 'Nenhuma'} />
          </View>

          <ConsiderationList
            title="Considerações para discutir"
            items={items}
            onToggle={toggleComplete}
            onAdd={() => navigation.navigate('ConsiderationForm')}
          />
        </>
      ) : null}
    </FormPage>
  );
}

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
  ticket: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: space.lg,
    gap: space.sm,
  },
  perforation: {
    marginVertical: space.xxs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  infoLabel: {
    width: 84,
  },
  infoValue: {
    flex: 1,
  },
});

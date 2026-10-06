import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Chip, DateField, FormPage, Input, SuccessOverlay, Text, TimeField } from '@/shared/ui';
import { space } from '@/shared/theme';
import { brDateToIso, isoDateToBr, isValidDateString, isValidTimeString } from '@/shared/lib/formatters';
import { useActiveChildId } from '@/features/child/hooks/useActiveChild';
import type { RootStackParamList } from '@/app/navigation/types';
import { useAppointmentStore } from '../store/appointmentStore';
import type { AppointmentDraft } from '../types';

const emptyDraft: AppointmentDraft = { specialty: '', date: '', time: '', professional: '', location: '', notes: '' };

const specialties = ['Pediatria', 'Urologia', 'Nefrologia', 'Fisioterapia', 'Psicologia'];

const toForm = (initial?: AppointmentDraft): AppointmentDraft =>
  initial ? { ...initial, date: isoDateToBr(initial.date) } : emptyDraft;

const validate = (draft: AppointmentDraft) => {
  if (!draft.specialty.trim() || !draft.date.trim() || !draft.time.trim())
    return 'Por favor, preencha a especialidade, data e horário.';
  if (!isValidDateString(draft.date)) return 'A data da consulta informada não é válida (DD/MM/AAAA).';
  if (!isValidTimeString(draft.time)) return 'O horário informado não é válido (HH:MM).';
  return null;
};

export function AppointmentFormScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'AppointmentForm'>>();
  const childId = useActiveChildId();
  const addAppointment = useAppointmentStore((s) => s.addAppointment);
  const [draft, setDraft] = useState(() => toForm(params?.draft));
  const [success, setSuccess] = useState(false);

  const set = (key: keyof AppointmentDraft) => (value: string) => setDraft((d) => ({ ...d, [key]: value }));

  const save = () => {
    const error = validate(draft);
    if (error) {
      Alert.alert('Atenção', error);
      return;
    }
    const result = { ...draft, date: brDateToIso(draft.date) };
    if (params?.returnTo === 'Onboarding') {
      navigation.popTo('Onboarding', { appointment: result });
      return;
    }
    if (!childId) {
      Alert.alert('Erro', 'Selecione uma criança primeiro.');
      return;
    }
    addAppointment({ childId, ...result });
    setSuccess(true);
  };

  return (
    <FormPage
      eyebrow="Agenda"
      title="Nova consulta"
      onBack={() => navigation.goBack()}
      footer={
        <>
          <Button label="Cancelar" variant="secondary" onPress={() => navigation.goBack()} style={styles.grow} />
          <Button label="Salvar consulta" onPress={save} style={styles.grow} />
        </>
      }
      overlay={
        <SuccessOverlay
          visible={success}
          onAnimationEnd={() => {
            setSuccess(false);
            navigation.goBack();
          }}
        />
      }
    >
      <Input label="Especialidade" placeholder="Pediatria" value={draft.specialty} onChangeText={set('specialty')} />
      <View style={styles.suggestions}>
        <Text variant="caption">Sugestões</Text>
        <View style={styles.chips}>
          {specialties.map((name) => (
            <Chip key={name} label={name} active={draft.specialty === name} onPress={() => set('specialty')(name)} />
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <DateField label="Data" value={draft.date} onChange={set('date')} style={styles.grow} />
        <TimeField label="Horário" value={draft.time} onChange={set('time')} style={styles.grow} />
      </View>

      <Input label="Profissional" placeholder="Nome do médico(a)" value={draft.professional} onChangeText={set('professional')} />
      <Input label="Local" placeholder="Clínica, hospital..." value={draft.location} onChangeText={set('location')} />
      <Input label="Observação" placeholder="Motivo da consulta" value={draft.notes} onChangeText={set('notes')} />
    </FormPage>
  );
}

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: space.sm,
  },
  suggestions: {
    gap: space.xs,
    marginTop: -space.xxs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});

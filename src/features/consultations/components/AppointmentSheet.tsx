import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { CheckIcon } from '@/shared/icons';
import { Button, Chip, DateField, Input, Sheet, Text, TimeField } from '@/shared/ui';
import { space } from '@/shared/theme';
import { fadeOut, layout, tickIn } from '@/shared/motion';
import { brDateToIso, isoDateToBr, isValidDateString, isValidTimeString } from '@/shared/lib/formatters';
import type { AppointmentDraft } from '../types';

export type AppointmentSheetProps = {
  visible: boolean;
  initial?: AppointmentDraft | null;
  onClose: () => void;
  onClosed?: () => void;
  onSubmit: (draft: AppointmentDraft) => void;
};

const emptyDraft: AppointmentDraft = { specialty: '', date: '', time: '', professional: '', location: '', notes: '' };

const specialties = ['Pediatria', 'Urologia', 'Nefrologia', 'Fisioterapia', 'Psicologia'];

const toForm = (initial?: AppointmentDraft | null): AppointmentDraft =>
  initial ? { ...initial, date: isoDateToBr(initial.date) } : emptyDraft;

const validate = (draft: AppointmentDraft) => {
  if (!draft.specialty.trim() || !draft.date.trim() || !draft.time.trim())
    return 'Por favor, preencha a especialidade, data e horário.';
  if (!isValidDateString(draft.date)) return 'A data da consulta informada não é válida (DD/MM/AAAA).';
  if (!isValidTimeString(draft.time)) return 'O horário informado não é válido (HH:MM).';
  return null;
};

export function AppointmentSheet({ visible, initial, onClose, onClosed, onSubmit }: AppointmentSheetProps) {
  const [draft, setDraft] = useState(() => toForm(initial));
  const [custom, setCustom] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const form = toForm(initial);
    setDraft(form);
    setCustom(!!form.specialty && !specialties.includes(form.specialty));
  }, [visible]);

  const set = (key: keyof AppointmentDraft) => (value: string) => setDraft((d) => ({ ...d, [key]: value }));

  const pickSpecialty = (name: string) => {
    setCustom(false);
    set('specialty')(name);
  };

  const pickCustom = () => {
    setCustom(true);
    set('specialty')('');
  };

  const save = () => {
    const error = validate(draft);
    if (error) {
      Alert.alert('Atenção', error);
      return;
    }
    onSubmit({ ...draft, date: brDateToIso(draft.date) });
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      onClosed={onClosed}
      eyebrow="Agenda"
      title={initial ? 'Editar consulta' : 'Nova consulta'}
      footer={<Button label="Salvar consulta" icon={CheckIcon} onPress={save} style={styles.grow} />}
    >
      <Animated.View layout={layout} style={styles.specialty}>
        <Text variant="label">Especialidade</Text>
        <View style={styles.chips}>
          {specialties.map((name) => (
            <Chip key={name} label={name} active={!custom && draft.specialty === name} onPress={() => pickSpecialty(name)} />
          ))}
          <Chip label="Outra" active={custom} onPress={pickCustom} />
        </View>
        {custom ? (
          <Animated.View entering={tickIn} exiting={fadeOut}>
            <Input
              placeholder="Qual especialidade?"
              value={draft.specialty}
              onChangeText={set('specialty')}
              autoFocus={!draft.specialty}
            />
          </Animated.View>
        ) : null}
      </Animated.View>

      <Animated.View layout={layout} style={styles.row}>
        <DateField label="Data" value={draft.date} onChange={set('date')} style={styles.grow} />
        <TimeField label="Horário" value={draft.time} onChange={set('time')} style={styles.grow} />
      </Animated.View>

      <Animated.View layout={layout} style={styles.row}>
        <Input
          label="Profissional"
          placeholder="Dr(a)."
          value={draft.professional}
          onChangeText={set('professional')}
          style={styles.grow}
        />
        <Input
          label="Local"
          placeholder="Clínica"
          value={draft.location}
          onChangeText={set('location')}
          style={styles.grow}
        />
      </Animated.View>

      <Animated.View layout={layout}>
        <Input label="Observação" placeholder="Motivo da consulta" value={draft.notes} onChangeText={set('notes')} />
      </Animated.View>
    </Sheet>
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
  specialty: {
    gap: space.xs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});

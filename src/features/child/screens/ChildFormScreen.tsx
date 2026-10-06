import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, DateField, FormPage, Input, SuccessOverlay } from '@/shared/ui';
import { brDateToIso, isValidDateString } from '@/shared/lib/formatters';
import { useAppointmentStore } from '@/features/consultations/store/appointmentStore';
import { useChildStore } from '../store/childStore';

const validate = (name: string, birthDate: string, nextAppointment: string) => {
  if (!name.trim()) return 'O nome da criança é obrigatório.';
  if (birthDate.trim() && !isValidDateString(birthDate)) return 'A data de nascimento informada não é válida (DD/MM/AAAA).';
  if (nextAppointment.trim() && !isValidDateString(nextAppointment))
    return 'A data da próxima consulta informada não é válida (DD/MM/AAAA).';
  return null;
};

export function ChildFormScreen() {
  const navigation = useNavigation();
  const addChild = useChildStore((s) => s.addChild);
  const addAppointment = useAppointmentStore((s) => s.addAppointment);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [goal, setGoal] = useState('');
  const [nextAppointment, setNextAppointment] = useState('');
  const [success, setSuccess] = useState(false);

  const save = () => {
    const error = validate(name, birthDate, nextAppointment);
    if (error) {
      Alert.alert('Atenção', error);
      return;
    }
    const child = addChild({ name, birthDate, goal });
    if (nextAppointment.trim()) {
      addAppointment({
        childId: child.id,
        date: brDateToIso(nextAppointment),
        time: '08:00',
        specialty: 'Acompanhamento',
        professional: '',
        location: '',
        notes: 'Agendado no cadastro',
      });
    }
    setSuccess(true);
  };

  return (
    <FormPage
      eyebrow="Nova criança"
      title="Cadastrar nova criança"
      onBack={() => navigation.goBack()}
      footer={<Button label="Cadastrar" onPress={save} style={styles.grow} />}
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
      <Input label="Nome ou apelido *" placeholder="Ex: Ana, Pedrinho..." value={name} onChangeText={setName} autoFocus />
      <DateField label="Data de nascimento" value={birthDate} onChange={setBirthDate} untilToday />
      <Input
        label="Objetivo atual do acompanhamento"
        placeholder="Ex: Reduzir escapes na escola..."
        value={goal}
        onChangeText={setGoal}
        multiline
        numberOfLines={3}
        minHeight={100}
      />
      <DateField label="Data da próxima consulta" value={nextAppointment} onChange={setNextAppointment} />
    </FormPage>
  );
}

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
});

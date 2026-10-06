import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, FormPage, Input, SuccessOverlay } from '@/shared/ui';
import { useActiveChildId } from '@/features/child/hooks/useActiveChild';
import { useConsiderationStore } from '../store/considerationStore';

export function ConsiderationFormScreen() {
  const navigation = useNavigation();
  const childId = useActiveChildId();
  const addConsideration = useConsiderationStore((s) => s.addConsideration);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const save = () => {
    if (!childId) {
      Alert.alert('Erro', 'Selecione uma criança primeiro.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Atenção', 'Preencha o assunto da consideração.');
      return;
    }
    addConsideration({ childId, title: title.trim(), description: description.trim() });
    setSuccess(true);
  };

  return (
    <FormPage
      eyebrow="Para a consulta"
      title="Lembrar de falar sobre..."
      onBack={() => navigation.goBack()}
      footer={<Button label="Salvar consideração" onPress={save} style={styles.grow} />}
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
      <Input label="Assunto (curto)" placeholder="Ex: Escape durante a noite" value={title} onChangeText={setTitle} autoFocus />
      <Input
        label="Detalhes"
        optional
        placeholder="Adicione mais detalhes se precisar..."
        value={description}
        onChangeText={setDescription}
        multiline
        minHeight={120}
      />
    </FormPage>
  );
}

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
});

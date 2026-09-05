import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useChildStore } from '../store/childStore';
import { useAppointmentStore } from '../../consultations/store/consultationsStore';
import { colors, metrics } from '../../../shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDateInput, isValidDateString } from '../../../shared/utils/formatters';
import { SuccessModal } from '../../../shared/ui/SuccessModal';
import { Input } from '../../../shared/ui/Input';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function AddChildModal({ visible, onClose }: Props) {
  const { addChild } = useChildStore();
  const { addAppointment } = useAppointmentStore();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [goal, setGoal] = useState('');
  const [nextAppointment, setNextAppointment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'O nome da criança é obrigatório.');
      return;
    }

    if (birthDate.trim() && !isValidDateString(birthDate)) {
      Alert.alert('Atenção', 'A data de nascimento informada não é válida (DD/MM/AAAA).');
      return;
    }

    if (nextAppointment.trim() && !isValidDateString(nextAppointment)) {
      Alert.alert('Atenção', 'A data da próxima consulta informada não é válida (DD/MM/AAAA).');
      return;
    }

    // Add child
    const newChild = addChild({
      name,
      birthDate,
      goal,
      avatar: '👦', // default avatar
    });

    if (nextAppointment.trim()) {
      let formattedDate = nextAppointment.trim();
      if (formattedDate.includes('/')) {
        const parts = formattedDate.split('/');
        if (parts.length === 3) {
          formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      addAppointment({
        childId: newChild.id,
        date: formattedDate, 
        time: '08:00', 
        specialty: 'Acompanhamento',
        professional: '',
        location: '',
        notes: 'Agendado no cadastro',
      });
    }

    // Reset and close
    setName('');
    setBirthDate('');
    setGoal('');
    setNextAppointment('');
    setShowSuccess(true);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Cadastrar nova criança</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome ou apelido *</Text>
              <Input
                placeholder="Ex: Ana, Pedrinho..."
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de nascimento</Text>
              <Input
                placeholder="dd/mm/aaaa"
                value={birthDate}
                onChangeText={(text) => setBirthDate(formatDateInput(text))}
                keyboardType="numeric"
                maxLength={10}
                rightIcon={<Ionicons name="calendar-outline" size={20} color={colors.textDark} />}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Objetivo atual do acompanhamento</Text>
              <Input
                style={styles.textArea}
                placeholder="Ex: Reduzir escapes na escola..."
                value={goal}
                onChangeText={setGoal}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data da próxima consulta</Text>
              <Input
                placeholder="dd/mm/aaaa"
                value={nextAppointment}
                onChangeText={(text) => setNextAppointment(formatDateInput(text))}
                keyboardType="numeric"
                maxLength={10}
                rightIcon={<Ionicons name="calendar-outline" size={20} color={colors.textDark} />}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>Cadastrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <SuccessModal 
        visible={showSuccess} 
        onAnimationEnd={() => {
          setShowSuccess(false);
          onClose();
        }} 
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B', // Slate gray
    marginBottom: 8,
  },
  textArea: {
    height: 100,
  },
  primaryButton: {
    backgroundColor: '#00696E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

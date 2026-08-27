import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useChildStore } from '../store/childStore';
import { useAppointmentStore } from '../../consultations/store/consultationsStore';
import { colors, metrics } from '../../../shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDateInput, isValidDateString } from '../../../shared/utils/formatters';

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
    onClose();
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
              <TextInput
                style={styles.input}
                placeholder="Ex: Ana, Pedrinho..."
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de nascimento</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputIcon}
                  placeholder="dd/mm/aaaa"
                  value={birthDate}
                  onChangeText={(text) => setBirthDate(formatDateInput(text))}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Ionicons name="calendar-outline" size={20} color={colors.textDark} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Objetivo atual do acompanhamento</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ex: Reduzir escapes na escola..."
                value={goal}
                onChangeText={setGoal}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data da próxima consulta</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputIcon}
                  placeholder="dd/mm/aaaa"
                  value={nextAppointment}
                  onChangeText={(text) => setNextAppointment(formatDateInput(text))}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Ionicons name="calendar-outline" size={20} color={colors.textDark} />
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Text style={styles.primaryButtonText}>Cadastrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textDark,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textDark,
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

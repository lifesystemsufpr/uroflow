import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { formatDateInput, isValidDateString, formatTimeInput, isValidTimeString } from '../../../shared/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../../shared/ui/Input';

export interface AppointmentData {
  specialty: string;
  date: string;
  time: string;
  professional: string;
  location: string;
  notes: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: AppointmentData) => void;
  initialData?: Partial<AppointmentData>;
}

export function NewAppointmentModal({ visible, onClose, onSave, initialData }: Props) {
  const insets = useSafeAreaInsets();
  
  const [specialty, setSpecialty] = useState(initialData?.specialty || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [professional, setProfessional] = useState(initialData?.professional || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Update states if modal becomes visible and we want to reset or use initialData
  // But for simplicity, we let the parent unmount or we just rely on the states.
  
  const handleSave = () => {
    if (!specialty.trim() || !date.trim() || !time.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha a especialidade, data e horário.');
      return;
    }

    if (!isValidDateString(date)) {
      Alert.alert('Atenção', 'A data da consulta informada não é válida (DD/MM/AAAA).');
      return;
    }

    if (!isValidTimeString(time)) {
      Alert.alert('Atenção', 'O horário informado não é válido (HH:MM).');
      return;
    }

    let formattedDate = date.trim();
    if (formattedDate.includes('/')) {
      const parts = formattedDate.split('/');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    onSave({
      specialty,
      date: formattedDate,
      time,
      professional,
      location,
      notes
    });

    // Reset local state
    setSpecialty('');
    setDate('');
    setTime('');
    setProfessional('');
    setLocation('');
    setNotes('');
  };

  const handleClose = () => {
    // Reset on close as well
    setSpecialty('');
    setDate('');
    setTime('');
    setProfessional('');
    setLocation('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nova consulta</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Especialidade</Text>
              <Input
                placeholder="Pediatria"
                value={specialty}
                onChangeText={setSpecialty}
                rightIcon={<Ionicons name="chevron-down" size={20} color={colors.textLight} />}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>Data</Text>
                <Input
                  placeholder="dd/mm/aaaa"
                  value={date}
                  onChangeText={(text) => setDate(formatDateInput(text))}
                  keyboardType="numeric"
                  maxLength={10}
                  rightIcon={<Ionicons name="calendar-outline" size={20} color={colors.textDark} />}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Horário</Text>
                <Input
                  placeholder="--:--"
                  value={time}
                  onChangeText={(text) => setTime(formatTimeInput(text))}
                  keyboardType="numeric"
                  maxLength={5}
                  rightIcon={<Ionicons name="time-outline" size={20} color={colors.textDark} />}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profissional</Text>
              <Input
                placeholder="Nome do médico(a)"
                value={professional}
                onChangeText={setProfessional}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Local</Text>
              <Input
                placeholder="Clínica, hospital..."
                value={location}
                onChangeText={setLocation}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observação</Text>
              <Input
                placeholder="Motivo da consulta"
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelBtn} 
                onPress={handleClose}
              >
                <Text style={styles.modalCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSaveBtn}
                onPress={handleSave}
              >
                <Text style={styles.modalSaveBtnText}>Salvar consulta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const tealDark = '#00696E';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B', // Slate gray
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  modalCancelBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: tealDark,
  },
  modalSaveBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  }
});

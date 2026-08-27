import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Screen } from '../../../shared/ui/Screen';
import { useChildStore } from '../../child';
import { useAppointmentStore, useConsiderationStore } from '../store/consultationsStore';
import { colors, metrics } from '../../../shared/theme/colors';
import { formatDateInput, isValidDateString, formatTimeInput, isValidTimeString } from '../../../shared/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../../shared/utils/date';
import { Appointment } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tealDark = '#00696E';
const tealLight = '#E6F4F1';

export function ConsultationsScreen() {
  const insets = useSafeAreaInsets();
  const { children, activeChildId } = useChildStore();
  const activeChild = children.find(c => c.id === activeChildId);
  
  const { appointments, addAppointment } = useAppointmentStore();
  const { considerations, toggleComplete, addConsideration } = useConsiderationStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [professional, setProfessional] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Consideration Modal state
  const [consModalVisible, setConsModalVisible] = useState(false);
  const [consTitle, setConsTitle] = useState('');
  const [consDesc, setConsDesc] = useState('');

  const now = new Date();
  
  // Sort future appointments so the soonest is first
  const futureAppts = appointments
    .filter(a => new Date(`${a.date}T${a.time}`) >= now)
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  
  const pastAppts = appointments
    .filter(a => new Date(`${a.date}T${a.time}`) < now)
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
    
  const activeConsiderations = considerations.filter(c => !c.completed);

  const nextAppt = futureAppts.length > 0 ? futureAppts[0] : null;
  const otherFutureAppts = futureAppts.length > 1 ? futureAppts.slice(1) : [];

  const handleSave = () => {
    if (!activeChildId) {
      Alert.alert('Erro', 'Selecione uma criança primeiro.');
      return;
    }
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

    addAppointment({
      childId: activeChildId,
      specialty,
      date: formattedDate,
      time,
      professional,
      location,
      notes
    });

    setModalVisible(false);
    setSpecialty('');
    setDate('');
    setTime('');
    setProfessional('');
    setLocation('');
    setNotes('');
  };

  const handleSaveConsideration = () => {
    if (!activeChildId) {
      Alert.alert('Erro', 'Selecione uma criança primeiro.');
      return;
    }
    if (!consTitle.trim()) {
      Alert.alert('Atenção', 'Preencha o assunto da consideração.');
      return;
    }
    addConsideration({
      childId: activeChildId,
      title: consTitle.trim(),
      description: consDesc.trim()
    });
    setConsModalVisible(false);
    setConsTitle('');
    setConsDesc('');
  };

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.childSelector}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>{activeChild?.avatar || '👦'}</Text>
          </View>
          <Text style={styles.childName}>{activeChild?.name || 'Selecione'} ▼</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Próxima Consulta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRÓXIMA CONSULTA</Text>
          {nextAppt ? (
            <AppointmentCard appointment={nextAppt} />
          ) : (
            <View style={styles.card}>
              <Text style={styles.emptyText}>Nenhuma consulta marcada.</Text>
            </View>
          )}
        </View>

        {/* Outras Consultas */}
        {otherFutureAppts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OUTRAS CONSULTAS FUTURAS</Text>
            {otherFutureAppts.map(appt => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.primaryButtonText}>+ Adicionar consulta</Text>
        </TouchableOpacity>

        {/* Considerações Box */}
        <View style={styles.considerationBox}>
          <View style={styles.considerationHeader}>
            <Text style={styles.considerationTitleEmoji}>💭</Text>
            <Text style={styles.considerationTitleText}>Quero conversar na próxima consulta</Text>
          </View>
          
          {activeConsiderations.length > 0 ? (
            activeConsiderations.map((cons, index) => (
              <View key={cons.id}>
                <TouchableOpacity 
                  style={styles.considerationItem}
                  onPress={() => toggleComplete(cons.id)}
                >
                  <View style={styles.checkbox} />
                  <Text style={styles.considerationItemText}>{cons.title}</Text>
                </TouchableOpacity>
                {index < activeConsiderations.length - 1 && <View style={styles.considerationDivider} />}
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { marginBottom: 16 }]}>Nenhum tópico adicionado.</Text>
          )}
          
          <TouchableOpacity style={styles.outlineButton} onPress={() => setConsModalVisible(true)}>
            <Text style={styles.outlineButtonText}>+ Adicionar consideração</Text>
          </TouchableOpacity>
        </View>

        {/* Histórico */}
        {pastAppts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONSULTAS ANTERIORES</Text>
            {pastAppts.map(appt => <AppointmentCard key={appt.id} appointment={appt} isPast />)}
          </View>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal Appointment */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova consulta</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Especialidade</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Pediatria"
                    value={specialty}
                    onChangeText={setSpecialty}
                  />
                  <Ionicons name="chevron-down" size={20} color={colors.textLight} />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.label}>Data</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="dd/mm/aaaa"
                      value={date}
                      onChangeText={(text) => setDate(formatDateInput(text))}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                    <Ionicons name="calendar-outline" size={20} color={colors.textDark} />
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Horário</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="--:--"
                      value={time}
                      onChangeText={(text) => setTime(formatTimeInput(text))}
                      keyboardType="numeric"
                      maxLength={5}
                    />
                    <Ionicons name="time-outline" size={20} color={colors.textDark} />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Profissional</Text>
                <TextInput
                  style={[styles.input, styles.inputSolo]}
                  placeholder="Nome do médico(a)"
                  value={professional}
                  onChangeText={setProfessional}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Local</Text>
                <TextInput
                  style={[styles.input, styles.inputSolo]}
                  placeholder="Clínica, hospital..."
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Observação</Text>
                <TextInput
                  style={[styles.input, styles.inputSolo]}
                  placeholder="Motivo da consulta"
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalCancelBtn} 
                  onPress={() => setModalVisible(false)}
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

      {/* Consideration Modal */}
      <Modal
        visible={consModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setConsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lembrar de falar sobre...</Text>
              <TouchableOpacity onPress={() => setConsModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Assunto (Curto)</Text>
                <TextInput
                  style={[styles.input, styles.inputSolo]}
                  placeholder="Ex: Escape durante a noite"
                  value={consTitle}
                  onChangeText={setConsTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Detalhes (Opcional)</Text>
                <TextInput
                  style={[styles.input, styles.inputSolo, { height: 100, textAlignVertical: 'top' }]}
                  placeholder="Adicione mais detalhes se precisar..."
                  value={consDesc}
                  onChangeText={setConsDesc}
                  multiline
                />
              </View>

              <View style={[styles.modalActions, { marginTop: 16 }]}>
                <TouchableOpacity 
                  style={styles.modalSaveBtn}
                  onPress={handleSaveConsideration}
                >
                  <Text style={styles.modalSaveBtnText}>Salvar consideração</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}

function AppointmentCard({ appointment, isPast = false }: { appointment: Appointment, isPast?: boolean }) {
  const icon = isPast ? '✓' : '🗓️';
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={[styles.dateBox, isPast && styles.dateBoxPast]}>
          <Text style={[styles.dateDay, isPast && styles.textMuted]}>{formatDate(appointment.date, 'dd')}</Text>
          <Text style={[styles.dateMonth, isPast && styles.textMuted]}>{formatDate(appointment.date, 'MMM').toUpperCase()}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.specialty, isPast && styles.textMuted]}>{icon} {appointment.specialty}</Text>
          <Text style={styles.professional}>{appointment.time} - {appointment.professional}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: metrics.paddingLg,
    paddingBottom: metrics.paddingMd,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    backgroundColor: '#FFF1E5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 18,
  },
  childName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  content: {
    padding: metrics.paddingLg,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBox: {
    backgroundColor: tealLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 16,
  },
  dateBoxPast: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: tealDark,
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: tealDark,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  specialty: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  professional: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  textMuted: {
    color: colors.textSecondary,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: tealDark,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  considerationBox: {
    backgroundColor: tealLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: tealDark,
    borderStyle: 'dashed',
    marginBottom: 32,
  },
  considerationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  considerationTitleEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  considerationTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: tealDark,
  },
  considerationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: tealDark,
    marginRight: 12,
  },
  considerationItemText: {
    fontSize: 14,
    color: tealDark,
    fontWeight: '500',
  },
  considerationDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 105, 110, 0.1)',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tealDark,
    marginTop: 12,
  },
  outlineButtonText: {
    color: tealDark,
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Modal Styles
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textDark,
  },
  inputSolo: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
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

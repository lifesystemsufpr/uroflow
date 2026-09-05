import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useConsiderationStore } from '../store/consultationsStore';
import { formatDate } from '../../../shared/utils/date';

interface Props {
  visible: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onAddConsideration: () => void;
}

export function AppointmentDetailsModal({ visible, onClose, appointment, onAddConsideration }: Props) {
  const insets = useSafeAreaInsets();
  const { considerations, toggleComplete } = useConsiderationStore();

  if (!appointment) return null;

  const childConsiderations = considerations.filter(c => c.childId === appointment.childId);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes da consulta</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Appointment Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardEmoji}>🗓️</Text>
                <Text style={styles.infoCardTitle}>{appointment.specialty}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data:</Text>
                <Text style={styles.infoValue}>{formatDate(appointment.date)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Horário:</Text>
                <Text style={styles.infoValue}>{appointment.time}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Profissional:</Text>
                <Text style={styles.infoValue}>{appointment.professional || 'Não informado'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Local:</Text>
                <Text style={styles.infoValue}>{appointment.location || 'Não informado'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Obs:</Text>
                <Text style={styles.infoValue}>{appointment.notes || 'Nenhuma'}</Text>
              </View>
            </View>

            {/* Considerações Box */}
            <View style={styles.considerationBox}>
              <Text style={styles.considerationTitleText}>Considerações para discutir</Text>
              
              {childConsiderations.length > 0 ? (
                childConsiderations.map((cons, index) => (
                  <View key={cons.id}>
                    <TouchableOpacity 
                      style={styles.considerationItem}
                      onPress={() => toggleComplete(cons.id)}
                    >
                      <View style={[styles.checkbox, cons.completed && styles.checkboxChecked]}>
                        {cons.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                      </View>
                      <Text style={[styles.considerationItemText, cons.completed && styles.considerationItemTextCompleted]}>
                        {cons.title}
                      </Text>
                    </TouchableOpacity>
                    {index < childConsiderations.length - 1 && <View style={styles.considerationDivider} />}
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyText, { marginBottom: 16 }]}>Nenhum tópico adicionado.</Text>
              )}
              
              <TouchableOpacity style={styles.outlineButton} onPress={onAddConsideration}>
                <Text style={styles.outlineButtonText}>+ Adicionar consideração</Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.primaryBtn} onPress={onClose}>
                <Text style={styles.primaryBtnText}>Concluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => {}}>
                <Text style={styles.secondaryBtnText}>Ver evolução</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const tealDark = '#00696E';
const tealLight = '#E6F4F1';

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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoCardEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: colors.textDark,
    marginRight: 4,
    fontSize: 15,
  },
  infoValue: {
    color: colors.textSecondary,
    fontSize: 15,
    flex: 1,
  },
  considerationBox: {
    backgroundColor: tealLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: tealDark,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  considerationTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: tealDark,
    marginBottom: 16,
  },
  considerationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: tealDark,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: tealDark,
  },
  considerationItemText: {
    fontSize: 16,
    color: tealDark,
    fontWeight: '500',
  },
  considerationItemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#8A9D9E',
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
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: tealDark,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

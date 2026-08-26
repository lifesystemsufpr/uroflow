import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '../../../shared/ui/Screen';
import { useChildStore } from '../../child';
import { useAppointmentStore, useConsiderationStore } from '../store/consultationsStore';
import { colors, metrics } from '../../../shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../../shared/utils/date';
import { Appointment, Consideration } from '../types';

export function ConsultationsScreen() {
  const { children, activeChildId } = useChildStore();
  const activeChild = children.find(c => c.id === activeChildId);
  
  const { appointments } = useAppointmentStore();
  const { considerations, toggleComplete } = useConsiderationStore();

  const now = new Date();
  
  const futureAppts = appointments.filter(a => new Date(`${a.date}T${a.time}`) >= now);
  const pastAppts = appointments.filter(a => new Date(`${a.date}T${a.time}`) < now);
  const activeConsiderations = considerations.filter(c => !c.completed);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.childSelector}>
          <Text style={styles.avatar}>{activeChild?.avatar || '👦'}</Text>
          <Text style={styles.childName}>{activeChild?.name || 'Selecione'} ▼</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Próximas Consultas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próxima consulta</Text>
          {futureAppts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Nenhuma consulta marcada.</Text>
            </View>
          ) : (
            futureAppts.map(appt => <AppointmentCard key={appt.id} appointment={appt} isNext />)
          )}
        </View>

        {/* Considerações */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>💬 Quero conversar sobre...</Text>
            <TouchableOpacity>
              <Text style={styles.addText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
          
          {activeConsiderations.length === 0 ? (
            <Text style={styles.emptyText}>Você não tem tópicos pendentes para a próxima consulta.</Text>
          ) : (
            activeConsiderations.map(cons => (
              <TouchableOpacity 
                key={cons.id} 
                style={styles.considerationItem}
                onPress={() => toggleComplete(cons.id)}
              >
                <Ionicons name="square-outline" size={24} color={colors.textLight} />
                <View style={styles.considerationContent}>
                  <Text style={styles.considerationTitle}>{cons.title}</Text>
                  {cons.description && <Text style={styles.considerationDesc}>{cons.description}</Text>}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Histórico */}
        {pastAppts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico</Text>
            {pastAppts.map(appt => <AppointmentCard key={appt.id} appointment={appt} isPast />)}
          </View>
        )}
        
      </ScrollView>
    </Screen>
  );
}

function AppointmentCard({ appointment, isNext = false, isPast = false }: { appointment: Appointment, isNext?: boolean, isPast?: boolean }) {
  return (
    <View style={[styles.card, isNext && styles.cardNext, isPast && styles.cardPast]}>
      <View style={styles.cardRow}>
        <View style={styles.dateBox}>
          <Text style={[styles.dateDay, isPast && styles.textMuted]}>{formatDate(appointment.date, 'dd')}</Text>
          <Text style={[styles.dateMonth, isPast && styles.textMuted]}>{formatDate(appointment.date, 'MMM').toUpperCase()}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.specialty, isPast && styles.textMuted]}>{appointment.specialty}</Text>
          <Text style={styles.professional}>{appointment.professional}</Text>
          <View style={styles.cardDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{appointment.time}</Text>
            </View>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: metrics.paddingLg,
    paddingTop: metrics.paddingSm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.paddingMd,
    paddingVertical: metrics.paddingSm,
    borderRadius: metrics.radiusXl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    fontSize: 20,
    marginRight: metrics.paddingSm,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  addButton: {
    padding: metrics.paddingSm,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
  },
  content: {
    padding: metrics.paddingLg,
  },
  section: {
    marginBottom: metrics.paddingLg + 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.paddingMd,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: metrics.paddingMd,
  },
  addText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: colors.surface,
    padding: metrics.paddingLg,
    borderRadius: metrics.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    padding: metrics.paddingMd,
    borderRadius: metrics.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: metrics.paddingSm,
  },
  cardNext: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  cardPast: {
    opacity: 0.7,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBox: {
    backgroundColor: colors.background,
    padding: metrics.paddingSm,
    borderRadius: metrics.radiusSm,
    alignItems: 'center',
    width: 60,
    marginRight: metrics.paddingMd,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dateMonth: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  specialty: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  professional: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  textMuted: {
    color: colors.textSecondary,
  },
  considerationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    padding: metrics.paddingMd,
    borderRadius: metrics.radiusMd,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  considerationContent: {
    marginLeft: 12,
    flex: 1,
  },
  considerationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  considerationDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  }
});

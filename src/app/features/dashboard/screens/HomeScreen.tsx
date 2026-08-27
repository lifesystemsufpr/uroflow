import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Screen } from '../../../shared/ui/Screen';
import { useChildStore, ChildSelector } from '../../child';
import { useAppointmentStore } from '../../consultations/store/consultationsStore';
import { HomeSummary } from '../components/HomeSummary';
import { RecentEvents } from '../components/RecentEvents';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, metrics } from '../../../shared/theme/colors';

type ActionType = 'pee' | 'water' | 'poop' | 'night' | 'escape' | 'pain';

export function HomeScreen() {
  const { children, activeChildId } = useChildStore();
  const activeChild = children.find(c => c.id === activeChildId);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const navigation = useNavigation<any>();

  const appointments = useAppointmentStore((state) => state.appointments);

  const nextAppointment = useMemo(() => {
    if (!activeChildId) return null;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const tomorrowAppointments = appointments.filter(
      (a) => a.childId === activeChildId && a.date === tomorrowStr
    );
    
    if (tomorrowAppointments.length === 0) return null;
    
    tomorrowAppointments.sort((a, b) => a.time.localeCompare(b.time));
    return tomorrowAppointments[0];
  }, [appointments, activeChildId]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.childSelector} onPress={() => setSelectorVisible(true)}>
            <Text style={styles.avatar}>{activeChild?.avatar || '👦'}</Text>
            <Text style={styles.childName}>{activeChild?.name || 'Selecione'} ▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.greeting}>Olá! 👋</Text>
          <Text style={styles.question}>Como foi o dia de {activeChild?.name || ''}?</Text>
          
          {nextAppointment && (
            <TouchableOpacity 
              style={styles.consultationAlert} 
              onPress={() => navigation.navigate('Consultations')}
            >
              <View style={styles.consultationContent}>
                <Text style={styles.consultationTitle}>CONSULTA AMANHÃ</Text>
                <Text style={styles.consultationText}>
                  {nextAppointment.specialty} às {nextAppointment.time}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.primaryDark} />
            </TouchableOpacity>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hoje</Text>
            <HomeSummary />
          </View>

          <Text style={styles.sectionTitle}>O que aconteceu?</Text>
          <View style={styles.actionGrid}>
            <ActionButton type="water" icon="💧" label="Líquidos" bgColor={colors.waterBackground} onPress={() => navigation.navigate('Wizard', { type: 'water' })} />
            <ActionButton type="pee" icon="〰️" label="Xixi" bgColor={colors.peeBackground} onPress={() => navigation.navigate('Wizard', { type: 'pee' })} />
            <ActionButton type="poop" icon="💩" label="Cocô" bgColor={colors.poopBackground} onPress={() => navigation.navigate('Wizard', { type: 'poop' })} />
            <ActionButton type="night" icon="🌙" label="Noite" bgColor={colors.nightBackground} onPress={() => navigation.navigate('Wizard', { type: 'night' })} />
            <ActionButton type="escape" icon="⚠️" label="Escape" bgColor={colors.escapeBackground} onPress={() => navigation.navigate('Wizard', { type: 'escape' })} />
            <ActionButton type="pain" icon="😣" label="Desconforto" bgColor={colors.painBackground} onPress={() => navigation.navigate('Wizard', { type: 'pain' })} />
          </View>
          
          <RecentEvents />
        </View>
      </ScrollView>

      <ChildSelector 
        visible={selectorVisible} 
        onClose={() => setSelectorVisible(false)} 
        onAddChild={() => console.log('Navigate to add child')} 
      />
    </Screen>
  );
}

function ActionButton({ icon, label, bgColor, onPress }: { type: ActionType, icon: string, label: string, bgColor: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: metrics.paddingLg,
    paddingTop: 32,
    flexDirection: 'row',
  },
  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.paddingSm,
  },
  avatar: {
    fontSize: 24,
    marginRight: 8,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  content: {
    paddingHorizontal: metrics.paddingLg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  question: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  consultationAlert: {
    backgroundColor: colors.primaryLight,
    padding: metrics.paddingLg,
    borderRadius: metrics.radiusMd,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  consultationContent: {
    flex: 1,
  },
  consultationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  consultationText: {
    fontSize: 16,
    color: colors.primaryDark,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: metrics.paddingLg,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 32,
  },
  actionBtn: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  }
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEventStore, DiaryEvent } from '../../diary';
import { colors, metrics } from '../../../shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export function RecentEvents() {
  const { events } = useEventStore();
  const navigation = useNavigation<any>();
  
  // Pegar os 3 últimos eventos
  const recentEvents = events.slice(0, 3);

  if (recentEvents.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Nenhum registro recente.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Últimos Registros</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Diary')}>
          <Text style={styles.seeAllText}>Ver diário</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        {recentEvents.map((evt) => (
          <EventItem key={evt.id} event={evt} />
        ))}
      </View>
    </View>
  );
}

function EventItem({ event }: { event: DiaryEvent }) {
  const config = getEventConfig(event.type);
  
  return (
    <View style={styles.card}>
      <Text style={styles.time}>{event.time}</Text>
      <View style={[styles.iconWrapper, { backgroundColor: config.bgColor }]}>
        <Text style={{ fontSize: 16 }}>{config.icon}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.cardTitle}>{config.title}</Text>
        <Text style={styles.summary}>{getEventSummary(event)}</Text>
      </View>
    </View>
  );
}

function getEventConfig(type: string) {
  switch (type) {
    case 'pee': return { title: 'Xixi', color: colors.pee, bgColor: colors.peeBackground, icon: '〰️' };
    case 'water': return { title: 'Líquido', color: colors.water, bgColor: colors.waterBackground, icon: '💧' };
    case 'poop': return { title: 'Evacuação', color: colors.poop, bgColor: colors.poopBackground, icon: '💩' };
    case 'night': return { title: 'Noite', color: colors.night, bgColor: colors.nightBackground, icon: '🌙' };
    case 'escape': return { title: 'Escape', color: colors.escape, bgColor: colors.escapeBackground, icon: '⚠️' };
    case 'pain': return { title: 'Desconforto', color: colors.pain, bgColor: colors.painBackground, icon: '😣' };
    default: return { title: 'Registro', color: colors.primary, bgColor: '#E8EAF6', icon: '📝' };
  }
}

function getEventSummary(event: DiaryEvent) {
  if (!event.data) return '';
  const parts = [];
  if (event.data.q1) parts.push(event.data.q1);
  if (event.data.q2) parts.push(event.data.q2);
  return parts.join(', ');
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  empty: {
    padding: metrics.paddingLg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textLight,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 45,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 2,
  },
  summary: {
    fontSize: 12,
    color: colors.textSecondary,
  }
});

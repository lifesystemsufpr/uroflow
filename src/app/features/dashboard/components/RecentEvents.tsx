import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEventStore } from '../../../entities/event/model/store';
import { colors, metrics } from '../../../shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { DiaryEvent } from '../../../entities/event/model/types';

export function RecentEvents() {
  const { events } = useEventStore();
  
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
      <Text style={styles.title}>Últimos Registros</Text>
      {recentEvents.map((evt, index) => (
        <EventItem key={evt.id} event={evt} isLast={index === recentEvents.length - 1} />
      ))}
    </View>
  );
}

function EventItem({ event, isLast }: { event: DiaryEvent, isLast: boolean }) {
  const config = getEventConfig(event.type);
  
  return (
    <View style={styles.item}>
      <Text style={styles.time}>{event.time}</Text>
      <View style={styles.timeline}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.cardTitle}>{config.title}</Text>
        </View>
        <Text style={styles.summary}>{getEventSummary(event)}</Text>
      </View>
    </View>
  );
}

function getEventConfig(type: string) {
  switch (type) {
    case 'pee': return { title: 'Xixi', color: colors.pee };
    case 'water': return { title: 'Líquido', color: colors.water };
    case 'poop': return { title: 'Evacuação', color: colors.poop };
    case 'night': return { title: 'Noite', color: colors.night };
    case 'escape': return { title: 'Escape', color: colors.escape };
    case 'pain': return { title: 'Desconforto', color: colors.pain };
    default: return { title: 'Registro', color: colors.primary };
  }
}

function getEventSummary(event: DiaryEvent) {
  if (!event.data) return '';
  const parts = [];
  if (event.data.q1) parts.push(event.data.q1);
  if (event.data.q2) parts.push(event.data.q2);
  return parts.join(' • ');
}

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.paddingLg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: metrics.paddingMd,
  },
  empty: {
    padding: metrics.paddingLg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textLight,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  time: {
    width: 45,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: 'bold',
    marginTop: 12,
  },
  timeline: {
    width: 24,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 14,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: metrics.paddingMd,
    borderRadius: metrics.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: metrics.paddingMd,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  summary: {
    fontSize: 14,
    color: colors.textSecondary,
  }
});

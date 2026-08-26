import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DiaryEvent } from '../types';
import { colors } from '../../../shared/theme/colors';

export function TimelineList({ events }: { events: DiaryEvent[] }) {
  if (!events || events.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>Nenhum registro encontrado para este filtro.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {events.map((event, index) => (
        <View key={event.id} style={styles.eventItem}>
          <Text style={styles.time}>{event.time}</Text>
          <View style={styles.line}>
            <View style={[styles.dot, { backgroundColor: colors[event.type] || colors.primary }]} />
            {index !== events.length - 1 && <View style={styles.verticalLine} />}
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{event.type.toUpperCase()}</Text>
            {event.notes && <Text style={styles.notes}>{event.notes}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  time: {
    width: 50,
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  line: {
    width: 30,
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  }
});

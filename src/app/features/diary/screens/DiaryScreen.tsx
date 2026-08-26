import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useChildStore } from '../../child';
import { useEventStore } from '../store/eventStore';
import { colors, metrics } from '../../../shared/theme/colors';
import { DiaryEvent } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../shared/ui/Screen';

type FilterType = 'all' | 'pee' | 'water' | 'poop' | 'night' | 'escape' | 'pain';

export function DiaryScreen() {
  const { children, activeChildId } = useChildStore();
  const activeChild = children.find(c => c.id === activeChildId);
  const { events } = useEventStore();
  
  const [filter, setFilter] = useState<FilterType>('all');
  
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.childSelector}>
          <Text style={styles.avatar}>{activeChild?.avatar || '👦'}</Text>
          <Text style={styles.childName}>{activeChild?.name || 'Selecione'} ▼</Text>
        </View>
        <TouchableOpacity style={styles.dateSelector}>
          <Ionicons name="calendar-outline" size={20} color={colors.textDark} />
          <Text style={styles.dateText}>Hoje</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <FilterChip label="Todos" isActive={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="Xixi" isActive={filter === 'pee'} onPress={() => setFilter('pee')} />
          <FilterChip label="Água" isActive={filter === 'water'} onPress={() => setFilter('water')} />
          <FilterChip label="Cocô" isActive={filter === 'poop'} onPress={() => setFilter('poop')} />
          <FilterChip label="Escape" isActive={filter === 'escape'} onPress={() => setFilter('escape')} />
          <FilterChip label="Noite" isActive={filter === 'night'} onPress={() => setFilter('night')} />
          <FilterChip label="Dor" isActive={filter === 'pain'} onPress={() => setFilter('pain')} />
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.timeline}>
        {filteredEvents.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🤷</Text>
            <Text style={styles.emptyText}>Hoje ainda não há registros para este filtro.</Text>
          </View>
        ) : (
          filteredEvents.map((evt, index) => (
            <TimelineItem key={evt.id} event={evt} isLast={index === filteredEvents.length - 1} />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

function FilterChip({ label, isActive, onPress }: { label: string, isActive: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity 
      style={[styles.chip, isActive && styles.chipActive]} 
      onPress={onPress}
    >
      <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TimelineItem({ event, isLast }: { event: DiaryEvent, isLast: boolean }) {
  const config = getEventConfig(event.type);
  
  return (
    <View style={styles.item}>
      <Text style={styles.time}>{event.time}</Text>
      <View style={styles.timelineCol}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        {!isLast && <View style={styles.line} />}
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{config.icon}</Text>
          <Text style={styles.cardTitle}>{config.title}</Text>
        </View>
        {event.data.q2 && <Text style={styles.summary}>{event.data.q2}</Text>}
        <View style={styles.tags}>
          {Object.values(event.data).map((val, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{val}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function getEventConfig(type: string) {
  switch (type) {
    case 'pee': return { title: 'Xixi', icon: '〰️', color: colors.pee };
    case 'water': return { title: 'Líquido', icon: '💧', color: colors.water };
    case 'poop': return { title: 'Evacuação', icon: '💩', color: colors.poop };
    case 'night': return { title: 'Noite', icon: '🌙', color: colors.night };
    case 'escape': return { title: 'Escape', icon: '⚠️', color: colors.escape };
    case 'pain': return { title: 'Desconforto', icon: '⚡', color: colors.pain };
    default: return { title: 'Registro', icon: '📝', color: colors.primary };
  }
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.paddingMd,
    paddingVertical: metrics.paddingSm,
    borderRadius: metrics.radiusXl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    marginLeft: 4,
    fontWeight: '600',
    color: colors.textDark,
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: metrics.paddingSm,
  },
  filters: {
    paddingHorizontal: metrics.paddingLg,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.surface,
  },
  timeline: {
    padding: metrics.paddingLg,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
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
  timelineCol: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  summary: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.textSecondary,
  }
});

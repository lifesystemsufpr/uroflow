import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useChildStore, ChildSelector } from '../../child';
import { useEventStore } from '../store/eventStore';
import { colors, metrics } from '../../../shared/theme/colors';
import { DiaryEvent } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../../shared/ui/Screen';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FilterType = 'all' | 'pee' | 'water' | 'poop' | 'night' | 'escape' | 'pain';

export function DiaryScreen() {
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { children, activeChildId } = useChildStore();
  const activeChild = children.find(c => c.id === activeChildId);
  const { events } = useEventStore();
  
  const [filter, setFilter] = useState<FilterType>(route.params?.filter || 'all');
  const [selectorVisible, setSelectorVisible] = useState(false);
  
  useEffect(() => {
    if (route.params?.filter) {
      setFilter(route.params.filter);
    }
  }, [route.params?.filter]);
  
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.childSelector} onPress={() => setSelectorVisible(true)}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>{activeChild?.avatar || '👦'}</Text>
          </View>
          <Text style={styles.childName}>{activeChild?.name || 'Selecione'} ▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateBar}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={20} color={colors.water} />
        </TouchableOpacity>
        <Text style={styles.dateText}>Hoje</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color={colors.water} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          <FilterChip label="Todos" isActive={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterChip label="Xixi" isActive={filter === 'pee'} onPress={() => setFilter('pee')} />
          <FilterChip label="Líquido" isActive={filter === 'water'} onPress={() => setFilter('water')} />
          <FilterChip label="Cocô" isActive={filter === 'poop'} onPress={() => setFilter('poop')} />
          <FilterChip label="Escape" isActive={filter === 'escape'} onPress={() => setFilter('escape')} />
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

      <ChildSelector 
        visible={selectorVisible} 
        onClose={() => setSelectorVisible(false)} 
        onAddChild={() => console.log('Navigate to add child')} 
      />
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
        <View style={[styles.line, isLast && { bottom: '50%' }]} />
        <View style={[styles.iconCircle, { borderColor: config.color, backgroundColor: config.bgColor }]}>
          <Text style={styles.iconEmoji}>{config.icon}</Text>
        </View>
      </View>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{config.title}</Text>
        </View>
        <Text style={styles.summary}>{getEventSummary(event)}</Text>
        <View style={styles.tags}>
          {Object.values(event.data).filter(Boolean).map((val, idx) => (
            <View key={idx} style={[styles.tag, { backgroundColor: config.bgColor }]}>
              <Text style={[styles.tagText, { color: config.color }]}>{val}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function getEventConfig(type: string) {
  switch (type) {
    case 'pee': return { title: 'Xixi', icon: '〰️', color: colors.pee, bgColor: colors.peeBackground };
    case 'water': return { title: 'Água', icon: '💧', color: colors.water, bgColor: colors.waterBackground }; // O mock novo usa 'Água' ao invés de Líquido no título, mantendo o mock
    case 'poop': return { title: 'Cocô', icon: '💩', color: colors.poop, bgColor: colors.poopBackground };
    case 'night': return { title: 'Noite', icon: '🌙', color: colors.night, bgColor: colors.nightBackground };
    case 'escape': return { title: 'Escape', icon: '⚠️', color: colors.escape, bgColor: colors.escapeBackground };
    case 'pain': return { title: 'Desconforto', icon: '😣', color: colors.pain, bgColor: colors.painBackground };
    default: return { title: 'Registro', icon: '📝', color: colors.primary, bgColor: '#E8EAF6' };
  }
}

function getEventSummary(event: DiaryEvent) {
  if (!event.data) return '';
  if (event.type === 'pee') return `Volume ${event.data.q2?.toLowerCase() || ''}`;
  
  const parts = [];
  if (event.data.q1) parts.push(event.data.q1);
  if (event.data.q2) parts.push(event.data.q2);
  return parts.join(', ');
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
    backgroundColor: '#FFF1E5', // Soft orange/peach background as per mock
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
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: metrics.paddingMd,
    paddingHorizontal: metrics.paddingLg,
    backgroundColor: colors.surface,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  filtersWrapper: {
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    backgroundColor: '#2D3748',
    borderColor: '#2D3748',
  },
  chipText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  timeline: {
    padding: metrics.paddingLg,
    paddingTop: 24,
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
    marginBottom: 20,
  },
  time: {
    width: 45,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 10,
  },
  timelineCol: {
    width: 40,
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 4,
  },
  line: {
    position: 'absolute',
    top: 10,
    bottom: -20, // extends down to the next item
    width: 1,
    backgroundColor: '#CBD5E0',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginTop: 0,
    zIndex: 2,
  },
  iconEmoji: {
    fontSize: 14,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: metrics.paddingMd,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  summary: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});

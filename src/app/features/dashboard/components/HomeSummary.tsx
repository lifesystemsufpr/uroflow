import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEventStore } from '../../../entities/event/model/store';
import { colors, metrics } from '../../../shared/theme/colors';

export function HomeSummary() {
  const { events } = useEventStore();
  
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.date === today);

  const peeCount = todayEvents.filter(e => e.type === 'pee').length;
  const poopCount = todayEvents.filter(e => e.type === 'poop').length;
  const escapeCount = todayEvents.filter(e => e.type === 'escape').length;
  
  let waterMl = 0;
  todayEvents.filter(e => e.type === 'water').forEach(e => {
    if (e.data && e.data.q2) {
      const ml = parseInt(e.data.q2.replace(/\D/g, ''));
      if (!isNaN(ml)) waterMl += ml;
    }
  });

  return (
    <View style={styles.grid}>
      <SummaryItem label="Xixis" value={peeCount.toString()} color={colors.pee} bgColor={colors.peeBackground} />
      <SummaryItem label="Líquidos" value={waterMl > 0 ? `${waterMl}ml` : '0'} color={colors.water} bgColor={colors.waterBackground} />
      <SummaryItem label="Evacuação" value={poopCount.toString()} color={colors.poop} bgColor={colors.poopBackground} />
      <SummaryItem label="Escapes" value={escapeCount.toString()} color={colors.escape} bgColor={colors.escapeBackground} />
    </View>
  );
}

function SummaryItem({ label, value, color, bgColor }: { label: string, value: string, color: string, bgColor: string }) {
  return (
    <TouchableOpacity style={styles.item}>
      <View style={[styles.valueContainer, { backgroundColor: bgColor }]}>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  item: {
    width: '47%',
    alignItems: 'center',
    marginBottom: metrics.paddingSm,
  },
  valueContainer: {
    width: '100%',
    aspectRatio: 1.5,
    borderRadius: metrics.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  }
});

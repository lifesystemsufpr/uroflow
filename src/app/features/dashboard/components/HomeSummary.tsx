import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useEventStore } from '../../diary';
import { colors, metrics } from '../../../shared/theme/colors';
import { useNavigation } from '@react-navigation/native';

export function HomeSummary() {
  const { events } = useEventStore();
  const navigation = useNavigation<any>();
  
  const today = new Date().toISOString().split('T')[0];
  const todayEvents = events.filter(e => e.date === today);

  const peeCount = todayEvents.filter(e => e.type === 'pee').length;
  const poopCount = todayEvents.filter(e => e.type === 'poop').length;
  const escapeCount = todayEvents.filter(e => e.type === 'escape').length;
  
  // As per prototype, it just shows '4' for Líquidos, so counting events makes sense.
  const waterCount = todayEvents.filter(e => e.type === 'water').length;

  const handlePress = (filterType: string) => {
    navigation.navigate('Diary', { filter: filterType });
  };

  return (
    <View style={styles.grid}>
      <SummaryItem label="Xixis" value={peeCount.toString()} color="#cfa015" bgColor={colors.peeBackground} onPress={() => handlePress('pee')} />
      <SummaryItem label="Líquidos" value={waterCount.toString()} color={colors.water} bgColor={colors.waterBackground} onPress={() => handlePress('water')} />
      <SummaryItem label="Evacuação" value={poopCount.toString()} color={colors.poop} bgColor={colors.poopBackground} onPress={() => handlePress('poop')} />
      <SummaryItem label="Escapes" value={escapeCount.toString()} color={colors.escape} bgColor={colors.escapeBackground} onPress={() => handlePress('escape')} />
    </View>
  );
}

function SummaryItem({ label, value, color, bgColor, onPress }: { label: string, value: string, color: string, bgColor: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    width: '23%',
  },
  valueContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  }
});

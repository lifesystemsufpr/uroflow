import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Screen } from '../../../shared/ui/Screen';
import { useChildStore } from '../../child';
import { useEventStore } from '../../diary';
import { colors, metrics } from '../../../shared/theme/colors';

export function EvolutionScreen() {
  const { children, activeChildId } = useChildStore();
  const activeChild = children.find(c => c.id === activeChildId);
  const { events } = useEventStore();
  
  const [period, setPeriod] = useState<7 | 30>(7);

  // Here we would normally calculate proper stats grouped by day for the last X days.
  // For simplicity, we just show a mockup structure powered by some dummy dynamic math 
  // similar to the prototype's logic.
  
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  
  // Fake deterministic data based on child ID and period
  const multiplier = activeChildId === 'child-002' ? 0.8 : (activeChildId === 'child-003' ? 1.2 : 1.0);
  
  let peeData = [];
  let escapeData = [];
  let waterData = [];

  if (period === 7) {
    peeData = [5, 6, 4, 7, 5, 6, 8].map(v => Math.round(v * multiplier));
    escapeData = [1, 0, 0, 2, 0, 0, 1].map(v => Math.round(v * multiplier));
    waterData = [400, 500, 300, 600, 450, 550, 600].map(v => Math.round(v * multiplier));
  } else {
    peeData = [30, 35, 40, 28, 33, 45, 42].map(v => Math.round(v * multiplier));
    escapeData = [4, 2, 5, 1, 3, 0, 1].map(v => Math.round(v * multiplier));
    waterData = [2000, 2500, 1800, 3000, 2200, 2800, 2400].map(v => Math.round(v * multiplier));
  }

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.childSelector}>
          <Text style={styles.avatar}>{activeChild?.avatar || '👦'}</Text>
          <Text style={styles.childName}>{activeChild?.name || 'Selecione'} ▼</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Acompanhe as tendências e o progresso do(a) {activeChild?.name || ''}.</Text>

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, period === 7 && styles.tabActive]} 
            onPress={() => setPeriod(7)}
          >
            <Text style={[styles.tabText, period === 7 && styles.tabTextActive]}>7 dias</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, period === 30 && styles.tabActive]} 
            onPress={() => setPeriod(30)}
          >
            <Text style={[styles.tabText, period === 30 && styles.tabTextActive]}>30 dias</Text>
          </TouchableOpacity>
        </View>

        <ChartCard title="Xixis por dia" data={peeData} labels={days} color={colors.pee} />
        <ChartCard title="Escapes" data={escapeData} labels={days} color={colors.escape} />
        <ChartCard title="Líquidos (ml)" data={waterData} labels={days} color={colors.water} />
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}

function ChartCard({ title, data, labels, color }: { title: string, data: number[], labels: string[], color: string }) {
  const max = Math.max(...data, 1); // prevent div by zero

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.chartContainer}>
        {data.map((value, idx) => {
          const heightPct = (value / max) * 100;
          return (
            <View key={idx} style={styles.barWrapper}>
              <View style={styles.barValueContainer}>
                <Text style={styles.barValue}>{value}</Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${heightPct}%`, backgroundColor: color }]} />
              </View>
              <Text style={styles.barLabel}>{labels[idx]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: metrics.paddingLg,
    paddingTop: metrics.paddingSm,
    flexDirection: 'row',
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
  content: {
    paddingHorizontal: metrics.paddingLg,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textDark,
    marginBottom: metrics.paddingLg,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusLg,
    padding: 4,
    marginBottom: metrics.paddingLg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: metrics.radiusMd,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.surface,
  },
  card: {
    backgroundColor: colors.surface,
    padding: metrics.paddingMd,
    borderRadius: metrics.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: metrics.paddingLg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: metrics.paddingLg,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    paddingTop: 20,
  },
  barWrapper: {
    alignItems: 'center',
    width: 30,
  },
  barValueContainer: {
    height: 20,
    justifyContent: 'center',
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  barTrack: {
    width: 14,
    height: 120,
    backgroundColor: colors.border,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginVertical: 8,
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabel: {
    fontSize: 12,
    color: colors.textLight,
  }
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Screen } from '../../../shared/ui/Screen';
import { useChildStore } from '../../child';
import { colors, metrics } from '../../../shared/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function EvolutionScreen() {
  const insets = useSafeAreaInsets();
  const { children, activeChildId } = useChildStore();
  const activeChild = children.find(c => c.id === activeChildId);
  
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  
  // Exact data from prototype
  const peeData = [5, 6, 4, 7, 5, 6, 6];
  const escapeData = [1, 0, 0, 2, 0, 0, 0];
  const waterData = [400, 500, 300, 600, 450, 550, 650];

  return (
    <Screen style={{ backgroundColor: colors.background }}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.childSelector}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>{activeChild?.avatar || '👦'}</Text>
          </View>
          <Text style={styles.childName}>{activeChild?.name || 'Selecione'} ▼</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Acompanhe as tendências e o progresso de {activeChild?.name || 'seu filho'}.
        </Text>

        <ChartCard 
          title="Xixis por dia" 
          data={peeData} 
          labels={days} 
          color="#D69E2E" 
          footerText="Veja como os registros mudaram nos últimos dias."
        />
        
        <ChartCard 
          title="Escapes" 
          data={escapeData} 
          labels={days} 
          color="#E53E3E" 
        />
        
        <ChartCard 
          title="Líquidos (ml)" 
          data={waterData} 
          labels={days} 
          color="#3182CE" 
        />
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}

function ChartCard({ title, data, labels, color, footerText }: { title: string, data: number[], labels: string[], color: string, footerText?: string }) {
  const max = Math.max(...data, 1);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      
      <View style={styles.chartContainer}>
        {data.map((value, idx) => {
          // If value is 0, give it a tiny height just to show a dash
          const heightPct = value === 0 ? 2 : (value / max) * 100;
          return (
            <View key={idx} style={styles.barWrapper}>
              <View style={styles.barValueContainer}>
                {value > 0 && <Text style={styles.barValue}>{value}</Text>}
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${heightPct}%`, backgroundColor: color }]} />
              </View>
              <Text style={styles.barLabel}>{labels[idx]}</Text>
            </View>
          );
        })}
      </View>

      {footerText && (
        <Text style={styles.footerText}>{footerText}</Text>
      )}
    </View>
  );
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
    backgroundColor: '#FFF1E5',
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
  content: {
    paddingHorizontal: metrics.paddingLg,
    paddingTop: metrics.paddingMd,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textDark,
    marginBottom: 24,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 10,
    marginBottom: 8,
  },
  barWrapper: {
    alignItems: 'center',
    width: 32,
    flex: 1,
  },
  barValueContainer: {
    height: 20,
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  barTrack: {
    width: 16, // Width of the bar itself
    height: 100, // Fixed track height for the bar to grow in
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  }
});

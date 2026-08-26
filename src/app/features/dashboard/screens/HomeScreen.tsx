import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Screen } from '../../../shared/ui/Screen';
import { useChildStore, ChildSelector } from '../../child';
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

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity style={styles.childSelector} onPress={() => setSelectorVisible(true)}>
          <Text style={styles.avatar}>{activeChild?.avatar || '👦'}</Text>
          <Text style={styles.childName}>{activeChild?.name || 'Selecione'} ▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.greeting}>Olá! 👋</Text>
        <Text style={styles.question}>Como foi o dia do {activeChild?.name || ''}?</Text>
        
        {/* Placeholder for HomeSummary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hoje</Text>
          <HomeSummary />
        </View>

        <Text style={styles.sectionTitle}>O que aconteceu?</Text>
        <View style={styles.actionGrid}>
          <ActionButton type="water" icon="water" label="Líquidos" color={colors.water} bgColor={colors.waterBackground} onPress={() => navigation.navigate('Wizard', { type: 'water' })} />
          <ActionButton type="pee" icon="body" label="Xixi" color={colors.pee} bgColor={colors.peeBackground} onPress={() => navigation.navigate('Wizard', { type: 'pee' })} />
          <ActionButton type="poop" icon="sad" label="Cocô" color={colors.poop} bgColor={colors.poopBackground} onPress={() => navigation.navigate('Wizard', { type: 'poop' })} />
          <ActionButton type="night" icon="moon" label="Noite" color={colors.night} bgColor={colors.nightBackground} onPress={() => navigation.navigate('Wizard', { type: 'night' })} />
          <ActionButton type="escape" icon="warning" label="Escape" color={colors.escape} bgColor={colors.escapeBackground} onPress={() => navigation.navigate('Wizard', { type: 'escape' })} />
          <ActionButton type="pain" icon="medkit" label="Desconforto" color={colors.pain} bgColor={colors.painBackground} onPress={() => navigation.navigate('Wizard', { type: 'pain' })} />
        </View>
        
        <RecentEvents />
      </View>

      <ChildSelector 
        visible={selectorVisible} 
        onClose={() => setSelectorVisible(false)} 
        onAddChild={() => console.log('Navigate to add child')} 
      />
    </Screen>
  );
}

function ActionButton({ icon, label, color, bgColor, onPress }: { type: ActionType, icon: any, label: string, color: string, bgColor: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.actionBtn, { backgroundColor: bgColor }]} onPress={onPress}>
      <Ionicons name={icon} size={28} color={color} />
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  question: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: metrics.paddingLg,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: metrics.paddingSm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: metrics.paddingSm,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  actionBtn: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: metrics.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.paddingSm,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  }
});

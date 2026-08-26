import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEventStore } from '../store/eventStore';
import { useChildStore } from '../../child';
import { wizardDefinitions, WizardOption } from '../components/wizardConfig';
import { colors, metrics } from '../../../shared/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export function WizardScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params as { type: string };
  
  const def = wizardDefinitions[type];
  const { activeChildId } = useChildStore();
  const { addEvent } = useEventStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  if (!def) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Fluxo não encontrado</Text>
      </SafeAreaView>
    );
  }

  const step = def.steps[currentStep];

  const handleSelect = (option: WizardOption) => {
    const newAnswers = { ...answers, [step.id]: option.label };
    setAnswers(newAnswers);

    if (currentStep < def.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishWizard(newAnswers);
    }
  };

  const finishWizard = async (finalAnswers: Record<string, string>) => {
    if (!activeChildId) return;

    const now = new Date();
    await addEvent({
      childId: activeChildId,
      type: type as any,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0].substring(0, 5),
      data: finalAnswers,
    });
    
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: def.bgColor }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={def.color} />
        </TouchableOpacity>
        <View style={styles.progress}>
          {def.steps.map((_, idx) => (
            <View 
              key={idx} 
              style={[
                styles.progressDot, 
                idx <= currentStep ? { backgroundColor: def.color } : { backgroundColor: colors.border }
              ]} 
            />
          ))}
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.question, { color: def.color }]}>{step.question}</Text>

        <View style={styles.options}>
          {step.options?.map(opt => (
            <TouchableOpacity 
              key={opt.id} 
              style={styles.optionCard}
              onPress={() => handleSelect(opt)}
            >
              <Text style={styles.optionIcon}>{opt.icon}</Text>
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: metrics.paddingLg,
  },
  backBtn: {
    padding: 4,
  },
  progress: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    flex: 1,
    padding: metrics.paddingLg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  optionCard: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.paddingMd,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  optionIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
  }
});

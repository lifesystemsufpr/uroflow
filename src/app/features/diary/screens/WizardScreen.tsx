import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Platform, StatusBar, TextInput } from 'react-native';
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
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [textValue, setTextValue] = useState('');

  if (!def) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Fluxo não encontrado</Text>
      </SafeAreaView>
    );
  }

  const step = def.steps[currentStep];
  const isLastStep = currentStep === def.steps.length - 1;

  const handleNext = () => {
    let answerToSave = '';
    let isEndAction = false;

    if (step.type === 'text') {
      answerToSave = textValue;
    } else {
      if (!selectedOptionId) return;
      const selectedOpt = step.options?.find(o => o.id === selectedOptionId);
      if (!selectedOpt) return;
      answerToSave = selectedOpt.label;
      if (selectedOpt.action === 'end') {
        isEndAction = true;
      }
    }

    const newAnswers = { ...answers, [step.id]: answerToSave };
    setAnswers(newAnswers);

    if (!isLastStep && !isEndAction) {
      setCurrentStep(prev => prev + 1);
      const nextStepId = def.steps[currentStep + 1].id;
      const nextAnswerLabel = newAnswers[nextStepId];
      if (def.steps[currentStep + 1].type === 'text') {
        setTextValue(nextAnswerLabel || '');
        setSelectedOptionId(null);
      } else if (nextAnswerLabel) {
        const nextOpt = def.steps[currentStep + 1].options?.find(o => o.label === nextAnswerLabel);
        setSelectedOptionId(nextOpt ? nextOpt.id : null);
        setTextValue('');
      } else {
        setSelectedOptionId(null);
        setTextValue('');
      }
    } else {
      finishWizard(newAnswers);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const prevStepId = def.steps[currentStep - 1].id;
      const prevAnswerLabel = answers[prevStepId];
      if (def.steps[currentStep - 1].type === 'text') {
        setTextValue(prevAnswerLabel || '');
        setSelectedOptionId(null);
      } else if (prevAnswerLabel) {
        const prevOpt = def.steps[currentStep - 1].options?.find(o => o.label === prevAnswerLabel);
        setSelectedOptionId(prevOpt ? prevOpt.id : null);
        setTextValue('');
      } else {
        setSelectedOptionId(null);
        setTextValue('');
      }
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
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={[styles.headerIconBox, { backgroundColor: def.bgColor }]}>
            <Text style={styles.headerIconText}>{def.headerIcon}</Text>
          </View>
          <View style={styles.speechBubble}>
            <Text style={styles.speechBubbleText}>{def.headerText}</Text>
            <View style={styles.speechBubbleArrow} />
          </View>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.question, { color: '#1E293B' }]}>{step.question}</Text>

        {step.type === 'options' && (
          <View style={styles.options}>
            {step.options?.map(opt => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <TouchableOpacity 
                  key={opt.id} 
                  style={[
                    styles.optionCard,
                    isSelected && { borderColor: colors.primary, backgroundColor: colors.primaryLight }
                  ]}
                  onPress={() => setSelectedOptionId(opt.id)}
                >
                  {opt.icon && <Text style={styles.optionIcon}>{opt.icon}</Text>}
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionLabel, isSelected && { color: colors.primary, fontWeight: '700' }]}>{opt.label}</Text>
                    {opt.description && (
                      <Text style={[styles.optionDescription, isSelected && { color: colors.primary }]}>{opt.description}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        {step.type === 'text' && (
          <TextInput
            style={styles.textArea}
            multiline
            placeholder={step.placeholder}
            placeholderTextColor="#94A3B8"
            value={textValue}
            onChangeText={setTextValue}
            textAlignVertical="top"
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.btnVoltar} onPress={handlePrev}>
              <Text style={styles.btnVoltarText}>Voltar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[
              styles.btnPrimary, 
              (step.type === 'text' ? textValue.trim().length > 0 : selectedOptionId) && { backgroundColor: colors.primary }
            ]} 
            onPress={handleNext}
            disabled={step.type === 'text' ? textValue.trim().length === 0 : !selectedOptionId}
          >
            <Text style={[
              styles.btnPrimaryText, 
              (step.type === 'text' ? textValue.trim().length > 0 : selectedOptionId) && styles.btnPrimaryTextActive
            ]}>
              {step.type === 'text' ? 'Salvar registro' : 'Avançar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: metrics.paddingLg,
    paddingTop: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  headerIconText: {
    fontSize: 24,
  },
  speechBubble: {
    marginLeft: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
    maxWidth: '75%',
  },
  speechBubbleText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  speechBubbleArrow: {
    position: 'absolute',
    left: -6,
    top: 16,
    width: 10,
    height: 10,
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    transform: [{ rotate: '45deg' }],
  },
  closeBtn: {
    padding: 8,
  },
  content: {
    padding: metrics.paddingLg,
    paddingTop: 32,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  options: {
    flexDirection: 'column',
    width: '100%',
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  textArea: {
    backgroundColor: '#475569',
    color: '#F8FAFC',
    minHeight: 120,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  btnPrimaryTextActive: {
    color: '#FFFFFF',
  },
  btnVoltar: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVoltarText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  }
});

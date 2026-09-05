import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, metrics } from '../../../shared/theme/colors';
import { Input } from '../../../shared/ui/Input';
import { formatDateInput, isValidDateString } from '../../../shared/utils/formatters';
import { useChildStore } from '../../child/store/childStore';
import { useUserStore } from '../../../shared/store/userStore';
import { useAppointmentStore, useConsiderationStore } from '../../consultations/store/consultationsStore';
import { NewAppointmentModal, AppointmentData } from '../../consultations/components/NewAppointmentModal';
import { SuccessModal } from '../../../shared/ui/SuccessModal';

export function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // States
  const [guardianName, setGuardianName] = useState('');
  const [childName, setChildName] = useState('');
  const [childDob, setChildDob] = useState('');
  const [childGoal, setChildGoal] = useState('');
  
  // Modal & Appointment State
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [newAppointment, setNewAppointment] = useState<AppointmentData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Stores
  const { setGuardianName: saveGuardianName } = useUserStore();
  const { addChild } = useChildStore();
  const { addAppointment } = useAppointmentStore();
  const { addConsideration } = useConsiderationStore();

  const handleNext = () => {
    if (step === 2 && !guardianName.trim()) {
      Alert.alert('Atenção', 'Digite seu nome para continuar.');
      return;
    }
    if (step === 3) {
      if (!childName.trim()) {
        Alert.alert('Atenção', 'Digite o nome da criança para continuar.');
        return;
      }
      if (!childDob.trim() || !isValidDateString(childDob)) {
        Alert.alert('Atenção', 'Digite uma data de nascimento válida (DD/MM/AAAA).');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return 'Sem idade informada';
    
    // Suporte para DD/MM/AAAA
    let parts = dobString.split('/');
    if (parts.length !== 3) return 'Idade não calculada';
    
    const birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
    if (isNaN(birthDate.getTime())) return 'Idade não calculada';

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} anos`;
  };

  const handleFinish = () => {
    setShowSuccess(true);
  };

  const finalizeRegistration = () => {
    saveGuardianName(guardianName.trim());
    
    const newChild = addChild({
      name: childName.trim(),
      avatar: '👦',
      birthDate: childDob.trim(),
      goal: childGoal.trim()
    });

    if (childGoal.trim()) {
      addConsideration({
        childId: newChild.id,
        title: childGoal.trim(),
        description: 'Objetivo do acompanhamento definido no cadastro.',
      });
    }

    if (newAppointment) {
      addAppointment({
        childId: newChild.id,
        specialty: newAppointment.specialty,
        professional: newAppointment.professional || 'A definir',
        date: newAppointment.date,
        time: newAppointment.time,
        location: newAppointment.location || 'A definir',
        notes: newAppointment.notes || '',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>{step} de 4</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${step * 25}%` }]} />
          </View>
        </View>

        <View style={styles.content}>
          {step === 1 && (
            <View style={styles.centerBox}>
              <Text style={styles.title}>Vamos começar?</Text>
              <Text style={styles.subtitle}>Cadastre seus dados e da criança que você deseja acompanhar.</Text>
            </View>
          )}

          {step === 2 && (
            <View style={styles.boxCentered}>
              <Text style={styles.title}>Sobre você</Text>
              <Text style={styles.subtitle}>Vamos identificar quem está acompanhando a criança.</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome do Responsável</Text>
                <Input
                  placeholder="Ex: Maria" 
                  value={guardianName}
                  onChangeText={setGuardianName}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.boxCentered}>
              <Text style={styles.title}>Agora, vamos cadastrar a criança</Text>
              <Text style={styles.subtitle}>Essas informações ajudam a organizar o acompanhamento.</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome da Criança</Text>
                <Input 
                  placeholder="Ex: João" 
                  value={childName}
                  onChangeText={setChildName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Data de Nascimento da Criança</Text>
                <Input 
                  placeholder="dd/mm/aaaa" 
                  value={childDob}
                  onChangeText={(text) => setChildDob(formatDateInput(text))}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Objetivo atual do acompanhamento <Text style={styles.optional}>(Opcional)</Text></Text>
                <Input 
                  placeholder="Ex: Reduzir escapes na escola..." 
                  value={childGoal}
                  onChangeText={setChildGoal}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Próxima consulta <Text style={styles.optional}>(Opcional)</Text></Text>
                
                {newAppointment ? (
                  <View style={styles.appointmentSummary}>
                    <Text style={styles.appointmentSummaryText}>
                      {newAppointment.specialty} - {newAppointment.date} às {newAppointment.time}
                    </Text>
                    <TouchableOpacity onPress={() => setIsAppointmentModalVisible(true)}>
                      <Text style={styles.appointmentSummaryEdit}>Editar</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.dashedButton}
                    onPress={() => setIsAppointmentModalVisible(true)}
                  >
                    <Text style={styles.dashedButtonText}>+ Adicionar Nova Consulta</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.boxCentered}>
              <Text style={styles.title}>Tudo pronto!</Text>
              <Text style={styles.subtitle}>Confira as informações antes de começar.</Text>
              
              <View style={styles.card}>
                <Text style={styles.cardSectionTitle}>Responsável</Text>
                <Text style={styles.cardMainText}>{guardianName}</Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.cardSectionTitle}>Criança</Text>
                <View style={styles.childRow}>
                  <View style={styles.avatarBox}><Text style={styles.avatarText}>👦</Text></View>
                  <View>
                    <Text style={styles.cardMainText}>{childName}</Text>
                    <Text style={styles.cardSubText}>{calculateAge(childDob)}</Text>
                  </View>
                </View>
                
                {childGoal ? (
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Objetivo:</Text>
                    <Text style={styles.infoValue}>{childGoal}</Text>
                  </View>
                ) : null}
                
                {newAppointment ? (
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Próxima Consulta:</Text>
                    <Text style={styles.infoValue}>{newAppointment.date} às {newAppointment.time}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          )}

        </View>

        <View style={styles.footer}>
          {step === 1 ? (
            <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={handleNext}>
              <Text style={styles.primaryButtonText}>Começar</Text>
            </TouchableOpacity>
          ) : step === 4 ? (
            <>
              <TouchableOpacity style={[styles.secondaryButton, { flex: 0.4 }]} onPress={handlePrev}>
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={handleFinish}>
                <Text style={styles.primaryButtonText}>Começar acompanhamento</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.secondaryButton, { flex: 1 }]} onPress={handlePrev}>
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { flex: 1 }]} onPress={handleNext}>
                <Text style={styles.primaryButtonText}>Continuar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      <NewAppointmentModal 
        visible={isAppointmentModalVisible}
        onClose={() => setIsAppointmentModalVisible(false)}
        initialData={newAppointment || undefined}
        onSave={(data) => {
          setNewAppointment(data);
          setIsAppointmentModalVisible(false);
        }}
      />

      <SuccessModal 
        visible={showSuccess} 
        onAnimationEnd={() => {
          setShowSuccess(false);
          finalizeRegistration();
        }} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.border,
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    flex: 1,
    marginTop: 24,
  },
  boxCentered: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004D51', // primary-dark
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  optional: {
    fontWeight: 'normal',
    color: colors.textLight,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusMd,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardSectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '600',
  },
  cardMainText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 4,
  },
  cardSubText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF1E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  infoBox: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  footer: {
    padding: 24,
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: metrics.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: metrics.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashedButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: metrics.radiusMd,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedButtonText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  appointmentSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: metrics.radiusMd,
    padding: 16,
  },
  appointmentSummaryText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  appointmentSummaryEdit: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  }
});

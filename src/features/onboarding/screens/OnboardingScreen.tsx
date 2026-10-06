import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { ArrowLeftIcon, ArrowRightIcon, CalendarPlusIcon, PencilSimpleIcon } from '@/shared/icons';
import { Button, DateField, Glyph, Grain, Input, ProgressTrack, SuccessOverlay, Text, Touchable } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { formatDate } from '@/shared/lib/date';
import { slideStep } from '@/shared/motion';
import { useChildStore } from '@/features/child';
import { useUserStore } from '@/features/user';
import { useAppointmentStore, useConsiderationStore, type AppointmentDraft } from '@/features/consultations';
import type { RootStackParamList } from '@/app/navigation/types';
import { ReviewCard } from '../components/ReviewCard';
import { StepIntro } from '../components/StepIntro';
import { WelcomeArt } from '../components/WelcomeArt';
import { stepError, TOTAL_STEPS, type OnboardingForm } from '../model/validation';

const emptyForm: OnboardingForm = { guardianName: '', childName: '', childDob: '', childGoal: '' };

export function OnboardingScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Onboarding'>>();
  const returned = route.params?.appointment;
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [form, setForm] = useState(emptyForm);
  const [appointment, setAppointment] = useState<AppointmentDraft | null>(null);
  const [success, setSuccess] = useState(false);

  const setGuardianName = useUserStore((s) => s.setGuardianName);
  const addChild = useChildStore((s) => s.addChild);
  const addAppointment = useAppointmentStore((s) => s.addAppointment);
  const addConsideration = useConsiderationStore((s) => s.addConsideration);

  useEffect(() => {
    if (returned) setAppointment(returned);
  }, [returned]);

  const openAppointmentForm = () =>
    navigation.navigate('AppointmentForm', { draft: appointment ?? undefined, returnTo: 'Onboarding' });

  const update = (key: keyof OnboardingForm) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const goNext = () => {
    const error = stepError(step, form);
    if (error) {
      Alert.alert('Atenção', error);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const finalize = () => {
    setGuardianName(form.guardianName.trim());
    const goal = form.childGoal.trim();
    const child = addChild({ name: form.childName.trim(), birthDate: form.childDob.trim(), goal });
    if (goal) {
      addConsideration({
        childId: child.id,
        title: goal,
        description: 'Objetivo do acompanhamento definido no cadastro.',
      });
    }
    if (appointment) {
      addAppointment({
        childId: child.id,
        specialty: appointment.specialty,
        professional: appointment.professional || 'A definir',
        date: appointment.date,
        time: appointment.time,
        location: appointment.location || 'A definir',
        notes: appointment.notes || '',
      });
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Grain />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text variant="label" color={colors.primary}>
            {step} de {TOTAL_STEPS}
          </Text>
          <ProgressTrack steps={TOTAL_STEPS} current={step} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View key={step} entering={slideStep(direction)} style={[styles.step, step === 1 && styles.centered]}>
            {step === 1 ? (
              <>
                <WelcomeArt />
                <StepIntro
                  eyebrow="Bem-vindo ao Uroflow"
                  title="Vamos começar?"
                  subtitle="Cadastre seus dados e da criança que você deseja acompanhar."
                />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <StepIntro
                  eyebrow="Passo 1 · Responsável"
                  title="Sobre você"
                  subtitle="Vamos identificar quem está acompanhando a criança."
                />
                <Input
                  label="Nome do responsável"
                  placeholder="Ex: Maria"
                  value={form.guardianName}
                  onChangeText={update('guardianName')}
                  autoFocus
                />
              </>
            ) : null}

            {step === 3 ? (
              <>
                <StepIntro
                  eyebrow="Passo 2 · Criança"
                  title="Agora, vamos cadastrar a criança"
                  subtitle="Essas informações ajudam a organizar o acompanhamento."
                />
                <Input label="Nome da criança" placeholder="Ex: João" value={form.childName} onChangeText={update('childName')} />
                <DateField
                  label="Data de nascimento da criança"
                  value={form.childDob}
                  onChange={update('childDob')}
                  untilToday
                />
                <Input
                  label="Objetivo atual do acompanhamento"
                  optional
                  placeholder="Ex: Reduzir escapes na escola..."
                  value={form.childGoal}
                  onChangeText={update('childGoal')}
                />
                <View style={styles.group}>
                  <Text variant="label">
                    Próxima consulta
                    <Text variant="label" color={colors.textFaint}>
                      {'  ·  opcional'}
                    </Text>
                  </Text>
                  {appointment ? (
                    <Touchable onPress={openAppointmentForm} effect="tint" tintColor="rgba(255, 255, 255, 0.08)" style={styles.appointment}>
                      <View style={styles.flex}>
                        <Text variant="bodyStrong" color={colors.onPrimary}>
                          {appointment.specialty}
                        </Text>
                        <Text variant="caption" color={colors.primaryMist}>
                          {formatDate(appointment.date)} às {appointment.time}
                        </Text>
                      </View>
                      <View style={styles.edit}>
                        <Glyph icon={PencilSimpleIcon} size={14} color={colors.primary} weight="bold" />
                        <Text variant="label" color={colors.primary}>
                          Editar
                        </Text>
                      </View>
                    </Touchable>
                  ) : (
                    <Button
                      label="Adicionar nova consulta"
                      icon={CalendarPlusIcon}
                      variant="dashed"
                      onPress={openAppointmentForm}
                    />
                  )}
                </View>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <StepIntro
                  eyebrow="Passo 3 · Revisão"
                  title="Tudo pronto!"
                  subtitle="Confira as informações antes de começar."
                />
                <ReviewCard form={form} appointment={appointment} />
              </>
            ) : null}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          {step === 1 ? (
            <Button label="Começar" icon={ArrowRightIcon} iconPosition="end" onPress={goNext} style={styles.flex} />
          ) : (
            <>
              <Button
                label="Voltar"
                icon={ArrowLeftIcon}
                variant="secondary"
                onPress={goBack}
                style={step === TOTAL_STEPS ? styles.backCompact : styles.flex}
              />
              {step === TOTAL_STEPS ? (
                <Button label="Começar acompanhamento" onPress={() => setSuccess(true)} style={styles.flex} />
              ) : (
                <Button label="Continuar" icon={ArrowRightIcon} iconPosition="end" onPress={goNext} style={styles.flex} />
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      <SuccessOverlay
        visible={success}
        onAnimationEnd={() => {
          setSuccess(false);
          finalize();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    gap: space.sm,
    paddingHorizontal: space.gutter,
    paddingTop: space.md,
    paddingBottom: space.xs,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.gutter,
    paddingVertical: space.lg,
  },
  step: {
    gap: space.lg,
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  group: {
    gap: space.xs,
  },
  appointment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.onPrimary,
  },
  footer: {
    flexDirection: 'row',
    gap: space.sm,
    paddingHorizontal: space.gutter,
    paddingTop: space.sm,
    paddingBottom: space.sm,
  },
  backCompact: {
    flex: 0.55,
  },
});

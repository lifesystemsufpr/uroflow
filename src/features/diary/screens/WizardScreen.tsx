import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, XIcon } from '@/shared/icons';
import { Button, Glyph, Grain, IconBadge, Input, ProgressTrack, SuccessOverlay, Text, Touchable } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { reveal, slideStep } from '@/shared/motion';
import { clockTime, utcDateKey } from '@/shared/lib/date';
import { useActiveChildId } from '@/features/child';
import type { RootStackParamList } from '@/app/navigation/types';
import { OptionCard } from '../components/OptionCard';
import { useWizardFlow } from '../hooks/useWizardFlow';
import { eventCatalog } from '../model/eventCatalog';
import { isEventType, wizardDefinitions, type WizardDefinition } from '../model/wizards';
import type { Answers } from '../model/wizardMachine';
import { useEventStore } from '../store/eventStore';

function WizardFlow({ def }: { def: WizardDefinition }) {
  const navigation = useNavigation();
  const childId = useActiveChildId();
  const addEvent = useEventStore((s) => s.addEvent);
  const [success, setSuccess] = useState(false);
  const meta = eventCatalog[def.type];

  const finish = (answers: Answers) => {
    if (!childId) return;
    const now = new Date();
    addEvent({ childId, type: def.type, date: utcDateKey(now), time: clockTime(now), data: answers });
    setSuccess(true);
  };

  const { state, step, total, ready, select, type, back, next } = useWizardFlow(def, finish);
  const isText = step.type === 'text';

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <Grain />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <View style={styles.progress}>
            <ProgressTrack steps={total} current={state.index + 1} color={meta.tone.solid} />
          </View>
          <Touchable onPress={() => navigation.goBack()} style={styles.close} accessibilityLabel="Fechar">
            <Glyph icon={XIcon} size={18} color={colors.primary} weight="bold" />
          </Touchable>
        </View>

        <Animated.View entering={reveal(120)} style={styles.header}>
          <IconBadge icon={meta.icon} tone={meta.tone} size={56} inverted />
          <View style={styles.bubble}>
            <View style={styles.bubbleTail} />
            <Text variant="label" color={meta.tone.ink}>
              {meta.title} · passo {state.index + 1} de {total}
            </Text>
            <Text variant="heading" color={colors.primary}>
              {def.headerText}
            </Text>
          </View>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View key={state.index} entering={slideStep(state.direction)} style={styles.step}>
            <Text variant="display" style={styles.question}>
              {step.question}
            </Text>

            {isText ? (
              <Input
                multiline
                minHeight={140}
                placeholder={step.placeholder}
                value={state.text}
                onChangeText={type}
              />
            ) : (
              <View style={styles.options} accessibilityRole="radiogroup">
                {step.options?.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    tone={meta.tone}
                    selected={state.selectedId === option.id}
                    onPress={() => select(option.id)}
                  />
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          {state.index > 0 ? (
            <Button
              label="Voltar"
              variant="secondary"
              icon={ArrowLeftIcon}
              onPress={back}
            />
          ) : null}
          <Button
            label={isText ? 'Salvar registro' : 'Avançar'}
            icon={isText ? CheckIcon : ArrowRightIcon}
            iconPosition={isText ? 'start' : 'end'}
            onPress={next}
            disabled={!ready}
            style={styles.flex}
          />
        </View>
      </KeyboardAvoidingView>

      <SuccessOverlay
        visible={success}
        onAnimationEnd={() => {
          setSuccess(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

export function WizardScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Wizard'>>();
  const type = route.params?.type;

  if (!isEventType(type)) {
    return (
      <SafeAreaView style={[styles.root, styles.missing]}>
        <Text variant="heading">Fluxo não encontrado</Text>
      </SafeAreaView>
    );
  }

  return <WizardFlow def={wizardDefinitions[type]} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  missing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.gutter,
    paddingTop: space.sm,
  },
  progress: {
    flex: 1,
  },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.gutter,
    paddingTop: space.lg,
  },
  bubble: {
    flex: 1,
    gap: 2,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  bubbleTail: {
    position: 'absolute',
    left: -7,
    top: '50%',
    marginTop: -6,
    width: 12,
    height: 12,
    backgroundColor: colors.surface,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    transform: [{ rotate: '45deg' }],
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: space.gutter,
    paddingTop: space.xl,
    paddingBottom: space.lg,
  },
  step: {
    gap: space.lg,
  },
  question: {
    fontSize: 26,
    lineHeight: 31,
  },
  options: {
    gap: space.sm,
  },
  footer: {
    flexDirection: 'row',
    gap: space.sm,
    paddingHorizontal: space.gutter,
    paddingTop: space.sm,
    paddingBottom: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});

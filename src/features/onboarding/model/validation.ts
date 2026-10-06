import { isValidDateString } from '@/shared/lib/formatters';

export type OnboardingForm = {
  guardianName: string;
  childName: string;
  childDob: string;
  childGoal: string;
};

export const TOTAL_STEPS = 4;

export const stepError = (step: number, form: OnboardingForm) => {
  if (step === 2 && !form.guardianName.trim()) return 'Digite seu nome para continuar.';
  if (step === 3 && !form.childName.trim()) return 'Digite o nome da criança para continuar.';
  if (step === 3 && (!form.childDob.trim() || !isValidDateString(form.childDob)))
    return 'Digite uma data de nascimento válida (DD/MM/AAAA).';
  return null;
};

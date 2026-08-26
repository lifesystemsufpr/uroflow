export type WizardStepType = 'options' | 'number' | 'text' | 'time' | 'date';

export interface WizardOption {
  id: string;
  label: string;
  icon?: string;
}

export interface WizardStep {
  id: string; // The data key (e.g. q1, q2)
  question: string;
  type: WizardStepType;
  options?: WizardOption[];
  placeholder?: string;
  unit?: string;
  required?: boolean;
}

export interface WizardDefinition {
  type: string;
  title: string;
  color: string;
  bgColor: string;
  steps: WizardStep[];
}

import { colors } from '../../../shared/theme/colors';

export const wizardDefinitions: Record<string, WizardDefinition> = {
  pee: {
    type: 'pee',
    title: 'Xixi',
    color: colors.pee,
    bgColor: colors.peeBackground,
    steps: [
      {
        id: 'q1',
        question: 'Onde o xixi foi feito?',
        type: 'options',
        options: [
          { id: '1', label: 'No Vaso', icon: '🚽' },
          { id: '2', label: 'No Penico', icon: '🪣' },
          { id: '3', label: 'Na Fralda', icon: '🧷' },
          { id: '4', label: 'Na Roupa', icon: '👖' },
        ]
      },
      {
        id: 'q2',
        question: 'Qual a quantidade de xixi?',
        type: 'options',
        options: [
          { id: '1', label: 'Muito', icon: '🌊' },
          { id: '2', label: 'Médio', icon: '💧' },
          { id: '3', label: 'Pouco', icon: '🤏' },
        ]
      }
    ]
  },
  water: {
    type: 'water',
    title: 'Líquidos',
    color: colors.water,
    bgColor: colors.waterBackground,
    steps: [
      {
        id: 'q1',
        question: 'O que a criança bebeu?',
        type: 'options',
        options: [
          { id: '1', label: 'Água', icon: '💧' },
          { id: '2', label: 'Suco', icon: '🧃' },
          { id: '3', label: 'Leite', icon: '🍼' },
          { id: '4', label: 'Outro', icon: '🥛' },
        ]
      },
      {
        id: 'q2',
        question: 'Qual a quantidade?',
        type: 'options',
        options: [
          { id: '1', label: '100 ml', icon: '🥤' },
          { id: '2', label: '200 ml', icon: '🥤' },
          { id: '3', label: '300 ml', icon: '🥤' },
          { id: '4', label: 'Mais de 300 ml', icon: '🥤' },
        ]
      }
    ]
  },
  poop: {
    type: 'poop',
    title: 'Cocô',
    color: colors.poop,
    bgColor: colors.poopBackground,
    steps: [
      {
        id: 'q1',
        question: 'Como estava o cocô?',
        type: 'options',
        options: [
          { id: '1', label: 'Duro (Bolinhas)', icon: '🍪' },
          { id: '2', label: 'Firme', icon: '🥖' },
          { id: '3', label: 'Pastoso', icon: '🍦' },
          { id: '4', label: 'Líquido', icon: '💦' },
        ]
      },
      {
        id: 'q2',
        question: 'Onde fez?',
        type: 'options',
        options: [
          { id: '1', label: 'No Vaso', icon: '🚽' },
          { id: '2', label: 'No Penico', icon: '🪣' },
          { id: '3', label: 'Na Fralda', icon: '🧷' },
          { id: '4', label: 'Na Roupa', icon: '👖' },
        ]
      }
    ]
  },
  night: {
    type: 'night',
    title: 'Noite',
    color: colors.night,
    bgColor: colors.nightBackground,
    steps: [
      {
        id: 'q1',
        question: 'Como a criança acordou?',
        type: 'options',
        options: [
          { id: '1', label: 'Seco', icon: '☀️' },
          { id: '2', label: 'Molhado', icon: '🌧️' },
        ]
      }
    ]
  },
  escape: {
    type: 'escape',
    title: 'Escape',
    color: colors.escape,
    bgColor: colors.escapeBackground,
    steps: [
      {
        id: 'q1',
        question: 'Qual foi o tamanho do escape?',
        type: 'options',
        options: [
          { id: '1', label: 'Apenas sujou a cueca/calcinha', icon: '💧' },
          { id: '2', label: 'Molhou a roupa externa', icon: '🌊' },
        ]
      },
      {
        id: 'q2',
        question: 'O que a criança estava fazendo?',
        type: 'options',
        options: [
          { id: '1', label: 'Brincando', icon: '🎮' },
          { id: '2', label: 'Assistindo TV', icon: '📺' },
          { id: '3', label: 'Dormindo', icon: '💤' },
          { id: '4', label: 'Rindo', icon: '😂' },
        ]
      }
    ]
  },
  pain: {
    type: 'pain',
    title: 'Desconforto',
    color: colors.pain,
    bgColor: colors.painBackground,
    steps: [
      {
        id: 'q1',
        question: 'O que a criança sentiu?',
        type: 'options',
        options: [
          { id: '1', label: 'Dor ao fazer xixi', icon: '🔥' },
          { id: '2', label: 'Dor na barriga', icon: '😣' },
          { id: '3', label: 'Coceira', icon: '🤏' },
        ]
      }
    ]
  }
};

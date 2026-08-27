export type WizardStepType = 'options' | 'number' | 'text' | 'time' | 'date';

export interface WizardOption {
  id: string;
  label: string;
  icon?: string;
  description?: string;
  action?: 'end';
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
  headerText: string;
  headerIcon: string;
  steps: WizardStep[];
}

import { colors } from '../../../shared/theme/colors';

export const wizardDefinitions: Record<string, WizardDefinition> = {
  pee: {
    type: 'pee',
    title: 'Xixi',
    color: colors.pee,
    bgColor: colors.peeBackground,
    headerText: 'Fez xixi agora?',
    headerIcon: '🚽',
    steps: [
      {
        id: 'q1',
        question: 'Como demonstrou vontade de fazer xixi?',
        type: 'options',
        options: [
          { id: '1', label: 'Vontade normal', icon: '😌' },
          { id: '2', label: 'Vontade muito forte', icon: '😬' },
          { id: '3', label: 'Quase não percebeu', icon: '😴' },
          { id: '4', label: 'Apareceu de repente', icon: '⚡' },
        ]
      },
      {
        id: 'q2',
        question: 'Como foi a quantidade?',
        type: 'options',
        options: [
          { id: '1', label: 'Pouca', icon: '💧' },
          { id: '2', label: 'Média', icon: '💧💧' },
          { id: '3', label: 'Muita', icon: '💧💧💧' },
        ]
      },
      {
        id: 'q3',
        question: 'Onde aconteceu?',
        type: 'options',
        options: [
          { id: '1', label: 'Casa', icon: '🏠' },
          { id: '2', label: 'Escola', icon: '🏫' },
          { id: '3', label: 'Passeio', icon: '🌳' },
          { id: '4', label: 'Outro lugar', icon: '📍' },
        ]
      },
      {
        id: 'q4',
        question: 'Teve algum desconforto?',
        type: 'options',
        options: [
          { id: '1', label: 'Não, foi tranquilo', icon: '😊' },
          { id: '2', label: 'Ardência', icon: '🔥' },
          { id: '3', label: 'Dor', icon: '😣' },
          { id: '4', label: 'Demorou para sair', icon: '⏳' },
        ]
      }
    ]
  },
  water: {
    type: 'water',
    title: 'Líquidos',
    color: colors.water,
    bgColor: colors.waterBackground,
    headerText: 'O que bebeu agora?',
    headerIcon: '💧',
    steps: [
      {
        id: 'q1',
        question: 'Qual copo foi usado?',
        type: 'options',
        options: [
          { id: '1', label: 'Copo pequeno', icon: '🥛' },
          { id: '2', label: 'Copo médio', icon: '🥤' },
          { id: '3', label: 'Copo grande', icon: '🫙' },
        ]
      },
      {
        id: 'q2',
        question: 'Quanto a criança bebeu?',
        type: 'options',
        options: [
          { id: '1', label: 'Metade do copo', icon: '🌗' },
          { id: '2', label: 'Copo cheio', icon: '🌕' },
          { id: '3', label: 'Mais de um copo', icon: '✨' },
        ]
      },
      {
        id: 'q3',
        question: 'O que bebeu?',
        type: 'options',
        options: [
          { id: '1', label: 'Água', icon: '💧' },
          { id: '2', label: 'Suco', icon: '🍹' },
          { id: '3', label: 'Leite', icon: '🥛' },
          { id: '4', label: 'Chá', icon: '🫖' },
          { id: '5', label: 'Outra bebida', icon: '🧃' },
        ]
      }
    ]
  },
  poop: {
    type: 'poop',
    title: 'Cocô',
    color: colors.poop,
    bgColor: colors.poopBackground,
    headerText: 'Fez cocô agora?',
    headerIcon: '💩',
    steps: [
      {
        id: 'q1',
        question: 'Como estava o cocô?',
        type: 'options',
        options: [
          { id: '1', label: 'Bolinhas duras', description: 'Muito ressecado', icon: '🪨' },
          { id: '2', label: 'Salsicha grossa e dura', description: 'Ressecado', icon: '🌭' },
          { id: '3', label: 'Salsicha com rachaduras', description: 'Quase normal', icon: '🥖' },
          { id: '4', label: 'Liso e macio', description: 'Ideal', icon: '🍌' },
          { id: '5', label: 'Pedaços macios', description: 'Normal', icon: '🫐' },
          { id: '6', label: 'Pastoso e mole', description: 'Mole demais', icon: '🥣' },
          { id: '7', label: 'Líquido, aguado', description: 'Muito líquido', icon: '💧' },
        ]
      },
      {
        id: 'q2',
        question: 'Precisou fazer força?',
        type: 'options',
        options: [
          { id: '1', label: 'Não precisou', icon: '😊' },
          { id: '2', label: 'Um pouquinho', icon: '😐' },
          { id: '3', label: 'Fiz bastante força', icon: '😤' },
        ]
      },
      {
        id: 'q3',
        question: 'Sentiu dor?',
        type: 'options',
        options: [
          { id: '1', label: 'Não', icon: '😊' },
          { id: '2', label: 'Um pouco', icon: '😟' },
          { id: '3', label: 'Bastante', icon: '😣' },
        ]
      },
      {
        id: 'q4',
        question: 'Onde foi?',
        type: 'options',
        options: [
          { id: '1', label: 'Casa', icon: '🏠' },
          { id: '2', label: 'Escola', icon: '🏫' },
          { id: '3', label: 'Passeio', icon: '🌳' },
          { id: '4', label: 'Outro', icon: '📍' },
        ]
      }
    ]
  },
  night: {
    type: 'night',
    title: 'Noite',
    color: colors.night,
    bgColor: colors.nightBackground,
    headerText: 'Como foi a noite?',
    headerIcon: '🌙',
    steps: [
      {
        id: 'q1',
        question: 'Como foi a noite?',
        type: 'options',
        options: [
          { id: '1', label: 'Noite seca', icon: '🌟' },
          { id: '2', label: 'Roupa úmida', icon: '👕' },
          { id: '3', label: 'Cama molhada', icon: '💧' },
          { id: '4', label: 'Acordou para urinar', icon: '⏰' },
          { id: '5', label: 'Não sei informar', icon: '🤷' },
        ]
      },
      {
        id: 'q2',
        question: 'Deseja acrescentar uma observação?',
        type: 'options',
        options: [
          { id: '1', label: 'Sim', icon: '✅' },
          { id: '2', label: 'Não', icon: '⏭️', action: 'end' },
        ]
      },
      {
        id: 'q3',
        question: 'Observação da noite',
        type: 'text',
        placeholder: 'Anote algo que ache importante para a consulta...'
      }
    ]
  },
  escape: {
    type: 'escape',
    title: 'Escape',
    color: colors.escape,
    bgColor: colors.escapeBackground,
    headerText: 'Teve um escape?',
    headerIcon: '💧',
    steps: [
      {
        id: 'q1',
        question: 'Qual foi o tamanho do escape?',
        type: 'options',
        options: [
          { id: '1', label: 'Apenas sujou a cueca/calcinha' },
          { id: '2', label: 'Molhou a roupa externa' },
        ]
      },
      {
        id: 'q2',
        question: 'O que a criança estava fazendo?',
        type: 'options',
        options: [
          { id: '1', label: 'Brincando' },
          { id: '2', label: 'Assistindo TV' },
          { id: '3', label: 'Dormindo' },
          { id: '4', label: 'Rindo' },
        ]
      }
    ]
  },
  pain: {
    type: 'pain',
    title: 'Desconforto',
    color: colors.pain,
    bgColor: colors.painBackground,
    headerText: 'Sentiu desconforto?',
    headerIcon: '😣',
    steps: [
      {
        id: 'q1',
        question: 'O que a criança sentiu?',
        type: 'options',
        options: [
          { id: '1', label: 'Dor ao fazer xixi' },
          { id: '2', label: 'Dor na barriga' },
          { id: '3', label: 'Coceira' },
        ]
      }
    ]
  }
};

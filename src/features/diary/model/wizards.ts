import {
  AlarmIcon,
  BarbellIcon,
  BedIcon,
  ChatCircleTextIcon,
  CheckIcon,
  CircleHalfIcon,
  CircleIcon,
  CirclesThreeIcon,
  CowIcon,
  DropHalfBottomIcon,
  DropIcon,
  DropSimpleIcon,
  EyeSlashIcon,
  FireIcon,
  HourglassMediumIcon,
  HouseIcon,
  LightningIcon,
  MapPinIcon,
  OrangeSliceIcon,
  PantsIcon,
  PersonIcon,
  PersonSimpleWalkIcon,
  PintGlassIcon,
  QuestionIcon,
  SkipForwardIcon,
  SmileyBlankIcon,
  SmileyIcon,
  SmileyMehIcon,
  SmileyNervousIcon,
  SmileySadIcon,
  SmileyXEyesIcon,
  SparkleIcon,
  StudentIcon,
  TShirtIcon,
  TeaBagIcon,
  ThumbsUpIcon,
  TreeIcon,
  type Icon,
} from '@/shared/icons';
import type { EventType } from '../types';

export type WizardOption = {
  id: string;
  label: string;
  icon?: Icon;
  badge?: string;
  scale?: number;
  description?: string;
  action?: 'end';
};

export type WizardStep = {
  id: string;
  question: string;
  type: 'options' | 'text';
  options?: WizardOption[];
  placeholder?: string;
};

export type WizardDefinition = {
  type: EventType;
  headerText: string;
  steps: WizardStep[];
};

const places = (other: string): WizardOption[] => [
  { id: '1', label: 'Casa', icon: HouseIcon },
  { id: '2', label: 'Escola', icon: StudentIcon },
  { id: '3', label: 'Passeio', icon: TreeIcon },
  { id: '4', label: other, icon: MapPinIcon },
];

export const wizardDefinitions: Record<EventType, WizardDefinition> = {
  pee: {
    type: 'pee',
    headerText: 'Fez xixi agora?',
    steps: [
      {
        id: 'q1',
        question: 'Como demonstrou vontade de fazer xixi?',
        type: 'options',
        options: [
          { id: '1', label: 'Vontade normal', icon: SmileyIcon },
          { id: '2', label: 'Vontade muito forte', icon: SmileyNervousIcon },
          { id: '3', label: 'Quase não percebeu', icon: EyeSlashIcon },
          { id: '4', label: 'Apareceu de repente', icon: LightningIcon },
        ],
      },
      {
        id: 'q2',
        question: 'Como foi a quantidade?',
        type: 'options',
        options: [
          { id: '1', label: 'Pouca', icon: DropSimpleIcon },
          { id: '2', label: 'Média', icon: DropHalfBottomIcon },
          { id: '3', label: 'Muita', icon: DropIcon },
        ],
      },
      { id: 'q3', question: 'Onde aconteceu?', type: 'options', options: places('Outro lugar') },
      {
        id: 'q4',
        question: 'Teve algum desconforto?',
        type: 'options',
        options: [
          { id: '1', label: 'Não, foi tranquilo', icon: SmileyIcon },
          { id: '2', label: 'Ardência', icon: FireIcon },
          { id: '3', label: 'Dor', icon: SmileySadIcon },
          { id: '4', label: 'Demorou para sair', icon: HourglassMediumIcon },
        ],
      },
    ],
  },
  water: {
    type: 'water',
    headerText: 'O que bebeu agora?',
    steps: [
      {
        id: 'q1',
        question: 'Qual copo foi usado?',
        type: 'options',
        options: [
          { id: '1', label: 'Copo pequeno', icon: PintGlassIcon, scale: 0.72 },
          { id: '2', label: 'Copo médio', icon: PintGlassIcon, scale: 0.88 },
          { id: '3', label: 'Copo grande', icon: PintGlassIcon, scale: 1.08 },
        ],
      },
      {
        id: 'q2',
        question: 'Quanto a criança bebeu?',
        type: 'options',
        options: [
          { id: '1', label: 'Metade do copo', icon: CircleHalfIcon },
          { id: '2', label: 'Copo cheio', icon: CircleIcon },
          { id: '3', label: 'Mais de um copo', icon: CirclesThreeIcon },
        ],
      },
      {
        id: 'q3',
        question: 'O que bebeu?',
        type: 'options',
        options: [
          { id: '1', label: 'Água', icon: DropIcon },
          { id: '2', label: 'Suco', icon: OrangeSliceIcon },
          { id: '3', label: 'Leite', icon: CowIcon },
          { id: '4', label: 'Chá', icon: TeaBagIcon },
          { id: '5', label: 'Outra bebida', icon: PintGlassIcon },
        ],
      },
    ],
  },
  poop: {
    type: 'poop',
    headerText: 'Fez cocô agora?',
    steps: [
      {
        id: 'q1',
        question: 'Como estava o cocô?',
        type: 'options',
        options: [
          { id: '1', label: 'Bolinhas duras', description: 'Muito ressecado', badge: '1' },
          { id: '2', label: 'Salsicha grossa e dura', description: 'Ressecado', badge: '2' },
          { id: '3', label: 'Salsicha com rachaduras', description: 'Quase normal', badge: '3' },
          { id: '4', label: 'Liso e macio', description: 'Ideal', badge: '4' },
          { id: '5', label: 'Pedaços macios', description: 'Normal', badge: '5' },
          { id: '6', label: 'Pastoso e mole', description: 'Mole demais', badge: '6' },
          { id: '7', label: 'Líquido, aguado', description: 'Muito líquido', badge: '7' },
        ],
      },
      {
        id: 'q2',
        question: 'Precisou fazer força?',
        type: 'options',
        options: [
          { id: '1', label: 'Não precisou', icon: SmileyIcon },
          { id: '2', label: 'Um pouquinho', icon: SmileyMehIcon },
          { id: '3', label: 'Fiz bastante força', icon: BarbellIcon },
        ],
      },
      {
        id: 'q3',
        question: 'Sentiu dor?',
        type: 'options',
        options: [
          { id: '1', label: 'Não', icon: SmileyIcon },
          { id: '2', label: 'Um pouco', icon: SmileySadIcon },
          { id: '3', label: 'Bastante', icon: SmileyXEyesIcon },
        ],
      },
      { id: 'q4', question: 'Onde foi?', type: 'options', options: places('Outro') },
    ],
  },
  night: {
    type: 'night',
    headerText: 'Como foi a noite?',
    steps: [
      {
        id: 'q1',
        question: 'Como foi a noite?',
        type: 'options',
        options: [
          { id: '1', label: 'Noite seca', icon: SparkleIcon },
          { id: '2', label: 'Roupa úmida', icon: TShirtIcon },
          { id: '3', label: 'Cama molhada', icon: BedIcon },
          { id: '4', label: 'Acordou para urinar', icon: AlarmIcon },
          { id: '5', label: 'Não sei informar', icon: QuestionIcon },
        ],
      },
      {
        id: 'q2',
        question: 'Deseja acrescentar uma observação?',
        type: 'options',
        options: [
          { id: '1', label: 'Sim', icon: CheckIcon },
          { id: '2', label: 'Não', icon: SkipForwardIcon, action: 'end' },
        ],
      },
      {
        id: 'q3',
        question: 'Observação da noite',
        type: 'text',
        placeholder: 'Anote algo que ache importante para a consulta...',
      },
    ],
  },
  escape: {
    type: 'escape',
    headerText: 'Teve um escape?',
    steps: [
      {
        id: 'q1',
        question: 'Quanto molhou?',
        type: 'options',
        options: [
          { id: '1', label: 'Só gotas', icon: DropSimpleIcon },
          { id: '2', label: 'Roupa ficou úmida', icon: TShirtIcon },
          { id: '3', label: 'Precisou trocar a roupa', icon: PantsIcon },
        ],
      },
      { id: 'q2', question: 'Onde estava?', type: 'options', options: places('Outro lugar') },
      {
        id: 'q3',
        question: 'Percebeu a vontade antes?',
        type: 'options',
        options: [
          { id: '1', label: 'Sim, percebeu', icon: ThumbsUpIcon },
          { id: '2', label: 'Não percebeu', icon: EyeSlashIcon },
          { id: '3', label: 'Percebeu um pouquinho', icon: SmileyMehIcon },
        ],
      },
      {
        id: 'q4',
        question: 'Opcional — como ficou?',
        type: 'options',
        options: [
          { id: '1', label: 'Tranquilo', icon: SmileyIcon },
          { id: '2', label: 'Preocupado', icon: SmileyNervousIcon },
          { id: '3', label: 'Com vergonha', icon: SmileyBlankIcon },
          { id: '4', label: 'Outro', icon: ChatCircleTextIcon },
        ],
      },
    ],
  },
  pain: {
    type: 'pain',
    headerText: 'Sentiu desconforto?',
    steps: [
      {
        id: 'q1',
        question: 'Onde está a dor ou desconforto?',
        type: 'options',
        options: [
          { id: '1', label: 'Na barriga', icon: PersonIcon },
          { id: '2', label: 'Na hora do xixi', icon: DropIcon },
          { id: '3', label: 'Nas costas', icon: PersonSimpleWalkIcon },
          { id: '4', label: 'Outro lugar', icon: MapPinIcon },
        ],
      },
      {
        id: 'q2',
        question: 'Como é a dor?',
        type: 'options',
        options: [
          { id: '1', label: 'Leve', icon: SmileyMehIcon },
          { id: '2', label: 'Média', icon: SmileySadIcon },
          { id: '3', label: 'Forte', icon: SmileyXEyesIcon },
        ],
      },
    ],
  },
};

export const isEventType = (value: unknown): value is EventType =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(wizardDefinitions, value);

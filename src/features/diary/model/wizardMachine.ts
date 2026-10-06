import type { WizardDefinition, WizardStep } from './wizards';

export type Answers = Record<string, string>;

export type WizardState = {
  index: number;
  direction: 1 | -1;
  answers: Answers;
  selectedId: string | null;
  text: string;
};

export type WizardAction =
  | { type: 'select'; id: string }
  | { type: 'type'; text: string }
  | { type: 'advance'; answers: Answers }
  | { type: 'back' }
  | { type: 'commit'; answers: Answers };

export const initialWizardState: WizardState = {
  index: 0,
  direction: 1,
  answers: {},
  selectedId: null,
  text: '',
};

const restore = (step: WizardStep, answers: Answers) =>
  step.type === 'text'
    ? { selectedId: null, text: answers[step.id] || '' }
    : { selectedId: step.options?.find((o) => o.label === answers[step.id])?.id ?? null, text: '' };

export const canAdvance = (step: WizardStep, state: WizardState) =>
  step.type === 'text' ? state.text.trim().length > 0 : !!state.selectedId;

export type Resolution = { answers: Answers; finished: boolean } | null;

export const resolveStep = (def: WizardDefinition, state: WizardState): Resolution => {
  const step = def.steps[state.index];
  if (step.type === 'text') {
    return { answers: { ...state.answers, [step.id]: state.text }, finished: state.index === def.steps.length - 1 };
  }
  const option = state.selectedId ? step.options?.find((o) => o.id === state.selectedId) : undefined;
  if (!option) return null;
  return {
    answers: { ...state.answers, [step.id]: option.label },
    finished: option.action === 'end' || state.index === def.steps.length - 1,
  };
};

export const createWizardReducer =
  (def: WizardDefinition) =>
  (state: WizardState, action: WizardAction): WizardState => {
    switch (action.type) {
      case 'select':
        return { ...state, selectedId: action.id };
      case 'type':
        return { ...state, text: action.text };
      case 'commit':
        return { ...state, answers: action.answers };
      case 'advance': {
        const index = state.index + 1;
        return { ...state, index, direction: 1, answers: action.answers, ...restore(def.steps[index], action.answers) };
      }
      case 'back': {
        if (state.index === 0) return state;
        const index = state.index - 1;
        return { ...state, index, direction: -1, ...restore(def.steps[index], state.answers) };
      }
    }
  };

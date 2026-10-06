import { useMemo, useReducer } from 'react';
import {
  canAdvance,
  createWizardReducer,
  initialWizardState,
  resolveStep,
  type Answers,
} from '../model/wizardMachine';
import type { WizardDefinition } from '../model/wizards';

export const useWizardFlow = (def: WizardDefinition, onFinish: (answers: Answers) => void) => {
  const reducer = useMemo(() => createWizardReducer(def), [def]);
  const [state, dispatch] = useReducer(reducer, initialWizardState);
  const step = def.steps[state.index];

  const next = () => {
    const resolution = resolveStep(def, state);
    if (!resolution) return;
    if (resolution.finished) {
      dispatch({ type: 'commit', answers: resolution.answers });
      onFinish(resolution.answers);
      return;
    }
    dispatch({ type: 'advance', answers: resolution.answers });
  };

  return {
    state,
    step,
    total: def.steps.length,
    ready: canAdvance(step, state),
    select: (id: string) => dispatch({ type: 'select', id }),
    type: (text: string) => dispatch({ type: 'type', text }),
    back: () => dispatch({ type: 'back' }),
    next,
  };
};

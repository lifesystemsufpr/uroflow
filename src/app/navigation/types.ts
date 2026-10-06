import type { NavigatorScreenParams } from '@react-navigation/native';
import type { EventFilter, EventType } from '@/features/diary/types';
import type { AppointmentDraft } from '@/features/consultations/types';

export type TabParamList = {
  Home: undefined;
  Consultations: undefined;
  Diary: { filter?: EventFilter } | undefined;
  Evolution: undefined;
};

export type RootStackParamList = {
  Onboarding: { appointment?: AppointmentDraft } | undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Wizard: { type: EventType };
  AppointmentForm: { draft?: AppointmentDraft; returnTo?: 'Onboarding' } | undefined;
  AppointmentDetails: { id: string };
  ConsiderationForm: undefined;
  ChildForm: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

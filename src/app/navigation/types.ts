import type { NavigatorScreenParams } from '@react-navigation/native';
import type { EventFilter, EventType } from '@/features/diary/types';

export type TabParamList = {
  Home: undefined;
  Consultations: undefined;
  Diary: { filter?: EventFilter } | undefined;
  Evolution: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  Wizard: { type: EventType };
  AppointmentDetails: { id: string };
  ConsiderationForm: undefined;
  ChildForm: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

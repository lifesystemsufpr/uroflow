import { DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator, type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { colors } from '@/shared/theme';
import { useUserStore } from '@/features/user';
import { OnboardingScreen } from '@/features/onboarding';
import { WizardScreen } from '@/features/diary';
import { ChildFormScreen } from '@/features/child';
import { AppointmentDetailsScreen, ConsiderationFormScreen } from '@/features/consultations';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.line,
    notification: colors.accent,
  },
};

const page: NativeStackNavigationOptions = { animation: 'ios_from_right', gestureEnabled: true };

export function RootNavigator() {
  const isFirstAccess = useUserStore((s) => s.guardianName === null);

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        {isFirstAccess ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Tabs" component={TabNavigator} />
        )}
        <Stack.Screen name="Wizard" component={WizardScreen} options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} options={page} />
        <Stack.Screen name="ConsiderationForm" component={ConsiderationFormScreen} options={page} />
        <Stack.Screen name="ChildForm" component={ChildFormScreen} options={page} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

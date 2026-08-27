import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { WizardScreen } from '../features/diary';
import { OnboardingScreen } from '../features/onboarding/screens/OnboardingScreen';
import { useChildStore } from '../features/child/store/childStore';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../shared/theme/colors';

import { useUserStore } from '../shared/store/userStore';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { children, _hasHydrated: childHydrated } = useChildStore();
  const { guardianName, _hasHydrated: userHydrated } = useUserStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (childHydrated && userHydrated) {
      setIsReady(true);
    }
  }, [childHydrated, userHydrated]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isFirstAccess = guardianName === null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstAccess ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Tabs" component={MainTabNavigator} />
        )}
        <Stack.Screen 
          name="Wizard" 
          component={WizardScreen} 
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

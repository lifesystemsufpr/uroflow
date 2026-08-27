import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from '../shared/theme/colors';

import { HomeScreen } from '../features/dashboard';
import { DiaryScreen } from '../features/diary';
import { ConsultationsScreen } from '../features/consultations';
import { EvolutionScreen } from '../features/evolution';

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let emoji = '🏠';
            if (route.name === 'Home') emoji = '🏠';
            else if (route.name === 'Diary') emoji = '🗓️';
            else if (route.name === 'Consultations') emoji = '🩺';
            else if (route.name === 'Evolution') emoji = '📈';
            
            return (
              <Text style={{ fontSize: size * 0.9, opacity: focused ? 1 : 0.5 }}>
                {emoji}
              </Text>
            );
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Painel' }} />
        <Tab.Screen name="Consultations" component={ConsultationsScreen} options={{ title: 'Consultas' }} />
        <Tab.Screen name="Diary" component={DiaryScreen} options={{ title: 'Diário' }} />
        <Tab.Screen name="Evolution" component={EvolutionScreen} options={{ title: 'Evolução' }} />
      </Tab.Navigator>
  );
}

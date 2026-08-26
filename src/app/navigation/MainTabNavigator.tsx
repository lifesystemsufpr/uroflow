import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'home';
            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Diary') iconName = focused ? 'book' : 'book-outline';
            else if (route.name === 'Consultations') iconName = focused ? 'medical' : 'medical-outline';
            else if (route.name === 'Evolution') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            return <Ionicons name={iconName as any} size={size} color={color} />;
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

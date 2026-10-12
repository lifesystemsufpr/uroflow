import { HomeScreen } from '@/features/dashboard';
import { ConsultationsScreen } from '@/features/consultations';
import { DiaryScreen } from '@/features/diary';
import { EvolutionScreen } from '@/features/evolution';
import { createSwipeTabNavigator } from './swipeTabs';
import { TabBar } from './TabBar';
import type { TabParamList } from './types';

const Tab = createSwipeTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Painel' }} />
      <Tab.Screen name="Consultations" component={ConsultationsScreen} options={{ title: 'Consultas' }} />
      <Tab.Screen name="Diary" component={DiaryScreen} options={{ title: 'Diário' }} />
      <Tab.Screen name="Evolution" component={EvolutionScreen} options={{ title: 'Evolução' }} />
    </Tab.Navigator>
  );
}

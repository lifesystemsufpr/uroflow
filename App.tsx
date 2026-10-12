import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { AppProvider } from '@/app/providers/AppProvider';
import { colors } from '@/shared/theme';
import { SuccessHost } from '@/shared/ui';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AppProvider>
          <RootNavigator />
          <SuccessHost />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

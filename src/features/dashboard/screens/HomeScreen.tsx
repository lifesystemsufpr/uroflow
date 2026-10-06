import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import { CalendarDotsIcon } from '@/shared/icons';
import { Glyph, ScrollScreen, SectionHeader, Text } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { reveal } from '@/shared/motion';
import { shortDate } from '@/shared/lib/date';
import { ChildSwitcher } from '@/features/child';
import { useUserStore } from '@/features/user';
import { AppointmentBanner } from '../components/AppointmentBanner';
import { QuickLogGrid } from '../components/QuickLogGrid';
import { RecentEvents } from '../components/RecentEvents';
import { TodayBoard } from '../components/TodayBoard';

function Greeting() {
  const guardianName = useUserStore((s) => s.guardianName);
  const firstName = guardianName?.trim().split(/\s+/)[0];

  return (
    <View style={styles.greeting}>
      <View style={styles.greetingRow}>
        <Text variant="title" color={colors.onPrimary} style={styles.hello}>
          {firstName ? `Olá, ${firstName}` : 'Olá!'}
        </Text>
        <View style={styles.datePill}>
          <Glyph icon={CalendarDotsIcon} size={14} color={colors.onPrimary} />
          <Text variant="label" color={colors.onPrimary}>
            {shortDate(new Date())}
          </Text>
        </View>
      </View>
      <Text variant="display" color={colors.onPrimary} style={styles.question}>
        Como foi o dia de
      </Text>
      <ChildSwitcher variant="headline" inverse />
    </View>
  );
}

export function HomeScreen() {
  const focused = useIsFocused();

  return (
    <>
      {focused ? <StatusBar style="light" /> : null}
      <ScrollScreen title="Painel" hero={<Greeting />} band="strong">
        <AppointmentBanner />
        <Animated.View entering={reveal(60)}>
          <TodayBoard />
        </Animated.View>
        <Animated.View entering={reveal(140)} style={styles.section}>
          <SectionHeader title="O que aconteceu?" />
          <QuickLogGrid />
        </Animated.View>
        <RecentEvents />
      </ScrollScreen>
    </>
  );
}

const styles = StyleSheet.create({
  greeting: {
    gap: space.xxs,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    marginBottom: space.sm,
  },
  hello: {
    flex: 1,
    fontSize: 24,
    lineHeight: 30,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 34,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  question: {
    fontSize: 32,
    lineHeight: 38,
  },
  section: {
    gap: space.sm,
  },
});

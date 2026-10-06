import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CaretRightIcon, StethoscopeIcon } from '@/shared/icons';
import { Glyph, Text, Touchable } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { tomorrowUtcKey } from '@/shared/lib/date';
import { useActiveChildId } from '@/features/child';
import { firstOnDate, useAppointmentStore } from '@/features/consultations';

export function AppointmentBanner() {
  const navigation = useNavigation();
  const childId = useActiveChildId();
  const appointments = useAppointmentStore((s) => s.appointments);
  const next = useMemo(
    () => (childId ? firstOnDate(appointments, childId, tomorrowUtcKey()) : null),
    [appointments, childId],
  );

  if (!next) return null;

  return (
    <Touchable
      onPress={() => navigation.navigate('Tabs', { screen: 'Consultations' })}
      effect="tint"
      style={styles.banner}
    >
      <View style={styles.icon}>
        <Glyph icon={StethoscopeIcon} size={22} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text variant="label" color={colors.primarySoft}>
          Consulta amanhã
        </Text>
        <Text variant="heading" color={colors.primary}>
          {next.specialty} às {next.time}
        </Text>
      </View>
      <Glyph icon={CaretRightIcon} size={18} color={colors.primary} weight="bold" />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryMist,
    borderWidth: 1.5,
    borderColor: colors.primaryMist,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
});

import { StyleSheet, View } from 'react-native';
import { ClockIcon, MapPinIcon, StethoscopeIcon, UserIcon, type Icon } from '@/shared/icons';
import { Glyph, Text, Touchable } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { daysUntil, formatDate } from '@/shared/lib/date';
import type { Appointment } from '../types';
import { monthShort } from './AppointmentCard';

const countdown = (date: string) => {
  const days = daysUntil(date);
  if (days <= 0) return 'Hoje';
  if (days === 1) return 'Amanhã';
  return `Em ${days} dias`;
};

function Meta({ icon, value }: { icon: Icon; value: string }) {
  return (
    <View style={styles.meta}>
      <Glyph icon={icon} size={16} color={colors.primaryMist} />
      <Text variant="caption" color={colors.primaryMist} numberOfLines={1} style={styles.flex}>
        {value}
      </Text>
    </View>
  );
}

export function NextAppointmentCard({ appointment, onPress }: { appointment: Appointment; onPress: () => void }) {
  return (
    <Touchable onPress={onPress} effect="tint" tintColor="rgba(255, 255, 255, 0.08)" style={styles.card}>
      <View style={styles.header}>
        <Text variant="label" color={colors.primaryMist}>
          Próxima consulta
        </Text>
        <View style={styles.badge}>
          <Text variant="label" color={colors.primary}>
            {countdown(appointment.date)}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.date}>
          <Text variant="hero" color={colors.onPrimary} style={styles.day}>
            {formatDate(appointment.date, 'dd')}
          </Text>
          <Text variant="label" color={colors.primaryMist}>
            {monthShort(appointment.date)}
          </Text>
        </View>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Glyph icon={StethoscopeIcon} size={20} color={colors.onPrimary} />
            <Text variant="title" color={colors.onPrimary} numberOfLines={2} style={styles.flex}>
              {appointment.specialty}
            </Text>
          </View>
          <Meta icon={ClockIcon} value={appointment.time} />
          {appointment.professional ? <Meta icon={UserIcon} value={appointment.professional} /> : null}
          {appointment.location ? <Meta icon={MapPinIcon} value={appointment.location} /> : null}
        </View>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: space.lg,
    gap: space.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: space.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.onPrimary,
  },
  body: {
    flexDirection: 'row',
    gap: space.lg,
  },
  date: {
    width: 76,
    paddingVertical: space.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    fontSize: 38,
    lineHeight: 42,
  },
  info: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flex: {
    flex: 1,
  },
});

import { StyleSheet, View } from 'react-native';
import { CaretRightIcon, CheckIcon, ClockIcon } from '@/shared/icons';
import { Glyph, Text, Touchable } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { formatDate } from '@/shared/lib/date';
import type { Appointment } from '../types';

export const monthShort = (date: string) => formatDate(date, 'MMM').replace('.', '').toUpperCase();

export type AppointmentCardProps = {
  appointment: Appointment;
  past?: boolean;
  onPress: () => void;
};

export function AppointmentCard({ appointment, past = false, onPress }: AppointmentCardProps) {
  return (
    <Touchable onPress={onPress} effect="tint" style={[styles.card, past && styles.cardPast]}>
      <View style={[styles.date, past && styles.datePast]}>
        <Text variant="numberSm" color={past ? colors.textMuted : colors.onPrimary} style={styles.day}>
          {formatDate(appointment.date, 'dd')}
        </Text>
        <Text variant="label" color={past ? colors.textFaint : colors.primaryMist}>
          {monthShort(appointment.date)}
        </Text>
      </View>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          {past ? <Glyph icon={CheckIcon} size={14} color={colors.textMuted} weight="bold" /> : null}
          <Text variant="heading" color={past ? colors.textMuted : colors.text} numberOfLines={1} style={styles.flex}>
            {appointment.specialty}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Glyph icon={ClockIcon} size={14} color={colors.textMuted} />
          <Text variant="caption" numberOfLines={1} style={styles.flex}>
            {appointment.time}
            {appointment.professional ? ` · ${appointment.professional}` : ''}
          </Text>
        </View>
      </View>
      <Glyph icon={CaretRightIcon} size={16} color={colors.textFaint} weight="bold" />
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.sm,
    paddingRight: space.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  cardPast: {
    backgroundColor: 'transparent',
  },
  date: {
    width: 58,
    height: 62,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePast: {
    backgroundColor: colors.surfaceMuted,
  },
  day: {
    lineHeight: 30,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flex: {
    flex: 1,
  },
});

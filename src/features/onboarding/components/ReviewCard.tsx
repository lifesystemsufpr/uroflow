import { StyleSheet, View } from 'react-native';
import { CalendarCheckIcon, TargetIcon, type Icon } from '@/shared/icons';
import { Avatar, DashedDivider, Glyph, Text } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { calculateAge, formatDate } from '@/shared/lib/date';
import type { AppointmentDraft } from '@/features/consultations';
import type { OnboardingForm } from '../model/validation';

function Detail({ icon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <View style={styles.detailIcon}>
        <Glyph icon={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <Text variant="label">{label}</Text>
        <Text variant="bodyStrong">{value}</Text>
      </View>
    </View>
  );
}

export function ReviewCard({ form, appointment }: { form: OnboardingForm; appointment: AppointmentDraft | null }) {
  return (
    <View style={styles.card}>
      <View style={styles.guardian}>
        <Text variant="label" color={colors.primaryMist}>
          Responsável
        </Text>
        <Text variant="title" color={colors.onPrimary}>
          {form.guardianName}
        </Text>
      </View>

      <View style={styles.body}>
        <Text variant="label">Criança</Text>
        <View style={styles.childRow}>
          <Avatar name={form.childName} size={52} />
          <View>
            <Text variant="title">{form.childName}</Text>
            <Text variant="caption">{calculateAge(form.childDob) || 'Idade não calculada'}</Text>
          </View>
        </View>

        {form.childGoal || appointment ? <DashedDivider /> : null}
        {form.childGoal ? <Detail icon={TargetIcon} label="Objetivo" value={form.childGoal} /> : null}
        {appointment ? (
          <Detail
            icon={CalendarCheckIcon}
            label="Próxima consulta"
            value={`${formatDate(appointment.date)} às ${appointment.time}`}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  guardian: {
    backgroundColor: colors.primary,
    padding: space.lg,
    gap: 2,
  },
  body: {
    padding: space.lg,
    gap: space.md,
  },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  detailIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
});

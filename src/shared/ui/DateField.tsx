import { useState } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { CalendarDotsIcon, CaretDownIcon, CaretLeftIcon, CaretRightIcon } from '@/shared/icons';
import { colors, radius, space } from '@/shared/theme';
import { reveal } from '@/shared/motion';
import {
  MONTHS,
  WEEKDAYS,
  compareDays,
  formatLong,
  fromBr,
  monthGrid,
  shiftMonth,
  toBr,
  today,
  type Day,
} from '@/shared/lib/calendar';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { Glyph } from './Glyph';
import { PickerField } from './PickerField';
import { Text } from './Text';
import { Touchable } from './Touchable';

export type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  untilToday?: boolean;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

const YEARS_BACK = 30;
const YEARS_AHEAD = 5;

export function DateField({
  label,
  value,
  onChange,
  optional,
  untilToday = false,
  placeholder = 'Selecionar data',
  style,
}: DateFieldProps) {
  const now = today();
  const current = fromBr(value);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'days' | 'years'>('days');
  const [view, setView] = useState({ year: now.year, month: now.month });
  const [picked, setPicked] = useState<Day | null>(null);

  const maxYear = untilToday ? now.year : now.year + YEARS_AHEAD;
  const years = Array.from({ length: maxYear - (now.year - YEARS_BACK) + 1 }, (_, i) => maxYear - i);
  const isAfterMax = (day: Day) => untilToday && compareDays(day, now) > 0;
  const canGoNext = !untilToday || view.year < now.year || (view.year === now.year && view.month < now.month);

  const openPicker = () => {
    const start = current ?? now;
    setView({ year: start.year, month: start.month });
    setPicked(current);
    setMode('days');
    setOpen(true);
  };

  const confirm = () => {
    if (picked) onChange(toBr(picked));
    setOpen(false);
  };

  return (
    <>
      <PickerField
        label={label}
        optional={optional}
        display={current ? toBr(current) : null}
        placeholder={placeholder}
        icon={CalendarDotsIcon}
        onPress={openPicker}
        style={style}
      />
      <Dialog
        visible={open}
        onClose={() => setOpen(false)}
        eyebrow={label}
        title={picked ? formatLong(picked) : 'Escolha uma data'}
        footer={
          <>
            <Button label="Cancelar" variant="secondary" onPress={() => setOpen(false)} style={styles.grow} />
            <Button label="Confirmar" onPress={confirm} disabled={!picked} style={styles.grow} />
          </>
        }
      >
        <View style={styles.nav}>
          <Touchable
            onPress={() => setView((v) => shiftMonth(v.year, v.month, -1))}
            style={styles.arrow}
            accessibilityLabel="Mês anterior"
          >
            <Glyph icon={CaretLeftIcon} size={16} color={colors.primary} weight="bold" />
          </Touchable>
          <Touchable
            onPress={() => setMode((m) => (m === 'days' ? 'years' : 'days'))}
            style={styles.monthButton}
            accessibilityLabel="Escolher ano"
          >
            <Text variant="heading" color={colors.primary}>
              {MONTHS[view.month]} {view.year}
            </Text>
            <Glyph icon={CaretDownIcon} size={14} color={colors.primary} weight="bold" />
          </Touchable>
          <Touchable
            onPress={() => setView((v) => shiftMonth(v.year, v.month, 1))}
            disabled={!canGoNext}
            style={[styles.arrow, !canGoNext && styles.hidden]}
            accessibilityLabel="Próximo mês"
          >
            <Glyph icon={CaretRightIcon} size={16} color={colors.primary} weight="bold" />
          </Touchable>
        </View>

        {mode === 'years' ? (
          <Animated.View key="years" entering={reveal()}>
            <ScrollView style={styles.years} contentContainerStyle={styles.yearGrid} showsVerticalScrollIndicator={false}>
              {years.map((year) => {
                const active = year === view.year;
                return (
                  <Touchable
                    key={year}
                    onPress={() => {
                      setView((v) => ({ year, month: untilToday && year === now.year ? Math.min(v.month, now.month) : v.month }));
                      setMode('days');
                    }}
                    style={[styles.yearCell, active && styles.cellActive]}
                  >
                    <Text variant="bodyStrong" color={active ? colors.onPrimary : colors.text}>
                      {year}
                    </Text>
                  </Touchable>
                );
              })}
            </ScrollView>
          </Animated.View>
        ) : (
          <Animated.View key={`${view.year}-${view.month}`} entering={reveal()}>
            <View style={styles.row}>
              {WEEKDAYS.map((weekday, index) => (
                <Text key={index} variant="label" align="center" style={styles.cell}>
                  {weekday}
                </Text>
              ))}
            </View>
            <View style={styles.grid}>
              {monthGrid(view.year, view.month).map((day, index) => {
                if (!day) return <View key={index} style={styles.cell} />;
                const date = { ...view, day };
                const selected = !!picked && compareDays(picked, date) === 0;
                const isToday = compareDays(now, date) === 0;
                const disabled = isAfterMax(date);
                return (
                  <View key={index} style={styles.cell}>
                    <Touchable
                      onPress={() => setPicked(date)}
                      disabled={disabled}
                      accessibilityLabel={formatLong(date)}
                      accessibilityState={{ selected, disabled }}
                      style={[styles.day, isToday && styles.today, selected && styles.cellActive]}
                    >
                      <Text
                        variant="bodyStrong"
                        color={selected ? colors.onPrimary : disabled ? colors.line : colors.text}
                      >
                        {day}
                      </Text>
                    </Touchable>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    opacity: 0,
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  row: {
    flexDirection: 'row',
    marginBottom: space.xxs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    paddingVertical: 2,
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  today: {
    borderWidth: 1.5,
    borderColor: colors.primarySoft,
  },
  cellActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  years: {
    maxHeight: 300,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  yearCell: {
    width: '31%',
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

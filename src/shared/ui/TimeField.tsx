import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { ClockIcon } from '@/shared/icons';
import { colors, fonts, radius, space } from '@/shared/theme';
import { fromTime, toTime } from '@/shared/lib/calendar';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { PickerField } from './PickerField';
import { Text } from './Text';
import { WHEEL_ITEM, WHEEL_VISIBLE, WheelColumn } from './WheelColumn';

export type TimeFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

const now = () => {
  const date = new Date();
  return { hour: date.getHours(), minute: date.getMinutes() };
};

export function TimeField({ label, value, onChange, placeholder = 'Selecionar', style }: TimeFieldProps) {
  const current = fromTime(value);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(() => current ?? now());

  const openPicker = () => {
    setTime(current ?? now());
    setOpen(true);
  };

  return (
    <>
      <PickerField
        label={label}
        display={current ? value : null}
        placeholder={placeholder}
        icon={ClockIcon}
        onPress={openPicker}
        style={style}
      />
      <Dialog
        visible={open}
        onClose={() => setOpen(false)}
        eyebrow={label}
        title="Escolha o horário"
        footer={
          <>
            <Button label="Cancelar" variant="secondary" onPress={() => setOpen(false)} style={styles.grow} />
            <Button
              label="Confirmar"
              onPress={() => {
                onChange(toTime(time.hour, time.minute));
                setOpen(false);
              }}
              style={styles.grow}
            />
          </>
        }
      >
        <View style={styles.labels}>
          <Text variant="label" align="center" style={styles.grow}>
            Hora
          </Text>
          <View style={styles.separatorSpace} />
          <Text variant="label" align="center" style={styles.grow}>
            Minutos
          </Text>
        </View>
        <View style={styles.wheels}>
          <View pointerEvents="none" style={styles.band} />
          <WheelColumn
            label="Hora"
            values={HOURS}
            value={time.hour}
            onChange={(hour) => setTime((t) => ({ ...t, hour }))}
          />
          <Text style={styles.colon}>:</Text>
          <WheelColumn
            label="Minutos"
            values={MINUTES}
            value={time.minute}
            onChange={(minute) => setTime((t) => ({ ...t, minute }))}
          />
        </View>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  grow: {
    flex: 1,
  },
  labels: {
    flexDirection: 'row',
  },
  separatorSpace: {
    width: 24,
  },
  wheels: {
    flexDirection: 'row',
    alignItems: 'center',
    height: WHEEL_ITEM * WHEEL_VISIBLE,
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: WHEEL_ITEM * Math.floor(WHEEL_VISIBLE / 2),
    height: WHEEL_ITEM,
    borderRadius: radius.md,
    backgroundColor: colors.primaryMist,
  },
  colon: {
    width: 24,
    textAlign: 'center',
    fontFamily: fonts.heavy,
    fontSize: 26,
    color: colors.primary,
  },
});

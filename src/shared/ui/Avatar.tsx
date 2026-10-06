import { StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/shared/theme';
import { initials } from '@/shared/lib/formatters';
import { Text } from './Text';

export type AvatarProps = {
  name?: string;
  size?: number;
  background?: string;
  color?: string;
};

export function Avatar({ name, size = 36, background = colors.primaryMist, color = colors.primary }: AvatarProps) {
  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: size / 2, backgroundColor: background }]}>
      <Text style={{ fontFamily: fonts.heavy, fontSize: size * 0.4, lineHeight: size * 0.5, color }}>
        {initials(name) || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

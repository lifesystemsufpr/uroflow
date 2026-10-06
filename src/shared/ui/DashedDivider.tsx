import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/shared/theme';

export function DashedDivider({ color = colors.line, style }: { color?: string; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.line, { borderColor: color }, style]} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 1,
  },
});

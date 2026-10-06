import { StyleSheet, View } from 'react-native';

export type DotsProps = {
  total?: number;
  filled: number;
  color: string;
  emptyColor: string;
};

export function Dots({ total = 7, filled, color, emptyColor }: DotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, index) => (
        <View key={index} style={[styles.dot, { backgroundColor: index < filled ? color : emptyColor }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

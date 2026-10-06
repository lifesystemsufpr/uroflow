import { StyleSheet, View } from 'react-native';
import { Text } from '@/shared/ui';
import { space } from '@/shared/theme';

export function StepIntro({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <View style={styles.intro}>
      <Text variant="label">{eyebrow}</Text>
      <Text variant="display">{title}</Text>
      <Text variant="body">{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: space.xs,
    marginBottom: space.xs,
  },
});

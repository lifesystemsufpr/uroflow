import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Icon } from '@/shared/icons';
import { Card, Glyph, ScrollScreen, Text } from '@/shared/ui';
import { colors, palette, radius, space, tones, type Tone } from '@/shared/theme';
import { reveal } from '@/shared/motion';
import { ChildSwitcher, useActiveChild } from '@/features/child';
import { eventCatalog } from '@/features/diary';
import { BarChart } from '../components/BarChart';
import { average, sum, weekDays, weekSample } from '../model/weekSample';

function Highlight({ label, value, icon, tone }: { label: string; value: string; icon: Icon; tone: Tone }) {
  return (
    <View style={[styles.highlight, { backgroundColor: tone.soft }]}>
      <Glyph icon={icon} size={20} color={tone.ink} />
      <Text variant="numberSm" color={tone.ink}>
        {value}
      </Text>
      <Text variant="label" color={tone.ink}>
        {label}
      </Text>
    </View>
  );
}

function ChartCard({
  title,
  data,
  tone,
  index,
  footer,
}: {
  title: string;
  data: number[];
  tone: Tone;
  index: number;
  footer?: string;
}) {
  return (
    <Animated.View entering={reveal(index * 80)}>
      <Card style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View style={[styles.swatch, { backgroundColor: tone.solid }]} />
          <Text variant="heading">{title}</Text>
        </View>
        <BarChart
          data={data}
          labels={weekDays}
          barColor={tone.solid}
          trackColor={tone.soft}
          textColor={colors.text}
          mutedColor={colors.textMuted}
        />
        {footer ? (
          <Text variant="caption" align="center">
            {footer}
          </Text>
        ) : null}
      </Card>
    </Animated.View>
  );
}

export function EvolutionScreen() {
  const child = useActiveChild();

  return (
    <ScrollScreen
      eyebrow="Últimos 7 dias"
      title="Evolução"
      subtitle={`Acompanhe as tendências e o progresso de ${child?.name || 'seu filho'}.`}
      right={<ChildSwitcher />}
    >
      <Animated.View entering={reveal()}>
        <Card variant="primary" style={styles.hero}>
          <Text variant="label" color={colors.primaryMist}>
            Xixis por dia
          </Text>
          <BarChart
            data={weekSample.pee}
            labels={weekDays}
            barColor={palette.cream}
            trackColor={colors.primarySoft}
            textColor={colors.onPrimary}
            mutedColor={colors.primaryMist}
            height={140}
          />
          <Text variant="caption" color={colors.primaryMist} align="center">
            Veja como os registros mudaram nos últimos dias.
          </Text>
        </Card>
      </Animated.View>

      <Animated.View entering={reveal(80)} style={styles.highlights}>
        <Highlight
          label="Xixis / dia"
          value={average(weekSample.pee).toFixed(1).replace('.', ',')}
          icon={eventCatalog.pee.icon}
          tone={tones.marigold}
        />
        <Highlight label="Escapes" value={String(sum(weekSample.escape))} icon={eventCatalog.escape.icon} tone={tones.rose} />
        <Highlight
          label="ml / dia"
          value={String(Math.round(average(weekSample.water)))}
          icon={eventCatalog.water.icon}
          tone={tones.lagoon}
        />
      </Animated.View>

      <ChartCard title="Escapes" data={weekSample.escape} tone={tones.rose} index={2} />
      <ChartCard title="Líquidos (ml)" data={weekSample.water} tone={tones.lagoon} index={3} />
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: space.md,
  },
  highlights: {
    flexDirection: 'row',
    gap: space.sm,
  },
  highlight: {
    flex: 1,
    gap: 2,
    padding: space.md,
    borderRadius: radius.lg,
  },
  chartCard: {
    gap: space.md,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

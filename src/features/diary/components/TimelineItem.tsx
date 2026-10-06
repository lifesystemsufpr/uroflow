import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { CaretDownIcon } from '@/shared/icons';
import { DashedDivider, Glyph, Text, Touchable } from '@/shared/ui';
import { colors, radius, space } from '@/shared/theme';
import { durations, easings, layout, listItem, reveal } from '@/shared/motion';
import { eventCatalog } from '../model/eventCatalog';
import { describeEvent, eventAnswers } from '../model/selectors';
import type { DiaryEvent } from '../types';

export type TimelineItemProps = {
  event: DiaryEvent;
  index: number;
  isLast: boolean;
};

export function TimelineItem({ event, index, isLast }: TimelineItemProps) {
  const meta = eventCatalog[event.type];
  const summary = describeEvent(event);
  const answers = eventAnswers(event);
  const [open, setOpen] = useState(false);
  const turn = useSharedValue(0);

  useEffect(() => {
    turn.value = withTiming(open ? 1 : 0, { duration: durations.base, easing: easings.out });
  }, [open, turn]);

  const caretStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.value * 180}deg` }] }));

  return (
    <Animated.View entering={listItem(index)} style={styles.row}>
      <View style={styles.rail}>
        <Text variant="label" color={colors.textMuted} style={styles.time}>
          {event.time}
        </Text>
        <View style={[styles.dot, { backgroundColor: meta.tone.solid }]} />
        {!isLast ? <View style={styles.line} /> : null}
      </View>

      <Animated.View layout={layout} style={styles.cardWrap}>
        <Touchable
          onPress={() => setOpen((value) => !value)}
          effect="tint"
          disabled={answers.length === 0}
          accessibilityLabel={`${meta.title} às ${event.time}`}
          accessibilityHint={open ? 'Toque para recolher' : 'Toque para ver as respostas'}
          accessibilityState={{ expanded: open }}
          style={styles.card}
        >
          <View style={styles.header}>
            <View style={[styles.iconBox, { backgroundColor: meta.tone.soft }]}>
              <Glyph icon={meta.icon} size={20} color={meta.tone.ink} />
            </View>
            <View style={styles.headerText}>
              <Text variant="heading">{meta.title}</Text>
              {summary ? (
                <Text variant="caption" numberOfLines={1}>
                  {summary}
                </Text>
              ) : null}
            </View>
            {answers.length > 0 ? (
              <Animated.View style={[styles.caret, caretStyle]}>
                <Glyph icon={CaretDownIcon} size={14} color={colors.primary} weight="bold" />
              </Animated.View>
            ) : null}
          </View>

          {open ? (
            <Animated.View entering={reveal()} style={styles.answers}>
              {answers.map((item, i) => (
                <View key={item.question}>
                  {i > 0 ? <DashedDivider /> : null}
                  <View style={styles.answer}>
                    <Text variant="caption">{item.question}</Text>
                    <Text variant="bodyStrong" color={colors.primary}>
                      {item.answer}
                    </Text>
                  </View>
                </View>
              ))}
            </Animated.View>
          ) : null}
        </Touchable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.sm,
  },
  rail: {
    width: 44,
    alignItems: 'center',
    paddingTop: space.md,
    gap: 6,
  },
  time: {
    letterSpacing: 0.5,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: colors.background,
  },
  line: {
    flex: 1,
    width: 2,
    borderRadius: 1,
    backgroundColor: colors.line,
    marginBottom: -space.sm,
  },
  cardWrap: {
    flex: 1,
    marginBottom: space.sm,
  },
  card: {
    padding: space.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 1,
  },
  caret: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answers: {
    marginTop: space.sm,
    paddingTop: space.xxs,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  answer: {
    gap: 1,
    paddingVertical: space.xs,
  },
});

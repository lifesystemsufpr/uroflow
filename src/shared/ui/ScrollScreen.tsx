import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, space } from '@/shared/theme';
import { Grain } from './Grain';
import { WaveBand, bandColor, type BandTone } from './WaveBand';
import { useTabBarInset } from './layout';
import { Text } from './Text';

export type ScrollScreenProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  right?: ReactNode;
  hero?: ReactNode;
  band?: BandTone;
  children: ReactNode;
};

const BAR_HEIGHT = 52;
const BAND_REACH = 214;

export function ScrollScreen({ title, eyebrow, subtitle, right, hero, band = 'soft', children }: ScrollScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = useTabBarInset();
  const scrollY = useSharedValue(0);
  const [heroBottom, setHeroBottom] = useState(0);
  const bandHeight = Math.max(insets.top + BAND_REACH, heroBottom + space.xl);
  const strong = band === 'strong';

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [40, 90], [0, 1], 'clamp'),
  }));

  const heroStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 90], [1, 0], 'clamp'),
    transform: [{ translateY: interpolate(scrollY.value, [0, 120], [0, -24], 'clamp') }],
  }));

  return (
    <View style={styles.root}>
      <Grain />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.bar,
          { paddingTop: insets.top, height: insets.top + BAR_HEIGHT, backgroundColor: strong ? bandColor('strong') : colors.background },
          barStyle,
        ]}
      >
        <Text numberOfLines={1} style={[styles.compactTitle, strong && styles.compactTitleStrong]}>
          {title}
        </Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + space.lg, paddingBottom: bottomInset }]}
      >
        <WaveBand height={bandHeight} tone={band} />
        <Animated.View
          style={[styles.hero, heroStyle]}
          onLayout={(e) => setHeroBottom(e.nativeEvent.layout.y + e.nativeEvent.layout.height)}
        >
          {hero ?? (
            <View style={styles.heroRow}>
              <View style={styles.heroText}>
                {eyebrow ? <Text variant="label">{eyebrow}</Text> : null}
                <Text variant="display">{title}</Text>
              </View>
              {right}
            </View>
          )}
          {!hero && subtitle ? (
            <Text variant="body" style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </Animated.View>
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    justifyContent: 'center',
    paddingHorizontal: space.gutter,
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  compactTitle: {
    fontFamily: fonts.heavy,
    fontSize: 17,
    color: colors.primary,
  },
  compactTitleStrong: {
    color: colors.onPrimary,
  },
  hero: {
    marginBottom: space.md,
  },
  content: {
    paddingHorizontal: space.gutter,
    gap: space.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.sm,
  },
  heroText: {
    flex: 1,
    gap: 2,
  },
  subtitle: {
    marginTop: space.xxs,
  },
});

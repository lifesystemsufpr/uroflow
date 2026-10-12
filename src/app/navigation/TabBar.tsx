import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ChartLineUpIcon, HouseLineIcon, NotebookIcon, StethoscopeIcon, type Icon } from '@/shared/icons';
import { Glyph, TAB_BAR_HEIGHT, Text, useTabBarBottom } from '@/shared/ui';
import { colors, radius, shadow, space } from '@/shared/theme';
import { tabSpring } from '@/shared/motion';
import type { SwipeTabBarProps } from './swipeTabs';
import type { TabParamList } from './types';

const icons: Record<keyof TabParamList, Icon> = {
  Home: HouseLineIcon,
  Consultations: StethoscopeIcon,
  Diary: NotebookIcon,
  Evolution: ChartLineUpIcon,
};

const INSET = 6;

function TabItem({ icon, label, focused, onPress, onLongPress }: {
  icon: Icon;
  label: string;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const lift = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    lift.value = withSpring(focused ? 1 : 0, tabSpring);
  }, [focused, lift]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -lift.value * 2 }, { scale: 1 + lift.value * 0.1 }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      style={styles.item}
    >
      <Animated.View style={iconStyle}>
        <Glyph
          icon={icon}
          size={22}
          weight={focused ? 'fill' : 'regular'}
          color={focused ? colors.primary : colors.primaryMist}
        />
      </Animated.View>
      <Text variant="label" color={focused ? colors.primary : colors.primaryMist} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

export function TabBar({ state, descriptors, navigation, position }: SwipeTabBarProps) {
  const bottom = useTabBarBottom();
  const [width, setWidth] = useState(0);
  const itemWidth = width / state.routes.length;

  const indicatorStyle = useAnimatedStyle(() => ({
    width: Math.max(itemWidth - INSET * 2, 0),
    transform: [{ translateX: position.value * itemWidth + INSET }],
  }));

  return (
    <View style={[styles.bar, { bottom }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width - INSET * 2)}>
      {width > 0 ? <Animated.View style={[styles.indicator, indicatorStyle]} /> : null}
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = typeof options.title === 'string' ? options.title : route.name;

        return (
          <TabItem
            key={route.key}
            icon={icons[route.name as keyof TabParamList]}
            label={label}
            focused={focused}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
            }}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: space.gutter,
    right: space.gutter,
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: INSET,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    ...shadow.lifted,
  },
  indicator: {
    position: 'absolute',
    left: INSET,
    top: INSET,
    bottom: INSET,
    borderRadius: radius.lg,
    backgroundColor: colors.onPrimary,
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 9.5,
    letterSpacing: 1,
  },
});

import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type Descriptor,
  type NavigationHelpers,
  type NavigationProp,
  type NavigatorTypeBagBase,
  type ParamListBase,
  type RouteProp,
  type StaticConfig,
  type TabActionHelpers,
  type TabNavigationState,
  TabRouter,
  type TabRouterOptions,
  type TypedNavigator,
  useNavigationBuilder,
} from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { colors } from '@/shared/theme';

export type SwipeTabNavigationOptions = {
  title?: string;
};

export type SwipeTabNavigationEventMap = {
  tabPress: { data: undefined; canPreventDefault: true };
  tabLongPress: { data: undefined };
};

export type SwipeTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
  NavigatorID extends string | undefined = undefined,
> = NavigationProp<
  ParamList,
  RouteName,
  NavigatorID,
  TabNavigationState<ParamList>,
  SwipeTabNavigationOptions,
  SwipeTabNavigationEventMap
> &
  TabActionHelpers<ParamList>;

export type SwipeTabBarProps = {
  state: TabNavigationState<ParamListBase>;
  navigation: NavigationHelpers<ParamListBase, SwipeTabNavigationEventMap>;
  descriptors: Record<
    string,
    Descriptor<SwipeTabNavigationOptions, SwipeTabNavigationProp<ParamListBase>, RouteProp<ParamListBase>>
  >;
  position: SharedValue<number>;
};

type SwipeTabNavigatorProps = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  TabNavigationState<ParamListBase>,
  SwipeTabNavigationOptions,
  SwipeTabNavigationEventMap,
  SwipeTabNavigationProp<ParamListBase>
> &
  TabRouterOptions & {
    tabBar: (props: SwipeTabBarProps) => ReactNode;
  };

const PARALLAX = 0.82;
const DEPTH_SCALE = 0.1;
const DEPTH_SHADE = 0.45;
const SWIPE_VELOCITY = 500;
const easing = Easing.bezier(0.22, 1, 0.36, 1);

const travelDuration = (distance: number) => Math.min(280 + (distance - 1) * 90, 520);

function Page({ index, position, width, focused, children }: {
  index: number;
  position: SharedValue<number>;
  width: number;
  focused: boolean;
  children: ReactNode;
}) {
  const pageStyle = useAnimatedStyle(() => {
    const depth = interpolate(position.value - index, [0, 1], [0, 1], 'clamp');
    return {
      transform: [
        { translateX: (index - position.value) * width + depth * width * PARALLAX },
        { scale: 1 - depth * DEPTH_SCALE },
      ],
    };
  });

  const shadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(position.value - index, [0, 1], [0, DEPTH_SHADE], 'clamp'),
  }));

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.page, pageStyle]}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      accessibilityElementsHidden={!focused}
    >
      {children}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.shade, shadeStyle]} />
    </Animated.View>
  );
}

function SwipeTabNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  tabBar,
}: SwipeTabNavigatorProps) {
  const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder<
    TabNavigationState<ParamListBase>,
    TabRouterOptions,
    TabActionHelpers<ParamListBase>,
    SwipeTabNavigationOptions,
    SwipeTabNavigationEventMap
  >(TabRouter, { id, initialRouteName, backBehavior, children, layout, screenListeners, screenOptions, screenLayout });

  const { width } = useWindowDimensions();
  const last = state.routes.length - 1;
  const position = useSharedValue(state.index);
  const target = useSharedValue(state.index);
  const origin = useSharedValue(state.index);
  const start = useSharedValue(state.index);

  useEffect(() => {
    if (target.value === state.index) return;
    const distance = Math.abs(state.index - position.value);
    target.value = state.index;
    position.value = withTiming(state.index, { duration: travelDuration(Math.max(distance, 1)), easing });
  }, [state.index, position, target]);

  const jumpTo = (index: number) => {
    const route = state.routes[index];
    if (route && index !== state.index) navigation.navigate(route.name, route.params);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-14, 14])
    .failOffsetY([-12, 12])
    .onStart(() => {
      cancelAnimation(position);
      start.value = position.value;
      origin.value = Math.round(position.value);
    })
    .onUpdate((e) => {
      const next = start.value - e.translationX / width;
      position.value = next < 0 ? next * 0.25 : next > last ? last + (next - last) * 0.25 : next;
    })
    .onEnd((e) => {
      const projected = position.value - (e.velocityX / width) * 0.18;
      const fling = Math.abs(e.velocityX) > SWIPE_VELOCITY ? -Math.sign(e.velocityX) : 0;
      const step = fling || Math.round(projected) - origin.value;
      const index = Math.min(Math.max(origin.value + Math.sign(step), 0), last);
      target.value = index;
      position.value = withTiming(index, { duration: travelDuration(1), easing });
      scheduleOnRN(jumpTo, index);
    });

  return (
    <NavigationContent>
      <View style={styles.root}>
        <GestureDetector gesture={pan}>
          <View style={styles.pages}>
            {state.routes.map((route, index) => (
              <Page key={route.key} index={index} position={position} width={width} focused={index === state.index}>
                {descriptors[route.key].render()}
              </Page>
            ))}
          </View>
        </GestureDetector>
        {tabBar({ state, navigation, descriptors, position })}
      </View>
    </NavigationContent>
  );
}

export type SwipeTabTypeBag<
  ParamList extends ParamListBase = ParamListBase,
  NavigatorID extends string | undefined = string | undefined,
> = {
  ParamList: ParamList;
  NavigatorID: NavigatorID;
  State: TabNavigationState<ParamList>;
  ScreenOptions: SwipeTabNavigationOptions;
  EventMap: SwipeTabNavigationEventMap;
  NavigationList: {
    [RouteName in keyof ParamList]: SwipeTabNavigationProp<ParamList, RouteName, NavigatorID>;
  };
  Navigator: typeof SwipeTabNavigator;
};

export function createSwipeTabNavigator<
  const ParamList extends ParamListBase,
  const NavigatorID extends string | undefined = string | undefined,
  const TypeBag extends NavigatorTypeBagBase = SwipeTabTypeBag<ParamList, NavigatorID>,
  const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>,
>(config?: Config): TypedNavigator<TypeBag, Config> {
  return createNavigatorFactory(SwipeTabNavigator)(config);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  pages: {
    flex: 1,
    overflow: 'hidden',
  },
  page: {
    backgroundColor: colors.background,
  },
  shade: {
    backgroundColor: colors.primaryDark,
  },
});

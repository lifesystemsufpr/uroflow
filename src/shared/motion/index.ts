import {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';

export const easings = {
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  emphasized: Easing.bezier(0.2, 0, 0, 1),
} as const;

export const durations = {
  fast: 140,
  base: 220,
  slow: 360,
} as const;

export const tabSpring = { damping: 16, stiffness: 220, mass: 0.8 } as const;

export const reveal = (delay = 0) => FadeIn.duration(durations.slow).delay(delay).easing(easings.out);

export const listItem = (index = 0) =>
  FadeInDown.duration(durations.base)
    .delay(Math.min(index, 8) * 35)
    .easing(easings.out)
    .withInitialValues({ opacity: 0, transform: [{ translateY: 10 }] });

export const tickIn = FadeInDown.duration(durations.base)
  .easing(easings.out)
  .withInitialValues({ opacity: 0, transform: [{ translateY: 16 }] });

export const tickOut = FadeOutUp.duration(durations.fast);

export const slideStep = (direction: 1 | -1) =>
  (direction === 1 ? FadeInRight : FadeInLeft)
    .duration(durations.slow)
    .easing(easings.emphasized)
    .withInitialValues({ opacity: 0, transform: [{ translateX: 28 * direction }] });

export const layout = LinearTransition.duration(durations.base).easing(easings.inOut);

import { useEffect, useRef, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { durations, easings } from './index';

export const usePresence = (visible: boolean, onClosed?: () => void) => {
  const [mounted, setMounted] = useState(visible);
  const wasMounted = useRef(mounted);
  const progress = useSharedValue(0);

  if (visible && !mounted) setMounted(true);

  useEffect(() => {
    if (wasMounted.current && !mounted) onClosed?.();
    wasMounted.current = mounted;
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (visible) {
      progress.value = withTiming(1, { duration: durations.base, easing: easings.emphasized });
      return;
    }
    progress.value = withTiming(0, { duration: durations.fast }, (finished) => {
      if (finished) scheduleOnRN(setMounted, false);
    });
  }, [visible, mounted, progress]);

  return { mounted, progress };
};

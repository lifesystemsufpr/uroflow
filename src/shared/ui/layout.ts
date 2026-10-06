import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_HEIGHT = 66;
export const TAB_BAR_GAP = 10;

export const useTabBarBottom = () => Math.max(useSafeAreaInsets().bottom, TAB_BAR_GAP);

export const useTabBarInset = () => useTabBarBottom() + TAB_BAR_HEIGHT + 24;

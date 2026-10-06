import { View, type StyleProp, type ViewStyle } from 'react-native';
import type { Icon, IconWeight } from '@/shared/icons';
import { radius, type Tone } from '@/shared/theme';
import { Glyph } from './Glyph';

export type IconBadgeProps = {
  icon: Icon;
  tone: Tone;
  size?: number;
  shape?: 'circle' | 'square';
  inverted?: boolean;
  weight?: IconWeight;
  style?: StyleProp<ViewStyle>;
};

export function IconBadge({ icon, tone, size = 40, shape = 'circle', inverted = false, weight, style }: IconBadgeProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: shape === 'circle' ? size / 2 : radius.sm,
          backgroundColor: inverted ? tone.solid : tone.soft,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Glyph icon={icon} size={Math.round(size * 0.52)} color={inverted ? tone.soft : tone.ink} weight={weight} />
    </View>
  );
}

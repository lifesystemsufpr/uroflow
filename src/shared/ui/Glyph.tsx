import type { Icon, IconWeight } from '@/shared/icons';
import { colors } from '@/shared/theme';

export type GlyphProps = {
  icon: Icon;
  size?: number;
  color?: string;
  weight?: IconWeight;
  duotoneColor?: string;
};

export function Glyph({ icon: IconComponent, size = 22, color = colors.primary, weight = 'duotone', duotoneColor }: GlyphProps) {
  return (
    <IconComponent
      size={size}
      color={color}
      weight={weight}
      duotoneColor={duotoneColor ?? color}
      duotoneOpacity={0.22}
    />
  );
}

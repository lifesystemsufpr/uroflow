import {
  DropIcon,
  MoonStarsIcon,
  SmileySadIcon,
  ToiletIcon,
  ToiletPaperIcon,
  WarningCircleIcon,
  type Icon,
} from '@/shared/icons';
import { tones, type Tone } from '@/shared/theme';
import type { EventType } from '../types';

export type EventMeta = {
  title: string;
  action: string;
  icon: Icon;
  tone: Tone;
};

export const eventCatalog: Record<EventType, EventMeta> = {
  water: { title: 'Líquido', action: 'Líquidos', icon: DropIcon, tone: tones.lagoon },
  pee: { title: 'Xixi', action: 'Xixi', icon: ToiletIcon, tone: tones.marigold },
  poop: { title: 'Cocô', action: 'Cocô', icon: ToiletPaperIcon, tone: tones.umber },
  night: { title: 'Noite', action: 'Noite', icon: MoonStarsIcon, tone: tones.violet },
  escape: { title: 'Escape', action: 'Escape', icon: WarningCircleIcon, tone: tones.rose },
  pain: { title: 'Desconforto', action: 'Desconforto', icon: SmileySadIcon, tone: tones.periwinkle },
};

export const quickLogOrder: EventType[] = ['water', 'pee', 'poop', 'night', 'escape', 'pain'];

export const filterOptions: { value: 'all' | EventType; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pee', label: 'Xixi' },
  { value: 'water', label: 'Líquido' },
  { value: 'poop', label: 'Cocô' },
  { value: 'escape', label: 'Escape' },
];

import { Waves, Wind, Sailboat, Anchor } from 'lucide-react';
import type { SportType } from '../../types/spot';

const icons: Record<SportType, typeof Waves> = {
  surf: Waves,
  kitesurf: Wind,
  windsurf: Sailboat,
  paddle: Anchor,
};

const colors: Record<SportType, string> = {
  surf: '#0E7490',
  kitesurf: '#7C3AED',
  windsurf: '#0D9488',
  paddle: '#059669',
};

export function SportIcon({ sport, size = 16 }: { sport: SportType; size?: number }) {
  const Icon = icons[sport];
  return <Icon size={size} color={colors[sport]} />;
}

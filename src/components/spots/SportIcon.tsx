import { Waves, Wind, Sailboat, PersonStanding } from 'lucide-react';
import type { SportType } from '../../types/spot';

const icons: Record<SportType, typeof Waves> = {
  surf: Waves,
  kitesurf: Wind,
  windsurf: Sailboat,
  paddle: PersonStanding,
};

const colors: Record<SportType, string> = {
  surf: '#0E7490',
  kitesurf: '#7C3AED',
  windsurf: '#0D9488',
  paddle: '#059669',
};

const labels: Record<SportType, string> = {
  surf: 'Surf',
  kitesurf: 'Kitesurf',
  windsurf: 'Windsurf',
  paddle: 'Paddle',
};

export function SportIcon({ sport, size = 16 }: { sport: SportType; size?: number }) {
  const Icon = icons[sport];
  return (
    <span className="group relative inline-flex">
      <Icon size={size} color={colors[sport]} />
      <span className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-text px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 z-50">
        {labels[sport]}
      </span>
    </span>
  );
}

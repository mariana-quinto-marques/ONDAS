import { Link } from 'react-router-dom';
import { Waves, Wind } from 'lucide-react';
import type { Spot } from '../../types/spot';
import type { SpotConditions } from '../../types/conditions';
import { ConditionBadge } from './ConditionBadge';
import { getBestSportForConditions } from '../../utils/conditionScoring';
import { formatWaveHeight, formatWindSpeed } from '../../utils/formatters';
import { regionColors } from '../../data/regions';

interface SpotCardCompactProps {
  spot: Spot;
  conditions?: SpotConditions;
}

export function SpotCardCompact({ spot, conditions }: SpotCardCompactProps) {
  const best = conditions
    ? getBestSportForConditions(spot.sportTypes, conditions.marine, conditions.weather)
    : null;

  return (
    <Link
      to={`/spot/${spot.id}`}
      className="flex shrink-0 flex-col justify-between rounded-2xl bg-white/85 backdrop-blur-md border border-border/50 p-3 w-[200px] transition-all hover:shadow-md no-underline"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display truncate text-sm text-text">
            {spot.name}
          </h3>
          {best && <ConditionBadge quality={best.quality} />}
        </div>
        <span
          className="mt-0.5 block text-[10px] font-medium"
          style={{ color: regionColors[spot.region] }}
        >
          {spot.region}
        </span>
      </div>

      {conditions ? (
        <div className="mt-2 flex items-center gap-3 text-[11px] text-text-secondary">
          <span className="flex items-center gap-1">
            <Waves size={10} className="text-ocean" />
            {formatWaveHeight(conditions.marine.waveHeight)}
          </span>
          <span className="flex items-center gap-1">
            <Wind size={10} className="text-teal" />
            {formatWindSpeed(conditions.weather.windSpeed)}
          </span>
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <div className="h-3 w-12 animate-pulse rounded bg-surface-warm" />
          <div className="h-3 w-12 animate-pulse rounded bg-surface-warm" />
        </div>
      )}
    </Link>
  );
}

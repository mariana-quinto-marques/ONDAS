import { Link } from 'react-router-dom';
import { MapPin, Thermometer, ArrowRight, Waves, Wind } from 'lucide-react';
import type { Spot } from '../../types/spot';
import type { SpotConditions } from '../../types/conditions';
import { ConditionBadge } from './ConditionBadge';
import { SportIcon } from './SportIcon';
import { getBestSportForConditions } from '../../utils/conditionScoring';
import { formatWaveHeight, formatWindSpeed, formatTemperature } from '../../utils/formatters';
import { degreesToCompass } from '../../utils/windDirection';
import { StarRating } from './StarRating';
import { regionColors } from '../../data/regions';

interface SpotCardProps {
  spot: Spot;
  conditions?: SpotConditions;
}

export function SpotCard({ spot, conditions }: SpotCardProps) {
  const best = conditions
    ? getBestSportForConditions(spot.sportTypes, conditions.marine, conditions.weather)
    : null;

  return (
    <Link
      to={`/spot/${spot.id}`}
      className="block rounded-2xl bg-white/80 backdrop-blur-sm border border-border/60 p-4 transition-all hover:shadow-md hover:border-ocean/20 no-underline"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display truncate text-base text-text">
            {spot.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-1.5">
            <MapPin size={11} className="shrink-0 text-text-secondary" />
            <span
              className="text-xs font-medium"
              style={{ color: regionColors[spot.region] }}
            >
              {spot.region}
            </span>
          </div>
          <StarRating stars={spot.googleRating.stars} reviewCount={spot.googleRating.reviewCount} size={10} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {spot.sportTypes.map((sport) => (
            <SportIcon key={sport} sport={sport} size={14} />
          ))}
        </div>
      </div>

      {conditions ? (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Waves size={12} className="text-ocean" />
              {formatWaveHeight(conditions.marine.waveHeight)}
            </span>
            <span className="flex items-center gap-1">
              <Wind size={12} className="text-teal" />
              {formatWindSpeed(conditions.weather.windSpeed)}{' '}
              {degreesToCompass(conditions.weather.windDirection)}
            </span>
            <span className="flex items-center gap-1">
              <Thermometer size={12} className="text-rose" />
              {formatTemperature(conditions.weather.temperature)}
            </span>
          </div>
          {best && <ConditionBadge quality={best.quality} />}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-4 w-16 animate-pulse rounded bg-surface-warm" />
          <div className="h-4 w-16 animate-pulse rounded bg-surface-warm" />
          <div className="h-4 w-12 animate-pulse rounded bg-surface-warm" />
        </div>
      )}

      <div className="mt-2 flex items-center justify-end">
        <ArrowRight size={14} className="text-border" />
      </div>
    </Link>
  );
}

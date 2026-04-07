import { useMemo } from 'react';
import type { Spot } from '../../types/spot';
import type { SpotConditions } from '../../types/conditions';
import { SpotCard } from './SpotCard';
import { useFilterStore } from '../../stores/filterStore';
import { getBestSportForConditions, scoreForSport } from '../../utils/conditionScoring';
import type { ConditionQuality } from '../../types/conditions';

const qualityRank: Record<ConditionQuality, number> = {
  good: 0,
  fair: 1,
  poor: 2,
};

interface SpotListProps {
  spots: Spot[];
  conditions?: SpotConditions[];
}

export function SpotList({ spots, conditions }: SpotListProps) {
  const activeSport = useFilterStore((s) => s.activeSport);

  const sorted = useMemo(() => {
    if (!conditions || conditions.length === 0) return spots;

    return [...spots].sort((a, b) => {
      const ca = conditions.find((c) => c.spotId === a.id);
      const cb = conditions.find((c) => c.spotId === b.id);
      if (!ca && !cb) return 0;
      if (!ca) return 1;
      if (!cb) return -1;

      const qa = activeSport
        ? scoreForSport(activeSport, ca.marine, ca.weather)
        : getBestSportForConditions(a.sportTypes, ca.marine, ca.weather).quality;
      const qb = activeSport
        ? scoreForSport(activeSport, cb.marine, cb.weather)
        : getBestSportForConditions(b.sportTypes, cb.marine, cb.weather).quality;
      return qualityRank[qa] - qualityRank[qb];
    });
  }, [spots, conditions, activeSport]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-xs font-medium text-text-secondary">
        {sorted.length} spot{sorted.length !== 1 ? 's' : ''}
      </p>
      {sorted.map((spot) => (
        <SpotCard
          key={spot.id}
          spot={spot}
          conditions={conditions?.find((c) => c.spotId === spot.id)}
          activeSport={activeSport}
        />
      ))}
    </div>
  );
}

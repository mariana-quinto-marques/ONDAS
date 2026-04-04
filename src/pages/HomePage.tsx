import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { spots } from '../data/spots';
import { SpotMap } from '../components/map/SpotMap';
import { SpotList } from '../components/spots/SpotList';
import { SpotCardCompact } from '../components/spots/SpotCardCompact';
import { useAllSpotsConditions } from '../hooks/useAllSpotsConditions';
import { useFilterStore } from '../stores/filterStore';
import { getBestSportForConditions } from '../utils/conditionScoring';
import type { ConditionQuality } from '../types/conditions';

const qualityRank: Record<ConditionQuality, number> = { good: 0, fair: 1, poor: 2 };

export function HomePage() {
  const { data: conditions, isLoading } = useAllSpotsConditions();
  const [expanded, setExpanded] = useState(false);
  const activeSport = useFilterStore((s) => s.activeSport);

  const sorted = useMemo(() => {
    const filtered = activeSport
      ? spots.filter((s) => s.sportTypes.includes(activeSport))
      : spots;

    if (!conditions || conditions.length === 0) return filtered;

    return [...filtered].sort((a, b) => {
      const ca = conditions.find((c) => c.spotId === a.id);
      const cb = conditions.find((c) => c.spotId === b.id);
      if (!ca && !cb) return 0;
      if (!ca) return 1;
      if (!cb) return -1;
      const qa = getBestSportForConditions(a.sportTypes, ca.marine, ca.weather).quality;
      const qb = getBestSportForConditions(b.sportTypes, cb.marine, cb.weather).quality;
      return qualityRank[qa] - qualityRank[qb];
    });
  }, [conditions, activeSport]);

  return (
    <>
      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden lg:flex lg:h-full lg:w-full">
        <aside className="w-[340px] shrink-0 overflow-y-auto border-r border-border/50 bg-bg">
          {isLoading && (
            <p className="p-4 text-xs text-text-secondary animate-pulse">Loading conditions...</p>
          )}
          <SpotList spots={spots} conditions={conditions} />
        </aside>
        <div className="relative flex-1">
          <SpotMap spots={spots} conditions={conditions} />
        </div>
      </div>

      {/* ===== MOBILE LAYOUT — Map-first with floating carousel ===== */}
      <div className="relative h-full lg:hidden">
        <div className="absolute inset-0">
          <div className="relative h-full w-full map-fade">
            <SpotMap spots={spots} conditions={conditions} />
          </div>
        </div>

        {isLoading && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500] rounded-full bg-white/80 backdrop-blur-md border border-border/50 px-3 py-1">
            <span className="text-[10px] text-text-secondary animate-pulse">Loading conditions...</span>
          </div>
        )}

        <div className={`fixed left-0 right-0 z-[1000] transition-all duration-300 ease-out ${
          expanded ? 'top-[20%] bottom-0' : 'bottom-14'
        }`}>
          <div className="flex justify-center pb-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border/50 px-4 py-1.5 text-[11px] font-medium text-text-secondary transition-all hover:text-text shadow-sm"
            >
              {expanded ? (
                <><ChevronDown size={14} />Map view</>
              ) : (
                <><ChevronUp size={14} />{sorted.length} spots</>
              )}
            </button>
          </div>

          {expanded ? (
            <div className="h-full overflow-y-auto bg-bg/95 backdrop-blur-md rounded-t-2xl border-t border-border/50">
              <SpotList spots={spots} conditions={conditions} />
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
              {sorted.map((spot) => (
                <SpotCardCompact
                  key={spot.id}
                  spot={spot}
                  conditions={conditions?.find((c) => c.spotId === spot.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

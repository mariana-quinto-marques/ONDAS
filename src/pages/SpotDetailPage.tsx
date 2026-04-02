import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Lightbulb } from 'lucide-react';
import { spots } from '../data/spots';
import { useSpotConditions } from '../hooks/useSpotConditions';
import { useAllSpotsConditions } from '../hooks/useAllSpotsConditions';
import { generateApproximateTides } from '../utils/tideCalculation';
import { CurrentConditions } from '../components/conditions/CurrentConditions';
import { ForecastTimeline } from '../components/conditions/ForecastTimeline';
import { TideChart } from '../components/conditions/TideChart';
import { ConditionReportForm } from '../components/community/ConditionReportForm';
import { ReportsList } from '../components/community/ReportsList';
import { SportIcon } from '../components/spots/SportIcon';
import { regionColors } from '../data/regions';

export function SpotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const spot = spots.find((s) => s.id === id);
  const { data: forecast, isLoading: forecastLoading } = useSpotConditions(id ?? '');
  const { data: allConditions } = useAllSpotsConditions();

  if (!spot) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-text-secondary">Spot not found</p>
        <Link to="/" className="mt-2 text-sm text-ocean hover:underline">Back to all spots</Link>
      </div>
    );
  }

  const currentConditions = allConditions?.find((c) => c.spotId === spot.id);

  // Generate approximate tide data (semi-diurnal model for Portugal)
  const tideData = useMemo(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    return generateApproximateTides(now, 48);
  }, []);

  const tideTimes = tideData.times;
  const tideSeaLevels = tideData.heights;

  return (
    <div className="h-full overflow-y-auto pb-20 lg:pb-4">
    <div className="mx-auto max-w-2xl">
      <div className="p-4">
        <Link to="/" className="mb-3 inline-flex items-center gap-1 text-sm text-ocean hover:text-ocean-dark no-underline transition-colors">
          <ArrowLeft size={16} />
          All spots
        </Link>

        <h1 className="font-display text-2xl text-text">{spot.name}</h1>

        <div className="mt-1 flex items-center gap-2">
          <MapPin size={14} className="text-text-secondary" />
          <span className="text-sm font-medium" style={{ color: regionColors[spot.region] }}>{spot.region}</span>
          <span className="text-xs text-border">|</span>
          <div className="flex items-center gap-1">
            {spot.sportTypes.map((sport) => (<SportIcon key={sport} sport={sport} size={14} />))}
          </div>
        </div>

        <p className="mt-2 text-sm text-text-secondary">{spot.description}</p>
      </div>

      <div className="space-y-4 p-4">
        {forecastLoading && !currentConditions ? (
          <div className="space-y-3">
            <div className="h-48 animate-pulse rounded-2xl bg-surface-warm" />
            <div className="h-24 animate-pulse rounded-2xl bg-surface-warm" />
          </div>
        ) : currentConditions ? (
          <CurrentConditions
            marine={currentConditions.marine} weather={currentConditions.weather}
            sportTypes={spot.sportTypes}
            tideTimes={tideTimes.length > 0 ? tideTimes : undefined}
            tideSeaLevels={tideSeaLevels.length > 0 ? tideSeaLevels : undefined}
          />
        ) : null}

        {forecast && <ForecastTimeline hourly={forecast.hourly} />}
        {tideTimes.length > 0 && <TideChart times={tideTimes} seaLevels={tideSeaLevels} />}

        <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-border/60 p-4">
          <h3 className="font-display mb-3 flex items-center gap-2 text-lg text-text">
            <Lightbulb size={16} className="text-sand" />
            Fun Facts
          </h3>
          <div className="space-y-3">
            {spot.funFacts.map((fact, i) => (
              <div key={i} className="flex gap-3">
                <span className="shrink-0 font-display text-sm text-ocean">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-sm text-text-secondary">{fact}</p>
              </div>
            ))}
          </div>
        </div>

        <ConditionReportForm spotId={spot.id} />

        <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-border/60 p-4">
          <h3 className="font-display mb-3 text-lg text-text">Community Reports</h3>
          <ReportsList spotId={spot.id} />
        </div>
      </div>
    </div>
    </div>
  );
}

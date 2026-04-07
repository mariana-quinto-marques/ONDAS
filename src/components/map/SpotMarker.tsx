import { CircleMarker, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import type { Spot, SportType } from '../../types/spot';
import type { SpotConditions } from '../../types/conditions';
import { scoreForSport, getBestSportForConditions } from '../../utils/conditionScoring';
import { formatWaveHeight } from '../../utils/formatters';

const qualityColors = {
  good: '#0D9488',
  fair: '#D4A24E',
  poor: '#E87461',
};

const sportColors: Record<SportType, string> = {
  surf: '#0E7490',
  kitesurf: '#7C3AED',
  windsurf: '#0D9488',
  paddle: '#059669',
};

interface SpotMarkerProps {
  spot: Spot;
  conditions?: SpotConditions;
  activeSport?: SportType | null;
}

export function SpotMarker({ spot, conditions, activeSport }: SpotMarkerProps) {
  const navigate = useNavigate();

  let color: string;
  if (activeSport) {
    const quality = conditions
      ? scoreForSport(activeSport, conditions.marine, conditions.weather)
      : 'fair';
    // Use sport color at full opacity for good, muted for fair/poor
    color = quality === 'good'
      ? sportColors[activeSport]
      : quality === 'fair'
      ? qualityColors.fair
      : qualityColors.poor;
  } else {
    const quality = conditions
      ? getBestSportForConditions(spot.sportTypes, conditions.marine, conditions.weather).quality
      : 'fair';
    color = qualityColors[quality];
  }

  return (
    <CircleMarker
      center={[spot.coordinates.lat, spot.coordinates.lng]}
      radius={7}
      pathOptions={{
        color: '#FFFFFF',
        fillColor: color,
        fillOpacity: 0.9,
        weight: 2,
        opacity: 0.8,
      }}
      eventHandlers={{
        click: () => navigate(`/spot/${spot.id}`),
      }}
    >
      <Tooltip direction="top" offset={[0, -8]}>
        <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '12px' }}>
          {spot.name}
        </span>
        {conditions && (
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', marginLeft: '6px', opacity: 0.6 }}>
            {formatWaveHeight(conditions.marine.waveHeight)}
          </span>
        )}
      </Tooltip>
    </CircleMarker>
  );
}

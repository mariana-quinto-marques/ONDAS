import { CircleMarker, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import type { Spot } from '../../types/spot';
import type { SpotConditions } from '../../types/conditions';
import { getBestSportForConditions } from '../../utils/conditionScoring';
import { formatWaveHeight } from '../../utils/formatters';

const qualityColors = {
  good: '#0D9488',
  fair: '#D4A24E',
  poor: '#E87461',
};

interface SpotMarkerProps {
  spot: Spot;
  conditions?: SpotConditions;
}

export function SpotMarker({ spot, conditions }: SpotMarkerProps) {
  const navigate = useNavigate();
  const quality = conditions
    ? getBestSportForConditions(spot.sportTypes, conditions.marine, conditions.weather).quality
    : 'fair';

  const color = qualityColors[quality];

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

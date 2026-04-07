import { MapContainer, TileLayer } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Spot } from '../../types/spot';
import type { SpotConditions } from '../../types/conditions';
import { SpotMarker } from './SpotMarker';
import { useFilterStore } from '../../stores/filterStore';

const PORTUGAL_BOUNDS: LatLngBoundsExpression = [
  [36.9, -9.8],
  [42.2, -6.2],
];

interface SpotMapProps {
  spots: Spot[];
  conditions?: SpotConditions[];
}

export function SpotMap({ spots, conditions }: SpotMapProps) {
  const activeSport = useFilterStore((s) => s.activeSport);

  const filtered = activeSport
    ? spots.filter((s) => s.sportTypes.includes(activeSport))
    : spots;

  return (
    <MapContainer
      bounds={PORTUGAL_BOUNDS}
      boundsOptions={{ padding: [20, 20] }}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
      />
      {filtered.map((spot) => (
        <SpotMarker
          key={spot.id}
          spot={spot}
          conditions={conditions?.find((c) => c.spotId === spot.id)}
          activeSport={activeSport}
        />
      ))}
    </MapContainer>
  );
}

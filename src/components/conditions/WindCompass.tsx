import { degreesToCompass } from '../../utils/windDirection';

export function WindCompass({
  direction,
  speed,
}: {
  direction: number;
  speed: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#E4DDD4" strokeWidth="1.5" />
          <text x="32" y="10" textAnchor="middle" fill="#6B8299" fontSize="8">N</text>
          <text x="56" y="35" textAnchor="middle" fill="#6B8299" fontSize="8">E</text>
          <text x="32" y="58" textAnchor="middle" fill="#6B8299" fontSize="8">S</text>
          <text x="8" y="35" textAnchor="middle" fill="#6B8299" fontSize="8">W</text>
          <g transform={`rotate(${direction}, 32, 32)`}>
            <line x1="32" y1="44" x2="32" y2="14" stroke="#0E7490" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="32,12 27,20 37,20" fill="#0E7490" />
          </g>
        </svg>
      </div>
      <div className="text-center">
        <span className="text-sm font-semibold text-text">{Math.round(speed)} km/h</span>
        <span className="ml-1 text-xs text-text-secondary">{degreesToCompass(direction)}</span>
      </div>
    </div>
  );
}

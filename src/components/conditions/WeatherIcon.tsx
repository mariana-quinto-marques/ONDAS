import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  type LucideIcon,
} from 'lucide-react';

function getWeatherIcon(code: number): LucideIcon {
  if (code === 0) return Sun;
  if (code <= 3) return CloudSun;
  if (code <= 49) return CloudFog;
  if (code <= 59) return CloudDrizzle;
  if (code <= 69) return CloudRain;
  if (code <= 79) return CloudSnow;
  if (code <= 84) return CloudRain;
  if (code <= 94) return CloudSnow;
  if (code <= 99) return CloudLightning;
  return Cloud;
}

function getWeatherLabel(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 59) return 'Drizzle';
  if (code <= 69) return 'Rain';
  if (code <= 79) return 'Snow';
  if (code <= 84) return 'Showers';
  if (code <= 94) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Cloudy';
}

export function WeatherIcon({
  code,
  size = 20,
  showLabel = false,
}: {
  code: number;
  size?: number;
  showLabel?: boolean;
}) {
  const Icon = getWeatherIcon(code);
  const label = getWeatherLabel(code);

  return (
    <span className="inline-flex items-center gap-1">
      <Icon size={size} className="text-sand" />
      {showLabel && <span className="text-xs text-text-secondary">{label}</span>}
    </span>
  );
}

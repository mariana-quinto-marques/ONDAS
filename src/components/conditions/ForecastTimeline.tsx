import type { HourlyForecast } from '../../types/conditions';
import { formatHour, formatWaveHeight, formatWindSpeed } from '../../utils/formatters';
import { WeatherIcon } from './WeatherIcon';

interface ForecastTimelineProps {
  hourly: HourlyForecast[];
}

export function ForecastTimeline({ hourly }: ForecastTimelineProps) {
  const now = new Date();
  const upcoming = hourly.filter((h) => new Date(h.time) >= now).slice(0, 24);
  if (upcoming.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-border/60 p-3">
      <h4 className="font-display mb-3 text-base text-text">24h Forecast</h4>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {upcoming.map((hour) => (
          <div key={hour.time} className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl bg-surface-warm/60 px-3 py-2">
            <span className="text-[10px] font-medium text-text-secondary">{formatHour(hour.time)}</span>
            <WeatherIcon code={hour.weather.weatherCode} size={16} />
            <span className="text-xs font-semibold text-ocean">{formatWaveHeight(hour.marine.waveHeight)}</span>
            <span className="text-[10px] text-text-secondary">{formatWindSpeed(hour.weather.windSpeed)}</span>
            <span className="text-[10px] text-text-secondary">{Math.round(hour.weather.temperature)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}

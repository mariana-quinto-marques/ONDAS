import {
  Waves, Wind, Thermometer, Droplets, Sun, ArrowUp, ArrowDown,
} from 'lucide-react';
import type { MarineConditions, WeatherConditions } from '../../types/conditions';
import type { SportType } from '../../types/spot';
import { ConditionBadge } from '../spots/ConditionBadge';
import { WindCompass } from './WindCompass';
import { WaveIndicator } from './WaveIndicator';
import { WeatherIcon } from './WeatherIcon';
import { getBestSportForConditions } from '../../utils/conditionScoring';
import { formatTemperature, formatWindSpeed, formatWaveHeight, formatUV, formatHour } from '../../utils/formatters';
import { degreesToCompass } from '../../utils/windDirection';
import { getCurrentTideStatus } from '../../utils/tideCalculation';

interface CurrentConditionsProps {
  marine: MarineConditions;
  weather: WeatherConditions;
  sportTypes: SportType[];
  tideTimes?: string[];
  tideSeaLevels?: number[];
}

export function CurrentConditions({ marine, weather, sportTypes, tideTimes, tideSeaLevels }: CurrentConditionsProps) {
  const best = getBestSportForConditions(sportTypes, marine, weather);
  const tideStatus = tideTimes && tideSeaLevels ? getCurrentTideStatus(tideTimes, tideSeaLevels) : null;

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-border/60 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg text-text">Current Conditions</h3>
        <ConditionBadge quality={best.quality} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center rounded-xl bg-surface-warm/60 p-3">
          <Waves size={16} className="mb-1 text-ocean" />
          <span className="text-[10px] uppercase tracking-widest text-text-secondary">Waves</span>
          <WaveIndicator height={marine.waveHeight} period={marine.wavePeriod} />
          <span className="mt-1 text-[10px] text-text-secondary">
            Swell: {formatWaveHeight(marine.swellHeight)} {degreesToCompass(marine.swellDirection)}
          </span>
        </div>

        <div className="flex flex-col items-center rounded-xl bg-surface-warm/60 p-3">
          <Wind size={16} className="mb-1 text-teal" />
          <span className="text-[10px] uppercase tracking-widest text-text-secondary">Wind</span>
          <WindCompass direction={weather.windDirection} speed={weather.windSpeed} />
          <span className="mt-1 text-[10px] text-text-secondary">Gusts: {formatWindSpeed(weather.windGusts)}</span>
        </div>

        <div className="flex flex-col items-center rounded-xl bg-surface-warm/60 p-3">
          <Thermometer size={16} className="mb-1 text-rose" />
          <span className="text-[10px] uppercase tracking-widest text-text-secondary">Temperature</span>
          <div className="mt-2 flex items-center gap-3">
            <div className="text-center">
              <span className="text-lg font-semibold text-text">{formatTemperature(weather.temperature)}</span>
              <span className="block text-[10px] text-text-secondary">Air</span>
            </div>
            <div className="text-center">
              <span className="text-lg font-semibold text-ocean">{formatTemperature(marine.waterTemperature)}</span>
              <span className="block text-[10px] text-text-secondary">Water</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center rounded-xl bg-surface-warm/60 p-3">
          <WeatherIcon code={weather.weatherCode} size={16} />
          <span className="mt-1 text-[10px] uppercase tracking-widest text-text-secondary">Weather</span>
          <WeatherIcon code={weather.weatherCode} size={28} showLabel />
          <div className="mt-2 flex items-center gap-2 text-[10px] text-text-secondary">
            <span className="flex items-center gap-0.5"><Sun size={10} /> UV: {formatUV(weather.uvIndex)}</span>
            <span className="flex items-center gap-0.5"><Droplets size={10} /> {weather.precipitation}mm</span>
          </div>
        </div>
      </div>

      {tideStatus && (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-surface-warm/60 p-2 text-xs text-text-secondary">
          {tideStatus.rising ? <ArrowUp size={14} className="text-ocean" /> : <ArrowDown size={14} className="text-ocean" />}
          <span>Tide: {tideStatus.rising ? 'Rising' : 'Falling'}</span>
          {tideStatus.nextTide && (
            <span>| Next {tideStatus.nextTide.type === 'high' ? 'high' : 'low'}: {formatHour(tideStatus.nextTide.time)}</span>
          )}
        </div>
      )}
    </div>
  );
}

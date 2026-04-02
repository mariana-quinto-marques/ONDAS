import type { SportType } from '../types/spot';
import type { ConditionQuality, MarineConditions, WeatherConditions } from '../types/conditions';

export function scoreForSport(
  sport: SportType,
  marine: MarineConditions,
  weather: WeatherConditions,
): ConditionQuality {
  switch (sport) {
    case 'surf':
      return scoreSurf(marine, weather);
    case 'kitesurf':
      return scoreKitesurf(weather);
    case 'windsurf':
      return scoreWindsurf(weather);
    case 'paddle':
      return scorePaddle(marine, weather);
  }
}

function scoreSurf(marine: MarineConditions, weather: WeatherConditions): ConditionQuality {
  const { waveHeight, wavePeriod } = marine;
  const { windSpeed } = weather;

  if (waveHeight >= 1 && waveHeight <= 2.5 && wavePeriod > 10 && windSpeed < 20) return 'good';
  if (waveHeight >= 0.5 && waveHeight <= 3.5 && wavePeriod >= 7) return 'fair';
  return 'poor';
}

function scoreKitesurf(weather: WeatherConditions): ConditionQuality {
  const windKnots = weather.windSpeed * 0.539957;
  const gustKnots = weather.windGusts * 0.539957;

  if (windKnots >= 15 && windKnots <= 30 && gustKnots < 40) return 'good';
  if (windKnots >= 12 && windKnots <= 35) return 'fair';
  return 'poor';
}

function scoreWindsurf(weather: WeatherConditions): ConditionQuality {
  const windKnots = weather.windSpeed * 0.539957;

  if (windKnots >= 12 && windKnots <= 25) return 'good';
  if (windKnots >= 8 && windKnots <= 30) return 'fair';
  return 'poor';
}

function scorePaddle(marine: MarineConditions, weather: WeatherConditions): ConditionQuality {
  const { waveHeight } = marine;
  const { windSpeed } = weather;

  if (waveHeight < 0.5 && windSpeed < 15) return 'good';
  if (waveHeight <= 1 && windSpeed <= 25) return 'fair';
  return 'poor';
}

export function getBestSportForConditions(
  sports: SportType[],
  marine: MarineConditions,
  weather: WeatherConditions,
): { sport: SportType; quality: ConditionQuality } {
  const scored = sports.map((sport) => ({
    sport,
    quality: scoreForSport(sport, marine, weather),
  }));

  const order: ConditionQuality[] = ['good', 'fair', 'poor'];
  scored.sort((a, b) => order.indexOf(a.quality) - order.indexOf(b.quality));

  return scored[0];
}

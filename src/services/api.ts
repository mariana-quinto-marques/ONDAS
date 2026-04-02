import type { SpotConditions, HourlyForecast, SpotForecast } from '../types/conditions';
import type { Spot } from '../types/spot';
import { fetchCurrentMarineBatch } from './openMeteoMarine';
import { fetchCurrentWeatherBatch } from './openMeteoWeather';
import { fetchHourlyMarine } from './openMeteoMarine';
import { fetchHourlyWeather } from './openMeteoWeather';

export async function fetchAllSpotsConditions(
  spots: Spot[],
): Promise<SpotConditions[]> {
  const marineCoords = spots.map((s) => s.marineCoordinates);
  const weatherCoords = spots.map((s) => s.coordinates);

  const [marineData, weatherData] = await Promise.all([
    fetchCurrentMarineBatch(marineCoords),
    fetchCurrentWeatherBatch(weatherCoords),
  ]);

  return spots.map((spot, i) => ({
    spotId: spot.id,
    timestamp: new Date().toISOString(),
    marine: marineData[i],
    weather: weatherData[i],
  }));
}

export async function fetchSpotForecast(spot: Spot): Promise<SpotForecast> {
  const [marine, weather] = await Promise.all([
    fetchHourlyMarine(spot.marineCoordinates.lat, spot.marineCoordinates.lng),
    fetchHourlyWeather(spot.coordinates.lat, spot.coordinates.lng),
  ]);

  const hourly: HourlyForecast[] = marine.times.map((time, i) => ({
    time,
    marine: marine.data[i],
    weather: weather.data[i] ?? {
      temperature: 0,
      windSpeed: 0,
      windDirection: 0,
      windGusts: 0,
      uvIndex: 0,
      precipitation: 0,
      weatherCode: 0,
      cloudCover: 0,
    },
  }));

  return { spotId: spot.id, hourly };
}

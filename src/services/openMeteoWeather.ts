import type { WeatherConditions } from '../types/conditions';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_VARS = [
  'temperature_2m',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'uv_index',
  'precipitation',
  'weather_code',
  'cloud_cover',
].join(',');

const HOURLY_VARS = CURRENT_VARS;

interface OpenMeteoWeatherResponse {
  current?: Record<string, number>;
  hourly?: {
    time: string[];
    [key: string]: number[] | string[];
  };
}

function parseWeatherData(data: Record<string, number>): WeatherConditions {
  return {
    temperature: data.temperature_2m ?? 0,
    windSpeed: data.wind_speed_10m ?? 0,
    windDirection: data.wind_direction_10m ?? 0,
    windGusts: data.wind_gusts_10m ?? 0,
    uvIndex: data.uv_index ?? 0,
    precipitation: data.precipitation ?? 0,
    weatherCode: data.weather_code ?? 0,
    cloudCover: data.cloud_cover ?? 0,
  };
}

export async function fetchCurrentWeatherBatch(
  coordinates: { lat: number; lng: number }[],
): Promise<WeatherConditions[]> {
  const lats = coordinates.map((c) => c.lat).join(',');
  const lngs = coordinates.map((c) => c.lng).join(',');

  const url = `${BASE_URL}?latitude=${lats}&longitude=${lngs}&current=${CURRENT_VARS}&timezone=Europe/Lisbon`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const json = await res.json();

  if (Array.isArray(json)) {
    return json.map((item: OpenMeteoWeatherResponse) =>
      parseWeatherData(item.current ?? {}),
    );
  }

  return [parseWeatherData(json.current ?? {})];
}

export async function fetchHourlyWeather(
  lat: number,
  lng: number,
  forecastDays = 3,
): Promise<{ times: string[]; data: WeatherConditions[] }> {
  const url = `${BASE_URL}?latitude=${lat}&longitude=${lng}&hourly=${HOURLY_VARS}&timezone=Europe/Lisbon&forecast_days=${forecastDays}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const json: OpenMeteoWeatherResponse = await res.json();

  if (!json.hourly) return { times: [], data: [] };

  const times = json.hourly.time as string[];
  const data = times.map((_, i) => ({
    temperature: (json.hourly!.temperature_2m as number[])[i] ?? 0,
    windSpeed: (json.hourly!.wind_speed_10m as number[])[i] ?? 0,
    windDirection: (json.hourly!.wind_direction_10m as number[])[i] ?? 0,
    windGusts: (json.hourly!.wind_gusts_10m as number[])[i] ?? 0,
    uvIndex: (json.hourly!.uv_index as number[])[i] ?? 0,
    precipitation: (json.hourly!.precipitation as number[])[i] ?? 0,
    weatherCode: (json.hourly!.weather_code as number[])[i] ?? 0,
    cloudCover: (json.hourly!.cloud_cover as number[])[i] ?? 0,
  }));

  return { times, data };
}

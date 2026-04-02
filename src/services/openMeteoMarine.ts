import type { MarineConditions } from '../types/conditions';

const BASE_URL = 'https://marine-api.open-meteo.com/v1/marine';

const CURRENT_VARS = [
  'wave_height',
  'wave_direction',
  'wave_period',
  'swell_wave_height',
  'swell_wave_direction',
  'swell_wave_period',
].join(',');

const HOURLY_VARS = [
  'wave_height',
  'wave_direction',
  'wave_period',
  'swell_wave_height',
  'swell_wave_direction',
  'swell_wave_period',
  'sea_surface_temperature',
].join(',');

interface OpenMeteoMarineResponse {
  current?: Record<string, number>;
  hourly?: {
    time: string[];
    [key: string]: number[] | string[];
  };
}

function parseMarineData(data: Record<string, number>): MarineConditions {
  return {
    waveHeight: data.wave_height ?? 0,
    waveDirection: data.wave_direction ?? 0,
    wavePeriod: data.wave_period ?? 0,
    swellHeight: data.swell_wave_height ?? 0,
    swellDirection: data.swell_wave_direction ?? 0,
    swellPeriod: data.swell_wave_period ?? 0,
    waterTemperature: 0,
    seaLevel: 0,
  };
}

export async function fetchCurrentMarineBatch(
  coordinates: { lat: number; lng: number }[],
): Promise<MarineConditions[]> {
  const lats = coordinates.map((c) => c.lat).join(',');
  const lngs = coordinates.map((c) => c.lng).join(',');

  // Fetch current wave data + 1 hour of hourly data for water temp
  const [currentRes, hourlyRes] = await Promise.all([
    fetch(`${BASE_URL}?latitude=${lats}&longitude=${lngs}&current=${CURRENT_VARS}&timezone=Europe/Lisbon`),
    fetch(`${BASE_URL}?latitude=${lats}&longitude=${lngs}&hourly=sea_surface_temperature&timezone=Europe/Lisbon&forecast_days=1`),
  ]);

  if (!currentRes.ok) throw new Error(`Marine API error: ${currentRes.status}`);

  const currentJson = await currentRes.json();
  const hourlyJson = hourlyRes.ok ? await hourlyRes.json() : null;

  const currentItems = Array.isArray(currentJson) ? currentJson : [currentJson];
  const hourlyItems = hourlyJson
    ? (Array.isArray(hourlyJson) ? hourlyJson : [hourlyJson])
    : [];

  return currentItems.map((item: OpenMeteoMarineResponse, i: number) => {
    const marine = parseMarineData(item.current ?? {});
    // Get current water temp from first hourly value
    const hourlyItem = hourlyItems[i];
    if (hourlyItem?.hourly?.sea_surface_temperature) {
      const temps = hourlyItem.hourly.sea_surface_temperature as number[];
      // Find closest to current time
      const now = new Date();
      const times = hourlyItem.hourly.time as string[];
      let closestIdx = 0;
      let closestDiff = Infinity;
      for (let j = 0; j < times.length; j++) {
        const diff = Math.abs(new Date(times[j]).getTime() - now.getTime());
        if (diff < closestDiff) {
          closestDiff = diff;
          closestIdx = j;
        }
      }
      marine.waterTemperature = temps[closestIdx] ?? 0;
    }
    return marine;
  });
}

export async function fetchHourlyMarine(
  lat: number,
  lng: number,
  forecastDays = 3,
): Promise<{ times: string[]; data: MarineConditions[] }> {
  const url = `${BASE_URL}?latitude=${lat}&longitude=${lng}&hourly=${HOURLY_VARS}&timezone=Europe/Lisbon&forecast_days=${forecastDays}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Marine API error: ${res.status}`);

  const json: OpenMeteoMarineResponse = await res.json();

  if (!json.hourly) return { times: [], data: [] };

  const times = json.hourly.time as string[];
  const data = times.map((_, i) => ({
    waveHeight: (json.hourly!.wave_height as number[])[i] ?? 0,
    waveDirection: (json.hourly!.wave_direction as number[])[i] ?? 0,
    wavePeriod: (json.hourly!.wave_period as number[])[i] ?? 0,
    swellHeight: (json.hourly!.swell_wave_height as number[])[i] ?? 0,
    swellDirection: (json.hourly!.swell_wave_direction as number[])[i] ?? 0,
    swellPeriod: (json.hourly!.swell_wave_period as number[])[i] ?? 0,
    waterTemperature: (json.hourly!.sea_surface_temperature as number[])[i] ?? 0,
    seaLevel: 0,
  }));

  return { times, data };
}

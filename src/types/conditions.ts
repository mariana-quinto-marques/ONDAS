export type ConditionQuality = 'good' | 'fair' | 'poor';

export interface MarineConditions {
  waveHeight: number;
  waveDirection: number;
  wavePeriod: number;
  swellHeight: number;
  swellDirection: number;
  swellPeriod: number;
  waterTemperature: number;
  seaLevel: number;
}

export interface WeatherConditions {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  precipitation: number;
  weatherCode: number;
  cloudCover: number;
}

export interface SpotConditions {
  spotId: string;
  timestamp: string;
  marine: MarineConditions;
  weather: WeatherConditions;
}

export interface HourlyForecast {
  time: string;
  marine: MarineConditions;
  weather: WeatherConditions;
}

export interface SpotForecast {
  spotId: string;
  hourly: HourlyForecast[];
}

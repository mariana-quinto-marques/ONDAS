const DIRECTIONS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'] as const;

export function degreesToCompass(degrees: number): string {
  const index = Math.round(degrees / 22.5) % 16;
  return DIRECTIONS[index];
}

export function isOffshoreWind(windDirection: number, coastDirection: number): boolean {
  const diff = Math.abs(((windDirection - coastDirection + 180) % 360) - 180);
  return diff < 45;
}

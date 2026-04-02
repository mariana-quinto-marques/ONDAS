export interface TidePoint {
  time: string;
  height: number;
  type: 'high' | 'low';
}

/**
 * Generate approximate tide data using a simple semi-diurnal model.
 * Portugal's coast has roughly 2 high tides and 2 low tides per day,
 * with a ~12h 25m cycle. This is a visual approximation, not precise navigation data.
 */
export function generateApproximateTides(
  startTime: Date,
  hours: number,
): { times: string[]; heights: number[]; extremes: TidePoint[] } {
  const TIDE_PERIOD_MS = 12 * 60 * 60 * 1000 + 25 * 60 * 1000; // 12h 25m
  const times: string[] = [];
  const heights: number[] = [];
  const extremes: TidePoint[] = [];

  // Use day-of-year as a seed for phase offset so it varies by date
  const dayOfYear = Math.floor(
    (startTime.getTime() - new Date(startTime.getFullYear(), 0, 0).getTime()) / 86400000,
  );
  const phaseOffset = (dayOfYear * 47) % 360; // pseudo-random daily shift

  for (let h = 0; h < hours; h++) {
    const t = new Date(startTime.getTime() + h * 3600000);
    const elapsed = t.getTime();
    const angle = ((elapsed / TIDE_PERIOD_MS) * 2 * Math.PI) + (phaseOffset * Math.PI / 180);
    const height = Math.sin(angle) * 1.5 + 2.0; // Range ~0.5m to 3.5m (typical Portugal)

    times.push(t.toISOString());
    heights.push(Math.round(height * 100) / 100);
  }

  // Find extremes
  for (let i = 1; i < heights.length - 1; i++) {
    if (heights[i] > heights[i - 1] && heights[i] > heights[i + 1]) {
      extremes.push({ time: times[i], height: heights[i], type: 'high' });
    } else if (heights[i] < heights[i - 1] && heights[i] < heights[i + 1]) {
      extremes.push({ time: times[i], height: heights[i], type: 'low' });
    }
  }

  return { times, heights, extremes };
}

export function getCurrentTideStatus(
  times: string[],
  heights: number[],
): { rising: boolean; nextTide: TidePoint | null } {
  const now = new Date();

  let currentIndex = 0;
  for (let i = 0; i < times.length; i++) {
    if (new Date(times[i]) <= now) currentIndex = i;
    else break;
  }

  const rising =
    currentIndex < heights.length - 1
      ? heights[currentIndex + 1] > heights[currentIndex]
      : false;

  // Find extremes from remaining data
  const extremes: TidePoint[] = [];
  for (let i = Math.max(1, currentIndex); i < heights.length - 1; i++) {
    if (heights[i] > heights[i - 1] && heights[i] > heights[i + 1]) {
      extremes.push({ time: times[i], height: heights[i], type: 'high' });
    } else if (heights[i] < heights[i - 1] && heights[i] < heights[i + 1]) {
      extremes.push({ time: times[i], height: heights[i], type: 'low' });
    }
  }

  const nextTide = extremes.find((e) => new Date(e.time) > now) ?? null;

  return { rising, nextTide };
}

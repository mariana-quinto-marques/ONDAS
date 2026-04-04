import { formatHour } from '../../utils/formatters';

interface TideChartProps {
  times: string[];
  seaLevels: number[];
}

export function TideChart({ times, seaLevels }: TideChartProps) {
  if (times.length < 3) return null;

  // Take next 24 hours
  const now = new Date();
  const nextIdx = times.findIndex((t) => new Date(t) >= now);
  const startIdx = Math.max(0, nextIdx - 1);
  const end = Math.min(startIdx + 25, times.length);
  const slicedTimes = times.slice(startIdx, end);
  const slicedLevels = seaLevels.slice(startIdx, end);

  if (slicedLevels.length < 3) return null;

  const min = Math.min(...slicedLevels);
  const max = Math.max(...slicedLevels);
  const range = max - min || 1;
  const width = 300;
  const height = 80;
  const padding = 10;

  const points = slicedLevels.map((level, i) => {
    const x = padding + (i / (slicedLevels.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((level - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  // Current time marker — interpolate position on the curve
  const nowMs = now.getTime();
  const startMs = new Date(slicedTimes[0]).getTime();
  const endMs = new Date(slicedTimes[slicedTimes.length - 1]).getTime();
  const nowFraction = (nowMs - startMs) / (endMs - startMs);
  let nowX: number | null = null;
  let nowY: number | null = null;
  if (nowFraction >= 0 && nowFraction <= 1) {
    const floatIdx = nowFraction * (slicedLevels.length - 1);
    const lo = Math.floor(floatIdx);
    const hi = Math.min(lo + 1, slicedLevels.length - 1);
    const t = floatIdx - lo;
    const nowLevel = slicedLevels[lo] * (1 - t) + slicedLevels[hi] * t;
    nowX = padding + nowFraction * (width - 2 * padding);
    nowY = height - padding - ((nowLevel - min) / range) * (height - 2 * padding);
  }

  // Find extremes inline
  const extremes: { time: string; height: number; type: 'high' | 'low'; x: number; y: number }[] = [];
  for (let i = 1; i < slicedLevels.length - 1; i++) {
    const prev = slicedLevels[i - 1];
    const curr = slicedLevels[i];
    const next = slicedLevels[i + 1];
    if (curr > prev && curr > next) {
      const x = padding + (i / (slicedLevels.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((curr - min) / range) * (height - 2 * padding);
      extremes.push({ time: slicedTimes[i], height: curr, type: 'high', x, y });
    } else if (curr < prev && curr < next) {
      const x = padding + (i / (slicedLevels.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((curr - min) / range) * (height - 2 * padding);
      extremes.push({ time: slicedTimes[i], height: curr, type: 'low', x, y });
    }
  }

  return (
    <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-border/60 p-3">
      <h4 className="font-display mb-2 text-base text-text">Tide</h4>
      <svg viewBox={`0 -14 ${width} ${height + 34}`} className="w-full">
        <defs>
          <linearGradient id="tideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0E7490" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
        <polyline points={points.join(' ')} fill="none" stroke="url(#tideGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {nowX !== null && nowY !== null && (
          <g>
            <circle cx={nowX} cy={nowY} r="3" fill="#E97451" />
            <text x={nowX} y={nowY + 10} textAnchor="middle" fill="#E97451" fontSize="6" fontWeight="500">Now</text>
          </g>
        )}
        {extremes.map((ext, i) => (
          <g key={i}>
            <circle cx={ext.x} cy={ext.y} r="3" fill={ext.type === 'high' ? '#0E7490' : '#6B8299'} />
            <text x={ext.x} y={height + 12} textAnchor="middle" fill="#6B8299" fontSize="8">{formatHour(ext.time)}</text>
            <text x={ext.x} y={ext.y - 6} textAnchor="middle" fontSize="7" fill={ext.type === 'high' ? '#0E7490' : '#6B8299'}>
              {ext.type === 'high' ? 'H' : 'L'} {ext.height.toFixed(1)}m
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-1 text-[9px] text-text-secondary text-center">Approximate tide model</p>
    </div>
  );
}

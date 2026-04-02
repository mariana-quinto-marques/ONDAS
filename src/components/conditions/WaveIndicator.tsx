export function WaveIndicator({
  height,
  period,
}: {
  height: number;
  period: number;
}) {
  const amplitude = Math.min(height * 8, 20);
  const wavelength = Math.max(period * 3, 20);

  const d = `M 0 25 ${Array.from({ length: 5 }, (_, i) => {
    const x = i * wavelength;
    return `C ${x + wavelength * 0.25} ${25 - amplitude}, ${x + wavelength * 0.75} ${25 + amplitude}, ${x + wavelength} 25`;
  }).join(' ')}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 120 50" className="h-12 w-24">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0E7490" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="url(#waveGrad)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="text-center">
        <span className="text-sm font-semibold text-text">{height.toFixed(1)}m</span>
        <span className="ml-1 text-xs text-text-secondary">{Math.round(period)}s</span>
      </div>
    </div>
  );
}

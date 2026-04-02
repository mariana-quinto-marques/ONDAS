import { Waves, Heart } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="h-full overflow-y-auto pb-20 lg:pb-4">
    <div className="mx-auto max-w-lg p-6">
      <div className="flex flex-col items-center text-center">
        <Waves size={48} className="text-ocean" />
        <h1 className="font-display mt-3 text-3xl text-text">Ondas</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Real-time water sports conditions for Portugal
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <section>
          <h2 className="font-display text-lg text-text">About</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Ondas helps you find the best spots for Surf, Kitesurf, Windsurf,
            and Paddle across Portugal. We show real-time wave, wind, and weather
            conditions so you can make the most of your time on the water.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-text">Data Sources</h2>
          <ul className="mt-2 space-y-1 text-sm text-text-secondary">
            <li>Wave & marine data: <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-ocean hover:underline">Open-Meteo Marine API</a></li>
            <li>Weather forecasts: <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-ocean hover:underline">Open-Meteo Weather API</a></li>
            <li>Map tiles: <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-ocean hover:underline">OpenStreetMap</a></li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg text-text">How it works</h2>
          <ul className="mt-2 space-y-1 text-sm text-text-secondary">
            <li>Conditions are color-coded: <span className="font-medium text-condition-good">Green</span> = good, <span className="font-medium text-condition-fair">Gold</span> = fair, <span className="font-medium text-condition-poor">Coral</span> = poor</li>
            <li>Each sport has its own scoring thresholds</li>
            <li>Data refreshes every 15 minutes</li>
            <li>Community reports help validate real conditions</li>
          </ul>
        </section>

        <div className="flex items-center justify-center gap-1 pt-4 text-xs text-text-secondary">
          Made with <Heart size={12} className="text-rose" /> in Portugal
        </div>
      </div>
    </div>
    </div>
  );
}

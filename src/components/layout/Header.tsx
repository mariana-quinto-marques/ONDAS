import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Waves } from 'lucide-react';
import { useFilterStore } from '../../stores/filterStore';
import { sportConfigs } from '../../data/sportTypes';
import type { SportType } from '../../types/spot';

export function Header() {
  const { activeSport, setActiveSport } = useFilterStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handleSportClick = (sportId: SportType | null) => {
    setActiveSport(sportId);
    if (!isHome) {
      navigate('/');
    }
  };

  return (
    <header className="glass sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <Waves className="h-6 w-6 text-ocean transition-colors group-hover:text-teal" />
          <span className="font-display text-2xl tracking-wide text-text">
            Ondas
          </span>
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
        <button
          onClick={() => handleSportClick(null)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            activeSport === null
              ? 'bg-ocean text-white'
              : 'bg-surface-warm text-text-secondary hover:text-text hover:bg-border'
          }`}
        >
          All
        </button>
        {sportConfigs.map((sport) => (
          <button
            key={sport.id}
            onClick={() => handleSportClick(sport.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeSport === sport.id
                ? 'text-white'
                : 'bg-surface-warm text-text-secondary hover:text-text hover:bg-border'
            }`}
            style={
              activeSport === sport.id
                ? { backgroundColor: sport.color }
                : undefined
            }
          >
            {sport.label}
          </button>
        ))}
      </div>
    </header>
  );
}

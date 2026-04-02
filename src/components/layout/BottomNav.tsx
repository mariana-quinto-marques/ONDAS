import { NavLink } from 'react-router-dom';
import { Map, Info } from 'lucide-react';

export function BottomNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
      isActive ? 'text-ocean' : 'text-text-secondary'
    }`;

  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex items-center justify-around py-2">
        <NavLink to="/" end className={linkClass}>
          <Map className="h-5 w-5" />
          <span>Explore</span>
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          <Info className="h-5 w-5" />
          <span>About</span>
        </NavLink>
      </div>
    </nav>
  );
}

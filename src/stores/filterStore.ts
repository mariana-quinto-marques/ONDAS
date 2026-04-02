import { create } from 'zustand';
import type { SportType } from '../types/spot';

interface FilterState {
  activeSport: SportType | null;
  setActiveSport: (sport: SportType | null) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  activeSport: null,
  setActiveSport: (sport) =>
    set((state) => ({
      activeSport: state.activeSport === sport ? null : sport,
    })),
}));

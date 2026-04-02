import type { SportType } from '../types/spot';

export interface SportConfig {
  id: SportType;
  label: string;
  color: string;
  icon: string;
}

export const sportConfigs: SportConfig[] = [
  { id: 'surf', label: 'Surf', color: '#0E7490', icon: 'waves' },
  { id: 'kitesurf', label: 'Kitesurf', color: '#7C3AED', icon: 'wind' },
  { id: 'windsurf', label: 'Windsurf', color: '#0D9488', icon: 'sailboat' },
  { id: 'paddle', label: 'Paddle', color: '#059669', icon: 'anchor' },
];

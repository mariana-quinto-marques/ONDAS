import type { Region } from '../types/spot';

export const regionColors: Record<Region, string> = {
  Norte: '#7C3AED',
  Centro: '#0E7490',
  Lisboa: '#D4A24E',
  Alentejo: '#C8A96E',
  Algarve: '#E87461',
  Acores: '#059669',
  Madeira: '#0D9488',
};

export const regionOrder: Region[] = [
  'Norte',
  'Centro',
  'Lisboa',
  'Alentejo',
  'Algarve',
  'Acores',
  'Madeira',
];

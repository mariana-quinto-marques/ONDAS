export type SportType = 'surf' | 'kitesurf' | 'windsurf' | 'paddle';
export type Region = 'Norte' | 'Centro' | 'Lisboa' | 'Alentejo' | 'Algarve' | 'Acores' | 'Madeira';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'all';

export interface Spot {
  id: string;
  name: string;
  region: Region;
  coordinates: { lat: number; lng: number };
  marineCoordinates: { lat: number; lng: number };
  sportTypes: SportType[];
  description: string;
  funFacts: string[];
  difficulty: Difficulty;
}

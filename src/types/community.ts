export type CrowdLevel = 'empty' | 'few' | 'moderate' | 'crowded';
export type ConditionEmoji = 'fire' | 'shaka' | 'thumbsup' | 'meh' | 'thumbsdown';

export interface ConditionReport {
  id: string;
  spotId: string;
  timestamp: number;
  rating: 1 | 2 | 3 | 4 | 5;
  crowdLevel: CrowdLevel;
  emoji: ConditionEmoji;
  note?: string;
}

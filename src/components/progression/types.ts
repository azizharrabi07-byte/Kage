export type XPCategory = 'strength' | 'discipline' | 'endurance' | 'focus' | 'recovery';

export interface XPMap extends Record<string, number> {
  strength: number;
  discipline: number;
  endurance: number;
  focus: number;
  recovery: number;
}

export interface RankTier {
  id: string;
  name: string;
  kanji: string;
  subtitle: string;
  xpRequired: number;
  color: string;
}

export const RANKS: RankTier[] = [
  { id: 'ronin', name: 'Ronin', kanji: '浪人', subtitle: 'Masterless Warrior', xpRequired: 0, color: '#8A8A8A' },
  { id: 'shadow', name: 'Shadow Disciple', kanji: '影弟子', subtitle: 'Path of Shadows', xpRequired: 1000, color: '#4488FF' },
  { id: 'crimson', name: 'Crimson Samurai', kanji: '紅侍', subtitle: 'Blade of Discipline', xpRequired: 3000, color: '#CC0000' },
  { id: 'oni', name: 'Oni Warrior', kanji: '鬼戦士', subtitle: 'Demon of Strength', xpRequired: 6000, color: '#FF4400' },
  { id: 'shogun', name: 'Ascended Shogun', kanji: '昇将軍', subtitle: 'The Awakened One', xpRequired: 10000, color: '#FFD700' },
];

export interface PlayerProgression {
  totalXP: number;
  xpMap: XPMap;
  rank: string;
  rankIndex: number;
  level: number;
  workoutsCompleted: number;
  lockInSessions: number;
  streak: number;
  lastWorkoutDate?: number;
}
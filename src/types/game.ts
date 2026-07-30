export type GameMode = 'campaign' | 'free';

export type BonusType = 'shield' | 'radar' | 'missile' | 'chronostop' | 'safeScan';

export interface Cell {
  id: string;
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  bonus?: BonusType;
  isExploded?: boolean;
  isScanned?: boolean; // Highlighted by radar
  highlighted?: boolean;
}

export type Board = Cell[][];

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type Difficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'extreme' | 'custom';

export interface DifficultyConfig {
  name: string;
  rows: number;
  cols: number;
  mines: number;
  startingBonuses?: Record<BonusType, number>;
}

export interface LevelObjective {
  type: 'clear' | 'time' | 'no_mistakes' | 'use_bonus' | 'find_bonuses';
  value?: number;
  description: string;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  rows: number;
  cols: number;
  mines: number;
  timeLimit?: number; // in seconds
  objectives: LevelObjective[];
  rewards: {
    bonuses: Partial<Record<BonusType, number>>;
    xp: number;
  };
}

export interface Inventory {
  shield: number;
  radar: number;
  missile: number;
  chronostop: number;
  safeScan: number;
}

export interface UserStats {
  campaignProgress: number; // Max unlocked level
  score: number;
  xp: number;
  gamesPlayed: number;
  gamesWon: number;
  minesFlagged: number;
  bonusesUsed: number;
}

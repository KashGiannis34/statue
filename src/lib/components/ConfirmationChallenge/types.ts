// Shared types for ConfirmationChallenge components

export type ChallengeType = 'slider' | 'hold' | 'type' | 'pattern' | 'math' | 'gravity';
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

// Difficulty to challenge type mapping
export const difficultyMap: Record<ChallengeDifficulty, ChallengeType[]> = {
  easy: ['slider', 'hold'],
  medium: ['type', 'pattern'],
  hard: ['math', 'gravity']
};

// Challenge type to difficulty mapping
export const challengeDifficulty: Record<ChallengeType, ChallengeDifficulty> = {
  slider: 'easy',
  hold: 'easy',
  type: 'medium',
  pattern: 'medium',
  math: 'hard',
  gravity: 'hard'
};

export function getRandomChallengeByDifficulty(difficulty: ChallengeDifficulty): ChallengeType {
  const types = difficultyMap[difficulty];
  return types[Math.floor(Math.random() * types.length)];
}

// Common props interface for sub-challenges
export interface BaseChallengeProps {
  onSuccess: () => void;
  onFail: (message: string) => void;
  confirmText?: string;
}

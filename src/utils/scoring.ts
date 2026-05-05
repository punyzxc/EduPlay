import { MAX_SCORE_BY_DIFFICULTY, WRONG_PENALTY_BY_DIFFICULTY } from '../data/questions';
import { Question } from '../types/quiz';

const QUICK_ERROR_SECONDS = 2;
const QUICK_ERROR_PENALTY = -4;
const ERROR_STREAK_PENALTY_STEP = -2;

export interface ScoreBreakdown {
  basePoints: number;
  speedFactor: number;
  antiRandomPenalty: number;
  totalPoints: number;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const calculateScore = (
  question: Question,
  isCorrect: boolean,
  remainingTime: number,
  totalTime: number,
  errorStreak: number,
  timeTaken: number,
): ScoreBreakdown => {
  if (isCorrect) {
    const maxPoints = MAX_SCORE_BY_DIFFICULTY[question.difficulty];
    const normalized = totalTime > 0 ? remainingTime / totalTime : 0;
    const safeFactor = clamp(normalized, 0, 1);
    const points = Math.max(1, Math.round(maxPoints * safeFactor));

    return {
      basePoints: points,
      speedFactor: safeFactor,
      antiRandomPenalty: 0,
      totalPoints: points,
    };
  }

  const basePenalty = WRONG_PENALTY_BY_DIFFICULTY[question.difficulty];
  const quickPenalty = timeTaken <= QUICK_ERROR_SECONDS ? QUICK_ERROR_PENALTY : 0;
  const streakPenalty = errorStreak > 1 ? ERROR_STREAK_PENALTY_STEP * (errorStreak - 1) : 0;
  const totalPenalty = basePenalty + quickPenalty + streakPenalty;

  return {
    basePoints: basePenalty,
    speedFactor: 0,
    antiRandomPenalty: quickPenalty + streakPenalty,
    totalPoints: totalPenalty,
  };
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

export const getPerformanceMessage = (correctAnswers: number, total: number): string => {
  const percentage = total > 0 ? (correctAnswers / total) * 100 : 0;

  if (percentage === 100) {
    return 'Идеально! Абсолютный результат.';
  }
  if (percentage >= 80) {
    return 'Отличный уровень. Продолжайте в том же духе.';
  }
  if (percentage >= 60) {
    return 'Хороший результат. Еще немного практики.';
  }
  if (percentage >= 40) {
    return 'Неплохо, но есть пространство для роста.';
  }
  return 'Это только начало. Следующая попытка будет лучше.';
};

export const getStreakMessage = (streak: number): string => {
  if (streak <= 0) {
    return 'Начните новую серию правильных ответов.';
  }
  if (streak < 3) {
    return `Хороший старт: серия ${streak}.`;
  }
  if (streak < 6) {
    return `Отлично! Серия ${streak}.`;
  }
  return `Мощная серия: ${streak} подряд.`;
};

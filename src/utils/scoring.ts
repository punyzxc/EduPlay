import { SCORE_BY_DIFFICULTY, WRONG_ANSWER_PENALTY } from '../data/questions';
import { Question } from '../types/quiz';

const STREAK_STEP = 3;
const STREAK_BONUS = 5;

export interface ScoreBreakdown {
  basePoints: number;
  streakBonus: number;
  totalPoints: number;
}

export const calculateScore = (
  question: Question,
  isCorrect: boolean,
  nextStreak: number,
): ScoreBreakdown => {
  if (!isCorrect) {
    return {
      basePoints: WRONG_ANSWER_PENALTY,
      streakBonus: 0,
      totalPoints: WRONG_ANSWER_PENALTY,
    };
  }

  const basePoints = SCORE_BY_DIFFICULTY[question.difficulty];
  const streakBonus = nextStreak > 0 && nextStreak % STREAK_STEP === 0 ? STREAK_BONUS : 0;

  return {
    basePoints,
    streakBonus,
    totalPoints: basePoints + streakBonus,
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
    return 'Начните серию правильных ответов.';
  }
  if (streak < STREAK_STEP) {
    return `Серия растет: ${streak}.`;
  }
  if (streak < 6) {
    return `Отлично! Серия ${streak}.`;
  }
  return `Мощная серия: ${streak} подряд.`;
};

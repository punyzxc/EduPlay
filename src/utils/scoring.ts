import { Difficulty, Question } from '../types/quiz';

const MAX_POINTS: Record<Difficulty, number> = {
  easy: 5,
  medium: 7,
  hard: 10,
};

const WRONG_PENALTY: Record<Difficulty, number> = {
  easy: -10,
  medium: -15,
  hard: -20,
};

export interface ScoreBreakdown {
  basePoints: number;
  speedFactor: number;
  antiRandomPenalty: number;
  totalPoints: number;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const calculateScore = (
  question: Question,
  isCorrect: boolean,
  remainingTime: number,
  totalTime: number,
  errorStreak: number,
  timeTaken: number,
): ScoreBreakdown => {
  const maxPoints = MAX_POINTS[question.difficulty];
  const wrongPenalty = WRONG_PENALTY[question.difficulty];
  const safeTotalTime = Math.max(1, totalTime);
  const speedFactor = clamp(remainingTime / safeTotalTime, 0, 1);

  if (isCorrect) {
    const raw = Math.round(maxPoints * speedFactor);
    const basePoints = Math.max(1, raw);
    return {
      basePoints,
      speedFactor,
      antiRandomPenalty: 0,
      totalPoints: basePoints,
    };
  }

  const quickMistakePenalty = timeTaken <= 2 ? -3 : 0;
  const streakMistakePenalty = errorStreak >= 2 ? -(errorStreak - 1) * 2 : 0;
  const antiRandomPenalty = quickMistakePenalty + streakMistakePenalty;
  const totalPoints = wrongPenalty + antiRandomPenalty;

  return {
    basePoints: wrongPenalty,
    speedFactor,
    antiRandomPenalty,
    totalPoints,
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
    return '🌟 Идеально! Вы мастер!';
  }
  if (percentage >= 80) {
    return '🎉 Отлично! Хороший результат!';
  }
  if (percentage >= 60) {
    return '👍 Хорошо! Продолжайте учиться!';
  }
  if (percentage >= 40) {
    return '📚 Неплохо, но нужно практиковаться!';
  }
  return '💪 Не сдавайтесь! Следующий раунд будет лучше.';
};

export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return 'Начните серию правильных ответов';
  if (streak < 3) return `Хорошее начало! Серия: ${streak}`;
  if (streak < 5) return `Отличная серия! 🔥 ${streak}`;
  if (streak < 10) return `Невероятно! 🚀 ${streak} подряд`;
  return `Легендарно! 💫 ${streak} правильных ответов подряд`;
};

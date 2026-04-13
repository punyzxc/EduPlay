import { Question } from '../hooks/useQuiz';
import { DIFFICULTY_MULTIPLIERS } from '../data/questions';

export const calculateScore = (
  question: Question,
  isCorrect: boolean,
  timeTaken: number,
): number => {
  if (!isCorrect) {
    return -5; // Penalty for wrong answer
  }

  const baseMult = DIFFICULTY_MULTIPLIERS[question.difficulty];
  // Time bonus: bonus for answering quickly
  const timeBonus = Math.max(0, 30 - timeTaken) * 0.5;

  return baseMult + timeBonus;
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

export const getPerformanceMessage = (correctAnswers: number, total: number): string => {
  const percentage = (correctAnswers / total) * 100;

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
  return '💪 Не забывайте учиться! Вы справитесь!';
};

export const getStreakMessage = (streak: number): string => {
  if (streak === 0) {
    return 'Начните серию правильных ответов';
  }
  if (streak < 3) {
    return `Хорошее начало! Серия: ${streak}`;
  }
  if (streak < 5) {
    return `Отличная серия! 🔥 ${streak}`;
  }
  if (streak < 10) {
    return `Невероятно! 🚀 ${streak} подряд`;
  }
  return `Легендарно! 💫 ${streak} правильных ответов подряд`;
};

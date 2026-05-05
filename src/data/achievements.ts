import { AchievementDefinition } from '../types/user';

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first-step',
    name: 'Первый шаг',
    description: 'Сыграйте 1 игру.',
    icon: '🌱',
  },
  {
    id: 'student-10',
    name: 'Ученик',
    description: 'Сыграйте 10 игр.',
    icon: '📘',
  },
  {
    id: 'master-50',
    name: 'Мастер',
    description: 'Сыграйте 50 игр.',
    icon: '👑',
  },
  {
    id: 'flawless',
    name: 'Без ошибок',
    description: 'Пройдите квиз без единой ошибки.',
    icon: '✅',
  },
  {
    id: 'light-speed',
    name: 'Скорость света',
    description: 'Дайте сверхбыстрый правильный ответ (до 2 секунд).',
    icon: '⚡',
  },
  {
    id: 'streak-5',
    name: 'Серия',
    description: 'Сделайте серию из 5+ правильных ответов.',
    icon: '🔥',
  },
];

export const getAchievementDefinition = (id: string): AchievementDefinition | undefined =>
  ACHIEVEMENT_DEFINITIONS.find((achievement) => achievement.id === id);

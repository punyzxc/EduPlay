export interface UserStats {
  totalScore: number;
  totalXP: number;
  level: number;
  currentStreak: number;
  bestStreak: number;
  gamesPlayed: number;
  totalAnswers: number;
  correctAnswers: number;
  bestScore: number;
  lastPlayedAt?: string;
}

export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Achievement extends AchievementDefinition {
  unlockedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  login: string;
  password: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  stats: UserStats;
  achievements: Achievement[];
}

export interface QuizResultPayload {
  quizSessionId: string;
  totalScore: number;
  correctAnswers: number;
  totalAnswers: number;
  averageAnswerTime: number;
  fastestCorrectAnswerTime: number | null;
  highestStreak: number;
}

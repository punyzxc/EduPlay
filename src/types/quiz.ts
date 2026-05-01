export type Difficulty = 'easy' | 'medium' | 'hard';

export type DifficultyFilter = Difficulty | 'all';

export type CategoryId = 'history' | 'english' | 'informatics';

export interface QuizCategory {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  category: string;
  categoryId: CategoryId;
}

export interface Answer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeTaken: number;
}

export interface QuizSettings {
  categoryId: CategoryId;
  difficulty: DifficultyFilter;
  questionCount: number;
}

import React, { useMemo, useState } from 'react';
import {
  AvatarBadge,
  Button,
  Card,
  CategoryIcon,
  DifficultyIcon,
  Header,
  ProgressBar,
} from '../components';
import {
  DEFAULT_QUIZ_SETTINGS,
  DIFFICULTY_LABELS,
  QUIZ_CATEGORIES,
  getCategoryById,
} from '../data/questions';
import { useGame } from '../context/GameContext';
import { DifficultyFilter, QuizSettings } from '../types/quiz';

interface MainScreenProps {
  onStartQuiz: (settings: QuizSettings) => void;
  onViewLeaderboard: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

const difficultyOptions: DifficultyFilter[] = ['all', 'easy', 'medium', 'hard'];

export const MainScreen: React.FC<MainScreenProps> = ({
  onStartQuiz,
  onViewLeaderboard,
  onOpenProfile,
  onLogout,
}) => {
  const { score, level, xp, user } = useGame();
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_QUIZ_SETTINGS.categoryId);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>(
    DEFAULT_QUIZ_SETTINGS.difficulty,
  );

  const currentLevelXP = xp % 100;

  const selectedCategoryMeta = useMemo(
    () => getCategoryById(selectedCategory),
    [selectedCategory],
  );

  const handleStart = () => {
    onStartQuiz({
      categoryId: selectedCategory,
      difficulty: selectedDifficulty,
      questionCount: DEFAULT_QUIZ_SETTINGS.questionCount,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />

      <Header title="EduPlay" subtitle="Выберите режим и начните викторину" showStats={true} />

      <div className="flex-1 overflow-auto px-4 py-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          {user && (
            <Card variant="glass" size="md">
              <div className="flex items-center gap-3">
                <AvatarBadge avatarId={user.avatar} username={user.login} size="lg" />
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Аккаунт</p>
                  <p className="text-xl font-bold text-slate-100">{user.login}</p>
                  <p className="text-sm text-slate-300">{user.email}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={onOpenProfile} variant="outline" size="sm" icon="👤">
                    Профиль
                  </Button>
                  <Button onClick={onLogout} variant="ghost" size="sm" icon="↩">
                    Выйти
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card variant="gradient" size="md">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-display">
                Режим игры
              </h2>
              <p className="text-slate-300">
                В каждом раунде 10 вопросов. Очки зависят от скорости: Easy до +5, Medium до +7, Hard до +10.
                Ошибки: Easy -10, Medium -15, Hard -20.
              </p>
            </div>
          </Card>

          <Card variant="default" size="md">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
                Категория
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {QUIZ_CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                        isActive
                          ? 'border-primary-400 bg-primary-500/20 shadow-lg shadow-primary-500/20'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl" aria-hidden="true">
                          {category.icon}
                        </span>
                        <CategoryIcon categoryId={category.id} className="text-primary-300" />
                      </div>
                      <p className="font-semibold text-slate-100">{category.label}</p>
                      <p className="text-xs text-slate-400 mt-1">{category.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card variant="default" size="md">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
                Сложность
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {difficultyOptions.map((difficulty) => {
                  const isActive = selectedDifficulty === difficulty;
                  return (
                    <button
                      key={difficulty}
                      type="button"
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`rounded-lg border px-3 py-3 transition-all duration-200 ${
                        isActive
                          ? 'border-success-400 bg-success-500/20 text-success-100'
                          : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {difficulty !== 'all' && (
                          <DifficultyIcon difficulty={difficulty} className="text-current" />
                        )}
                        <span className="font-semibold">{DIFFICULTY_LABELS[difficulty]}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card variant="subtle" size="md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-wider text-slate-400">Текущий прогресс</p>
                <p className="font-mono text-primary-300">{currentLevelXP}/100 XP</p>
              </div>
              <ProgressBar current={currentLevelXP} max={100} color="primary" size="lg" />
              <p className="text-sm text-slate-300">
                Уровень {level}, общий счет {score}.
              </p>
            </div>
          </Card>

          <Card variant="glass" size="md">
            <div className="space-y-4">
              <p className="text-slate-300">
                Выбрано: <span className="font-semibold text-slate-100">{selectedCategoryMeta.label}</span> •{' '}
                <span className="font-semibold text-slate-100">{DIFFICULTY_LABELS[selectedDifficulty]}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={handleStart} variant="primary" size="lg" icon="▶">
                  Играть
                </Button>
                <Button onClick={onViewLeaderboard} variant="secondary" size="lg" icon="🏆">
                  Лидерборд
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

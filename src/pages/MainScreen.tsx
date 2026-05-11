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
const desktopParticles = [
  { left: '8%', top: '16%', duration: '11s', delay: '0s' },
  { left: '19%', top: '28%', duration: '13s', delay: '1.8s' },
  { left: '27%', top: '64%', duration: '14s', delay: '0.9s' },
  { left: '36%', top: '10%', duration: '12s', delay: '2.2s' },
  { left: '43%', top: '47%', duration: '10.5s', delay: '1.1s' },
  { left: '52%', top: '78%', duration: '12.5s', delay: '2.6s' },
  { left: '61%', top: '18%', duration: '13.5s', delay: '0.6s' },
  { left: '69%', top: '53%', duration: '11.7s', delay: '2.8s' },
  { left: '78%', top: '29%', duration: '14.2s', delay: '1.4s' },
  { left: '86%', top: '68%', duration: '12.1s', delay: '0.3s' },
];

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
  const selectedCategoryMeta = useMemo(() => getCategoryById(selectedCategory), [selectedCategory]);

  const handleStart = () => {
    onStartQuiz({
      categoryId: selectedCategory,
      difficulty: selectedDifficulty,
      questionCount: DEFAULT_QUIZ_SETTINGS.questionCount,
    });
  };

  return (
    <div className="app-shell relative isolate min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-8 top-24 h-52 w-52 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -right-10 top-1/3 h-56 w-56 rounded-full bg-cyan-500/12 blur-3xl" />
      </div>
      <div className="desktop-atmosphere">
        <div className="desktop-grid-overlay" />
        <div className="desktop-light-beam desktop-light-beam-left" />
        <div className="desktop-light-beam desktop-light-beam-right" />
        <div className="desktop-orb desktop-orb-a" />
        <div className="desktop-orb desktop-orb-b" />
        <div className="desktop-orb desktop-orb-c" />
        <div className="desktop-shape desktop-shape-a" />
        <div className="desktop-shape desktop-shape-b" />
        {desktopParticles.map((particle, index) => (
          <span
            key={`${particle.left}-${particle.top}-${index}`}
            className="desktop-particle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header title="EduPlay" subtitle="Играй, прокачивайся и соревнуйся" showStats />

        <div className="mobile-content-padding flex-1 overflow-auto px-4 pb-6 pt-2">
          <div className="mx-auto max-w-3xl space-y-4">
          {user && (
            <Card variant="glass" size="md" className="surface-glow">
              <div className="flex items-center gap-3">
                <AvatarBadge avatarId={user.avatar} username={user.login} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Аккаунт</p>
                  <p className="truncate text-lg font-bold text-slate-100">{user.login}</p>
                  <p className="truncate text-sm text-slate-300">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button onClick={onOpenProfile} variant="outline" size="sm" icon="👤">
                  Профиль
                </Button>
                <Button onClick={onLogout} variant="ghost" size="sm" icon="↩">
                  Выйти
                </Button>
              </div>
            </Card>
          )}

          <Card variant="gradient" size="md" className="surface-glow">
            <div className="space-y-1.5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Режим раунда</p>
              <h2 className="text-2xl font-bold text-slate-50">10 вопросов с таймером</h2>
              <p className="text-sm text-slate-300">
                Очки зависят от скорости ответа. Ошибки дают штраф, поэтому играй точно.
              </p>
            </div>
          </Card>

          <Card variant="default" size="md">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold uppercase tracking-[0.12em] text-slate-100">Категория</h3>
              <span className="rounded-full bg-slate-800/70 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                {selectedCategoryMeta.icon} {selectedCategoryMeta.label}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {QUIZ_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={[
                      'rounded-2xl border p-3.5 text-left transition-all duration-200',
                      isActive
                        ? 'border-sky-400/60 bg-sky-500/20 shadow-[0_10px_25px_rgba(14,165,233,0.2)]'
                        : 'border-slate-700 bg-slate-900/55 hover:border-slate-500 hover:bg-slate-900/70',
                    ].join(' ')}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">
                        {category.icon}
                      </span>
                      <CategoryIcon categoryId={category.id} className="text-sky-300" />
                    </div>
                    <p className="font-semibold text-slate-100">{category.label}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{category.description}</p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card variant="subtle" size="md">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold uppercase tracking-[0.12em] text-slate-100">Сложность</h3>
              <span className="rounded-full bg-slate-800/70 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                {DIFFICULTY_LABELS[selectedDifficulty]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {difficultyOptions.map((difficulty) => {
                const isActive = selectedDifficulty === difficulty;
                return (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={[
                      'rounded-xl border px-3 py-2.5 text-sm transition-all duration-200',
                      isActive
                        ? 'border-emerald-400/70 bg-emerald-500/18 text-emerald-100'
                        : 'border-slate-700 bg-slate-900/55 text-slate-300 hover:border-slate-500',
                    ].join(' ')}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      {difficulty !== 'all' && <DifficultyIcon difficulty={difficulty} className="text-current" />}
                      <span className="font-semibold">{DIFFICULTY_LABELS[difficulty]}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card variant="glass" size="md">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em]">
                <span className="text-slate-400">Прогресс уровня</span>
                <span className="font-mono text-sky-300">{currentLevelXP}/100 XP</span>
              </div>
              <ProgressBar current={currentLevelXP} max={100} color="primary" size="lg" />
              <p className="text-sm text-slate-300">
                Текущий уровень: <span className="font-semibold text-slate-100">{level}</span> • общий счёт:{' '}
                <span className="font-semibold text-emerald-300">{score}</span>
              </p>
            </div>
          </Card>

          <Card variant="default" size="md">
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                Выбрано: <span className="font-semibold text-slate-100">{selectedCategoryMeta.label}</span> •{' '}
                <span className="font-semibold text-slate-100">{DIFFICULTY_LABELS[selectedDifficulty]}</span>
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Button onClick={handleStart} variant="primary" size="lg" icon="▶">
                  Начать игру
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
    </div>
  );
};

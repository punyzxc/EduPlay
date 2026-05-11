import React, { useEffect } from 'react';
import { Button, Card, Header, ProgressBar } from '../components';
import { DIFFICULTY_LABELS, getCategoryById } from '../data/questions';
import { useGame } from '../context/GameContext';
import { Answer, QuizSettings } from '../types/quiz';
import { getPerformanceMessage, getStreakMessage } from '../utils/scoring';
import { addDailyResult, getPlayerName } from '../utils/dailyLeaderboard';

interface ResultScreenProps {
  answers: Answer[];
  totalScore: number;
  settings: QuizSettings;
  onRetry: () => void;
  onQuit: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  answers,
  totalScore,
  settings,
  onRetry,
  onQuit,
}) => {
  const { score, level, streak, user } = useGame();
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const category = getCategoryById(settings.categoryId);

  useEffect(() => {
    if (totalScore > 0) {
      addDailyResult(totalScore, user?.login || getPlayerName());
    }
  }, [totalScore, user?.login]);

  return (
    <div className="app-shell min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <Header title="Результат" showStats subtitle="Раунд завершён" />

      <div className="flex-1 overflow-auto px-4 pb-8 pt-2">
        <div className="mx-auto max-w-3xl space-y-4">
          <Card variant="gradient" size="lg" className="surface-glow text-center">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">Точность раунда</p>
              <p className="text-5xl font-extrabold text-emerald-300">{percentage}%</p>
              <p className="text-base text-slate-100">{getPerformanceMessage(correctAnswers, totalQuestions)}</p>
              <p className="text-sm text-slate-300">
                Правильных ответов: <span className="font-semibold text-slate-100">{correctAnswers}/{totalQuestions}</span>
              </p>
            </div>
          </Card>

          <Card variant="default" size="md">
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-200">Сводка</h3>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/65 p-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Категория</p>
                  <p className="mt-1 font-semibold text-slate-100">{category.icon} {category.label}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/65 p-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Сложность</p>
                  <p className="mt-1 font-semibold text-slate-100">{DIFFICULTY_LABELS[settings.difficulty]}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/65 p-3">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Очки раунда</p>
                  <p className={`mt-1 text-lg font-bold ${totalScore >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {totalScore > 0 ? '+' : ''}
                    {totalScore}
                  </p>
                </div>
              </div>
              <ProgressBar current={correctAnswers} max={Math.max(totalQuestions, 1)} color="success" size="lg" />
            </div>
          </Card>

          <Card variant="subtle" size="md">
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Уровень</p>
                <p className="text-2xl font-bold text-sky-300">{level}</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Общий счёт</p>
                <p className="text-2xl font-bold text-emerald-300">{score}</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Серия</p>
                <p className="text-2xl font-bold text-amber-300">{streak}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{getStreakMessage(streak)}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-400">
              Результат сохранён автоматически в рейтинг
            </p>
          </Card>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Button onClick={onRetry} variant="primary" size="lg" icon="🔄">
              Сыграть снова
            </Button>
            <Button onClick={onQuit} variant="secondary" size="lg" icon="🏠">
              В главное меню
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

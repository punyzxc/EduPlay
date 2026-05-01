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
  const { score, level, streak } = useGame();
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const category = getCategoryById(settings.categoryId);

  useEffect(() => {
    if (totalScore <= 0) return;
    addDailyResult(totalScore, getPlayerName());
  }, [totalScore]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />

      <Header title="Финальный результат" showStats={true} />

      <div className="flex-1 overflow-auto px-4 py-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card variant="gradient" size="lg" className="text-center">
            <div className="space-y-3">
              <p className="text-5xl font-bold text-success-300">{percentage}%</p>
              <p className="text-lg text-slate-100">{getPerformanceMessage(correctAnswers, totalQuestions)}</p>
              <p className="text-slate-300">
                Правильных ответов: <span className="font-bold">{correctAnswers}/{totalQuestions}</span>
              </p>
            </div>
          </Card>

          <Card variant="default" size="md">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider">Сводка раунда</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Категория</p>
                  <p className="mt-1 font-semibold text-slate-100">
                    {category.icon} {category.label}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Сложность</p>
                  <p className="mt-1 font-semibold text-slate-100">{DIFFICULTY_LABELS[settings.difficulty]}</p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Очки за раунд</p>
                  <p className={`mt-1 font-semibold ${totalScore >= 0 ? 'text-success-300' : 'text-danger-300'}`}>
                    {totalScore > 0 ? '+' : ''}
                    {totalScore}
                  </p>
                </div>
              </div>
              <ProgressBar current={correctAnswers} max={Math.max(totalQuestions, 1)} color="success" size="lg" />
            </div>
          </Card>

          <Card variant="subtle" size="md">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400">Уровень</p>
                <p className="text-2xl font-bold text-primary-300">{level}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400">Общий счет</p>
                <p className="text-2xl font-bold text-success-300">{score}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400">Серия</p>
                <p className="text-2xl font-bold text-warning-300">{streak}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{getStreakMessage(streak)}</p>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

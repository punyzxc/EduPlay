import React, { useEffect, useState } from 'react';
import { Header, Button, Card, ProgressBar } from '../components';
import { useGame } from '../context/GameContext';
import { Answer } from '../hooks/useQuiz';
import { getPerformanceMessage, getStreakMessage } from '../utils/scoring';
import { addDailyResult, getPlayerName } from '../utils/dailyLeaderboard';

interface ResultScreenProps {
  answers: Answer[];
  totalScore: number;
  onRetry: () => void;
  onQuit: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  answers,
  totalScore,
  onRetry,
  onQuit,
}) => {
  const { score, level, streak } = useGame();
  const [showDetails, setShowDetails] = useState(false);

  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = (correctAnswers / totalQuestions) * 100;
  const performanceMsg = getPerformanceMessage(correctAnswers, totalQuestions);
  const streakMsg = getStreakMessage(streak);

  // Автоматически добавить результат в ежедневный рейтинг
  useEffect(() => {
    if (totalScore > 0) {
      const playerName = getPlayerName();
      addDailyResult(totalScore, playerName);
    }
  }, []);

  const getPerformanceEmoji = () => {
    if (percentage >= 90) return '🌟';
    if (percentage >= 80) return '🎉';
    if (percentage >= 70) return '👏';
    if (percentage >= 60) return '👍';
    return '💪';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />

      <Header title="Результаты" showStats={true} />

      <div className="flex-1 overflow-auto px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Performance Card */}
          <Card
            variant="gradient"
            size="lg"
            className="animate-slideUp text-center relative overflow-hidden border-l-4 border-l-success-500"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-80 h-80 bg-success-500 rounded-full blur-3xl" />
            </div>

            <div className="relative space-y-4">
              <div className="text-7xl font-bold">
                {getPerformanceEmoji()}
              </div>

              <div>
                <p className="text-5xl sm:text-6xl font-bold font-display text-transparent bg-gradient-to-r from-success-400 to-cyan-400 bg-clip-text mb-2">
                  {Math.round(percentage)}%
                </p>
                <p className="text-xl sm:text-2xl font-semibold text-slate-200">
                  {performanceMsg}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-400/20">
                <p className="text-sm text-slate-300">
                  {correctAnswers} из {totalQuestions} ответов правильно
                </p>
              </div>
            </div>
          </Card>

          {/* Daily Leaderboard Notification */}
          <Card
            variant="default"
            size="md"
            className="border-l-4 border-l-success-500 bg-gradient-to-r from-success-500/10 to-emerald-500/10 animate-slideUp"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">🏆</span>
              <div>
                <p className="font-bold text-success-300 text-lg">
                  Результат добавлен в рейтинг!
                </p>
                <p className="text-sm text-slate-300">
                  Заработано <span className="font-bold text-success-400">{totalScore} очков</span> за эту попытку
                </p>
              </div>
            </div>
          </Card>

          {/* Statistics Grid */}
          <Card variant="subtle" size="md">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold font-display text-slate-100">
                📊 Статистика
              </h3>

              {/* Accuracy */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-300">Точность</span>
                  <span className="text-lg font-bold text-success-400">
                    {correctAnswers}/{totalQuestions}
                  </span>
                </div>
                <ProgressBar
                  current={correctAnswers}
                  max={totalQuestions}
                  color="success"
                  size="lg"
                />
              </div>

              {/* Score Divider */}
              <div className="border-t border-slate-700" />

              {/* Score Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-300">Очки в этом раунде</span>
                  <span
                    className={`text-2xl font-bold font-mono ${
                      totalScore >= 0 ? 'text-success-400' : 'text-danger-400'
                    }`}
                  >
                    {totalScore > 0 ? '+' : ''}{totalScore}
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 pt-3">
                  <div className="glass p-4 rounded-lg text-center">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Level
                    </p>
                    <p className="text-2xl font-bold text-primary-400">{level}</p>
                  </div>

                  <div className="glass p-4 rounded-lg text-center">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Total Score
                    </p>
                    <p className="text-2xl font-bold text-success-400">
                      {score.toLocaleString()}
                    </p>
                  </div>

                  <div className="glass p-4 rounded-lg text-center">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Streak 🔥
                    </p>
                    <p className="text-2xl font-bold text-warning-400">{streak}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Streak Message */}
          <Card
            variant="default"
            size="md"
            className="border-l-4 border-l-warning-500 bg-gradient-to-r from-warning-500/10 to-orange-500/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <p className="font-bold text-warning-300">{streakMsg}</p>
                <p className="text-sm text-slate-400">Продолжайте в том же духе!</p>
              </div>
            </div>
          </Card>

          {/* Detailed Answers */}
          <div className="space-y-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-left flex items-center justify-between font-semibold text-slate-300 hover:text-primary-300 transition-colors py-3 px-4 glass rounded-lg border border-slate-700 hover:border-primary-500"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                {showDetails ? 'Скрыть' : 'Показать'} детали ответов
              </span>
              <span className="text-lg">{showDetails ? '▼' : '▶'}</span>
            </button>

            {showDetails && (
              <div className="space-y-2 animate-slideDown">
                {answers.slice(0, 10).map((answer, idx) => (
                  <Card
                    key={idx}
                    variant="subtle"
                    size="sm"
                    className={`border-l-4 ${
                      answer.isCorrect
                        ? 'border-l-success-500 bg-success-500/5'
                        : 'border-l-danger-500 bg-danger-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="text-lg flex-shrink-0">
                          {answer.isCorrect ? '✅' : '❌'}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-200">
                            Вопрос {idx + 1}
                          </p>
                          <p className="text-xs text-slate-400">
                            {answer.timeTaken}с затрачено
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          answer.isCorrect
                            ? 'text-success-400'
                            : 'text-danger-400'
                        }`}
                      >
                        {answer.isCorrect ? '✓' : '✗'}
                      </span>
                    </div>
                  </Card>
                ))}
                {answers.length > 10 && (
                  <p className="text-xs text-center text-slate-400 py-3 font-semibold">
                    И еще {answers.length - 10} вопросов...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              onClick={onRetry}
              variant="primary"
              size="lg"
              icon="🔄"
              className="animate-slideUp"
            >
              Еще раз
            </Button>

            <Button
              onClick={onQuit}
              variant="secondary"
              size="lg"
              icon="🏠"
              className="animate-slideUp"
            >
              В меню
            </Button>
          </div>

          {/* Tips for Improvement */}
          <Card
            variant="default"
            size="md"
            className="border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-500/10 to-cyan-500/10"
          >
            <div className="space-y-3">
              <h4 className="text-lg font-bold font-display text-primary-300 flex items-center gap-2">
                💡 Советы для улучшения
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                {percentage < 80 && (
                  <li className="flex items-start gap-2">
                    <span className="text-primary-400 flex-shrink-0">•</span>
                    <span>Повторите материал перед следующей попыткой</span>
                  </li>
                )}
                {percentage >= 80 && (
                  <li className="flex items-start gap-2">
                    <span className="text-primary-400 flex-shrink-0">•</span>
                    <span>Отличный результат! Попробуйте сложные вопросы</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 flex-shrink-0">•</span>
                  <span>Быстрые ответы дают больше бонусных очков</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 flex-shrink-0">•</span>
                  <span>Ежедневная практика улучшает результаты</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

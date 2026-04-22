import React, { useState } from 'react';
import { Header, Button, Card, ProgressBar } from '../components';
import { useGame } from '../context/GameContext';
import { Answer } from '../hooks/useQuiz';
import { getPerformanceMessage, getStreakMessage } from '../utils/scoring';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pb-20">
      <Header title="Результаты" showStats={true} />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Performance Badge */}
        <Card className="bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 border-pink-700 py-8 text-center animate-slideDown">
          <div className="mb-4">
            <div className="text-6xl mb-4">
              {percentage >= 80 ? '🌟' : percentage >= 60 ? '🎉' : percentage >= 40 ? '👍' : '💪'}
            </div>
            <p className="text-2xl font-bold mb-2">{Math.round(percentage)}%</p>
            <p className="text-lg text-purple-300">{performanceMsg}</p>
          </div>
        </Card>

        {/* Score Summary */}
        <Card className="space-y-4">
          <h3 className="text-lg font-bold text-center mb-4">📊 Статистика</h3>

          <div className="space-y-4">
            {/* Correct Answers */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-300">Правильные ответы</span>
                <span className="text-sm font-bold text-green-400">{correctAnswers}/{totalQuestions}</span>
              </div>
              <ProgressBar current={correctAnswers} max={totalQuestions} color="green" />
            </div>

            {/* Score Gained */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-300">Очки в этом раунде</span>
                <span className={`text-lg font-bold ${totalScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalScore > 0 ? '+' : ''}{totalScore}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Уровень</p>
                  <p className="text-xl font-bold text-blue-400">{level}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Всего очков</p>
                  <p className="text-xl font-bold text-green-400">{score.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Серия</p>
                  <p className="text-xl font-bold text-purple-400">{streak}</p>
                </div>
              </div>
            </div>

            {/* Streak Message */}
            <div className="text-center text-sm text-purple-300 bg-purple-900 bg-opacity-30 p-3 rounded-lg">
              🔥 {streakMsg}
            </div>
          </div>
        </Card>

        {/* Detailed Answers */}
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-left text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors py-2 flex items-center justify-between"
          >
            <span>📋 {showDetails ? 'Скрыть' : 'Показать'} детали ответов</span>
            <span>{showDetails ? '▼' : '▶'}</span>
          </button>

          {showDetails && (
            <div className="space-y-2 mt-4">
              {answers.slice(0, 5).map((answer, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-sm ${
                    answer.isCorrect
                      ? 'bg-green-900 bg-opacity-30 border border-green-700'
                      : 'bg-red-900 bg-opacity-30 border border-red-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-semibold">
                      {answer.isCorrect ? '✅' : '❌'} Вопрос {idx + 1}
                    </span>
                    <span className="text-xs text-gray-400">{answer.timeTaken}с</span>
                  </div>
                  <p className="text-xs text-gray-300">Для закрытия откройте</p>
                </div>
              ))}
              {answers.length > 5 && (
                <p className="text-xs text-center text-gray-400 py-2">
                  И еще {answers.length - 5} вопросов...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button onClick={onRetry} size="lg" className="animate-slideUp">
            🔄 Попробовать еще раз
          </Button>

          <Button
            onClick={onQuit}
            variant="secondary"
            size="lg"
            className="animate-slideUp"
          >
            🏠 В меню
          </Button>
        </div>

        {/* Tips for improvement */}
        <Card className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-700 text-sm space-y-2">
          <p className="font-semibold text-cyan-200">💡 Еще немного:</p>
          <ul className="text-cyan-100 space-y-1 text-xs">
            {percentage < 80 && <li>• Повторите теорию перед следующим раундом</li>}
            {percentage >= 80 && <li>• Попробуйте вопросы повышенной сложности</li>}
            <li>• Берите вызовы, чтобы получить бонусные очки</li>
            <li>• Ежедневная практика повышает мастерство</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

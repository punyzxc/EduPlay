import React, { useState } from 'react';
import { Header, Button, Card, ProgressBar } from '../components';
import { useGame } from '../context/GameContext';

interface MainScreenProps {
  onStartQuiz: () => void;
  onViewLeaderboard: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onStartQuiz, onViewLeaderboard }) => {
  const { score, level, xp } = useGame();
  const [showStats, setShowStats] = useState(false);

  const currentLevelXP = xp % 100;
  const totalXPToNextLevel = 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header title="EduPlay" showStats={false} />

      <div className="px-4 py-8 max-w-md mx-auto space-y-6 pb-20">
        {/* Welcome Card */}
        <Card className="text-center py-12 animate-slideDown">
          <div className="mb-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              EduPlay
            </div>
            <p className="text-gray-300 text-lg">Превратите обучение в игру</p>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Отвечайте на вопросы, зарабатывайте очки и поднимайтесь в рейтинге!
          </p>

          {/* Quick Stats */}
          <div
            className="grid grid-cols-3 gap-3 bg-gray-900 rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-800"
            onClick={() => setShowStats(!showStats)}
          >
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Уровень</p>
              <p className="text-2xl font-bold text-blue-400">{level}</p>
            </div>
            <div className="text-center border-l border-r border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Очки</p>
              <p className="text-2xl font-bold text-green-400">{score.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">XP</p>
              <p className="text-2xl font-bold text-purple-400">{xp}</p>
            </div>
          </div>
        </Card>

        {/* Progress to next level */}
        <Card>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300">Прогресс до уровня {level + 1}</h3>
            <ProgressBar
              current={currentLevelXP}
              max={totalXPToNextLevel}
              label={`${currentLevelXP}/${totalXPToNextLevel} XP`}
              color="purple"
            />
            <div className="text-xs text-gray-400 text-center">
              {totalXPToNextLevel - currentLevelXP} очков до следующего уровня
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
          <Button onClick={onStartQuiz} size="lg" className="animate-scaleIn">
            🚀 Начать Викторину
          </Button>

          <Button
            onClick={onViewLeaderboard}
            variant="secondary"
            size="lg"
            className="animate-scaleIn"
          >
            🏆 Таблица Лидеров
          </Button>
        </div>

        {/* Tips */}
        <Card className="bg-gradient-to-br from-yellow-900 to-orange-900 border-yellow-700 text-sm space-y-2">
          <p className="font-semibold text-yellow-200">💡 Советы:</p>
          <ul className="text-yellow-100 space-y-1 text-xs">
            <li>✓ Дальше отвечаете, больше очков</li>
            <li>✓ Каждый уровень требует 100 XP</li>
            <li>✓ Неправильный ответ = -5 очков</li>
            <li>✓ Проверьте доску лидеров</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

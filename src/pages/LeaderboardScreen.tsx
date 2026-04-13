import React, { useEffect, useState } from 'react';
import { Header, Button, Card } from '../components';
import { useGame } from '../context/GameContext';

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  level: number;
  date: string;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const { score, level } = useGame();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    const saved = localStorage.getItem('eduplay_leaderboard');
    if (saved) {
      setEntries(JSON.parse(saved).sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score));
    }
  };

  const saveToLeaderboard = () => {
    if (!playerName.trim()) return;

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerName.trim(),
      score,
      level,
      date: new Date().toLocaleDateString('ru-RU'),
    };

    const updated = [...entries, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Keep top 50

    localStorage.setItem('eduplay_leaderboard', JSON.stringify(updated));
    setEntries(updated);
    setPlayerName('');
    setShowNameInput(false);
  };

  const getTopPercentage = (index: number): number => {
    return Math.round(((index + 1) / Math.max(entries.length, 1)) * 100);
  };

  const getMedalEmoji = (index: number): string => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '✓';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pb-20">
      <Header title="Таблица Лидеров" showStats={false} />

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Save Score Section */}
        <Card className="bg-gradient-to-br from-yellow-900 to-amber-900 border-yellow-700 space-y-4">
          {!showNameInput ? (
            <div>
              <h3 className="font-bold text-yellow-200 mb-3">📊 Ваш результат</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Очки</p>
                  <p className="text-2xl font-bold text-green-400">{score}</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">Уровень</p>
                  <p className="text-2xl font-bold text-blue-400">{level}</p>
                </div>
              </div>
              <button
                onClick={() => setShowNameInput(true)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                💾 Сохранить результат
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Введите ваше имя..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={saveToLeaderboard}
                  disabled={!playerName.trim()}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  ✅ Сохранить
                </button>
                <button
                  onClick={() => {
                    setShowNameInput(false);
                    setPlayerName('');
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  ✕ Отмена
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Leaderboard */}
        <div>
          <h3 className="text-lg font-bold mb-3">🏆 Лучшие игроки</h3>

          {entries.length === 0 ? (
            <Card className="text-center py-8 text-gray-400">
              <p>Таблица лидеров пуста</p>
              <p className="text-sm mt-2">Сохраните результат, чтобы появиться здесь!</p>
            </Card>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 10).map((entry, index) => (
                <Card
                  key={entry.id}
                  animated={false}
                  className={`p-4 ${
                    index < 3
                      ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 border-yellow-600'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{getMedalEmoji(index)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{entry.name}</p>
                        <p className="text-xs text-gray-400">
                          Уровень {entry.level} • {entry.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">{entry.score}</p>
                      <p className="text-xs text-gray-400">top {getTopPercentage(index)}%</p>
                    </div>
                  </div>
                </Card>
              ))}

              {entries.length > 10 && (
                <Card className="text-center py-3 text-gray-400 text-sm">
                  И еще {entries.length - 10} игроков...
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Back Button */}
        <Button onClick={onBack} variant="secondary" size="lg" className="animate-slideUp">
          ← Назад в меню
        </Button>

        {/* Info Card */}
        <Card className="bg-gradient-to-br from-blue-900 to-indigo-900 border-blue-700 text-sm space-y-2">
          <p className="font-semibold text-blue-200">ℹ️ Информация:</p>
          <p className="text-blue-100 text-xs">
            Таблица лидеров сохраняется в вашем браузере. Данные не синхронизируются между
            устройствами.
          </p>
        </Card>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Header, Card, Button } from '../components';
import { useGame } from '../context/GameContext';
import {
  getDailyLeaderboard,
  addDailyResult,
  getCurrentPlayerRank,
  getTimeUntilReset,
  getLeaderboardDateFormatted,
  setPlayerName,
  DailyLeaderboardEntry,
} from '../utils/dailyLeaderboard';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const { score, level } = useGame();
  const [dailyLeaderboard, setDailyLeaderboard] = useState<DailyLeaderboardEntry[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [currentPlayerRank, setCurrentPlayerRank] = useState<DailyLeaderboardEntry | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState(getTimeUntilReset());
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    loadDailyLeaderboard();
    // Обновлять рейтинг каждые 5 секунд (реальное время)
    const interval = setInterval(() => {
      loadDailyLeaderboard();
      setTimeUntilReset(getTimeUntilReset());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDailyLeaderboard = () => {
    const leaderboard = getDailyLeaderboard();
    setDailyLeaderboard(leaderboard);
    const myRank = getCurrentPlayerRank();
    setCurrentPlayerRank(myRank);
  };

  const saveToLeaderboard = () => {
    if (!nameInput.trim()) return;

    setPlayerName(nameInput.trim());

    // Добавить результат в ежедневный рейтинг
    addDailyResult(score, nameInput.trim());

    loadDailyLeaderboard();
    setNameInput('');
    setShowNameInput(false);
  };

  const getMedalEmoji = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}️⃣`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />

      <Header
        title="Таблица Лидеров"
        showStats={false}
        subtitle="Ежедневный рейтинг топ-10"
      />

      <div className="flex-1 overflow-auto px-4 py-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Reset Timer Card */}
          <Card
            variant="gradient"
            size="md"
            className="border-l-4 border-l-warning-500 text-center overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-warning-500/10 rounded-full blur-3xl" />

            <div className="relative space-y-3">
              <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                📅 {getLeaderboardDateFormatted()}
              </p>
              <div className="text-4xl sm:text-5xl font-bold font-mono text-warning-300">
                ⏱️ {String(timeUntilReset.hours).padStart(2, '0')}:
                {String(timeUntilReset.minutes).padStart(2, '0')}:
                {String(timeUntilReset.seconds).padStart(2, '0')}
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                до следующего сброса рейтинга
              </p>
            </div>
          </Card>

          {/* Current Player Card */}
          <Card variant="subtle" size="md">
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-display text-slate-100">
                🎮 Ваш результат
              </h3>

              <div className="grid grid-cols-3 gap-3">
                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Score
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-success-400">{score}</p>
                </div>

                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Level
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary-400">{level}</p>
                </div>

                <div className="glass p-4 rounded-lg text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Rank
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-warning-400">
                    {currentPlayerRank ? `#${currentPlayerRank.rank}` : '—'}
                  </p>
                </div>
              </div>

              {!showNameInput ? (
                <Button
                  onClick={() => setShowNameInput(true)}
                  variant="success"
                  size="md"
                  fullWidth
                  icon="💾"
                >
                  Сохранить в рейтинг
                </Button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                      Введите ваше имя
                    </label>
                    <input
                      type="text"
                      placeholder="Ваше имя (максимум 20 символов)..."
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={20}
                      autoFocus
                      className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-primary-500 outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={saveToLeaderboard}
                      variant="success"
                      size="md"
                      icon="✅"
                    >
                      Сохранить
                    </Button>
                    <Button
                      onClick={() => {
                        setShowNameInput(false);
                        setNameInput('');
                      }}
                      variant="secondary"
                      size="md"
                      icon="❌"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Leaderboard */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-display text-slate-100 flex items-center gap-2">
                🏆 Топ-10 за 24 часа
              </h2>
              {dailyLeaderboard.length > 0 && (
                <div className="glass px-3 py-1 rounded-lg border border-primary-500/30">
                  <p className="text-sm font-bold text-primary-300">
                    {dailyLeaderboard.length}/10
                  </p>
                </div>
              )}
            </div>

            {dailyLeaderboard.length === 0 ? (
              <Card variant="subtle" size="md" className="text-center py-12">
                <p className="text-4xl mb-3">📊</p>
                <p className="text-lg font-bold text-slate-300 mb-2">Рейтинг еще пуст</p>
                <p className="text-sm text-slate-400">
                  Завершите викторину и сохраните результат, чтобы попасть в топ-10!
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {dailyLeaderboard.map((entry, index) => {
                  const isCurrentPlayer = currentPlayerRank?.userId === entry.userId;
                  const rank = entry.rank || index + 1;

                  return (
                    <Card
                      key={entry.userId}
                      size="sm"
                      variant={
                        isCurrentPlayer ? 'gradient' : index < 3 ? 'default' : 'subtle'
                      }
                      className={`border-l-4 transition-all ${
                        isCurrentPlayer
                          ? 'border-l-success-500 bg-gradient-to-r from-success-500/15 to-success-500/5 ring-2 ring-success-500/50 scale-105'
                          : index === 0
                            ? 'border-l-warning-500 bg-gradient-to-r from-warning-500/10 to-warning-500/5'
                            : index === 1
                              ? 'border-l-primary-500 bg-gradient-to-r from-primary-500/10 to-primary-500/5'
                              : index === 2
                                ? 'border-l-cyan-500 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5'
                                : 'border-l-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Rank & Medal */}
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-3xl w-12 text-center flex-shrink-0">
                            {getMedalEmoji(rank)}
                          </span>

                          {/* Player Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-100 text-sm sm:text-base">
                              {entry.name}
                              {isCurrentPlayer && (
                                <span className="ml-2 text-xs font-semibold text-success-400 bg-success-500/20 px-2 py-1 rounded">
                                  (ВЫ)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {entry.attemptsCount}{' '}
                              {entry.attemptsCount === 1 ? 'попытка' : 'попыток'} • Лучше:{' '}
                              <span className="font-semibold text-primary-300">
                                {entry.bestScore}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl sm:text-3xl font-bold font-display text-success-400">
                            {entry.totalScore}
                          </p>
                          <p className="text-xs text-slate-400">очков</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* How It Works */}
          <Card
            variant="default"
            size="md"
            className="border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-500/10 to-cyan-500/10"
          >
            <div className="space-y-3">
              <h4 className="text-lg font-bold font-display text-primary-300 flex items-center gap-2">
                ℹ️ Как работает система?
              </h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 flex-shrink-0">✨</span>
                  <span>Ежедневно рейтинг сбрасывается в 00:00 UTC</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 flex-shrink-0">🎯</span>
                  <span>Показываются топ-10 игроков по сумме очков за день</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 flex-shrink-0">📊</span>
                  <span>Каждая попытка добавляет очки к вашему дневному результату</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 flex-shrink-0">🏆</span>
                  <span>Лучший результат отслеживается отдельно для каждого игрока</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 flex-shrink-0">🔄</span>
                  <span>Рейтинг обновляется в реальном времени каждые 5 секунд</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Back Button */}
          <Button
            onClick={onBack}
            variant="secondary"
            size="lg"
            fullWidth
            icon="←"
          >
            Вернуться в меню
          </Button>
        </div>
      </div>
    </div>
  );
};

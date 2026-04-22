import React, { useState } from 'react';
import { Header, Button, Card, ProgressBar, UserProfileModal } from '../components';
import { useGame } from '../context/GameContext';

interface MainScreenProps {
  onStartQuiz: () => void;
  onViewLeaderboard: () => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onStartQuiz, onViewLeaderboard }) => {
  const { score, level, xp, user } = useGame();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const currentLevelXP = xp % 100;
  const totalXPToNextLevel = 100;

  const getAvatarEmoji = (avatarId: string): string => {
    const avatars: { [key: string]: string } = {
      '1': '👨‍💻',
      '2': '👩‍💻',
      '3': '🧑‍🚀',
      '4': '🧙‍♂️',
      '5': '🦸‍♂️',
      '6': '🎓',
    };
    return avatars[avatarId] || '👨‍💻';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />

      {/* Header with Profile Button */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0">
        <Header title="EduPlay" showStats={true} />
        
        {user && (
          <button
            onClick={() => setShowProfileModal(true)}
            className="ml-auto text-4xl hover:scale-110 transition-transform"
            title={`Профиль: ${user.login}`}
          >
            {getAvatarEmoji(user.avatar)}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
          {/* Welcome Hero Card */}
          <Card
            variant="gradient"
            size="lg"
            className="animate-slideUp text-center relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl -z-10" />

            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold font-display">
                <span className="text-gradient">
                  Превратите обучение в игру
                </span>
              </h2>

              <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
                Отвечайте на вопросы, зарабатывайте очки и поднимайтесь в рейтинге вместе с другими игроками!
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-700/50">
                <div className="glass p-4 rounded-xl text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Level
                  </p>
                  <p className="text-3xl font-bold text-primary-400">{level}</p>
                  <p className="text-xs text-slate-500 mt-1">Уровень</p>
                </div>

                <div className="glass p-4 rounded-xl text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Score
                  </p>
                  <p className="text-3xl font-bold text-success-400">
                    {score.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Очки</p>
                </div>

                <div className="glass p-4 rounded-xl text-center">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Total XP
                  </p>
                  <p className="text-3xl font-bold text-cyan-400">{xp}</p>
                  <p className="text-xs text-slate-500 mt-1">Опыт</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Progress to next level */}
          <Card variant="subtle" size="md">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-100 font-display">
                  Прогресс до уровня {level + 1}
                </h3>
                <p className="text-sm text-slate-400">
                  {totalXPToNextLevel - currentLevelXP} очков до следующего уровня
                </p>
              </div>

              <ProgressBar
                current={currentLevelXP}
                max={totalXPToNextLevel}
                color="primary"
                size="lg"
                animated={true}
              />

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-mono text-slate-400">
                  {currentLevelXP} / {totalXPToNextLevel}
                </span>
                <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  {Math.round((currentLevelXP / totalXPToNextLevel) * 100)}%
                </span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button
              onClick={onStartQuiz}
              variant="primary"
              size="lg"
              className="animate-scaleIn"
              icon="🚀"
            >
              Начать Викторину
            </Button>

            <Button
              onClick={onViewLeaderboard}
              variant="secondary"
              size="lg"
              className="animate-scaleIn"
              icon="🏆"
            >
              Таблица Лидеров
            </Button>
          </div>

          {/* Features Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Scoring System */}
            <Card variant="default" size="md">
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
                  ⚡ Система Очков
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-success-400">✓</span>
                    <span>Easy: +10 очков</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success-400">✓</span>
                    <span>Medium: +20 очков</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success-400">✓</span>
                    <span>Hard: +30 очков</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-danger-400">✗</span>
                    <span>Ошибка: -5 очков</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Daily Leaderboard */}
            <Card variant="default" size="md">
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
                  🏅 Ежедневный Рейтинг
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-primary-400">•</span>
                    <span>Топ-10 за 24 часа</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-400">•</span>
                    <span>Накопление очков</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-400">•</span>
                    <span>Сброс в 00:00 UTC</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary-400">•</span>
                    <span>Реал-тайм обновление</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Tips Section */}
          <Card
            variant="gradient"
            size="md"
            className="border border-warning-500/30 bg-gradient-to-r from-warning-500/10 to-orange-500/10"
          >
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-warning-300 font-display flex items-center gap-2">
                💡 Советы для Успеха
              </h4>
              <ul className="space-y-2 text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="text-warning-400 text-lg flex-shrink-0">⚡</span>
                  <span>Ответьте быстрее → больше бонус-очков за время</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-warning-400 text-lg flex-shrink-0">📈</span>
                  <span>Каждый уровень требует 100 XP</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-warning-400 text-lg flex-shrink-0">🏆</span>
                  <span>Конкурируйте в ежедневном рейтинге топ-10</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-warning-400 text-lg flex-shrink-0">🔄</span>
                  <span>Сохраняйте имя для отслеживания в рейтинге</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

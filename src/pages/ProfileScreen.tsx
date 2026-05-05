import React, { useMemo, useState } from 'react';
import { ACHIEVEMENT_DEFINITIONS, useGame } from '../context/GameContext';
import { AVATAR_PRESETS } from '../data/avatars';
import { AvatarBadge, Button, Card, Header } from '../components';

interface ProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack, onLogout }) => {
  const {
    user,
    score,
    gamesPlayed,
    accuracy,
    bestScore,
    totalAnswers,
    correctAnswers,
    achievements,
    updateUserProfile,
  } = useGame();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.login || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0].id);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const unlockedSet = useMemo(() => new Set(achievements.map((achievement) => achievement.id)), [achievements]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="default" size="md" className="w-full max-w-lg text-center space-y-4">
          <p className="text-slate-200">Профиль недоступен без авторизации.</p>
          <Button onClick={onBack} variant="secondary">
            Назад
          </Button>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    setError('');
    setSuccess('');

    const result = updateUserProfile({
      login: username.trim(),
      username: username.trim(),
      email: email.trim(),
      avatar,
    });

    if (!result.success) {
      setError(result.error || 'Не удалось сохранить изменения.');
      return;
    }

    setSuccess('Профиль обновлен.');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 -z-10" />
      <Header title="Профиль" subtitle="Аккаунт, статистика и достижения" showStats={false} />

      <div className="flex-1 overflow-auto px-4 py-6 pb-20">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card variant="gradient" size="md">
            <div className="flex flex-wrap items-center gap-4">
              <AvatarBadge avatarId={avatar} username={username || user.login} size="xl" />
              <div className="flex-1 min-w-[180px]">
                <p className="text-xs uppercase tracking-wider text-slate-400">Пользователь</p>
                <p className="text-2xl font-bold text-slate-100">{user.login}</p>
                <p className="text-sm text-slate-300">{user.email}</p>
              </div>
              <Button
                onClick={() => {
                  setIsEditing((previous) => !previous);
                  setError('');
                  setSuccess('');
                }}
                variant="outline"
                size="sm"
                icon="✏️"
              >
                {isEditing ? 'Закрыть' : 'Редактировать'}
              </Button>
            </div>
          </Card>

          {isEditing && (
            <Card variant="default" size="md" className="space-y-4">
              <h3 className="text-lg font-bold text-slate-100">Редактирование профиля</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Username</label>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100"
                    maxLength={24}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Email</label>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-wider text-slate-400">Аватар</label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatar(preset.id)}
                      className={`rounded-lg border p-1.5 transition ${
                        avatar === preset.id
                          ? 'border-primary-400 bg-primary-500/20'
                          : 'border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <AvatarBadge avatarId={preset.id} username={username || user.login} size="md" />
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} variant="success" size="md" icon="💾">
                Сохранить изменения
              </Button>

              {error && (
                <p className="rounded-lg border border-danger-500/40 bg-danger-500/10 px-3 py-2 text-sm text-danger-300">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-lg border border-success-500/40 bg-success-500/10 px-3 py-2 text-sm text-success-300">
                  {success}
                </p>
              )}
            </Card>
          )}

          <Card variant="subtle" size="md">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Статистика</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-xs text-slate-400 uppercase">Общий счет</p>
                <p className="text-2xl font-bold text-success-300">{score}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-xs text-slate-400 uppercase">Игр сыграно</p>
                <p className="text-2xl font-bold text-primary-300">{gamesPlayed}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-xs text-slate-400 uppercase">Точность</p>
                <p className="text-2xl font-bold text-warning-300">{accuracy}%</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-xs text-slate-400 uppercase">Лучший раунд</p>
                <p className="text-2xl font-bold text-cyan-300">{bestScore}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-xs text-slate-400 uppercase">Правильных ответов</p>
                <p className="text-2xl font-bold text-success-300">{correctAnswers}</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-xs text-slate-400 uppercase">Всего ответов</p>
                <p className="text-2xl font-bold text-slate-100">{totalAnswers}</p>
              </div>
            </div>
          </Card>

          <Card variant="default" size="md">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Достижения</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENT_DEFINITIONS.map((achievement) => {
                const unlocked = unlockedSet.has(achievement.id);
                const unlockedAt = achievements.find((item) => item.id === achievement.id)?.unlockedAt;
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-xl border p-4 ${
                      unlocked
                        ? 'border-success-500/40 bg-success-500/10'
                        : 'border-slate-700 bg-slate-900/70 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-bold text-slate-100">{achievement.name}</p>
                        <p className="text-sm text-slate-300">{achievement.description}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {unlocked && unlockedAt
                            ? `Открыто: ${new Date(unlockedAt).toLocaleDateString('ru-RU')}`
                            : 'Пока не открыто'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={onBack} variant="secondary" size="lg" icon="←">
              Назад
            </Button>
            <Button onClick={onLogout} variant="danger" size="lg" icon="🚪">
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

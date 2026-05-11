import React, { useMemo, useState } from 'react';
import { ACHIEVEMENT_DEFINITIONS, useGame } from '../context/GameContext';
import { AVATAR_PRESETS } from '../data/avatars';
import { AvatarBadge, Button, Card, Header, ProgressBar } from '../components';

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
    xp,
  } = useGame();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.login || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0].id);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const unlockedSet = useMemo(() => new Set(achievements.map((achievement) => achievement.id)), [achievements]);
  const levelProgress = xp % 100;

  if (!user) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <Card variant="default" size="md" className="w-full max-w-lg space-y-4 text-center">
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
    <div className="app-shell min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <Header title="Профиль" subtitle="Статистика и достижения" showStats={false} />

      <div className="mobile-content-padding flex-1 overflow-auto px-4 pb-6 pt-2">
        <div className="mx-auto max-w-3xl space-y-4">
          <Card variant="gradient" size="md" className="surface-glow">
            <div className="flex flex-wrap items-center gap-4">
              <AvatarBadge avatarId={avatar} username={username || user.login} size="xl" />
              <div className="min-w-[180px] flex-1">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-300">Игровой аккаунт</p>
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
                {isEditing ? 'Закрыть' : 'Изменить'}
              </Button>
            </div>
            <div className="mt-4">
              <ProgressBar
                current={levelProgress}
                max={100}
                label="Прогресс уровня"
                showPercentage
                color="primary"
                size="lg"
              />
            </div>
          </Card>

          {isEditing && (
            <Card variant="default" size="md" className="space-y-4 animate-scaleIn">
              <h3 className="text-base font-bold uppercase tracking-[0.14em] text-slate-200">Редактирование</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Username</label>
                  <input value={username} onChange={(event) => setUsername(event.target.value)} maxLength={24} />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Email</label>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-slate-400">Аватар</label>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatar(preset.id)}
                      className={`rounded-xl border p-1.5 transition ${
                        avatar === preset.id
                          ? 'border-sky-400 bg-sky-500/20'
                          : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
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
                <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  {success}
                </p>
              )}
            </Card>
          )}

          <Card variant="subtle" size="md">
            <h3 className="mb-3 text-base font-bold uppercase tracking-[0.14em] text-slate-200">Статистика</h3>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Общий счёт</p>
                <p className="text-2xl font-bold text-emerald-300">{score}</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Игр сыграно</p>
                <p className="text-2xl font-bold text-sky-300">{gamesPlayed}</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Точность</p>
                <p className="text-2xl font-bold text-amber-300">{accuracy}%</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Лучший раунд</p>
                <p className="text-2xl font-bold text-cyan-300">{bestScore}</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Верных ответов</p>
                <p className="text-2xl font-bold text-emerald-300">{correctAnswers}</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Всего ответов</p>
                <p className="text-2xl font-bold text-slate-100">{totalAnswers}</p>
              </div>
            </div>
          </Card>

          <Card variant="default" size="md">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold uppercase tracking-[0.14em] text-slate-200">Достижения</h3>
              <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-300">
                {achievements.length}/{ACHIEVEMENT_DEFINITIONS.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {ACHIEVEMENT_DEFINITIONS.map((achievement) => {
                const unlocked = unlockedSet.has(achievement.id);
                const unlockedAt = achievements.find((item) => item.id === achievement.id)?.unlockedAt;

                return (
                  <div
                    key={achievement.id}
                    className={`rounded-2xl border p-3 ${
                      unlocked
                        ? 'border-emerald-500/35 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-900/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <p className="font-bold text-slate-100">{achievement.name}</p>
                        <p className="text-sm text-slate-300">{achievement.description}</p>
                        <p className="mt-1 text-xs text-slate-400">
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

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AvatarBadge, Button, Card, Header } from '../components';
import { useGame } from '../context/GameContext';
import {
  DailyLeaderboardEntry,
  getCurrentPlayerRank,
  getDailyLeaderboard,
} from '../utils/dailyLeaderboard';
import { fetchLeaderboardFromBackend, fetchProfileFromBackend } from '../utils/backendApi';
import { AVATAR_PRESETS } from '../data/avatars';

interface LeaderboardScreenProps {
  onBack: () => void;
}

interface LeaderboardViewEntry extends DailyLeaderboardEntry {
  avatarId: string;
}

const hashToAvatar = (seed: string): string => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return AVATAR_PRESETS[Math.abs(hash) % AVATAR_PRESETS.length].id;
};

const getMedalEmoji = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const { score, level, user } = useGame();
  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardViewEntry[]>([]);
  const [currentPlayerRank, setCurrentPlayerRank] = useState<LeaderboardViewEntry | null>(null);
  const [backendEnabled, setBackendEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pullStartY = useRef<number | null>(null);

  const mapBackendEntry = (entry: {
    id: number;
    username: string;
    totalScore: number;
    bestScore: number;
    rank: number;
    createdAt: string;
    avatar: string;
  }): LeaderboardViewEntry => ({
    userId: String(entry.id),
    name: entry.username,
    totalScore: entry.totalScore,
    bestScore: entry.bestScore,
    attemptsCount: 1,
    timestamp: new Date(entry.createdAt).getTime(),
    lastUpdate: Date.now(),
    rank: entry.rank,
    avatarId: entry.avatar || hashToAvatar(String(entry.id)),
  });

  const withFallbackAvatars = (entries: DailyLeaderboardEntry[]): LeaderboardViewEntry[] =>
    entries.map((entry) => ({
      ...entry,
      avatarId: hashToAvatar(`${entry.userId}_${entry.name}`),
    }));

  const loadDailyLeaderboard = async (silent = false) => {
    if (!silent) {
      setIsLoading(true);
    }
    try {
      const backendItems = await fetchLeaderboardFromBackend(10);
      setDailyLeaderboard(
        backendItems.map((entry) =>
          mapBackendEntry({
            ...entry,
            avatar: entry.avatar,
          }),
        ),
      );
      setBackendEnabled(true);

      if (user?.email || user?.login) {
        try {
          const profile = await fetchProfileFromBackend({
            email: user?.email,
            username: user?.login,
          });
          setCurrentPlayerRank(
            mapBackendEntry({
              id: profile.id,
              username: profile.username,
              totalScore: profile.totalScore,
              bestScore: profile.bestScore,
              rank: profile.rank,
              createdAt: profile.createdAt,
              avatar: profile.avatar,
            }),
          );
        } catch {
          setCurrentPlayerRank(null);
        }
      } else {
        setCurrentPlayerRank(null);
      }
      return;
    } catch {
      setBackendEnabled(false);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }

    const leaderboard = getDailyLeaderboard();
    setDailyLeaderboard(withFallbackAvatars(leaderboard));
    const current = getCurrentPlayerRank();
    setCurrentPlayerRank(
      current
        ? {
            ...current,
            avatarId: hashToAvatar(`${current.userId}_${current.name}`),
          }
        : null,
    );
  };

  useEffect(() => {
    void loadDailyLeaderboard();
    const interval = setInterval(() => {
      void loadDailyLeaderboard(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [user?.email, user?.login]);

  const topThree = useMemo(() => dailyLeaderboard.slice(0, 3), [dailyLeaderboard]);
  const restPlayers = useMemo(() => dailyLeaderboard.slice(3), [dailyLeaderboard]);

  const triggerRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await loadDailyLeaderboard(true);
    setIsRefreshing(false);
  };

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (!scrollRef.current) return;
    if (scrollRef.current.scrollTop > 0) return;
    pullStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (pullStartY.current === null || !scrollRef.current) return;
    if (scrollRef.current.scrollTop > 0) return;
    const delta = event.touches[0].clientY - pullStartY.current;
    if (delta <= 0) {
      setPullDistance(0);
      return;
    }
    setPullDistance(Math.min(90, delta * 0.45));
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (pullDistance > 52) {
      void triggerRefresh();
    }
    pullStartY.current = null;
    setPullDistance(0);
  };

  return (
    <div className="app-shell min-h-screen">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <Header title="Лидерборд" showStats={false} subtitle="Глобальный рейтинг игроков" />

      <div
        ref={scrollRef}
        className="mobile-content-padding flex-1 overflow-auto px-4 pb-6 pt-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <div
            className="mx-auto w-full max-w-xs overflow-hidden rounded-full border border-slate-700 bg-slate-900/70 transition-all duration-200"
            style={{ height: `${Math.max(0, pullDistance * 0.55)}px`, opacity: pullDistance > 0 ? 1 : 0 }}
          >
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.14em] text-slate-300">
              {isRefreshing ? 'Обновление...' : 'Потяни, чтобы обновить'}
            </div>
          </div>

          <Card variant="gradient" size="md" className="surface-glow text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Общий рейтинг</p>
            <div className="text-2xl font-bold text-sky-200">Очки синхронизируются между устройствами</div>
            <p className="mt-1 text-xs text-slate-400">
              {backendEnabled ? 'Backend sync активен' : 'Оффлайн режим: локальный рейтинг'}
            </p>
          </Card>

          <Card variant="subtle" size="md">
            <div className="space-y-3">
              <h3 className="text-base font-bold uppercase tracking-[0.14em] text-slate-200">Ваш прогресс</h3>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-center">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Score</p>
                  <p className="text-2xl font-bold text-emerald-300">{score}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-center">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Level</p>
                  <p className="text-2xl font-bold text-sky-300">{level}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-3 text-center">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Rank</p>
                  <p className="text-2xl font-bold text-amber-300">
                    {currentPlayerRank ? `#${currentPlayerRank.rank}` : '—'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {isLoading && dailyLeaderboard.length === 0 ? (
            <Card variant="default" size="md">
              <div className="space-y-3">
                <div className="skeleton h-6 w-1/2 rounded-xl" />
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="skeleton h-14 w-full rounded-2xl" />
                ))}
              </div>
            </Card>
          ) : dailyLeaderboard.length === 0 ? (
            <Card variant="subtle" size="md" className="text-center">
              <p className="text-4xl">📊</p>
              <p className="mt-2 text-lg font-bold text-slate-200">Рейтинг пока пуст</p>
              <p className="mt-1 text-sm text-slate-400">Сыграйте раунд, чтобы появиться в таблице лидеров.</p>
            </Card>
          ) : (
            <>
              <Card variant="default" size="md">
                <h3 className="mb-3 text-base font-bold uppercase tracking-[0.14em] text-slate-200">Топ-3</h3>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {topThree.map((entry, index) => {
                    const isCurrentPlayer = currentPlayerRank?.userId === entry.userId;
                    const rank = entry.rank || index + 1;
                    return (
                      <div
                        key={entry.userId}
                        className={`rounded-2xl border p-3 text-center ${
                          isCurrentPlayer
                            ? 'border-emerald-400/70 bg-emerald-500/16'
                            : 'border-slate-700 bg-slate-900/65'
                        }`}
                      >
                        <p className="text-xl">{getMedalEmoji(rank)}</p>
                        <div className="my-2 flex justify-center">
                          <AvatarBadge avatarId={entry.avatarId} username={entry.name} size="lg" />
                        </div>
                        <p className="truncate text-sm font-bold text-slate-100">{entry.name}</p>
                        <p className="mt-1 text-xl font-bold text-emerald-300">{entry.totalScore}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="space-y-2">
                {restPlayers.map((entry, index) => {
                  const rank = (entry.rank || index + 4);
                  const isCurrentPlayer = currentPlayerRank?.userId === entry.userId;
                  return (
                    <Card
                      key={entry.userId}
                      size="sm"
                      variant={isCurrentPlayer ? 'gradient' : 'subtle'}
                      className={isCurrentPlayer ? 'border border-emerald-400/55' : ''}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 text-center text-sm font-semibold text-slate-300">{getMedalEmoji(rank)}</span>
                        <AvatarBadge avatarId={entry.avatarId} username={entry.name} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-slate-100">
                            {entry.name} {isCurrentPlayer && <span className="text-emerald-300">(Вы)</span>}
                          </p>
                          <p className="text-xs text-slate-400">Лучший раунд: {entry.bestScore}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-300">{entry.totalScore}</p>
                          <p className="text-[11px] text-slate-400">очков</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          <Card
            variant="default"
            size="md"
            className="border-l-4 border-l-sky-400 bg-gradient-to-r from-sky-500/10 to-cyan-500/10"
          >
            <div className="space-y-2 text-sm text-slate-300">
              <p className="font-bold text-sky-200">Как работает рейтинг</p>
              <p>Очки записываются автоматически после завершения викторины.</p>
              <p>Лидерборд обновляется каждые 5 секунд и показывает топ-10 игроков.</p>
              <p>Одинаковые результаты сортируются по лучшему раунду и времени регистрации.</p>
            </div>
          </Card>

          <Button onClick={onBack} variant="secondary" size="lg" fullWidth icon="←">
            Вернуться в меню
          </Button>
        </div>
      </div>
    </div>
  );
};

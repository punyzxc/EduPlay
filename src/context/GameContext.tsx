import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ACHIEVEMENT_DEFINITIONS, getAchievementDefinition } from '../data/achievements';
import { AVATAR_PRESETS, getAvatarPreset } from '../data/avatars';
import {
  BackendProfile,
  fetchProfileFromBackend,
  loginUserInBackend,
  registerUserInBackend,
  SubmitScorePayload,
  submitScoreToBackend,
  syncProfileToBackend,
} from '../utils/backendApi';
import { setPlayerName } from '../utils/dailyLeaderboard';
import { Achievement, QuizResultPayload, UserProfile, UserStats } from '../types/user';

const USERS_STORAGE_KEY = 'eduplay_users_v2';
const SESSION_STORAGE_KEY = 'eduplay_session_v2';
const PENDING_SCORE_SYNC_KEY = 'eduplay_pending_score_sync_v1';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEGACY_QUIZ_SESSION_PREFIX = 'legacy_quiz';

const defaultStats = (): UserStats => ({
  totalScore: 0,
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  bestStreak: 0,
  gamesPlayed: 0,
  totalAnswers: 0,
  correctAnswers: 0,
  bestScore: 0,
});

const defaultProfileSettings = (): Record<string, string | number | boolean> => ({
  theme: 'dark',
  sound: true,
  animations: true,
});

interface AuthResult {
  success: boolean;
  error?: string;
}

export interface GameContextType {
  user: UserProfile | null;
  registerUser: (email: string, login: string, password: string, avatar?: string) => Promise<AuthResult>;
  loginUser: (identity: string, password: string) => Promise<AuthResult>;
  updateUserProfile: (profile: Partial<UserProfile>) => AuthResult;
  isUserLoggedIn: boolean;
  logout: () => void;

  score: number;
  level: number;
  xp: number;
  streak: number;
  gamesPlayed: number;
  totalAnswers: number;
  correctAnswers: number;
  bestScore: number;
  accuracy: number;

  setScore: (score: number) => void;
  setLevel: (level: number) => void;
  setXP: (xp: number) => void;
  setStreak: (streak: number) => void;
  addScore: (points: number) => void;
  addXP: (xp: number) => void;
  resetGame: () => void;

  achievements: Achievement[];
  addAchievement: (achievement: Achievement) => void;
  getAchievements: () => Achievement[];
  achievementQueue: Achievement[];
  dismissAchievement: (achievementId: string) => void;
  recordQuizResult: (payload: QuizResultPayload) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const parseJson = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const normalizeUserProfile = (candidate: UserProfile): UserProfile => {
  const normalizedXP = Number.isFinite(candidate.stats?.totalXP) ? Math.max(0, candidate.stats.totalXP) : 0;
  const normalizedLevel = Math.max(
    1,
    Number.isFinite(candidate.stats?.level)
      ? candidate.stats.level
      : Math.floor(normalizedXP / 100) + 1,
  );

  return {
    ...candidate,
    avatarColor: candidate.avatarColor ?? getAvatarPreset(candidate.avatar || AVATAR_PRESETS[0].id).from,
    stats: {
      ...defaultStats(),
      ...(candidate.stats ?? {}),
      totalXP: normalizedXP,
      level: normalizedLevel,
      bestStreak: Math.max(candidate.stats?.bestStreak ?? 0, candidate.stats?.currentStreak ?? 0),
      lastPlayedAt: candidate.stats?.lastPlayedAt || undefined,
    },
    achievements: Array.isArray(candidate.achievements) ? candidate.achievements : [],
    unlockedItems: Array.isArray(candidate.unlockedItems) ? candidate.unlockedItems : [],
    profileSettings:
      candidate.profileSettings && typeof candidate.profileSettings === 'object'
        ? candidate.profileSettings
        : defaultProfileSettings(),
  };
};

const buildProfilePayload = (profile: UserProfile) => ({
  username: profile.login,
  email: profile.email,
  avatar: profile.avatar,
  avatarColor: profile.avatarColor ?? getAvatarPreset(profile.avatar || AVATAR_PRESETS[0].id).from,
  password: profile.password,
  level: profile.stats.level,
  totalXP: profile.stats.totalXP,
  currentStreak: profile.stats.currentStreak,
  bestStreak: profile.stats.bestStreak,
  gamesPlayed: profile.stats.gamesPlayed,
  totalAnswers: profile.stats.totalAnswers,
  correctAnswers: profile.stats.correctAnswers,
  achievements: profile.achievements,
  unlockedItems: profile.unlockedItems ?? [],
  profileSettings: profile.profileSettings ?? defaultProfileSettings(),
  lastPlayedAt: profile.stats.lastPlayedAt ?? '',
});

const migrateLegacyState = (): { users: UserProfile[]; sessionUserId: string | null } => {
  const legacyUser = parseJson<Record<string, string> | null>(localStorage.getItem('eduplay_user'), null);
  if (!legacyUser) {
    return { users: [], sessionUserId: null };
  }

  const xp = parseInt(localStorage.getItem('eduplay_xp') || '0', 10);
  const score = parseInt(localStorage.getItem('eduplay_score') || '0', 10);
  const level = parseInt(localStorage.getItem('eduplay_level') || '1', 10);
  const streak = parseInt(localStorage.getItem('eduplay_streak') || '0', 10);
  const achievements = parseJson<Achievement[]>(localStorage.getItem('eduplay_achievements'), []);

  const nowIso = new Date().toISOString();
  const migratedUser: UserProfile = {
    id: legacyUser.id || `user_${Date.now()}`,
    email: legacyUser.email,
    username: legacyUser.login || legacyUser.username || 'Player',
    login: legacyUser.login || legacyUser.username || 'Player',
    password: legacyUser.password,
    avatar: legacyUser.avatar || AVATAR_PRESETS[0].id,
    avatarColor: getAvatarPreset(legacyUser.avatar || AVATAR_PRESETS[0].id).from,
    createdAt: legacyUser.createdAt || legacyUser.registeredAt || nowIso,
    updatedAt: nowIso,
    stats: {
      ...defaultStats(),
      totalScore: score,
      totalXP: xp,
      level: Math.max(level, Math.floor(xp / 100) + 1),
      currentStreak: streak,
      bestStreak: streak,
    },
    achievements: Array.isArray(achievements) ? achievements : [],
    unlockedItems: [],
    profileSettings: defaultProfileSettings(),
  };

  return { users: [normalizeUserProfile(migratedUser)], sessionUserId: migratedUser.id };
};

const getInitialState = (): { users: UserProfile[]; sessionUserId: string | null } => {
  const savedUsers = parseJson<UserProfile[] | null>(localStorage.getItem(USERS_STORAGE_KEY), null);
  const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);

  if (savedUsers && Array.isArray(savedUsers) && savedUsers.length > 0) {
    const normalizedUsers = savedUsers.map((entry) => normalizeUserProfile(entry));
    return {
      users: normalizedUsers,
      sessionUserId: savedSession && normalizedUsers.some((user) => user.id === savedSession) ? savedSession : null,
    };
  }

  return migrateLegacyState();
};

const checkAchievementUnlocks = (
  user: UserProfile,
  payload: QuizResultPayload,
): Achievement[] => {
  const unlocked = new Set(user.achievements.map((achievement) => achievement.id));
  const candidates: string[] = [];

  if (user.stats.gamesPlayed >= 1) candidates.push('first-step');
  if (user.stats.gamesPlayed >= 10) candidates.push('student-10');
  if (user.stats.gamesPlayed >= 50) candidates.push('master-50');
  if (payload.totalAnswers > 0 && payload.correctAnswers === payload.totalAnswers) candidates.push('flawless');
  if (payload.fastestCorrectAnswerTime !== null && payload.fastestCorrectAnswerTime <= 2) candidates.push('light-speed');
  if (payload.highestStreak >= 5) candidates.push('streak-5');

  return candidates
    .filter((id) => !unlocked.has(id))
    .map((id) => getAchievementDefinition(id))
    .filter((definition): definition is NonNullable<typeof definition> => Boolean(definition))
    .map((definition) => ({
      ...definition,
      unlockedAt: new Date().toISOString(),
    }));
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState = useMemo(getInitialState, []);
  const [users, setUsers] = useState<UserProfile[]>(initialState.users);
  const [sessionUserId, setSessionUserId] = useState<string | null>(initialState.sessionUserId);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const [pendingScoreSync, setPendingScoreSync] = useState<SubmitScorePayload[]>(
    () => {
      const pendingItems = parseJson<SubmitScorePayload[]>(localStorage.getItem(PENDING_SCORE_SYNC_KEY), []);
      const seed = Date.now();
      return pendingItems.map((entry, index) => {
        if (entry.score === 0 || entry.quizSessionId) {
          return entry;
        }
        return {
          ...entry,
          quizSessionId: `${LEGACY_QUIZ_SESSION_PREFIX}_${seed}_${index}`,
        };
      });
    },
  );

  const user = useMemo(
    () => users.find((candidate) => candidate.id === sessionUserId) ?? null,
    [users, sessionUserId],
  );

  const patchCurrentUser = useCallback((updater: (current: UserProfile) => UserProfile) => {
    setUsers((previous) =>
      previous.map((candidate) =>
        candidate.id === sessionUserId ? normalizeUserProfile(updater(candidate)) : candidate,
      ),
    );
  }, [sessionUserId]);

  const buildLocalUserFromBackend = useCallback(
    (profile: BackendProfile, password: string, fallbackLogin?: string): UserProfile => {
      const normalizedLogin = profile.username || fallbackLogin || profile.email;
      const localId = `backend_${profile.id}`;
      const existing = users.find(
        (candidate) =>
          candidate.id === localId ||
          candidate.email.toLowerCase() === profile.email.toLowerCase() ||
          candidate.login.toLowerCase() === normalizedLogin.toLowerCase(),
      );

      return normalizeUserProfile({
        id: localId,
        email: profile.email,
        username: normalizedLogin,
        login: normalizedLogin,
        password,
        avatar: profile.avatar || existing?.avatar || AVATAR_PRESETS[0].id,
        avatarColor:
          profile.avatarColor ||
          existing?.avatarColor ||
          getAvatarPreset(profile.avatar || existing?.avatar || AVATAR_PRESETS[0].id).from,
        createdAt: profile.createdAt || existing?.createdAt || new Date().toISOString(),
        updatedAt: profile.updatedAt || new Date().toISOString(),
        stats: {
          ...defaultStats(),
          ...existing?.stats,
          level: profile.level,
          totalXP: profile.totalXP,
          currentStreak: profile.currentStreak,
          bestStreak: profile.bestStreak,
          gamesPlayed: profile.gamesPlayed,
          totalAnswers: profile.totalAnswers,
          correctAnswers: profile.correctAnswers,
          totalScore: profile.totalScore,
          bestScore: profile.bestScore,
          lastPlayedAt: profile.lastPlayedAt || existing?.stats?.lastPlayedAt,
        },
        achievements: profile.achievements ?? existing?.achievements ?? [],
        unlockedItems: profile.unlockedItems ?? existing?.unlockedItems ?? [],
        profileSettings: profile.profileSettings ?? existing?.profileSettings ?? defaultProfileSettings(),
      });
    },
    [users],
  );

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(PENDING_SCORE_SYNC_KEY, JSON.stringify(pendingScoreSync));
  }, [pendingScoreSync]);

  useEffect(() => {
    if (sessionUserId) {
      localStorage.setItem(SESSION_STORAGE_KEY, sessionUserId);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [sessionUserId]);

  useEffect(() => {
    if (user) {
      setPlayerName(user.login);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let isCancelled = false;

    void fetchProfileFromBackend({
      email: user.email,
      username: user.login,
    })
      .then((profile) => {
        if (isCancelled) return;
        setUsers((previous) => {
          const localId = `backend_${profile.id}`;
          const normalizedLogin = profile.username || user.login || profile.email;
          const existing = previous.find(
            (candidate) =>
              candidate.id === localId ||
              candidate.email.toLowerCase() === profile.email.toLowerCase() ||
              candidate.login.toLowerCase() === normalizedLogin.toLowerCase(),
          );
          const hydratedUser = normalizeUserProfile({
            id: localId,
            email: profile.email,
            username: normalizedLogin,
            login: normalizedLogin,
            password: existing?.password ?? user.password,
            avatar: profile.avatar || existing?.avatar || AVATAR_PRESETS[0].id,
            avatarColor:
              profile.avatarColor ||
              existing?.avatarColor ||
              getAvatarPreset(profile.avatar || existing?.avatar || AVATAR_PRESETS[0].id).from,
            createdAt: profile.createdAt || existing?.createdAt || new Date().toISOString(),
            updatedAt: profile.updatedAt || new Date().toISOString(),
            stats: {
              ...defaultStats(),
              ...existing?.stats,
              level: profile.level,
              totalXP: profile.totalXP,
              currentStreak: profile.currentStreak,
              bestStreak: profile.bestStreak,
              gamesPlayed: profile.gamesPlayed,
              totalAnswers: profile.totalAnswers,
              correctAnswers: profile.correctAnswers,
              totalScore: profile.totalScore,
              bestScore: profile.bestScore,
              lastPlayedAt: profile.lastPlayedAt || existing?.stats?.lastPlayedAt,
            },
            achievements: profile.achievements ?? existing?.achievements ?? [],
            unlockedItems: profile.unlockedItems ?? existing?.unlockedItems ?? [],
            profileSettings: profile.profileSettings ?? existing?.profileSettings ?? defaultProfileSettings(),
          });
          const filtered = previous.filter((candidate) => candidate.id !== hydratedUser.id);
          return [...filtered, hydratedUser];
        });
      })
      .catch(() => {
        // Backend unavailable: keep cached local state.
      });

    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    const timeout = window.setTimeout(() => {
      void syncProfileToBackend(buildProfilePayload(user)).catch(() => {
        // Offline fallback: local state remains source of truth until backend is reachable.
      });
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [user]);

  useEffect(() => {
    if (!user || pendingScoreSync.length === 0) return;

    let isCancelled = false;
    void (async () => {
      const remaining: SubmitScorePayload[] = [];
      for (const payload of pendingScoreSync) {
        try {
          await submitScoreToBackend(payload);
        } catch {
          remaining.push(payload);
        }
      }
      if (!isCancelled) {
        setPendingScoreSync(remaining);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [user?.id, pendingScoreSync]);

  const registerUser = async (
    email: string,
    login: string,
    password: string,
    avatar: string = AVATAR_PRESETS[0].id,
  ): Promise<AuthResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedLogin = login.trim();

    if (!normalizedEmail || !normalizedLogin || !password.trim()) {
      return { success: false, error: 'Заполните все поля.' };
    }
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return { success: false, error: 'Некорректный email.' };
    }
    if (normalizedLogin.length < 3) {
      return { success: false, error: 'Username должен быть минимум 3 символа.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Пароль должен быть минимум 6 символов.' };
    }

    if (users.some((candidate) => candidate.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'Пользователь с таким email уже существует.' };
    }

    if (users.some((candidate) => candidate.login.toLowerCase() === normalizedLogin.toLowerCase())) {
      return { success: false, error: 'Этот логин уже занят.' };
    }

    try {
      const profile = await registerUserInBackend({
        username: normalizedLogin,
        email: normalizedEmail,
        password,
        avatar,
        avatarColor: getAvatarPreset(avatar).from,
      });
      const newUser = buildLocalUserFromBackend(profile, password, normalizedLogin);

      setUsers((previous) => {
        const filtered = previous.filter(
          (candidate) =>
            candidate.id !== newUser.id &&
            candidate.email.toLowerCase() !== newUser.email.toLowerCase() &&
            candidate.login.toLowerCase() !== newUser.login.toLowerCase(),
        );
        return [...filtered, newUser];
      });
      setSessionUserId(newUser.id);
      return { success: true };
    } catch (error) {
      if (error instanceof Error && error.message.includes('409')) {
        return { success: false, error: 'Пользователь с таким email или username уже существует на сервере.' };
      }
      return { success: false, error: 'Сервер недоступен. Проверьте backend и попробуйте снова.' };
    }
  };

  const loginUser = async (identity: string, password: string): Promise<AuthResult> => {
    const normalizedIdentity = identity.trim().toLowerCase();
    if (!normalizedIdentity || !password.trim()) {
      return { success: false, error: 'Заполните логин и пароль.' };
    }

    try {
      const profile = await loginUserInBackend({
        identity: normalizedIdentity,
        password,
      });
      const loggedInUser = buildLocalUserFromBackend(profile, password, profile.username);

      setUsers((previous) => {
        const filtered = previous.filter(
          (candidate) =>
            candidate.id !== loggedInUser.id &&
            candidate.email.toLowerCase() !== loggedInUser.email.toLowerCase() &&
            candidate.login.toLowerCase() !== loggedInUser.login.toLowerCase(),
        );
        return [...filtered, loggedInUser];
      });
      setSessionUserId(loggedInUser.id);
      return { success: true };
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        return { success: false, error: 'Неверный пароль.' };
      }
    }

    const target = users.find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedIdentity ||
        candidate.login.toLowerCase() === normalizedIdentity,
    );

    if (!target) {
      return { success: false, error: 'Пользователь не найден.' };
    }

    if (target.password !== password) {
      return { success: false, error: 'Неверный пароль.' };
    }

    setUsers((previous) =>
      previous.map((candidate) =>
        candidate.id === target.id
          ? normalizeUserProfile({ ...candidate, updatedAt: new Date().toISOString() })
          : candidate,
      ),
    );
    setSessionUserId(target.id);
    return { success: true };
  };

  const updateUserProfile = (profile: Partial<UserProfile>): AuthResult => {
    if (!user) return { success: false, error: 'Пользователь не авторизован.' };

    const nextEmail = profile.email?.trim().toLowerCase();
    const nextLogin = (profile.login ?? profile.username)?.trim();

    if (nextLogin !== undefined && nextLogin.length < 3) {
      return { success: false, error: 'Username должен быть минимум 3 символа.' };
    }
    if (nextEmail !== undefined && !EMAIL_REGEX.test(nextEmail)) {
      return { success: false, error: 'Некорректный email.' };
    }

    if (nextEmail && users.some((candidate) => candidate.id !== user.id && candidate.email.toLowerCase() === nextEmail)) {
      return { success: false, error: 'Этот email уже используется.' };
    }

    if (nextLogin && users.some((candidate) => candidate.id !== user.id && candidate.login.toLowerCase() === nextLogin.toLowerCase())) {
      return { success: false, error: 'Этот логин уже занят.' };
    }

    patchCurrentUser((current) => ({
      ...current,
      ...profile,
      email: nextEmail ?? current.email,
      login: nextLogin ?? current.login,
      username: nextLogin ?? current.username,
      avatarColor:
        profile.avatarColor ??
        (profile.avatar ? getAvatarPreset(profile.avatar).from : current.avatarColor),
      updatedAt: new Date().toISOString(),
    }));

    return { success: true };
  };

  const logout = () => {
    setSessionUserId(null);
    setAchievementQueue([]);
  };

  const setScore = (nextScore: number) => {
    if (!user) return;
    patchCurrentUser((current) => ({
      ...current,
      stats: { ...current.stats, totalScore: nextScore },
    }));
  };

  const addScore = (points: number) => {
    if (!user) return;
    patchCurrentUser((current) => ({
      ...current,
      stats: { ...current.stats, totalScore: current.stats.totalScore + points },
    }));
  };

  const setXP = (nextXP: number) => {
    if (!user) return;
    patchCurrentUser((current) => ({
      ...current,
      stats: {
        ...current.stats,
        totalXP: nextXP,
        level: Math.max(1, Math.floor(nextXP / 100) + 1),
      },
    }));
  };

  const addXP = (xpPoints: number) => {
    if (!user) return;
    patchCurrentUser((current) => {
      const totalXP = current.stats.totalXP + xpPoints;
      return {
        ...current,
        stats: {
          ...current.stats,
          totalXP,
          level: Math.max(1, Math.floor(totalXP / 100) + 1),
        },
      };
    });
  };

  const setLevel = (nextLevel: number) => {
    if (!user) return;
    patchCurrentUser((current) => ({
      ...current,
      stats: {
        ...current.stats,
        level: Math.max(1, nextLevel),
      },
    }));
  };

  const setStreak = (nextStreak: number) => {
    if (!user) return;
    patchCurrentUser((current) => ({
      ...current,
      stats: {
        ...current.stats,
        currentStreak: nextStreak,
        bestStreak: Math.max(current.stats.bestStreak, nextStreak),
      },
    }));
  };

  const resetGame = () => {
    if (!user) return;
    patchCurrentUser((current) => ({
      ...current,
      stats: defaultStats(),
      achievements: [],
      unlockedItems: [],
    }));
  };

  const addAchievement = (achievement: Achievement) => {
    if (!user) return;
    patchCurrentUser((current) => {
      if (current.achievements.some((item) => item.id === achievement.id)) {
        return current;
      }
      return {
        ...current,
        achievements: [...current.achievements, achievement],
        unlockedItems: Array.from(new Set([...(current.unlockedItems ?? []), achievement.id])),
      };
    });
    setAchievementQueue((queue) => [...queue, achievement]);
  };

  const recordQuizResult = (payload: QuizResultPayload) => {
    if (!user) return;

    let unlockedNow: Achievement[] = [];
    let updatedSnapshot: UserProfile | null = null;
    patchCurrentUser((current) => {
      const updatedStats: UserStats = {
        ...current.stats,
        gamesPlayed: current.stats.gamesPlayed + 1,
        totalAnswers: current.stats.totalAnswers + payload.totalAnswers,
        correctAnswers: current.stats.correctAnswers + payload.correctAnswers,
        bestScore: Math.max(current.stats.bestScore, payload.totalScore),
        bestStreak: Math.max(current.stats.bestStreak, payload.highestStreak),
        lastPlayedAt: new Date().toISOString(),
      };

      const updatedUser: UserProfile = {
        ...current,
        stats: updatedStats,
      };

      unlockedNow = checkAchievementUnlocks(updatedUser, payload);
      if (unlockedNow.length > 0) {
        const nextUnlockedItems = Array.from(
          new Set([...(updatedUser.unlockedItems ?? []), ...unlockedNow.map((item) => item.id)]),
        );
        updatedSnapshot = normalizeUserProfile({
          ...updatedUser,
          achievements: [...updatedUser.achievements, ...unlockedNow],
          unlockedItems: nextUnlockedItems,
        });
        return updatedSnapshot;
      }

      updatedSnapshot = normalizeUserProfile(updatedUser);
      return updatedSnapshot;
    });

    if (unlockedNow.length > 0) {
      setAchievementQueue((queue) => [...queue, ...unlockedNow]);
    }

    const snapshot = updatedSnapshot ?? user;

    const scorePayload: SubmitScorePayload = {
      ...buildProfilePayload(snapshot),
      score: payload.totalScore,
      quizSessionId: payload.quizSessionId,
    };

    void submitScoreToBackend(scorePayload).catch(() => {
      setPendingScoreSync((previous) => [...previous.slice(-49), scorePayload]);
    });
  };

  const dismissAchievement = (achievementId: string) => {
    setAchievementQueue((queue) => {
      const index = queue.findIndex((item) => item.id === achievementId);
      if (index === -1) return queue;
      return [...queue.slice(0, index), ...queue.slice(index + 1)];
    });
  };

  const accuracy = user?.stats.totalAnswers
    ? Math.round((user.stats.correctAnswers / user.stats.totalAnswers) * 100)
    : 0;

  const value: GameContextType = {
    user,
    registerUser,
    loginUser,
    updateUserProfile,
    isUserLoggedIn: user !== null,
    logout,

    score: user?.stats.totalScore ?? 0,
    level: user?.stats.level ?? 1,
    xp: user?.stats.totalXP ?? 0,
    streak: user?.stats.currentStreak ?? 0,
    gamesPlayed: user?.stats.gamesPlayed ?? 0,
    totalAnswers: user?.stats.totalAnswers ?? 0,
    correctAnswers: user?.stats.correctAnswers ?? 0,
    bestScore: user?.stats.bestScore ?? 0,
    accuracy,

    setScore,
    setLevel,
    setXP,
    setStreak,
    addScore,
    addXP,
    resetGame,

    achievements: user?.achievements ?? [],
    addAchievement,
    getAchievements: () => user?.achievements ?? [],
    achievementQueue,
    dismissAchievement,
    recordQuizResult,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export { ACHIEVEMENT_DEFINITIONS };

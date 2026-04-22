import React, { createContext, useContext, useState, useEffect } from 'react';

// User Profile Interface
export interface UserProfile {
  id: string;
  email: string;
  login: string;
  password: string; // In production, this should be hashed server-side
  avatar: string; // Avatar ID (e.g., '1', '2', '3')
  nickname: string; // Display nickname (can have special styling from achievements)
  isRegistered: boolean;
  registeredAt: string; // Timestamp
}

// Achievement/Reward Interface
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  reward?: {
    nicknameStyle?: 'rainbow' | 'gold' | 'platinum' | 'diamond';
    avatarAccessory?: 'academic-hat' | 'crown' | 'halo' | 'medal';
  };
}

export interface GameContextType {
  // User Profile
  user: UserProfile | null;
  registerUser: (email: string, login: string, password: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isUserLoggedIn: boolean;
  logout: () => void;

  // Game Stats
  score: number;
  level: number;
  xp: number;
  streak: number;
  setScore: (score: number) => void;
  setLevel: (level: number) => void;
  setXP: (xp: number) => void;
  setStreak: (streak: number) => void;
  addScore: (points: number) => void;
  addXP: (xp: number) => void;
  resetGame: () => void;

  // Achievements
  achievements: Achievement[];
  addAchievement: (achievement: Achievement) => void;
  getAchievements: () => Achievement[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // User Profile State
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('eduplay_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Game Stats State
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('eduplay_score');
    return saved ? parseInt(saved) : 0;
  });

  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('eduplay_level');
    return saved ? parseInt(saved) : 1;
  });

  const [xp, setXP] = useState(() => {
    const saved = localStorage.getItem('eduplay_xp');
    return saved ? parseInt(saved) : 0;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('eduplay_streak');
    return saved ? parseInt(saved) : 0;
  });

  // Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('eduplay_achievements');
    return saved ? JSON.parse(saved) : [];
  });

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('eduplay_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eduplay_user');
    }
  }, [user]);

  // Save game stats to localStorage
  useEffect(() => {
    localStorage.setItem('eduplay_score', score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem('eduplay_level', level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem('eduplay_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('eduplay_streak', streak.toString());
  }, [streak]);

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('eduplay_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // User Management Functions
  const registerUser = (email: string, login: string, password: string) => {
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email,
      login,
      password, // Note: In production, hash this on backend
      avatar: '1', // Default avatar
      nickname: login, // Default nickname
      isRegistered: true,
      registeredAt: new Date().toISOString(),
    };
    setUser(newUser);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...profile });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eduplay_user');
  };

  // Game Functions
  const addScore = (points: number) => {
    setScore((prev) => prev + points);
  };

  const addXP = (xpPoints: number) => {
    const newXP = xp + xpPoints;
    setXP(newXP);

    // Level up every 100 XP
    const newLevel = Math.floor(newXP / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      // Auto-add achievement for leveling up
      checkAndAddLevelUpAchievements(newLevel);
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setXP(0);
    setStreak(0);
  };

  // Achievement Functions
  const addAchievement = (achievement: Achievement) => {
    if (!achievements.find((a) => a.id === achievement.id)) {
      setAchievements([...achievements, achievement]);
    }
  };

  const getAchievements = () => achievements;

  const checkAndAddLevelUpAchievements = (newLevel: number) => {
    const levelAchievements: { [key: number]: Achievement } = {
      10: {
        id: 'level_10',
        name: '🚀 Рокетомен',
        description: 'Достигли уровня 10',
        icon: '🚀',
        unlockedAt: new Date().toISOString(),
        reward: {
          nicknameStyle: 'gold',
        },
      },
      25: {
        id: 'level_25',
        name: '⭐ Звезда',
        description: 'Достигли уровня 25',
        icon: '⭐',
        unlockedAt: new Date().toISOString(),
        reward: {
          nicknameStyle: 'platinum',
          avatarAccessory: 'crown',
        },
      },
      50: {
        id: 'level_50',
        name: '💎 Легенда',
        description: 'Достигли уровня 50',
        icon: '💎',
        unlockedAt: new Date().toISOString(),
        reward: {
          nicknameStyle: 'rainbow',
          avatarAccessory: 'halo',
        },
      },
    };

    if (levelAchievements[newLevel]) {
      addAchievement(levelAchievements[newLevel]);
    }
  };

  const value: GameContextType = {
    // User Profile
    user,
    registerUser,
    updateUserProfile,
    isUserLoggedIn: user !== null,
    logout,

    // Game Stats
    score,
    level,
    xp,
    streak,
    setScore,
    setLevel,
    setXP,
    setStreak,
    addScore,
    addXP,
    resetGame,

    // Achievements
    achievements,
    addAchievement,
    getAchievements,
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

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GameContextType {
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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // Save to localStorage whenever values change
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
    }
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setXP(0);
    setStreak(0);
  };

  const value: GameContextType = {
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

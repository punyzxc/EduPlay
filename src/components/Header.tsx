import React from 'react';
import { useGame } from '../context/GameContext';

interface HeaderProps {
  title?: string;
  showStats?: boolean;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'EduPlay',
  showStats = false,
  subtitle,
}) => {
  const { score, level, xp } = useGame();
  const currentLevelXP = xp % 100;

  return (
    <div className="w-full sticky top-0 z-40 backdrop-blur-xl">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-950/60 border-b border-slate-700/50" />

      <div className="relative px-4 py-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          {/* Title Section */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display">
              <span className="text-gradient">
                {title}
              </span>
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Stats Section */}
          {showStats && (
            <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
              {/* Level Stat */}
              <div className="glass p-3 rounded-lg text-center min-w-[80px]">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Level
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-primary-400">{level}</p>
              </div>

              {/* Score Stat */}
              <div className="glass p-3 rounded-lg text-center min-w-[90px]">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Score
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-success-400">{score}</p>
              </div>
            </div>
          )}
        </div>

        {/* XP Progress Bar */}
        {showStats && (
          <div className="max-w-xs sm:max-w-md">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                XP Progress
              </span>
              <span className="text-xs font-mono text-primary-400">
                {currentLevelXP}/100
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full bg-gradient-to-r from-primary-500 to-cyan-500 transition-all duration-500 ease-out`}
                style={{ width: `${currentLevelXP}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useGame } from '../context/GameContext';

interface HeaderProps {
  title?: string;
  showStats?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'EduPlay',
  showStats = false,
}) => {
  const { score, level, xp } = useGame();
  const currentLevelXP = xp % 100;

  return (
    <div className="w-full bg-gradient-to-b from-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-40 shadow-lg">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h1>
          {showStats && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">LVL</p>
                <p className="text-lg sm:text-xl font-bold text-blue-400">{level}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Очки</p>
                <p className="text-lg sm:text-xl font-bold text-green-400">{score}</p>
              </div>
            </div>
          )}
        </div>

        {showStats && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">XP: {currentLevelXP}/100</span>
              <span className="text-xs text-gray-400">{level + 1}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${currentLevelXP}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

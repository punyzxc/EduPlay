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
    <header className="safe-top sticky top-0 z-40 px-4 pb-3 sm:px-6">
      <div className="glass-lg rounded-b-[1.35rem] border-b border-slate-600/35 px-4 pb-3 pt-2 shadow-soft-card">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold sm:text-[1.9rem]">
              <span className="text-gradient">{title}</span>
            </h1>
            {subtitle && <p className="mt-0.5 text-xs text-slate-300 sm:text-sm">{subtitle}</p>}
          </div>

          {showStats && (
            <div className="flex gap-2">
              <div className="rounded-2xl border border-slate-600/50 bg-slate-900/65 px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Lvl</p>
                <p className="text-lg font-bold text-sky-300">{level}</p>
              </div>
              <div className="rounded-2xl border border-slate-600/50 bg-slate-900/65 px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.14em] text-slate-400">Score</p>
                <p className="text-lg font-bold text-emerald-300">{score}</p>
              </div>
            </div>
          )}
        </div>

        {showStats && (
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-[0.13em]">
              <span className="text-slate-400">XP Progress</span>
              <span className="font-mono text-sky-300">{currentLevelXP}/100</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full border border-slate-700 bg-slate-900/75">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${currentLevelXP}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

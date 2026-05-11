import React, { useEffect } from 'react';
import { Achievement } from '../types/user';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: (achievementId: string) => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onClose(achievement.id);
    }, 3800);
    return () => window.clearTimeout(timeout);
  }, [achievement.id, onClose]);

  return (
    <div className="animate-slideDown glass-lg relative w-full overflow-hidden rounded-2xl p-4 shadow-soft-card">
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-slate-800/90">
        <div className="h-full w-full origin-left bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 animate-[toastBar_3.6s_linear_forwards]" />
      </div>
      <div className="flex items-start gap-3 pr-1">
        <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-400/50 bg-amber-400/15 text-2xl">
          {achievement.icon}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-amber-200">Достижение открыто</p>
          <p className="truncate text-base font-bold text-slate-100">{achievement.name}</p>
          <p className="line-clamp-2 text-sm text-slate-300">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
};

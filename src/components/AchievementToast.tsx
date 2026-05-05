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
    <div className="animate-slideDown w-full rounded-xl border border-warning-500/50 bg-slate-900/95 p-4 shadow-2xl backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="text-3xl">{achievement.icon}</span>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-warning-300">Новое достижение</p>
          <p className="font-bold text-slate-100">{achievement.name}</p>
          <p className="text-sm text-slate-300">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const colorStyles: Record<NonNullable<ProgressBarProps['color']>, string> = {
  primary: 'from-sky-400 via-cyan-400 to-blue-500',
  success: 'from-emerald-400 via-teal-400 to-green-500',
  warning: 'from-amber-300 via-yellow-400 to-orange-500',
  danger: 'from-rose-400 via-red-400 to-red-600',
  secondary: 'from-slate-400 via-slate-500 to-slate-600',
};

const sizeStyles: Record<NonNullable<ProgressBarProps['size']>, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  showPercentage = false,
  color = 'primary',
  size = 'md',
  animated = true,
}) => {
  const percentage = max <= 0 ? 0 : Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            {label ?? 'Прогресс'}
          </span>
          {showPercentage && (
            <span className="font-mono text-xs font-semibold text-sky-300">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={`overflow-hidden rounded-full border border-slate-700/75 bg-slate-900/75 ${sizeStyles[size]}`}>
        <div
          className={[
            `h-full rounded-full bg-gradient-to-r ${colorStyles[color]}`,
            animated ? 'transition-all duration-500 ease-out' : '',
          ].join(' ')}
          style={{ width: `${percentage}%` }}
        >
          {animated && percentage > 0 && <div className="skeleton h-full rounded-full opacity-35" />}
        </div>
      </div>
    </div>
  );
};

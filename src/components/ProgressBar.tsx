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

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  showPercentage = false,
  color = 'primary',
  size = 'md',
  animated = true,
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  const colorStyles = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    danger: 'from-danger-500 to-danger-600',
    secondary: 'from-slate-500 to-slate-600',
  };

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm font-mono text-primary-400 font-semibold">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700 ${sizeStyles[size]}`}>
        <div
          className={`
            h-full bg-gradient-to-r ${colorStyles[color]}
            ${animated ? 'transition-all duration-500 ease-out' : ''}
            relative
          `}
          style={{ width: `${percentage}%` }}
        >
          {animated && percentage > 0 && (
            <div
              className="absolute inset-0 opacity-50 bg-white/20"
              style={{
                backgroundImage: 'linear-gradient(90deg, transparent, white, transparent)',
                animation: 'shimmer 2s infinite',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

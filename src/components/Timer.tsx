import React, { useEffect, useState } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isActive?: boolean;
  compact?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onTimeUp,
  isActive = true,
  compact = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp]);

  // Calculate percentage for visual indicator
  const percentage = Math.max(0, (timeLeft / duration) * 100);
  const isWarning = timeLeft <= duration / 3; // Last 1/3 of time
  const isCritical = timeLeft <= 5; // Last 5 seconds

  const getColorClass = () => {
    if (isCritical) return 'text-danger-500';
    if (isWarning) return 'text-warning-500';
    return 'text-primary-400';
  };

  const getBarColor = () => {
    if (isCritical) return 'from-danger-500 to-danger-600';
    if (isWarning) return 'from-warning-500 to-warning-600';
    return 'from-primary-500 to-primary-600';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
        <div className={`text-2xl font-mono font-bold ${getColorClass()} transition-colors duration-200`}>
          {String(Math.ceil(timeLeft)).padStart(2, '0')}s
        </div>
        <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Timer Display */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          {/* Circular Background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700/50 flex items-center justify-center">
            {/* Timer Number */}
            <div
              className={`text-5xl sm:text-6xl font-mono font-bold ${getColorClass()} transition-colors duration-200 text-center`}
            >
              {String(Math.ceil(timeLeft)).padStart(2, '0')}
            </div>

            {/* Animated Ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent transition-all duration-300"
              style={{
                borderRightColor: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#0ea5e9',
                transform: `rotate(${360 - (percentage / 100) * 360}deg)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
          <div
            className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-300 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Status Text */}
        {isCritical && (
          <div className="text-center animate-pulse">
            <p className="text-sm sm:text-base font-bold text-danger-400 uppercase tracking-wider">
              ⏰ Время заканчивается!
            </p>
          </div>
        )}
        {isWarning && !isCritical && (
          <div className="text-center">
            <p className="text-sm sm:text-base font-semibold text-warning-400 uppercase tracking-wider">
              ⚠️ Спешите!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

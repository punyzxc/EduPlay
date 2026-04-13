import React, { useEffect, useState } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isActive?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive = true }) => {
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
    if (isCritical) return 'text-red-500';
    if (isWarning) return 'text-yellow-500';
    return 'text-blue-400';
  };

  const getBarColor = () => {
    if (isCritical) return 'from-red-500 to-red-600';
    if (isWarning) return 'from-yellow-500 to-yellow-600';
    return 'from-blue-500 to-blue-600';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-3">
        <div className={`text-5xl font-bold font-mono ${getColorClass()} transition-colors duration-200`}>
          {String(Math.ceil(timeLeft)).padStart(2, '0')}
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getBarColor()} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isCritical && (
        <div className="mt-2 text-center animate-pulse">
          <p className="text-sm font-semibold text-red-500">Время заканчивается!</p>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useMemo, useState } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive?: boolean;
  compact?: boolean;
  onTick?: (timeLeft: number) => void;
}

export const Timer: React.FC<TimerProps> = ({
  duration,
  onTimeUp,
  isActive = true,
  compact = false,
  onTick,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    onTick?.(duration);
  }, [duration, onTick]);

  useEffect(() => {
    onTick?.(timeLeft);
  }, [timeLeft, onTick]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timeout = window.setTimeout(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          onTimeUp();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [isActive, onTimeUp, timeLeft]);

  const percentage = Math.max(0, (timeLeft / duration) * 100);
  const isWarning = timeLeft <= Math.ceil(duration * 0.33);
  const isCritical = timeLeft <= Math.min(4, Math.ceil(duration * 0.2));

  const tone = useMemo(() => {
    if (isCritical) {
      return {
        text: 'text-rose-300',
        ring: '#fb7185',
        gradient: 'from-rose-400 via-red-400 to-red-600',
        message: 'Финиш',
      };
    }
    if (isWarning) {
      return {
        text: 'text-amber-300',
        ring: '#fbbf24',
        gradient: 'from-amber-300 via-yellow-400 to-orange-500',
        message: 'Ускорься',
      };
    }
    return {
      text: 'text-sky-300',
      ring: '#38bdf8',
      gradient: 'from-sky-300 via-cyan-400 to-blue-500',
      message: 'Ритм',
    };
  }, [isCritical, isWarning]);

  if (compact) {
    return (
      <div className="glass flex items-center gap-3 rounded-2xl p-3">
        <div className={`text-2xl font-mono font-bold ${tone.text}`}>{String(Math.ceil(timeLeft)).padStart(2, '0')}s</div>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full border border-slate-700 bg-slate-900/75">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${tone.gradient} transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-5 flex items-center justify-center">
        <div className="relative h-32 w-32 sm:h-36 sm:w-36">
          <div
            className="absolute inset-0 rounded-full p-1"
            style={{
              background: `conic-gradient(${tone.ring} ${percentage * 3.6}deg, rgba(15,23,42,0.7) 0deg)`,
            }}
          >
            <div className="glass relative flex h-full w-full items-center justify-center rounded-full">
              <div className="text-center">
                <div className={`font-mono text-4xl font-bold ${tone.text}`}>
                  {String(Math.ceil(timeLeft)).padStart(2, '0')}
                </div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{tone.message}</div>
              </div>
            </div>
          </div>
          {isCritical && <div className="absolute inset-0 animate-pulseSoft rounded-full border border-rose-300/60" />}
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3 overflow-hidden rounded-full border border-slate-700 bg-slate-900/80">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${tone.gradient} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

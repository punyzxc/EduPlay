import { useState, useCallback } from 'react';

export const useTimer = (initialDuration: number) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);

  const start = useCallback(() => {
    setTimeLeft(initialDuration);
    setIsActive(true);
  }, [initialDuration]);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(initialDuration);
    setIsActive(false);
  }, [initialDuration]);

  return {
    timeLeft,
    setTimeLeft,
    isActive,
    start,
    stop,
    reset,
  };
};

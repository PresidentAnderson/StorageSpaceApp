import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  initialTime?: number;
  interval?: number;
  onComplete?: () => void;
}

/**
 * Custom hook for countdown timer
 */
export const useTimer = (options: UseTimerOptions = {}) => {
  const { initialTime = 0, interval = 1000, onComplete } = options;

  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setIsRunning(false);
    setTime(newTime ?? initialTime);
  }, [initialTime]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - interval / 1000;

          if (newTime <= 0) {
            setIsRunning(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }

          return newTime;
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time, interval, onComplete]);

  // Format time as MM:SS
  const formatTime = useCallback(() => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [time]);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    stop,
    formatTime,
  };
};

export default useTimer;

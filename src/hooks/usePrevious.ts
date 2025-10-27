import { useEffect, useRef } from 'react';

/**
 * Custom hook to get previous value
 * Useful for comparing current and previous props/state
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;

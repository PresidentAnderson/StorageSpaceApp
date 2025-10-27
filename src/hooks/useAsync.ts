import { useState, useCallback, useEffect } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseAsyncOptions {
  immediate?: boolean;
}

/**
 * Custom hook for handling async operations
 */
export const useAsync = <T, Args extends any[] = any[]>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
) => {
  const { immediate = false } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, error: null, isLoading: true });

      try {
        const data = await asyncFunction(...args);
        setState({ data, error: null, isLoading: false });
        return data;
      } catch (error) {
        setState({ data: null, error: error as Error, isLoading: false });
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

export default useAsync;

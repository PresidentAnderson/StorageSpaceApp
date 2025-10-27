import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseFetchOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for fetching data from APIs
 */
export const useFetch = <T>(url: string | null, options: UseFetchOptions = {}) => {
  const { immediate = true, onSuccess, onError } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const fetchData = useCallback(async () => {
    if (!url) return;

    setState({ data: null, error: null, isLoading: true });

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, error: null, isLoading: false });

      if (onSuccess) {
        onSuccess(data);
      }

      return data;
    } catch (error) {
      const err = error as Error;
      setState({ data: null, error: err, isLoading: false });

      if (onError) {
        onError(err);
      }

      throw error;
    }
  }, [url, onSuccess, onError]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [url, immediate]);

  return {
    ...state,
    refetch,
  };
};

export default useFetch;

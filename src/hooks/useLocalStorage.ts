import { useState, useEffect, useCallback } from 'react';
import { getFromStorage, saveToStorage, removeFromStorage } from '../utils/storage';

/**
 * Custom hook for persistent state with AsyncStorage
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial value from storage
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await getFromStorage<T>(key);
        if (item !== null) {
          setStoredValue(item);
        }
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  // Save value to storage
  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        await saveToStorage(key, valueToStore);
      } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from storage
  const removeValue = useCallback(async () => {
    try {
      setStoredValue(initialValue);
      await removeFromStorage(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
  };
};

export default useLocalStorage;

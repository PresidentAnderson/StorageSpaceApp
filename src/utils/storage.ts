// Local storage utility functions using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data to local storage
 */
export const saveToStorage = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
    throw error;
  }
};

/**
 * Get data from local storage
 */
export const getFromStorage = async <T = any>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting from storage (${key}):`, error);
    return null;
  }
};

/**
 * Remove data from local storage
 */
export const removeFromStorage = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from storage (${key}):`, error);
    throw error;
  }
};

/**
 * Clear all data from local storage
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Get multiple items from storage
 */
export const getMultipleFromStorage = async (
  keys: string[]
): Promise<Record<string, any>> => {
  try {
    const pairs = await AsyncStorage.multiGet(keys);
    const result: Record<string, any> = {};

    pairs.forEach(([key, value]) => {
      if (value) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error getting multiple from storage:', error);
    return {};
  }
};

/**
 * Save multiple items to storage
 */
export const saveMultipleToStorage = async (
  items: Array<[string, any]>
): Promise<void> => {
  try {
    const pairs = items.map(([key, value]) => [key, JSON.stringify(value)]);
    await AsyncStorage.multiSet(pairs as [string, string][]);
  } catch (error) {
    console.error('Error saving multiple to storage:', error);
    throw error;
  }
};

/**
 * Get all keys from storage
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys from storage:', error);
    return [];
  }
};

/**
 * Check if key exists in storage
 */
export const hasKey = async (key: string): Promise<boolean> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.includes(key);
  } catch (error) {
    console.error('Error checking key in storage:', error);
    return false;
  }
};

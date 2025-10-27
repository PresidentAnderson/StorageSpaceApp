import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';

interface AppContextType {
  theme: 'light' | 'dark';
  language: string;
  isOnboardingComplete: boolean;
  notifications: Notification[];
  isConnected: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  completeOnboarding: () => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setConnectionStatus: (status: boolean) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [language, setLanguageState] = useState('en');
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  // Load app settings from storage on mount
  useEffect(() => {
    loadAppSettings();
  }, []);

  const loadAppSettings = async () => {
    try {
      const storedTheme = await getFromStorage<'light' | 'dark'>(STORAGE_KEYS.THEME);
      const storedLanguage = await getFromStorage<string>(STORAGE_KEYS.LANGUAGE);
      const onboardingComplete = await getFromStorage<boolean>(
        STORAGE_KEYS.ONBOARDING_COMPLETE
      );

      if (storedTheme) setThemeState(storedTheme);
      if (storedLanguage) setLanguageState(storedLanguage);
      if (onboardingComplete) setIsOnboardingComplete(onboardingComplete);
    } catch (error) {
      console.error('Error loading app settings:', error);
    }
  };

  const setTheme = async (newTheme: 'light' | 'dark') => {
    try {
      setThemeState(newTheme);
      await saveToStorage(STORAGE_KEYS.THEME, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setLanguage = async (newLanguage: string) => {
    try {
      setLanguageState(newLanguage);
      await saveToStorage(STORAGE_KEYS.LANGUAGE, newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const completeOnboarding = async () => {
    try {
      setIsOnboardingComplete(true);
      await saveToStorage(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [...prev, notification]);

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const setConnectionStatus = (status: boolean) => {
    setIsConnected(status);
  };

  const value: AppContextType = {
    theme,
    language,
    isOnboardingComplete,
    notifications,
    isConnected,
    setTheme,
    setLanguage,
    completeOnboarding,
    addNotification,
    removeNotification,
    clearNotifications,
    setConnectionStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

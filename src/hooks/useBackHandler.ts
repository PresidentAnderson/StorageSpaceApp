import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Custom hook for handling Android back button
 */
export const useBackHandler = (handler: () => boolean) => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handler);
    };
  }, [handler]);
};

export default useBackHandler;

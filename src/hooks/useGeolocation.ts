import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
}

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
  hasPermission: boolean | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

/**
 * Custom hook for getting user's geolocation
 */
export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const { enableHighAccuracy = true, timeout = 15000, maximumAge = 10000, watch = false } = options;

  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: false,
    hasPermission: null,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const requestPermissions = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          setState((prev) => ({
            ...prev,
            error: 'Permission to access location was denied',
            hasPermission: false,
            isLoading: false,
          }));
          return false;
        }

        setState((prev) => ({ ...prev, hasPermission: true }));
        return true;
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message || 'Failed to request permissions',
          isLoading: false,
        }));
        return false;
      }
    };

    const getCurrentPosition = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: enableHighAccuracy
            ? Location.Accuracy.High
            : Location.Accuracy.Balanced,
          timeInterval: timeout,
          distanceInterval: 0,
        });

        setState({
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            altitude: location.coords.altitude,
            heading: location.coords.heading,
            speed: location.coords.speed,
          },
          error: null,
          isLoading: false,
          hasPermission: true,
        });
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message || 'Failed to get location',
          isLoading: false,
        }));
      }
    };

    const startWatching = async () => {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      try {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: enableHighAccuracy
              ? Location.Accuracy.High
              : Location.Accuracy.Balanced,
            timeInterval: timeout,
            distanceInterval: 10, // Update every 10 meters
          },
          (location) => {
            setState({
              coordinates: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
                altitude: location.coords.altitude,
                heading: location.coords.heading,
                speed: location.coords.speed,
              },
              error: null,
              isLoading: false,
              hasPermission: true,
            });
          }
        );
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          error: error.message || 'Failed to watch location',
          isLoading: false,
        }));
      }
    };

    if (watch) {
      startWatching();
    } else {
      getCurrentPosition();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [enableHighAccuracy, timeout, watch]);

  const refresh = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: enableHighAccuracy
          ? Location.Accuracy.High
          : Location.Accuracy.Balanced,
      });

      setState({
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          altitude: location.coords.altitude,
          heading: location.coords.heading,
          speed: location.coords.speed,
        },
        error: null,
        isLoading: false,
        hasPermission: true,
      });
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Failed to refresh location',
        isLoading: false,
      }));
    }
  };

  return {
    ...state,
    refresh,
  };
};

export default useGeolocation;

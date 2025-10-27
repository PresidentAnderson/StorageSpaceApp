import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { locationsService } from '../api';
import { StorageLocation } from '../types';

interface LocationFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  radius?: number;
  availability?: boolean;
}

interface LocationContextType {
  locations: StorageLocation[];
  selectedLocation: StorageLocation | null;
  filters: LocationFilters;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  userLocation: { latitude: number; longitude: number } | null;
  setLocations: (locations: StorageLocation[]) => void;
  setSelectedLocation: (location: StorageLocation | null) => void;
  setFilters: (filters: LocationFilters) => void;
  setSearchQuery: (query: string) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  fetchLocations: () => Promise<void>;
  fetchNearbyLocations: (latitude: number, longitude: number, radius?: number) => Promise<void>;
  searchLocations: (query: string) => Promise<void>;
  clearFilters: () => void;
  refreshLocations: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);
  const [filters, setFilters] = useState<LocationFilters>({
    radius: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );

  const fetchLocations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await locationsService.getLocations(filters);
      setLocations(response.locations);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch locations');
      console.error('Fetch locations error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchNearbyLocations = useCallback(
    async (latitude: number, longitude: number, radius: number = 5) => {
      try {
        setIsLoading(true);
        setError(null);
        setUserLocation({ latitude, longitude });
        const response = await locationsService.getNearbyLocations(latitude, longitude, radius);
        setLocations(response.locations);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch nearby locations');
        console.error('Fetch nearby locations error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const searchLocations = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        await fetchLocations();
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setSearchQuery(query);

        // If we have user location, include it in search
        const searchParams: any = {
          ...filters,
        };

        if (userLocation) {
          searchParams.latitude = userLocation.latitude;
          searchParams.longitude = userLocation.longitude;
        }

        const response = await locationsService.searchLocations(searchParams);
        setLocations(response.locations);
      } catch (err: any) {
        setError(err.message || 'Failed to search locations');
        console.error('Search locations error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters, userLocation, fetchLocations]
  );

  const clearFilters = useCallback(() => {
    setFilters({ radius: 5 });
    setSearchQuery('');
  }, []);

  const refreshLocations = useCallback(async () => {
    if (userLocation) {
      await fetchNearbyLocations(userLocation.latitude, userLocation.longitude, filters.radius);
    } else {
      await fetchLocations();
    }
  }, [userLocation, filters.radius, fetchLocations, fetchNearbyLocations]);

  const value: LocationContextType = {
    locations,
    selectedLocation,
    filters,
    isLoading,
    error,
    searchQuery,
    userLocation,
    setLocations,
    setSelectedLocation,
    setFilters,
    setSearchQuery,
    setUserLocation,
    fetchLocations,
    fetchNearbyLocations,
    searchLocations,
    clearFilters,
    refreshLocations,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;

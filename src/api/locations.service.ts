// Locations service

import apiClient from './client';
import { API_ENDPOINTS } from '../constants';
import { StorageLocation } from '../types';

interface LocationSearchParams {
  latitude: number;
  longitude: number;
  radius?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: boolean;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

interface LocationsResponse {
  locations: StorageLocation[];
  total: number;
  page: number;
  limit: number;
}

interface AvailabilityParams {
  startDate: string;
  endDate: string;
  numberOfBags?: number;
}

interface AvailabilityResponse {
  available: boolean;
  capacity: number;
  remaining: number;
  pricing: {
    hourlyRate: number;
    dailyRate: number;
    weeklyRate: number;
  };
}

class LocationsService {
  /**
   * Get all locations
   */
  async getLocations(params?: Partial<LocationSearchParams>): Promise<LocationsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `${API_ENDPOINTS.LOCATIONS.LIST}?${queryParams.toString()}`;
    return await apiClient.get<LocationsResponse>(endpoint);
  }

  /**
   * Search locations
   */
  async searchLocations(params: LocationSearchParams): Promise<LocationsResponse> {
    return await apiClient.post<LocationsResponse>(
      API_ENDPOINTS.LOCATIONS.SEARCH,
      params
    );
  }

  /**
   * Get nearby locations
   */
  async getNearbyLocations(
    latitude: number,
    longitude: number,
    radius: number = 5
  ): Promise<LocationsResponse> {
    return await apiClient.get<LocationsResponse>(
      `${API_ENDPOINTS.LOCATIONS.NEARBY}?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
  }

  /**
   * Get location details by ID
   */
  async getLocationDetails(locationId: string): Promise<StorageLocation> {
    const endpoint = API_ENDPOINTS.LOCATIONS.DETAILS.replace(':id', locationId);
    return await apiClient.get<StorageLocation>(endpoint);
  }

  /**
   * Check location availability
   */
  async checkAvailability(
    locationId: string,
    params: AvailabilityParams
  ): Promise<AvailabilityResponse> {
    const endpoint = API_ENDPOINTS.LOCATIONS.AVAILABILITY.replace(':id', locationId);
    return await apiClient.post<AvailabilityResponse>(endpoint, params);
  }

  /**
   * Get location reviews
   */
  async getLocationReviews(
    locationId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<any> {
    return await apiClient.get(
      `/locations/${locationId}/reviews?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Get location photos
   */
  async getLocationPhotos(locationId: string): Promise<string[]> {
    return await apiClient.get<string[]>(`/locations/${locationId}/photos`);
  }

  /**
   * Add location to favorites
   */
  async addToFavorites(locationId: string): Promise<void> {
    await apiClient.post(
      `/locations/${locationId}/favorite`,
      {},
      { requiresAuth: true }
    );
  }

  /**
   * Remove location from favorites
   */
  async removeFromFavorites(locationId: string): Promise<void> {
    await apiClient.delete(
      `/locations/${locationId}/favorite`,
      { requiresAuth: true }
    );
  }

  /**
   * Report location issue
   */
  async reportIssue(
    locationId: string,
    issue: {
      type: string;
      description: string;
      photos?: string[];
    }
  ): Promise<void> {
    await apiClient.post(
      `/locations/${locationId}/report`,
      issue,
      { requiresAuth: true }
    );
  }
}

export const locationsService = new LocationsService();
export default locationsService;

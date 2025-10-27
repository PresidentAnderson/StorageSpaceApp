// Export all API services

export { apiClient, default as client } from './client';
export { authService, default as auth } from './auth.service';
export { locationsService, default as locations } from './locations.service';
export { bookingsService, default as bookings } from './bookings.service';

// Create a single API object for easy access
export const api = {
  client: apiClient,
  auth: authService,
  locations: locationsService,
  bookings: bookingsService,
};

export default api;

// Re-export from client
import { apiClient } from './client';
import { authService } from './auth.service';
import { locationsService } from './locations.service';
import { bookingsService } from './bookings.service';

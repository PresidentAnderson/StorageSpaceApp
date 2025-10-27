// Bookings service

import apiClient from './client';
import { API_ENDPOINTS } from '../constants';
import { Booking } from '../types';

interface CreateBookingData {
  locationId: string;
  startDate: string;
  endDate: string;
  numberOfBags: number;
  bagSizes?: string[];
  specialInstructions?: string;
  contactPhone?: string;
  paymentMethodId: string;
}

interface BookingsListParams {
  status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

interface BookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
}

interface ExtendBookingData {
  newEndDate: string;
}

interface CheckInData {
  qrCode?: string;
  nfcToken?: string;
  verificationCode?: string;
}

interface CheckOutData {
  rating?: number;
  review?: string;
  photos?: string[];
}

class BookingsService {
  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingData): Promise<Booking> {
    return await apiClient.post<Booking>(
      API_ENDPOINTS.BOOKINGS.CREATE,
      data,
      { requiresAuth: true }
    );
  }

  /**
   * Get user's bookings
   */
  async getBookings(params?: BookingsListParams): Promise<BookingsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `${API_ENDPOINTS.BOOKINGS.LIST}?${queryParams.toString()}`;
    return await apiClient.get<BookingsResponse>(endpoint, { requiresAuth: true });
  }

  /**
   * Get booking details by ID
   */
  async getBookingDetails(bookingId: string): Promise<Booking> {
    const endpoint = API_ENDPOINTS.BOOKINGS.DETAILS.replace(':id', bookingId);
    return await apiClient.get<Booking>(endpoint, { requiresAuth: true });
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    const endpoint = API_ENDPOINTS.BOOKINGS.CANCEL.replace(':id', bookingId);
    return await apiClient.post<Booking>(
      endpoint,
      { reason },
      { requiresAuth: true }
    );
  }

  /**
   * Extend booking duration
   */
  async extendBooking(
    bookingId: string,
    data: ExtendBookingData
  ): Promise<Booking> {
    const endpoint = API_ENDPOINTS.BOOKINGS.EXTEND.replace(':id', bookingId);
    return await apiClient.post<Booking>(endpoint, data, { requiresAuth: true });
  }

  /**
   * Check in to a booking
   */
  async checkIn(bookingId: string, data?: CheckInData): Promise<Booking> {
    const endpoint = API_ENDPOINTS.BOOKINGS.CHECKIN.replace(':id', bookingId);
    return await apiClient.post<Booking>(endpoint, data, { requiresAuth: true });
  }

  /**
   * Check out from a booking
   */
  async checkOut(bookingId: string, data?: CheckOutData): Promise<Booking> {
    const endpoint = API_ENDPOINTS.BOOKINGS.CHECKOUT.replace(':id', bookingId);
    return await apiClient.post<Booking>(endpoint, data, { requiresAuth: true });
  }

  /**
   * Get booking QR code
   */
  async getBookingQRCode(bookingId: string): Promise<{ qrCode: string }> {
    return await apiClient.get(`/bookings/${bookingId}/qr-code`, {
      requiresAuth: true,
    });
  }

  /**
   * Get booking receipt
   */
  async getBookingReceipt(bookingId: string): Promise<any> {
    return await apiClient.get(`/bookings/${bookingId}/receipt`, {
      requiresAuth: true,
    });
  }

  /**
   * Request support for a booking
   */
  async requestSupport(
    bookingId: string,
    message: string,
    photos?: string[]
  ): Promise<void> {
    await apiClient.post(
      `/bookings/${bookingId}/support`,
      { message, photos },
      { requiresAuth: true }
    );
  }

  /**
   * Rate and review a booking
   */
  async rateBooking(
    bookingId: string,
    rating: number,
    review?: string
  ): Promise<void> {
    await apiClient.post(
      `/bookings/${bookingId}/review`,
      { rating, review },
      { requiresAuth: true }
    );
  }

  /**
   * Get active booking (if any)
   */
  async getActiveBooking(): Promise<Booking | null> {
    try {
      const response = await apiClient.get<{ booking: Booking | null }>(
        '/bookings/active',
        { requiresAuth: true }
      );
      return response.booking;
    } catch {
      return null;
    }
  }
}

export const bookingsService = new BookingsService();
export default bookingsService;

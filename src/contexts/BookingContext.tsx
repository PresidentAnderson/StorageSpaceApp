import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { bookingsService } from '../api';
import { Booking } from '../types';

interface BookingContextType {
  bookings: Booking[];
  activeBooking: Booking | null;
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  setBookings: (bookings: Booking[]) => void;
  setSelectedBooking: (booking: Booking | null) => void;
  fetchBookings: (status?: string) => Promise<void>;
  fetchActiveBooking: () => Promise<void>;
  createBooking: (data: CreateBookingData) => Promise<Booking>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<void>;
  extendBooking: (bookingId: string, newEndDate: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
}

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

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (status?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await bookingsService.getBookings({ status });
      setBookings(response.bookings);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
      console.error('Fetch bookings error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchActiveBooking = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const booking = await bookingsService.getActiveBooking();
      setActiveBooking(booking);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch active booking');
      console.error('Fetch active booking error:', err);
      setActiveBooking(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBooking = useCallback(
    async (data: CreateBookingData): Promise<Booking> => {
      try {
        setIsLoading(true);
        setError(null);
        const booking = await bookingsService.createBooking(data);

        // Add new booking to the list
        setBookings((prev) => [booking, ...prev]);

        // If this is an active booking, set it as active
        if (booking.status === 'active') {
          setActiveBooking(booking);
        }

        return booking;
      } catch (err: any) {
        setError(err.message || 'Failed to create booking');
        console.error('Create booking error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const cancelBooking = useCallback(
    async (bookingId: string, reason?: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const updatedBooking = await bookingsService.cancelBooking(bookingId, reason);

        // Update the booking in the list
        setBookings((prev) =>
          prev.map((booking) => (booking.id === bookingId ? updatedBooking : booking))
        );

        // Clear active booking if it was cancelled
        if (activeBooking?.id === bookingId) {
          setActiveBooking(null);
        }

        // Clear selected booking if it was cancelled
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(null);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to cancel booking');
        console.error('Cancel booking error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [activeBooking, selectedBooking]
  );

  const extendBooking = useCallback(
    async (bookingId: string, newEndDate: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const updatedBooking = await bookingsService.extendBooking(bookingId, { newEndDate });

        // Update the booking in the list
        setBookings((prev) =>
          prev.map((booking) => (booking.id === bookingId ? updatedBooking : booking))
        );

        // Update active booking if it was extended
        if (activeBooking?.id === bookingId) {
          setActiveBooking(updatedBooking);
        }

        // Update selected booking if it was extended
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(updatedBooking);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to extend booking');
        console.error('Extend booking error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [activeBooking, selectedBooking]
  );

  const refreshBookings = useCallback(async () => {
    await Promise.all([fetchBookings(), fetchActiveBooking()]);
  }, [fetchBookings, fetchActiveBooking]);

  const value: BookingContextType = {
    bookings,
    activeBooking,
    selectedBooking,
    isLoading,
    error,
    setBookings,
    setSelectedBooking,
    fetchBookings,
    fetchActiveBooking,
    createBooking,
    cancelBooking,
    extendBooking,
    refreshBookings,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;

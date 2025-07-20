export interface StorageLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  hourlyRate: number;
  dailyRate: number;
  capacity: number;
  availableSpaces: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: string[];
  openHours: {
    open: string;
    close: string;
  };
  description: string;
  type: 'hotel' | 'shop' | 'cafe' | 'locker' | 'storage_facility';
  distance?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  userId: string;
  locationId: string;
  startTime: Date;
  endTime: Date;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  bagsCount: number;
  specialInstructions?: string;
  qrCode?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  Bookings: undefined;
  Profile: undefined;
  LocationDetails: { locationId: string };
  BookingFlow: { locationId: string };
  BookingConfirmation: { bookingId: string };
};
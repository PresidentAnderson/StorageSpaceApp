import { StorageLocation, Booking } from '../types';

export const mockStorageLocations: StorageLocation[] = [
  {
    id: '1',
    name: 'City Center Hotel',
    address: '123 Main St, Downtown',
    latitude: 37.7749,
    longitude: -122.4194,
    hourlyRate: 8,
    dailyRate: 50,
    capacity: 50,
    availableSpaces: 12,
    rating: 4.8,
    reviews: 245,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400'
    ],
    amenities: ['24/7 Access', 'CCTV Security', 'Climate Controlled', 'Reception Desk'],
    openHours: {
      open: '00:00',
      close: '23:59'
    },
    description: 'Secure storage at a luxury hotel in the heart of downtown. Perfect for tourists and business travelers.',
    type: 'hotel'
  },
  {
    id: '2',
    name: 'Corner Coffee Shop',
    address: '456 Oak Ave, Midtown',
    latitude: 37.7849,
    longitude: -122.4094,
    hourlyRate: 5,
    dailyRate: 30,
    capacity: 20,
    availableSpaces: 8,
    rating: 4.5,
    reviews: 128,
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400'
    ],
    amenities: ['WiFi', 'Cafe', 'Friendly Staff', 'Quick Access'],
    openHours: {
      open: '06:00',
      close: '20:00'
    },
    description: 'Convenient storage while you enjoy artisan coffee. Great for day trips and shopping.',
    type: 'cafe'
  },
  {
    id: '3',
    name: 'Metro Storage Lockers',
    address: '789 Transit Blvd, Station District',
    latitude: 37.7649,
    longitude: -122.4294,
    hourlyRate: 6,
    dailyRate: 35,
    capacity: 100,
    availableSpaces: 25,
    rating: 4.6,
    reviews: 189,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    amenities: ['Digital Locks', 'Multiple Sizes', 'Transit Access', 'Insurance Included'],
    openHours: {
      open: '05:00',
      close: '23:00'
    },
    description: 'Modern automated storage facility near public transportation. Various locker sizes available.',
    type: 'locker'
  },
  {
    id: '4',
    name: 'Boutique Store & Storage',
    address: '321 Fashion Way, Shopping District',
    latitude: 37.7549,
    longitude: -122.4394,
    hourlyRate: 7,
    dailyRate: 45,
    capacity: 30,
    availableSpaces: 5,
    rating: 4.7,
    reviews: 156,
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
    ],
    amenities: ['Shopping Discounts', 'Personal Service', 'Bag Wrapping', 'Boutique Access'],
    openHours: {
      open: '09:00',
      close: '21:00'
    },
    description: 'Store your bags while you shop! Includes exclusive discounts at partner boutiques.',
    type: 'shop'
  },
  {
    id: '5',
    name: 'SafeSpace Storage Facility',
    address: '654 Industrial Ave, Warehouse District',
    latitude: 37.7449,
    longitude: -122.4494,
    hourlyRate: 10,
    dailyRate: 60,
    capacity: 200,
    availableSpaces: 45,
    rating: 4.9,
    reviews: 320,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400'
    ],
    amenities: ['Premium Security', 'Climate Control', 'Large Items', '24/7 Access', 'Insurance'],
    openHours: {
      open: '00:00',
      close: '23:59'
    },
    description: 'Professional storage facility with enterprise-grade security. Perfect for valuable items and long-term storage.',
    type: 'storage_facility'
  },
  {
    id: '6',
    name: 'Riverside Cafe Storage',
    address: '888 River Walk, Waterfront',
    latitude: 37.7749,
    longitude: -122.3994,
    hourlyRate: 6,
    dailyRate: 40,
    capacity: 25,
    availableSpaces: 10,
    rating: 4.4,
    reviews: 98,
    images: [
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400'
    ],
    amenities: ['River View', 'Outdoor Seating', 'Pet Friendly', 'Fresh Pastries'],
    openHours: {
      open: '07:00',
      close: '19:00'
    },
    description: 'Scenic storage location by the river. Enjoy beautiful views while your bags stay safe.',
    type: 'cafe'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    locationId: '1',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T18:00:00'),
    totalCost: 64,
    status: 'active',
    bagsCount: 2,
    specialInstructions: 'Handle with care - contains fragile items',
    qrCode: 'QR123456789'
  },
  {
    id: 'booking-2',
    userId: 'user-1',
    locationId: '3',
    startTime: new Date('2024-01-20T09:00:00'),
    endTime: new Date('2024-01-20T15:00:00'),
    totalCost: 36,
    status: 'confirmed',
    bagsCount: 1,
    qrCode: 'QR987654321'
  },
  {
    id: 'booking-3',
    userId: 'user-1',
    locationId: '2',
    startTime: new Date('2024-01-10T14:00:00'),
    endTime: new Date('2024-01-10T20:00:00'),
    totalCost: 30,
    status: 'completed',
    bagsCount: 1,
    qrCode: 'QR456789123'
  }
];
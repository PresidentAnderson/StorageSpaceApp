// App-wide constants

export const APP_NAME = 'StorageSpace';
export const APP_VERSION = '1.0.0';

// Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#E5E5EA',
  darkGray: '#3A3A3C',

  // Location type colors
  hotel: '#FF6B6B',
  cafe: '#4ECDC4',
  shop: '#45B7D1',
  locker: '#96CEB4',
  storage: '#FFEAA7',
};

// Location types
export const LOCATION_TYPES = {
  HOTEL: 'hotel',
  CAFE: 'cafe',
  SHOP: 'shop',
  LOCKER: 'locker',
  STORAGE: 'storage',
} as const;

// Booking status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
  PAYPAL: 'paypal',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  LOCATIONS: {
    LIST: '/locations',
    SEARCH: '/locations/search',
    NEARBY: '/locations/nearby',
    DETAILS: '/locations/:id',
    AVAILABILITY: '/locations/:id/availability',
  },
  BOOKINGS: {
    CREATE: '/bookings',
    LIST: '/bookings',
    DETAILS: '/bookings/:id',
    CANCEL: '/bookings/:id/cancel',
    EXTEND: '/bookings/:id/extend',
    CHECKIN: '/bookings/:id/checkin',
    CHECKOUT: '/bookings/:id/checkout',
  },
  PAYMENTS: {
    CREATE_INTENT: '/payments/intent',
    CONFIRM: '/payments/confirm',
    METHODS: '/payments/methods',
    ADD_METHOD: '/payments/methods/add',
    DELETE_METHOD: '/payments/methods/:id',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile/update',
    FAVORITES: '/user/favorites',
    HISTORY: '/user/history',
  },
} as const;

// Booking durations
export const BOOKING_DURATIONS = [
  { label: '2 hours', value: 2, hours: 2 },
  { label: '4 hours', value: 4, hours: 4 },
  { label: '8 hours', value: 8, hours: 8 },
  { label: '1 day', value: 24, hours: 24 },
  { label: '2 days', value: 48, hours: 48 },
  { label: '3 days', value: 72, hours: 72 },
  { label: '1 week', value: 168, hours: 168 },
];

// Map settings
export const MAP_SETTINGS = {
  DEFAULT_ZOOM: 14,
  MIN_ZOOM: 10,
  MAX_ZOOM: 18,
  DEFAULT_RADIUS_KM: 5,
  MARKER_CLUSTER_RADIUS: 50,
};

// Validation rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_BOOKING_HOURS: 1,
  MAX_BOOKING_DAYS: 30,
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@storage_auth_token',
  REFRESH_TOKEN: '@storage_refresh_token',
  USER_DATA: '@storage_user_data',
  LANGUAGE: '@storage_language',
  THEME: '@storage_theme',
  RECENT_SEARCHES: '@storage_recent_searches',
  FAVORITES: '@storage_favorites',
  ONBOARDING_COMPLETE: '@storage_onboarding_complete',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY h:mm A',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  TIME_ONLY: 'h:mm A',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking created successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PAYMENT_SUCCESS: 'Payment processed successfully.',
  PASSWORD_RESET: 'Password reset successfully.',
};

// Feature flags (from .env)
export const FEATURES = {
  SOCIAL_LOGIN: true,
  APPLE_PAY: true,
  GOOGLE_PAY: true,
  SPLIT_PAYMENT: true,
  LOYALTY_PROGRAM: true,
  PUSH_NOTIFICATIONS: true,
  IN_APP_MESSAGING: true,
  QR_CODE_CHECKIN: true,
  NFC_CHECKIN: false,
  BIOMETRIC_AUTH: true,
  DARK_MODE: true,
  OFFLINE_MODE: false,
  AI_RECOMMENDATIONS: true,
};

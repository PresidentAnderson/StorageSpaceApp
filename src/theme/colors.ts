// Color theme definitions

export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryLight: '#4DA6FF',
  primaryDark: '#0055CC',

  // Secondary colors
  secondary: '#5856D6',
  secondaryLight: '#8A89E6',
  secondaryDark: '#3634A3',

  // Status colors
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#E5E5EA',
  darkGray: '#3A3A3C',

  // Background colors
  background: '#F2F2F7',
  backgroundDark: '#1C1C1E',
  backgroundLight: '#FFFFFF',

  // Text colors
  text: '#000000',
  textSecondary: '#8E8E93',
  textLight: '#FFFFFF',
  textDark: '#1C1C1E',

  // Border colors
  border: '#C6C6C8',
  borderLight: '#E5E5EA',
  borderDark: '#38383A',

  // Location type colors
  locationTypes: {
    hotel: '#FF6B6B',
    cafe: '#4ECDC4',
    shop: '#45B7D1',
    locker: '#96CEB4',
    storage: '#FFEAA7',
  },

  // Booking status colors
  bookingStatus: {
    pending: '#FF9500',
    confirmed: '#007AFF',
    active: '#34C759',
    completed: '#8E8E93',
    cancelled: '#FF3B30',
  },

  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',

  // Shadow colors
  shadow: '#000000',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.2)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',
};

export type ColorKeys = keyof typeof colors;

export default colors;

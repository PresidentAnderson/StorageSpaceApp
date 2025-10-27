// Utility functions for formatting data

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Format distance in km or miles
 */
export const formatDistance = (distanceKm: number, useMetric: boolean = true): string => {
  if (useMetric) {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  } else {
    const miles = distanceKm * 0.621371;
    if (miles < 0.1) {
      return `${Math.round(miles * 5280)}ft`;
    }
    return `${miles.toFixed(1)}mi`;
  }
};

/**
 * Format date to display format
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Format time only
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Format duration in hours to human-readable format
 */
export const formatDuration = (hours: number): string => {
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  if (remainingHours === 0) {
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
  return `${days} ${days === 1 ? 'day' : 'days'} ${remainingHours}h`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format booking status for display
 */
export const formatBookingStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format location type for display
 */
export const formatLocationType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

/**
 * Format rating (e.g., 4.5)
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Format capacity (e.g., "5 bags")
 */
export const formatCapacity = (capacity: number): string => {
  return `${capacity} ${capacity === 1 ? 'bag' : 'bags'}`;
};

// Calculation utility functions

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(2));
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate booking price
 */
export const calculateBookingPrice = (
  hourlyRate: number,
  hours: number,
  numberOfBags: number = 1,
  discount: number = 0
): number => {
  const basePrice = hourlyRate * hours * numberOfBags;
  const discountAmount = basePrice * (discount / 100);
  return parseFloat((basePrice - discountAmount).toFixed(2));
};

/**
 * Calculate service fee (typically 10-15% of booking price)
 */
export const calculateServiceFee = (
  bookingPrice: number,
  feePercentage: number = 12
): number => {
  return parseFloat((bookingPrice * (feePercentage / 100)).toFixed(2));
};

/**
 * Calculate insurance fee
 */
export const calculateInsuranceFee = (
  bookingPrice: number,
  insurancePercentage: number = 3
): number => {
  return parseFloat((bookingPrice * (insurancePercentage / 100)).toFixed(2));
};

/**
 * Calculate total booking cost
 */
export const calculateTotalCost = (
  bookingPrice: number,
  serviceFee: number,
  insuranceFee: number = 0
): number => {
  return parseFloat((bookingPrice + serviceFee + insuranceFee).toFixed(2));
};

/**
 * Calculate refund amount based on cancellation policy
 */
export const calculateRefund = (
  totalAmount: number,
  hoursUntilBooking: number,
  cancellationPolicy: 'flexible' | 'moderate' | 'strict' = 'moderate'
): number => {
  let refundPercentage = 0;

  switch (cancellationPolicy) {
    case 'flexible':
      if (hoursUntilBooking >= 24) refundPercentage = 100;
      else if (hoursUntilBooking >= 12) refundPercentage = 75;
      else if (hoursUntilBooking >= 6) refundPercentage = 50;
      break;

    case 'moderate':
      if (hoursUntilBooking >= 48) refundPercentage = 100;
      else if (hoursUntilBooking >= 24) refundPercentage = 50;
      break;

    case 'strict':
      if (hoursUntilBooking >= 72) refundPercentage = 100;
      else if (hoursUntilBooking >= 48) refundPercentage = 50;
      break;
  }

  return parseFloat((totalAmount * (refundPercentage / 100)).toFixed(2));
};

/**
 * Calculate loyalty points earned
 */
export const calculateLoyaltyPoints = (
  totalAmount: number,
  pointsPerDollar: number = 10
): number => {
  return Math.floor(totalAmount * pointsPerDollar);
};

/**
 * Calculate discount from loyalty points
 */
export const calculatePointsDiscount = (
  points: number,
  conversionRate: number = 0.01
): number => {
  return parseFloat((points * conversionRate).toFixed(2));
};

/**
 * Calculate average rating
 */
export const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return parseFloat((sum / ratings.length).toFixed(1));
};

/**
 * Calculate time difference in hours
 */
export const calculateHoursDifference = (
  startDate: Date,
  endDate: Date
): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60));
};

/**
 * Calculate estimated arrival time
 */
export const calculateETA = (distanceKm: number, speedKmh: number = 40): Date => {
  const hours = distanceKm / speedKmh;
  const eta = new Date();
  eta.setMinutes(eta.getMinutes() + hours * 60);
  return eta;
};

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Booking } from '../types';
import { theme } from '../theme';
import { formatDate, formatTime, formatPrice } from '../utils';
import Badge from './Badge';
import Card from './Card';
import Button from './Button';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
  showActions?: boolean;
  onCancel?: () => void;
  onExtend?: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onPress,
  showActions = true,
  onCancel,
  onExtend,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'active':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Card onPress={onPress} padding="md" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.bookingId}>#{booking.id.slice(0, 8)}</Text>
          <Badge
            label={getStatusLabel(booking.status)}
            variant={getStatusVariant(booking.status)}
            size="small"
          />
        </View>
        <Text style={styles.price}>{formatPrice(booking.totalPrice)}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.locationInfo}>
          {booking.location.image && (
            <Image
              source={{ uri: booking.location.image }}
              style={styles.locationImage}
            />
          )}
          <View style={styles.locationDetails}>
            <Text style={styles.locationName} numberOfLines={1}>
              {booking.location.name}
            </Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {booking.location.address}
            </Text>
          </View>
        </View>

        <View style={styles.dateInfo}>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Check-in:</Text>
            <Text style={styles.dateValue}>
              {formatDate(booking.startDate)} at {formatTime(booking.startDate)}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Check-out:</Text>
            <Text style={styles.dateValue}>
              {formatDate(booking.endDate)} at {formatTime(booking.endDate)}
            </Text>
          </View>
        </View>

        <View style={styles.bagInfo}>
          <Text style={styles.bagText}>
            🎒 {booking.numberOfBags} {booking.numberOfBags === 1 ? 'bag' : 'bags'}
          </Text>
        </View>
      </View>

      {showActions && booking.status !== 'completed' && booking.status !== 'cancelled' && (
        <View style={styles.actions}>
          {onExtend && booking.status === 'active' && (
            <Button
              title="Extend"
              variant="outline"
              size="small"
              onPress={onExtend}
              style={styles.actionButton}
            />
          )}
          {onCancel && (booking.status === 'pending' || booking.status === 'confirmed') && (
            <Button
              title="Cancel"
              variant="ghost"
              size="small"
              onPress={onCancel}
              style={styles.actionButton}
            />
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  bookingId: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray,
  },
  price: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  content: {
    gap: theme.spacing.md,
  },
  locationInfo: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  locationImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
  },
  locationDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  locationName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs / 2,
  },
  locationAddress: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray,
  },
  dateInfo: {
    gap: theme.spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray,
  },
  dateValue: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  bagInfo: {
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  bagText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});

export default BookingCard;

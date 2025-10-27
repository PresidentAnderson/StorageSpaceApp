import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StorageLocation } from '../types';
import { theme } from '../theme';
import { formatPrice, formatDistance, formatRating } from '../utils';
import Badge from './Badge';
import Card from './Card';

interface LocationCardProps {
  location: StorageLocation;
  onPress: () => void;
  showDistance?: boolean;
  userLocation?: { latitude: number; longitude: number };
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onPress,
  showDistance = true,
  userLocation,
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      hotel: theme.colors.locationTypes.hotel,
      cafe: theme.colors.locationTypes.cafe,
      shop: theme.colors.locationTypes.shop,
      locker: theme.colors.locationTypes.locker,
      storage: theme.colors.locationTypes.storage,
    };
    return colors[type as keyof typeof colors] || theme.colors.primary;
  };

  return (
    <Card onPress={onPress} padding="sm" style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: location.image || 'https://via.placeholder.com/300x200' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.typeBadge}>
          <Badge
            label={location.type.toUpperCase()}
            variant="primary"
            size="small"
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {location.name}
          </Text>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>⭐ {formatRating(location.rating)}</Text>
          </View>
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {location.address}
        </Text>

        <View style={styles.footer}>
          <View style={styles.leftFooter}>
            {showDistance && location.distance !== undefined && (
              <Text style={styles.distance}>
                📍 {formatDistance(location.distance)}
              </Text>
            )}
            <Text style={styles.capacity}>
              🎒 {location.capacity} bags
            </Text>
          </View>
          <Text style={styles.price}>
            {formatPrice(location.hourlyRate)}/hr
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  content: {
    padding: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  address: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.gray,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftFooter: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  distance: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray,
  },
  capacity: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.gray,
  },
  price: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
});

export default LocationCard;

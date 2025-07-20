import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

import { StorageLocation } from '../types';
import { mockStorageLocations } from '../data/mockData';

const { width } = Dimensions.get('window');

const LocationDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { locationId } = route.params as { locationId: string };
  const [location, setLocation] = useState<StorageLocation | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const foundLocation = mockStorageLocations.find(loc => loc.id === locationId);
    setLocation(foundLocation || null);
  }, [locationId]);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Location not found</Text>
      </SafeAreaView>
    );
  }

  const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'hotel': return 'business-outline';
      case 'cafe': return 'cafe-outline';
      case 'shop': return 'storefront-outline';
      case 'locker': return 'cube-outline';
      case 'storage_facility': return 'archive-outline';
      default: return 'location-outline';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'hotel': return '#007AFF';
      case 'cafe': return '#FF6B6B';
      case 'shop': return '#4CAF50';
      case 'locker': return '#FF9800';
      case 'storage_facility': return '#9C27B0';
      default: return '#666';
    }
  };

  const formatType = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const renderImageGallery = () => (
    <View style={styles.imageContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentImageIndex(index);
        }}
      >
        {location.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.imageIndicators}>
        {location.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentImageIndex && styles.activeIndicator
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderAmenity = (amenity: string, index: number) => (
    <View key={index} style={styles.amenityItem}>
      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
      <Text style={styles.amenityText}>{amenity}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderImageGallery()}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{location.name}</Text>
              <View style={styles.typeContainer}>
                <Ionicons 
                  name={getTypeIcon(location.type)} 
                  size={16} 
                  color={getTypeColor(location.type)} 
                />
                <Text style={[styles.typeText, { color: getTypeColor(location.type) }]}>
                  {formatType(location.type)}
                </Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>{location.rating}</Text>
              <Text style={styles.reviews}>({location.reviews})</Text>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.address}>{location.address}</Text>
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Hourly Rate</Text>
              <Text style={styles.price}>${location.hourlyRate}</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Daily Rate</Text>
              <Text style={styles.price}>${location.dailyRate}</Text>
            </View>
          </View>

          <View style={styles.availabilityContainer}>
            <View style={styles.availabilityItem}>
              <Ionicons name="time-outline" size={20} color="#007AFF" />
              <Text style={styles.availabilityText}>
                Open {location.openHours.open} - {location.openHours.close}
              </Text>
            </View>
            <View style={styles.availabilityItem}>
              <Ionicons 
                name={location.availableSpaces > 0 ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={location.availableSpaces > 0 ? "#4CAF50" : "#FF6B6B"} 
              />
              <Text style={styles.availabilityText}>
                {location.availableSpaces} of {location.capacity} spaces available
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{location.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {location.amenities.map(renderAmenity)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety & Security</Text>
            <View style={styles.safetyContainer}>
              <View style={styles.safetyItem}>
                <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
                <Text style={styles.safetyText}>Verified Location</Text>
              </View>
              <View style={styles.safetyItem}>
                <Ionicons name="lock-closed" size={20} color="#4CAF50" />
                <Text style={styles.safetyText}>Secure Storage</Text>
              </View>
              <View style={styles.safetyItem}>
                <Ionicons name="eye" size={20} color="#4CAF50" />
                <Text style={styles.safetyText}>Monitored 24/7</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Alert.alert('Contact', 'Contact functionality coming soon!')}
          >
            <Ionicons name="call-outline" size={20} color="#007AFF" />
            <Text style={styles.contactButtonText}>Contact Location</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.priceInfo}>
          <Text style={styles.bottomPriceLabel}>Starting from</Text>
          <Text style={styles.bottomPrice}>${location.hourlyRate}/hour</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            location.availableSpaces === 0 && styles.bookButtonDisabled
          ]}
          onPress={() => {
            if (location.availableSpaces > 0) {
              navigation.navigate('BookingFlow' as never, { locationId: location.id } as never);
            } else {
              Alert.alert('Sorry', 'No spaces available at this location.');
            }
          }}
          disabled={location.availableSpaces === 0}
        >
          <LinearGradient
            colors={location.availableSpaces > 0 ? ['#007AFF', '#0056CC'] : ['#CCC', '#999']}
            style={styles.bookButtonGradient}
          >
            <Text style={styles.bookButtonText}>
              {location.availableSpaces > 0 ? 'Book Now' : 'Fully Booked'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  titleContainer: {
    flex: 1,
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  availabilityContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  availabilityText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  amenityText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  safetyContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  safetyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  safetyText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 10,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  priceInfo: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 14,
    color: '#666',
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  bookButton: {
    flex: 1,
    marginLeft: 15,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonGradient: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LocationDetailsScreen;
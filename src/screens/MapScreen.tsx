import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { StorageLocation } from '../types';
import { mockStorageLocations } from '../data/mockData';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);
  const [locations, setLocations] = useState<StorageLocation[]>(mockStorageLocations);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed to show your position on the map.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(userCoords);
      setRegion({
        ...userCoords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Calculate distances and sort by proximity
      const locationsWithDistance = mockStorageLocations.map(loc => ({
        ...loc,
        distance: calculateDistance(
          userCoords.latitude,
          userCoords.longitude,
          loc.latitude,
          loc.longitude
        ),
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setLocations(locationsWithDistance);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  };

  const getMarkerColor = (type: string): string => {
    switch (type) {
      case 'hotel': return '#007AFF';
      case 'cafe': return '#FF6B6B';
      case 'shop': return '#4CAF50';
      case 'locker': return '#FF9800';
      case 'storage_facility': return '#9C27B0';
      default: return '#666';
    }
  };

  const renderSelectedLocation = () => {
    if (!selectedLocation) return null;

    return (
      <View style={styles.selectedLocationCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{selectedLocation.name}</Text>
            <Text style={styles.cardAddress}>{selectedLocation.address}</Text>
            <View style={styles.cardMeta}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{selectedLocation.rating}</Text>
              </View>
              <Text style={styles.price}>${selectedLocation.hourlyRate}/hr</Text>
              {selectedLocation.distance && (
                <Text style={styles.distance}>{selectedLocation.distance.toFixed(1)} km</Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedLocation(null)}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => {
              navigation.navigate('LocationDetails' as never, { locationId: selectedLocation.id } as never);
              setSelectedLocation(null);
            }}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              navigation.navigate('BookingFlow' as never, { locationId: selectedLocation.id } as never);
              setSelectedLocation(null);
            }}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Storage Locations</Text>
        <TouchableOpacity style={styles.centerButton} onPress={centerOnUser}>
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onPress={() => setSelectedLocation(location)}
            pinColor={getMarkerColor(location.type)}
          >
            <View style={[styles.markerContainer, { backgroundColor: getMarkerColor(location.type) }]}>
              <Text style={styles.markerText}>${location.hourlyRate}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {renderSelectedLocation()}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
          <Text style={styles.legendText}>Hotels</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
          <Text style={styles.legendText}>Cafes</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Shops</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Lockers</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  centerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedLocationCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 15,
  },
  distance: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: '#F0F7FF',
    borderRadius: 10,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  legend: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
});

export default MapScreen;
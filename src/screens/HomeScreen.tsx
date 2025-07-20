import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import { StorageLocation } from '../types';
import { mockStorageLocations } from '../data/mockData';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [currentLocation, setCurrentLocation] = useState<string>('Getting location...');
  const [nearbyLocations, setNearbyLocations] = useState<StorageLocation[]>([]);

  useEffect(() => {
    getCurrentLocation();
    setNearbyLocations(mockStorageLocations.slice(0, 5));
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentLocation('Location access denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        const { city, region } = address[0];
        setCurrentLocation(`${city}, ${region}`);
      }
    } catch (error) {
      setCurrentLocation('Unable to get location');
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      navigation.navigate('Map' as never);
    }
  };

  const renderLocationCard = (location: StorageLocation) => (
    <TouchableOpacity
      key={location.id}
      style={styles.locationCard}
      onPress={() => navigation.navigate('LocationDetails' as never, { locationId: location.id } as never)}
    >
      <Image source={{ uri: location.images[0] }} style={styles.locationImage} />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationAddress}>{location.address}</Text>
        <View style={styles.locationMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{location.rating}</Text>
            <Text style={styles.reviews}>({location.reviews})</Text>
          </View>
          <Text style={styles.price}>${location.hourlyRate}/hr</Text>
        </View>
        <View style={styles.availabilityContainer}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.availability}>{location.availableSpaces} spaces available</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#007AFF', '#0056CC']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="white" />
            <Text style={styles.locationText}>{currentLocation}</Text>
          </View>
          <Text style={styles.welcomeText}>Find secure storage near you</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by location or area"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => Alert.alert('Filters', 'Filter functionality coming soon!')}>
            <Ionicons name="options-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Map' as never)}>
            <LinearGradient colors={['#FF6B6B', '#FF5252']} style={styles.actionGradient}>
              <Ionicons name="map-outline" size={24} color="white" />
              <Text style={styles.actionText}>Find Nearby</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Bookings' as never)}>
            <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.actionGradient}>
              <Ionicons name="calendar-outline" size={24} color="white" />
              <Text style={styles.actionText}>My Bookings</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Near You</Text>
          {nearbyLocations.map(renderLocationCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Find storage locations near you</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Book and pay securely</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Drop off your bags</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerContent: {
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: '500',
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  actionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  locationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  locationInfo: {
    padding: 15,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  locationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availability: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 4,
  },
  stepsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
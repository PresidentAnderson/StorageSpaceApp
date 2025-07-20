import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { Booking, StorageLocation } from '../types';
import { mockBookings, mockStorageLocations } from '../data/mockData';

const BookingsScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'active' | 'upcoming' | 'completed'>('active');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    // In real app, fetch from API
    setBookings(mockBookings);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    loadBookings();
    setRefreshing(false);
  };

  const getLocationById = (locationId: string): StorageLocation | undefined => {
    return mockStorageLocations.find(loc => loc.id === locationId);
  };

  const getFilteredBookings = (): Booking[] => {
    const now = new Date();
    
    switch (selectedTab) {
      case 'active':
        return bookings.filter(booking => 
          booking.status === 'active' || 
          (booking.status === 'confirmed' && new Date(booking.startTime) <= now && new Date(booking.endTime) > now)
        );
      case 'upcoming':
        return bookings.filter(booking => 
          booking.status === 'confirmed' && new Date(booking.startTime) > now
        );
      case 'completed':
        return bookings.filter(booking => 
          booking.status === 'completed' || booking.status === 'cancelled'
        );
      default:
        return bookings;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'confirmed': return '#007AFF';
      case 'completed': return '#666';
      case 'cancelled': return '#FF6B6B';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'active': return 'checkmark-circle';
      case 'confirmed': return 'time';
      case 'completed': return 'checkmark-done';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBookingAction = (booking: Booking, action: string) => {
    switch (action) {
      case 'view_qr':
        Alert.alert('QR Code', `QR Code: ${booking.qrCode}`);
        break;
      case 'extend':
        Alert.alert('Extend Booking', 'Extend booking functionality coming soon!');
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Booking',
          'Are you sure you want to cancel this booking?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', style: 'destructive', onPress: () => {
              // In real app, call API to cancel
              Alert.alert('Cancelled', 'Your booking has been cancelled.');
            }}
          ]
        );
        break;
      case 'rebook':
        const location = getLocationById(booking.locationId);
        if (location) {
          navigation.navigate('BookingFlow' as never, { locationId: location.id } as never);
        }
        break;
    }
  };

  const renderBookingCard = (booking: Booking) => {
    const location = getLocationById(booking.locationId);
    if (!location) return null;

    const isActive = booking.status === 'active';
    const isUpcoming = booking.status === 'confirmed' && new Date(booking.startTime) > new Date();
    const isCompleted = booking.status === 'completed' || booking.status === 'cancelled';

    return (
      <TouchableOpacity
        key={booking.id}
        style={styles.bookingCard}
        onPress={() => navigation.navigate('LocationDetails' as never, { locationId: location.id } as never)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationAddress}>{location.address}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
            <Ionicons 
              name={getStatusIcon(booking.status)} 
              size={14} 
              color="white" 
            />
            <Text style={styles.statusText}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {formatDate(booking.startTime)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="bag-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {booking.bagsCount} bag{booking.bagsCount > 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                ${booking.totalCost.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {booking.specialInstructions && (
          <View style={styles.instructionsContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#007AFF" />
            <Text style={styles.instructionsText}>{booking.specialInstructions}</Text>
          </View>
        )}

        <View style={styles.cardActions}>
          {isActive && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleBookingAction(booking, 'view_qr')}
              >
                <Ionicons name="qr-code-outline" size={18} color="#007AFF" />
                <Text style={styles.actionButtonText}>QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleBookingAction(booking, 'extend')}
              >
                <Ionicons name="time-outline" size={18} color="#4CAF50" />
                <Text style={[styles.actionButtonText, { color: '#4CAF50' }]}>Extend</Text>
              </TouchableOpacity>
            </>
          )}
          
          {isUpcoming && (
            <>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleBookingAction(booking, 'view_qr')}
              >
                <Ionicons name="qr-code-outline" size={18} color="#007AFF" />
                <Text style={styles.actionButtonText}>QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleBookingAction(booking, 'cancel')}
              >
                <Ionicons name="close-outline" size={18} color="#FF6B6B" />
                <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          
          {isCompleted && booking.status !== 'cancelled' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleBookingAction(booking, 'rebook')}
            >
              <Ionicons name="repeat-outline" size={18} color="#007AFF" />
              <Text style={styles.actionButtonText}>Book Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>No {selectedTab} bookings</Text>
      <Text style={styles.emptyDescription}>
        {selectedTab === 'active' && "You don't have any active storage bookings."}
        {selectedTab === 'upcoming' && "You don't have any upcoming bookings."}
        {selectedTab === 'completed' && "You don't have any completed bookings yet."}
      </Text>
      <TouchableOpacity
        style={styles.findStorageButton}
        onPress={() => navigation.navigate('Map' as never)}
      >
        <LinearGradient colors={['#007AFF', '#0056CC']} style={styles.findStorageGradient}>
          <Text style={styles.findStorageText}>Find Storage</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const filteredBookings = getFilteredBookings();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <View style={styles.tabContainer}>
        {[
          { key: 'active', label: 'Active' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'completed', label: 'History' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedTab === tab.key && styles.activeTab
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBookings.length > 0 ? (
          filteredBookings.map(renderBookingCard)
        ) : (
          renderEmptyState()
        )}
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
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  locationInfo: {
    flex: 1,
    marginRight: 15,
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
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  bookingDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginLeft: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  findStorageButton: {
    marginTop: 20,
  },
  findStorageGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  findStorageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingsScreen;
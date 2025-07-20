import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const BookingConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId } = route.params as { bookingId: string };

  useEffect(() => {
    // In a real app, you might want to fetch the booking details here
  }, [bookingId]);

  const mockBooking = {
    id: bookingId,
    qrCode: `QR${Date.now()}`,
    location: 'City Center Hotel',
    address: '123 Main St, Downtown',
    date: 'Today, Jan 15',
    time: '10:00 AM - 6:00 PM',
    bags: 2,
    total: 64.00,
    confirmationNumber: 'SSA' + Date.now().toString().slice(-6),
  };

  const handleViewQR = () => {
    Alert.alert(
      'QR Code',
      `Show this QR code at the storage location:\n\n${mockBooking.qrCode}`,
      [{ text: 'OK' }]
    );
  };

  const handleDirections = () => {
    Alert.alert('Directions', 'Opening directions to storage location...');
  };

  const handleContact = () => {
    Alert.alert('Contact', 'Contacting storage location...');
  };

  const handleDone = () => {
    navigation.navigate('Bookings' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.successIcon}
          >
            <Ionicons name="checkmark" size={40} color="white" />
          </LinearGradient>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successMessage}>
            Your storage space has been reserved successfully
          </Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.confirmationHeader}>
            <Text style={styles.confirmationNumber}>
              Confirmation #{mockBooking.confirmationNumber}
            </Text>
            <TouchableOpacity
              style={styles.qrButton}
              onPress={handleViewQR}
            >
              <Ionicons name="qr-code-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="location-outline" size={20} color="#007AFF" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>{mockBooking.location}</Text>
                <Text style={styles.detailSubtitle}>{mockBooking.address}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>{mockBooking.date}</Text>
                <Text style={styles.detailSubtitle}>{mockBooking.time}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="bag-outline" size={20} color="#007AFF" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>{mockBooking.bags} Bags</Text>
                <Text style={styles.detailSubtitle}>Total storage items</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="cash-outline" size={20} color="#007AFF" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailTitle}>${mockBooking.total.toFixed(2)}</Text>
                <Text style={styles.detailSubtitle}>Total amount paid</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.instructionsTitle}>Next Steps</Text>
          </View>
          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>
                Arrive at the storage location at your scheduled time
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>
                Show your QR code to the staff or scan at the kiosk
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>
                Drop off your bags and enjoy your day hands-free!
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDirections}
          >
            <Ionicons name="navigate-outline" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleContact}
          >
            <Ionicons name="call-outline" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewQR}
          >
            <Ionicons name="qr-code-outline" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>QR Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
        >
          <LinearGradient
            colors={['#007AFF', '#0056CC']}
            style={styles.doneButtonGradient}
          >
            <Text style={styles.doneButtonText}>Done</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  confirmationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  confirmationNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  qrButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 20,
  },
  detailsSection: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  detailSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  instructionsCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  instructionsList: {
    marginLeft: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 100,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 80,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
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
  doneButton: {
    width: '100%',
  },
  doneButtonGradient: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingConfirmationScreen;
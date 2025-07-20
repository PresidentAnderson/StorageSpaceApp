import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { StorageLocation, Booking } from '../types';
import { mockStorageLocations } from '../data/mockData';

const BookingFlowScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { locationId } = route.params as { locationId: string };
  
  const [location, setLocation] = useState<StorageLocation | null>(null);
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 8 * 60 * 60 * 1000)); // 8 hours later
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [bagsCount, setBagsCount] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string>('card');

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

  const calculateDuration = (): number => {
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)); // hours
  };

  const calculateTotal = (): number => {
    const duration = calculateDuration();
    const hourlyRate = location.hourlyRate;
    const subtotal = duration * hourlyRate * bagsCount;
    const serviceFee = subtotal * 0.1; // 10% service fee
    return subtotal + serviceFee;
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined, type: 'start' | 'end') => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
      setShowEndPicker(false);
    }

    if (selectedDate) {
      if (type === 'start') {
        setStartDate(selectedDate);
        // Ensure end date is after start date
        if (selectedDate >= endDate) {
          setEndDate(new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000)); // 2 hours later
        }
      } else {
        // Ensure end date is after start date
        if (selectedDate <= startDate) {
          Alert.alert('Invalid Time', 'End time must be after start time');
          return;
        }
        setEndDate(selectedDate);
      }
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((stepNum) => (
        <View key={stepNum} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            step >= stepNum && styles.stepCircleActive
          ]}>
            <Text style={[
              styles.stepText,
              step >= stepNum && styles.stepTextActive
            ]}>
              {stepNum}
            </Text>
          </View>
          {stepNum < 3 && (
            <View style={[
              styles.stepLine,
              step > stepNum && styles.stepLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Date & Time</Text>
      
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeItem}>
          <Text style={styles.dateLabel}>Drop-off Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Ionicons name="time-outline" size={20} color="#007AFF" />
            <Text style={styles.dateText}>
              {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateTimeItem}>
          <Text style={styles.dateLabel}>Pick-up Time</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Ionicons name="time-outline" size={20} color="#007AFF" />
            <Text style={styles.dateText}>
              {endDate.toLocaleDateString()} {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bagsContainer}>
        <Text style={styles.bagsLabel}>Number of Bags</Text>
        <View style={styles.bagsSelector}>
          <TouchableOpacity
            style={styles.bagsButton}
            onPress={() => setBagsCount(Math.max(1, bagsCount - 1))}
          >
            <Ionicons name="remove" size={20} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.bagsCount}>{bagsCount}</Text>
          <TouchableOpacity
            style={styles.bagsButton}
            onPress={() => setBagsCount(Math.min(10, bagsCount + 1))}
          >
            <Ionicons name="add" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.durationContainer}>
        <Text style={styles.durationLabel}>Duration: {calculateDuration()} hours</Text>
        <Text style={styles.durationRate}>Rate: ${location.hourlyRate}/hour per bag</Text>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="datetime"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, 'start')}
          minimumDate={new Date()}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="datetime"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, 'end')}
          minimumDate={new Date(startDate.getTime() + 60 * 60 * 1000)} // 1 hour after start
        />
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Additional Details</Text>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsLabel}>Special Instructions (Optional)</Text>
        <TextInput
          style={styles.instructionsInput}
          placeholder="Any special handling instructions for your bags..."
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          multiline
          maxLength={200}
        />
        <Text style={styles.characterCount}>{specialInstructions.length}/200</Text>
      </View>

      <View style={styles.reminderContainer}>
        <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
        <View style={styles.reminderText}>
          <Text style={styles.reminderTitle}>Storage Guidelines</Text>
          <Text style={styles.reminderDescription}>
            • No valuables, electronics, or fragile items
            • Maximum weight: 20kg per bag
            • No food, liquids, or prohibited items
            • Bags must be properly closed and labeled
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Payment & Confirmation</Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Location</Text>
          <Text style={styles.summaryValue}>{location.name}</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Duration</Text>
          <Text style={styles.summaryValue}>{calculateDuration()} hours</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Bags</Text>
          <Text style={styles.summaryValue}>{bagsCount}</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Storage Fee</Text>
          <Text style={styles.summaryValue}>${(calculateDuration() * location.hourlyRate * bagsCount).toFixed(2)}</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Service Fee</Text>
          <Text style={styles.summaryValue}>${(calculateDuration() * location.hourlyRate * bagsCount * 0.1).toFixed(2)}</Text>
        </View>
        
        <View style={[styles.summaryItem, styles.totalItem]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.paymentContainer}>
        <Text style={styles.paymentTitle}>Payment Method</Text>
        
        {[
          { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
          { id: 'apple_pay', name: 'Apple Pay', icon: 'logo-apple' },
          { id: 'google_pay', name: 'Google Pay', icon: 'logo-google' },
        ].map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedPayment === method.id && styles.paymentMethodSelected
            ]}
            onPress={() => setSelectedPayment(method.id)}
          >
            <Ionicons name={method.icon as any} size={24} color="#333" />
            <Text style={styles.paymentMethodText}>{method.name}</Text>
            <Ionicons
              name={selectedPayment === method.id ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color="#007AFF"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Process booking
      const booking: Booking = {
        id: `booking-${Date.now()}`,
        userId: 'user-1', // In real app, get from auth
        locationId: location.id,
        startTime: startDate,
        endTime: endDate,
        totalCost: calculateTotal(),
        status: 'confirmed',
        bagsCount,
        specialInstructions: specialInstructions || undefined,
        qrCode: `QR${Date.now()}`
      };
      
      Alert.alert(
        'Booking Confirmed!',
        'Your storage space has been reserved. You will receive a confirmation email shortly.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('BookingConfirmation' as never, { bookingId: booking.id } as never)
          }
        ]
      );
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'When do you need storage?';
      case 2: return 'Any special requirements?';
      case 3: return 'Ready to book?';
      default: return 'Book Storage';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getStepTitle()}</Text>
        <View style={styles.placeholder} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.priceInfo}>
          <Text style={styles.bottomPriceLabel}>Total</Text>
          <Text style={styles.bottomPrice}>${calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <LinearGradient colors={['#007AFF', '#0056CC']} style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>
              {step < 3 ? 'Continue' : 'Confirm Booking'}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#007AFF',
  },
  stepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  stepTextActive: {
    color: 'white',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 10,
  },
  stepLineActive: {
    backgroundColor: '#007AFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  dateTimeContainer: {
    marginBottom: 30,
  },
  dateTimeItem: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  bagsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bagsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  bagsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagsCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 30,
  },
  durationContainer: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  durationRate: {
    fontSize: 14,
    color: '#666',
  },
  instructionsContainer: {
    marginBottom: 30,
  },
  instructionsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  instructionsInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  reminderContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 15,
  },
  reminderText: {
    marginLeft: 15,
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 5,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 15,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  paymentContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  paymentMethodSelected: {
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
    flex: 1,
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
  nextButton: {
    flex: 1,
    marginLeft: 15,
  },
  nextButtonGradient: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingFlowScreen;
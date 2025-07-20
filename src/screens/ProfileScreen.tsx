import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    memberSince: 'January 2024',
    totalBookings: 12,
    savedLocations: 3,
  };

  const handleMenuPress = (action: string) => {
    switch (action) {
      case 'edit_profile':
        Alert.alert('Edit Profile', 'Profile editing functionality coming soon!');
        break;
      case 'payment_methods':
        Alert.alert('Payment Methods', 'Payment methods management coming soon!');
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Notification settings coming soon!');
        break;
      case 'support':
        Alert.alert('Support', 'Contact support functionality coming soon!');
        break;
      case 'terms':
        Alert.alert('Terms & Conditions', 'Terms and conditions will be displayed here.');
        break;
      case 'privacy':
        Alert.alert('Privacy Policy', 'Privacy policy will be displayed here.');
        break;
      case 'about':
        Alert.alert('About', 'StorageSpace App v1.0.0\nSecure luggage storage made easy.');
        break;
      case 'logout':
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => {
              Alert.alert('Signed Out', 'You have been signed out successfully.');
            }}
          ]
        );
        break;
    }
  };

  const renderProfileHeader = () => (
    <LinearGradient colors={['#007AFF', '#0056CC']} style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleMenuPress('edit_profile')}
        >
          <Ionicons name="pencil" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
    </LinearGradient>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{user.totalBookings}</Text>
        <Text style={styles.statLabel}>Total Bookings</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{user.savedLocations}</Text>
        <Text style={styles.statLabel}>Saved Locations</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>4.9</Text>
        <Text style={styles.statLabel}>Rating</Text>
      </View>
    </View>
  );

  const renderMenuItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle?: string,
    action?: string,
    showArrow: boolean = true,
    rightComponent?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => action && handleMenuPress(action)}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={20} color="#007AFF" />
        </View>
        <View style={styles.menuText}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {rightComponent}
        {showArrow && <Ionicons name="chevron-forward" size={20} color="#CCC" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        
        <View style={styles.body}>
          {renderStatsCard()}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.menuContainer}>
              {renderMenuItem('person-outline', 'Personal Information', 'Update your details', 'edit_profile')}
              {renderMenuItem('card-outline', 'Payment Methods', 'Manage cards and payments', 'payment_methods')}
              {renderMenuItem('location-outline', 'Saved Locations', 'Your favorite storage spots')}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.menuContainer}>
              {renderMenuItem(
                'notifications-outline',
                'Push Notifications',
                'Get updates about your bookings',
                '',
                false,
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#CCC', true: '#007AFF' }}
                  thumbColor={notificationsEnabled ? 'white' : '#f4f3f4'}
                />
              )}
              {renderMenuItem(
                'location-outline',
                'Location Services',
                'Find storage spots near you',
                '',
                false,
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: '#CCC', true: '#007AFF' }}
                  thumbColor={locationEnabled ? 'white' : '#f4f3f4'}
                />
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.menuContainer}>
              {renderMenuItem('help-circle-outline', 'Help Center', 'FAQs and support', 'support')}
              {renderMenuItem('chatbubble-outline', 'Contact Us', 'Get in touch with our team', 'support')}
              {renderMenuItem('star-outline', 'Rate the App', 'Help us improve')}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <View style={styles.menuContainer}>
              {renderMenuItem('document-text-outline', 'Terms & Conditions', '', 'terms')}
              {renderMenuItem('shield-outline', 'Privacy Policy', '', 'privacy')}
              {renderMenuItem('information-circle-outline', 'About', 'App version and info', 'about')}
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => handleMenuPress('logout')}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>StorageSpace App v1.0.0</Text>
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
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  body: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 15,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});

export default ProfileScreen;
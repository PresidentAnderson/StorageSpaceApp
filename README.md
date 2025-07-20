# StorageSpace - Luggage Storage App

A modern React Native application for finding and booking secure luggage storage locations. Built with Expo and TypeScript.

## Features

### 🗺️ Location Discovery
- Interactive map with storage locations
- Real-time availability
- Distance-based sorting
- Multiple location types (hotels, cafes, shops, lockers, storage facilities)

### 📱 Smart Booking System
- Multi-step booking flow
- Date/time selection with validation
- Bag count selection
- Special instructions
- Real-time pricing calculation

### 💳 Payment Integration (Ready)
- Multiple payment methods support
- Secure payment processing setup
- Service fee calculation

### 📋 Booking Management
- Active, upcoming, and completed bookings
- QR codes for easy access
- Booking extensions and cancellations
- Rebooking functionality

### 👤 User Profile
- Personal information management
- Booking history and statistics
- Notification preferences
- Support and help center

## Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: React Navigation v6
- **Maps**: React Native Maps (Google Maps)
- **UI Components**: Custom design with Expo Vector Icons
- **Location Services**: Expo Location
- **Animations**: Expo Linear Gradient
- **TypeScript**: Full type safety
- **State Management**: React Hooks (ready for Redux/Context)

## Project Structure

```
src/
├── navigation/          # Navigation configuration
├── screens/            # App screens
├── types/              # TypeScript type definitions
├── data/               # Mock data and utilities
└── components/         # Reusable components (to be added)
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd StorageSpaceApp
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on your preferred platform
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Key Features Implementation

### Map Integration
- Google Maps with custom markers
- Color-coded location types
- Distance calculation from user location
- Interactive location selection

### Booking Flow
- Three-step wizard interface
- Date/time validation
- Dynamic pricing calculation
- Payment method selection
- Confirmation with QR code

### User Experience
- Modern, clean UI design
- Consistent color scheme (#007AFF primary)
- Responsive layouts
- Loading states and error handling
- Pull-to-refresh functionality

## API Integration (Ready)

The app is structured to easily integrate with backend APIs:

- RESTful API calls for locations
- User authentication
- Booking management
- Payment processing
- Real-time updates

## Future Enhancements

### Planned Features
- Push notifications
- In-app messaging
- Rating and review system
- Loyalty program
- Multi-language support
- Dark mode theme

### Technical Improvements
- Redux for state management
- API integration
- Offline capability
- Performance optimization
- Automated testing

## Screenshots

*Coming soon - The app includes multiple beautifully designed screens including home, map, booking flow, and profile management.*

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@storagespace.app or create an issue in the repository.

---

**StorageSpace** - Making travel easier, one bag at a time! 🎒✨
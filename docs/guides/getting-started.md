# Getting Started with StorageSpace

This guide will help you set up your development environment and get the StorageSpace app running locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Expo CLI** - Install globally: `npm install -g expo-cli`
- **Watchman** (macOS only) - [Install guide](https://facebook.github.io/watchman/)

### Platform-Specific Requirements

#### iOS Development
- **macOS** (required for iOS development)
- **Xcode** (latest version) - [Download from App Store](https://apps.apple.com/app/xcode/id497799835)
- **CocoaPods** - Install: `sudo gem install cocoapods`
- **iOS Simulator** - Comes with Xcode

#### Android Development
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Android SDK** (API Level 29 or higher)
- **Android Emulator** or physical device

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/PresidentAnderson/storagespace.git
cd storagespace
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including React Native, Expo, and other packages.

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
API_URL=http://localhost:3000/v1
API_KEY=your_development_api_key

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Expo
EXPO_PUBLIC_API_URL=http://localhost:3000/v1

# Development Settings
DEV_MODE=true
ENABLE_LOGS=true
```

## Running the Application

### Start the Development Server

```bash
npm start
```

This opens the Expo DevTools in your browser.

### Run on Specific Platforms

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

### Using Expo Go App

1. Install **Expo Go** on your mobile device:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in the terminal or Expo DevTools

## Development Workflow

### 1. Code Structure

```
src/
├── screens/          # App screens
├── components/       # Reusable components
├── navigation/       # Navigation configuration
├── services/         # API services
├── utils/           # Helper functions
├── hooks/           # Custom React hooks
├── context/         # React Context providers
├── types/           # TypeScript definitions
└── constants/       # App constants
```

### 2. Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [coding standards](../contributing/code-standards.md)

3. Test your changes:
   ```bash
   npm test
   npm run lint
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### 3. Hot Reloading

The app supports hot reloading. Save your changes and they'll automatically reflect in the app.

To manually reload:
- **iOS Simulator**: Cmd + R
- **Android Emulator**: Double tap R
- **Expo Go**: Shake device and select "Reload"

## Common Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web

# Run tests
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run typecheck

# Build for production
npm run build

# Clean and reinstall
npm run clean
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear Metro cache
npx react-native start --reset-cache

# Clear all caches
npm run clean
```

### iOS Build Failures

```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Android Build Issues

1. Clean Android build:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

2. Reset Android emulator:
   - Open Android Studio
   - AVD Manager → Wipe Data

### Expo Issues

```bash
# Clear Expo cache
expo start -c

# Update Expo CLI
npm install -g expo-cli@latest
```

## Next Steps

1. Read the [Development Workflow](./development-workflow.md) guide
2. Explore the [Architecture Overview](../architecture/overview.md)
3. Check out [Testing Guide](./testing.md)
4. Review [API Documentation](../api/rest-api.md)

## Getting Help

- **Documentation**: Check our comprehensive [docs](../)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/PresidentAnderson/storagespace/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/PresidentAnderson/storagespace/discussions)
- **Discord**: Join our community (coming soon)

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
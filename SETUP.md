# StorageSpace - Complete Setup Guide 🚀

This guide will walk you through setting up the StorageSpace app from scratch to running it on your device.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js**: Version 16.0 or higher - [Download](https://nodejs.org/)
- **npm**: Comes with Node.js (version 7.0+)
- **Git**: Version control - [Download](https://git-scm.com/)

### Optional but Recommended
- **Expo CLI**: Install globally with `npm install -g @expo/cli`
- **VS Code**: Code editor - [Download](https://code.visualstudio.com/)
- **Expo Go App**: Mobile app for testing
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Platform-Specific Requirements

#### For iOS Development (Mac Only)
- **Xcode**: Version 14.0+ - [Mac App Store](https://apps.apple.com/app/xcode/id497799835)
- **iOS Simulator**: Comes with Xcode
- **CocoaPods**: Install with `sudo gem install cocoapods`

#### For Android Development
- **Android Studio**: Latest version - [Download](https://developer.android.com/studio)
- **Android SDK**: API Level 31+
- **Android Emulator**: Configure in Android Studio

## 🛠️ Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd /Users/president/StorageSpaceApp
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# If you encounter any issues, try:
npm install --legacy-peer-deps
```

### Step 3: Install Additional Dependencies (if needed)

These should already be installed, but if missing:

```bash
npm install react-native-maps @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack react-native-screens react-native-safe-area-context react-native-vector-icons @expo/vector-icons expo-location expo-linear-gradient react-native-gesture-handler @react-native-community/datetimepicker
```

### Step 4: Install Web Dependencies (Optional)

For web support:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

## 🚀 Running the App

### Option 1: Using Expo Go (Recommended for Beginners)

1. Start the development server:
   ```bash
   npm start
   # or
   npx expo start
   ```

2. A QR code will appear in your terminal

3. On your phone:
   - **iOS**: Open Camera app and scan the QR code
   - **Android**: Open Expo Go app and scan the QR code

4. The app will load on your device!

### Option 2: iOS Simulator (Mac Only)

```bash
# Start and open in iOS Simulator
npm run ios

# Or press 'i' after running npm start
```

### Option 3: Android Emulator

1. Open Android Studio
2. Start an Android Virtual Device (AVD)
3. Run:
   ```bash
   npm run android
   
   # Or press 'a' after running npm start
   ```

### Option 4: Web Browser (Limited Features)

```bash
# Note: Maps won't work in web version
npm run web

# Or press 'w' after running npm start
```

## 🔧 Configuration

### Environment Setup

Create a `.env` file in the root directory (optional for future API keys):

```env
# API Keys (when implementing backend)
GOOGLE_MAPS_API_KEY=your_google_maps_key
STRIPE_API_KEY=your_stripe_key

# Backend URL
API_URL=https://api.storagespace.com
```

### App Configuration

The main configuration is in `app.json`:

```json
{
  "expo": {
    "name": "StorageSpace",
    "slug": "storage-space-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light"
  }
}
```

## 📱 Development Workflow

### Hot Reloading

The app supports hot reloading by default. Changes to your code will automatically refresh the app.

### Debugging

1. **Shake** your device to open the developer menu
2. Select **Debug Remote JS** for Chrome DevTools debugging
3. Use `console.log()` for quick debugging

### Useful Commands

```bash
# Clear cache and restart
npx expo start --clear

# Run with tunnel (for external network access)
npx expo start --tunnel

# Check Expo diagnostics
npx expo doctor

# Update Expo SDK
npx expo upgrade
```

## 🌐 Platform-Specific Notes

### iOS Specific

- Minimum iOS version: 13.0
- Tested on iPhone and iPad
- Requires location permissions for maps

### Android Specific

- Minimum Android API: 21 (Android 5.0)
- Requires Google Play Services for maps
- Enable developer mode on physical devices

### Web Specific

- Maps functionality is limited
- Best used for UI development
- Not recommended for production

## 🔍 Verifying Installation

After setup, you should see:

1. **Home Screen**: Blue gradient header with "Find secure storage near you"
2. **Bottom Navigation**: 4 tabs (Home, Map, Bookings, Profile)
3. **Storage Cards**: List of available storage locations
4. **Interactive Features**: All buttons and navigation should work

## 🚨 Common Setup Issues

### "Metro bundler EADDRINUSE"
```bash
# Kill the process using port 8081
npx kill-port 8081
```

### "Unable to resolve module"
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

### "Invariant Violation"
```bash
# Reset Metro bundler cache
npx react-native start --reset-cache
```

## 📝 Next Steps

1. **Explore the Code**: Start with `App.tsx` and `src/navigation/AppNavigator.tsx`
2. **Modify Screens**: Edit files in `src/screens/`
3. **Add Features**: Create new components and screens
4. **Test on Devices**: Use different devices and screen sizes

## 🆘 Getting Help

- **Documentation**: Check the `/docs` folder
- **Issues**: Create an issue on GitHub
- **Community**: Join the React Native community

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] Project directory accessed
- [ ] Dependencies installed
- [ ] Expo CLI working
- [ ] Expo Go app installed (for mobile testing)
- [ ] App running successfully
- [ ] Can see home screen
- [ ] Navigation working

---

Congratulations! 🎉 You've successfully set up the StorageSpace app. Happy coding!
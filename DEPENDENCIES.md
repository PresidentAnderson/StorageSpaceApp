# Dependencies Documentation 📦

This document provides a complete overview of all dependencies used in the StorageSpace app, their purposes, and installation commands.

## 📋 Summary

- **Total Dependencies**: 12 main packages + 20 sub-dependencies
- **Bundle Size**: ~725 packages (including transitive dependencies)
- **Platform Support**: iOS, Android, Web (limited)
- **TypeScript**: Full support with type definitions

## 🏗️ Core Dependencies

### React Native & Expo

```bash
# Expo SDK (automatically installed)
expo@~53.0.0

# React Native (bundled with Expo)
react-native@0.76.2

# React (bundled)
react@18.3.1
```

**Purpose**: Core framework for cross-platform mobile development

### Navigation System

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
```

| Package | Version | Purpose |
|---------|---------|---------|
| `@react-navigation/native` | 6.1.18 | Core navigation library |
| `@react-navigation/bottom-tabs` | 6.6.1 | Bottom tab navigation |
| `@react-navigation/stack` | 6.4.1 | Stack navigation |

**Features Enabled**:
- Tab-based navigation
- Stack navigation with animations
- Deep linking support
- Type-safe navigation

### Navigation Dependencies

```bash
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react-native-screens` | 4.13.1 | Optimized screen management |
| `react-native-safe-area-context` | 5.5.2 | Safe area handling |
| `react-native-gesture-handler` | 2.27.1 | Touch gesture recognition |

### Maps & Location

```bash
npm install react-native-maps expo-location
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react-native-maps` | 1.24.5 | Google Maps integration |
| `expo-location` | 18.1.6 | Location services |

**Features Enabled**:
- Interactive maps with custom markers
- Current location detection
- Distance calculations
- Location permissions

### UI Components & Icons

```bash
npm install @expo/vector-icons react-native-vector-icons
```

| Package | Version | Purpose |
|---------|---------|---------|
| `@expo/vector-icons` | 14.0.4 | Icon library (Ionicons, etc.) |
| `react-native-vector-icons` | 10.2.0 | Additional icon sets |

**Icons Available**:
- Ionicons (primary)
- MaterialIcons
- FontAwesome
- Feather

### Visual Effects

```bash
npm install expo-linear-gradient
```

| Package | Version | Purpose |
|---------|---------|---------|
| `expo-linear-gradient` | 14.1.0 | Gradient backgrounds |

**Features Enabled**:
- Beautiful gradient headers
- Button gradients
- Visual polish

### Date & Time

```bash
npm install @react-native-community/datetimepicker
```

| Package | Version | Purpose |
|---------|---------|---------|
| `@react-native-community/datetimepicker` | 8.4.2 | Date/time selection |

**Features Enabled**:
- Native date/time pickers
- Booking time selection
- Cross-platform support

### Web Support (Optional)

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react-dom` | 19.0.0 | React DOM for web |
| `react-native-web` | 0.20.0 | React Native web compatibility |
| `@expo/metro-runtime` | 5.0.4 | Metro bundler for web |

## 🔧 Development Dependencies

These are included with Expo SDK:

| Package | Purpose |
|---------|---------|
| `typescript` | Static type checking |
| `@types/react` | React type definitions |
| `@types/react-native` | React Native types |
| `metro` | JavaScript bundler |
| `babel` | JavaScript compiler |

## 📊 Dependency Tree

```
StorageSpace App
├── expo (53.0.0)
│   ├── react-native (0.76.2)
│   ├── react (18.3.1)
│   └── typescript (5.1.3)
├── @react-navigation/
│   ├── native (6.1.18)
│   ├── bottom-tabs (6.6.1)
│   └── stack (6.4.1)
├── react-native-screens (4.13.1)
├── react-native-safe-area-context (5.5.2)
├── react-native-gesture-handler (2.27.1)
├── react-native-maps (1.24.5)
├── expo-location (18.1.6)
├── @expo/vector-icons (14.0.4)
├── expo-linear-gradient (14.1.0)
└── @react-native-community/datetimepicker (8.4.2)
```

## 📱 Platform-Specific Dependencies

### iOS Only
- CocoaPods dependencies (auto-managed by Expo)
- iOS-specific native modules

### Android Only
- Gradle dependencies (auto-managed by Expo)
- Google Play Services for maps

### Web Only
- `react-dom`
- `react-native-web`
- `@expo/metro-runtime`

## 🚀 Installation Commands

### Complete Fresh Install

```bash
# Navigate to project
cd /Users/president/StorageSpaceApp

# Install all dependencies
npm install

# Install web support (optional)
npx expo install react-dom react-native-web @expo/metro-runtime
```

### Individual Package Installation

```bash
# Navigation system
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler

# Maps and location
npm install react-native-maps expo-location

# UI and icons
npm install @expo/vector-icons react-native-vector-icons expo-linear-gradient

# Date/time picker
npm install @react-native-community/datetimepicker
```

## ⚠️ Version Compatibility

Current warnings and recommended versions:

| Package | Current | Recommended | Status |
|---------|---------|-------------|---------|
| `@react-native-community/datetimepicker` | 8.4.2 | 8.4.1 | ⚠️ Minor mismatch |
| `react-native-gesture-handler` | 2.27.1 | ~2.24.0 | ⚠️ Version ahead |
| `react-native-maps` | 1.24.5 | 1.20.1 | ⚠️ Version ahead |
| `react-native-safe-area-context` | 5.5.2 | 5.4.0 | ⚠️ Version ahead |
| `react-native-screens` | 4.13.1 | ~4.11.1 | ⚠️ Version ahead |

**Status**: All packages are functional. Warnings are recommendations, not requirements.

## 🔄 Updating Dependencies

### Update to Recommended Versions

```bash
npm install @react-native-community/datetimepicker@8.4.1 react-native-gesture-handler@~2.24.0 react-native-maps@1.20.1 react-native-safe-area-context@5.4.0 react-native-screens@~4.11.1
```

### Update All Packages

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update Expo SDK
npx expo upgrade
```

## 🔍 Package Analysis

### Bundle Size Impact

| Package | Estimated Size | Impact |
|---------|----------------|---------|
| `react-native-maps` | ~2MB | High (maps functionality) |
| `@expo/vector-icons` | ~1MB | Medium (icons) |
| `react-navigation` | ~500KB | Medium (navigation) |
| `expo-location` | ~200KB | Low (location services) |
| Others | ~300KB | Low (utilities) |

### Performance Considerations

- **react-native-maps**: Largest package, essential for core functionality
- **@expo/vector-icons**: Can be optimized by importing specific icons
- **react-native-gesture-handler**: Critical for navigation performance

## 🛠️ Troubleshooting Dependencies

### Common Issues

#### Metro bundler cache issues
```bash
npx expo start --clear
```

#### Module resolution issues
```bash
rm -rf node_modules package-lock.json
npm install
```

#### iOS CocoaPods issues
```bash
cd ios && pod install && cd ..
```

#### Android Gradle issues
```bash
cd android && ./gradlew clean && cd ..
```

## 📚 Documentation Links

| Package | Documentation |
|---------|---------------|
| Expo | [docs.expo.dev](https://docs.expo.dev) |
| React Navigation | [reactnavigation.org](https://reactnavigation.org) |
| React Native Maps | [github.com/react-native-maps/react-native-maps](https://github.com/react-native-maps/react-native-maps) |
| Expo Location | [docs.expo.dev/versions/latest/sdk/location](https://docs.expo.dev/versions/latest/sdk/location/) |
| Vector Icons | [icons.expo.fyi](https://icons.expo.fyi) |

## 🔒 Security Considerations

### Trusted Sources
- All packages are from official maintainers
- Regular security updates via Expo
- No packages with known vulnerabilities

### Permissions Required
- **Location**: `expo-location`
- **Camera**: Future implementation
- **Storage**: Local storage only

## 📊 Dependency Health

- ✅ **All packages actively maintained**
- ✅ **No critical vulnerabilities**
- ✅ **Compatible with Expo SDK 53**
- ✅ **TypeScript support available**
- ⚠️ **Some version mismatches (non-critical)**

---

Last updated: July 2025
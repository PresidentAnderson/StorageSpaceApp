# Bounce.app - iOS Application Markup Analysis

## Overview
**Bundle ID**: com.usebounce.app  
**Version**: 4.296.0 (Build: 4296000)  
**Platform**: iOS (Universal - iPhone & iPad)  
**Minimum iOS**: 18.0  
**Architecture**: ARM64 (64-bit)  
**Framework**: React Native/Expo  
**Binary Size**: ~48.7 MB  

## Application Structure

### Directory Layout
```
/Applications/Bounce.app/
├── WrappedBundle -> Wrapper/Bounce.app
└── Wrapper/
    ├── BundleMetadata.plist
    ├── iTunesMetadata.plist
    └── Bounce.app/
        ├── Bounce (main executable)
        ├── Info.plist
        ├── main.jsbundle (13.3 MB)
        ├── assets/
        ├── Frameworks/
        └── [Privacy & Resource Bundles]
```

## Core Technologies & Dependencies

### React Native Stack
- **JavaScript Runtime**: Hermes Framework
- **Main Bundle**: 13.3 MB JavaScript bundle
- **Expo Integration**: Multiple Expo modules for native functionality

### Embedded Frameworks
1. **hermes.framework** - JavaScript engine optimized for React Native
2. **Intercom.framework** - Customer support chat system
3. **OpenTelemetryApi.framework** - Observability and monitoring

### System Frameworks Used
- AVFoundation - Audio/Video handling
- CoreLocation - Location services
- CoreData - Local data persistence
- CoreMedia/CoreVideo - Media processing
- CoreTelephony - Carrier information
- Contacts - Contact access
- Accelerate - High-performance computing

## Third-Party Integrations

### Analytics & Marketing
1. **Braze** (SDK Key: 6b1c6198-d9d5-4782-8999-ddcc86adbb47)
   - Push notifications
   - User engagement tracking
   - Geofencing enabled
   - Location tracking enabled

2. **Google Analytics**
   - Ad personalization enabled
   - Analytics storage enabled
   - User data collection enabled

3. **Firebase**
   - Authentication
   - Messaging (FCM)
   - Crashlytics
   - Analytics (automatic screen reporting disabled)

4. **Datadog**
   - Application performance monitoring
   - Crash reporting
   - RUM (Real User Monitoring)

5. **AppsFlyer**
   - Attribution tracking
   - SKAdNetwork endpoint configured

### Payment Processing
1. **Stripe**
   - Full payment flow integration
   - 3D Secure 2.0 support
   - Financial connections
   - Multiple UI bundles for payment sheets

2. **Braintree**
   - Card processing
   - PayPal integration
   - Data collection

### Mapping & Location
1. **Google Maps** (API Key: AIzaSyDkPZo6Z00idFYjT06yF8luGKB1jmKy4Nc)
   - Full maps integration
   - Location-based storage spot discovery

### Authentication
1. **Google Sign-In**
   - OAuth integration
   - Multiple language support

2. **Firebase Auth**
   - User authentication backend

### Communication
1. **Intercom**
   - In-app support chat
   - Universal links configured

## Privacy & Permissions

### Required Permissions
- **Location Services** (Always & When In Use)
  - Purpose: Show nearby storage spots
- **Camera Access**
  - Purpose: Support photo capture
- **Photo Library**
  - Purpose: Send photos to support
- **Microphone**
  - Purpose: Audio recording (generic permission)
- **Push Notifications**
  - Purpose: Updates and marketing
- **User Tracking**
  - Purpose: Personalized advertising

### Privacy Manifest (PrivacyInfo.xcprivacy)
- **User Defaults Access**: App functionality, third-party SDKs
- **File Timestamps**: App functionality, third-party SDKs
- **System Boot Time**: Measuring app launch time
- **Disk Space**: User-facing feature, app functionality
- **No Tracking Domains Listed**
- **Tracking Disabled in Manifest**

## Localization Support

### App-Level Languages
- English (en)
- German (de)
- Spanish (es-ES)
- French (fr)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Polish (pl)
- Portuguese (pt-PT)
- Russian (ru)

### Extended Language Support (via SDKs)
- 60+ languages through Braze, Google Maps, Stripe, and other SDKs

## Security & Configuration

### Network Security
- Arbitrary loads disabled (NSAllowsArbitraryLoads: false)
- Local networking allowed for development
- HTTPS enforced for external connections

### URL Schemes
1. `usebounce://` - Primary app scheme
2. `com.usebounce.app://` - Alternative scheme
3. `com.googleusercontent.apps.[id]://` - Google OAuth
4. `exp+bounce://` - Expo development

### Universal Links
- usebounce.com
- bounce.com

### Supported External Apps
Navigation apps that can be launched:
- Google Maps, Apple Maps
- Uber, Lyft
- Citymapper, Transit
- Waze, Yandex
- And 15+ other navigation apps

## Build Information
- **Xcode**: 16.4.0 (16F6)
- **SDK**: iOS 18.5
- **Build Machine**: macOS 24F74
- **Platform Build**: 22F76
- **Deployment Target**: iOS 12.0+
- **Encryption**: Non-exempt (ITSAppUsesNonExemptEncryption: false)

## Key Features Implementation

### Core Functionality
1. **Luggage Storage Marketplace**
   - Location-based discovery
   - Real-time availability
   - Booking system

2. **Payment Processing**
   - Stripe & Braintree integration
   - Multiple payment methods
   - 3D Secure support

3. **User Engagement**
   - Push notifications
   - In-app messaging (Braze)
   - Support chat (Intercom)

4. **Analytics & Monitoring**
   - Multi-platform analytics
   - Crash reporting
   - Performance monitoring
   - User behavior tracking

### Technical Implementation
- React Native for cross-platform UI
- Hermes for optimized JavaScript execution
- Native modules for platform-specific features
- Extensive third-party SDK integration

## Notable Technical Details
1. **JavaScript Bundle**: 13.3 MB indicates a substantial React Native application
2. **Binary Size**: 48.7 MB executable suggests significant native code
3. **Minimum iOS 18.0**: Targeting very recent iOS version (unusual for production apps)
4. **Universal App**: Supports all iOS devices including Vision Pro
5. **No iPad-specific UI**: Uses scaled iPhone interface on iPad

## Security Considerations
- Multiple API keys exposed in Info.plist (Google Maps, Braze)
- Firebase configuration embedded
- No app-level encryption mentioned
- Standard iOS security features utilized
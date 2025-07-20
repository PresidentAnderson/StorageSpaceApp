# Production Deployment Guide

This guide covers the complete process of deploying StorageSpace to production on iOS App Store, Google Play Store, and Web.

## Prerequisites

### General Requirements
- [ ] Production API endpoints configured
- [ ] Environment variables set
- [ ] SSL certificates configured
- [ ] Analytics configured (Firebase, Mixpanel)
- [ ] Error tracking configured (Sentry)
- [ ] Push notification certificates

### iOS Requirements
- [ ] Apple Developer Account ($99/year)
- [ ] App Store Connect access
- [ ] Valid provisioning profiles
- [ ] Push notification certificates (APNs)

### Android Requirements
- [ ] Google Play Developer Account ($25 one-time)
- [ ] Google Play Console access
- [ ] App signing configured
- [ ] Firebase project for FCM

## Build Configuration

### 1. Environment Setup

Create `.env.production`:

```bash
# API Configuration
API_URL=https://api.storagespace.app/v1
API_KEY=your_production_api_key

# Services
GOOGLE_MAPS_API_KEY=your_production_maps_key
SENTRY_DSN=your_sentry_dsn
MIXPANEL_TOKEN=your_mixpanel_token

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
ENABLE_PERFORMANCE_MONITORING=true
```

### 2. App Configuration

Update `app.json`:

```json
{
  "expo": {
    "name": "StorageSpace",
    "slug": "storagespace",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#007AFF"
    },
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/your-project-id"
    },
    "ios": {
      "bundleIdentifier": "com.storagespace.app",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "StorageSpace needs your location to show nearby storage facilities.",
        "NSCameraUsageDescription": "StorageSpace needs camera access to scan QR codes."
      }
    },
    "android": {
      "package": "com.storagespace.app",
      "versionCode": 1,
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "CAMERA"
      ]
    }
  }
}
```

## iOS Deployment

### 1. Build Preparation

```bash
# Install dependencies
npm install

# Clear caches
cd ios
pod deintegrate
pod install
cd ..

# Configure EAS
eas build:configure
```

### 2. Create Production Build

```bash
# Build for iOS
eas build --platform ios --profile production

# Or using Xcode
npm run ios -- --configuration Release
```

### 3. App Store Connect Setup

1. Create app in App Store Connect
2. Fill in app information:
   - App name: StorageSpace
   - Primary language: English
   - Category: Travel
   - Privacy policy URL
   - Support URL

3. Configure app details:
   - Description
   - Keywords
   - Screenshots (6.5", 5.5", iPad)
   - App preview videos
   - Promotional text

### 4. TestFlight Distribution

```bash
# Upload to TestFlight
eas submit --platform ios --latest

# Or manually with Xcode
# Archive → Distribute App → App Store Connect → Upload
```

### 5. App Store Submission

1. Complete App Information
2. Set pricing and availability
3. Add build from TestFlight
4. Submit for review

## Android Deployment

### 1. Build Preparation

```bash
# Generate upload key (first time only)
keytool -genkeypair -v -storetype PKCS12 -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000

# Configure gradle properties
echo "MYAPP_UPLOAD_STORE_FILE=upload-keystore.jks
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_STORE_PASSWORD=your_password
MYAPP_UPLOAD_KEY_PASSWORD=your_password" >> android/gradle.properties
```

### 2. Create Production Build

```bash
# Build for Android
eas build --platform android --profile production

# Or using Gradle
cd android
./gradlew bundleRelease
cd ..
```

### 3. Google Play Console Setup

1. Create application
2. Set up store listing:
   - Title: StorageSpace
   - Short description (80 chars)
   - Full description (4000 chars)
   - Graphics:
     - Hi-res icon (512x512)
     - Feature graphic (1024x500)
     - Screenshots (min 2, max 8)
   - Categorization: Travel & Local
   - Content rating questionnaire

### 4. Release Management

```bash
# Upload to Google Play
eas submit --platform android --latest

# Or manually upload
# app/build/outputs/bundle/release/app-release.aab
```

### 5. Staged Rollout

1. Create release in Production track
2. Set rollout percentage (e.g., 20%)
3. Monitor crash reports and feedback
4. Gradually increase rollout

## Web Deployment

### 1. Build for Web

```bash
# Install web dependencies
npm install react-native-web react-dom

# Build web version
npm run web:build

# Output in web-build/
```

### 2. Deploy to Hosting

#### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### AWS S3 + CloudFront

```bash
# Build and sync to S3
aws s3 sync web-build/ s3://storagespace-web --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Post-Deployment

### 1. Monitoring Setup

#### Sentry Configuration

```typescript
// App.tsx
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: Config.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: false,
  environment: 'production',
});
```

#### Analytics Setup

```typescript
// services/analytics.ts
import * as Analytics from 'expo-firebase-analytics';

export const trackEvent = (name: string, params?: object) => {
  if (__DEV__) return;
  
  Analytics.logEvent(name, params);
};
```

### 2. Performance Monitoring

```typescript
// Enable performance monitoring
import perf from '@react-native-firebase/perf';

const trace = await perf().startTrace('custom_trace');
// ... perform action
await trace.stop();
```

### 3. Crash Reporting

Monitor crashes in:
- Firebase Crashlytics
- Sentry dashboard
- App Store Connect
- Google Play Console

## Release Checklist

### Pre-Release

- [ ] Version numbers updated
- [ ] Release notes prepared
- [ ] All tests passing
- [ ] No console.log statements
- [ ] API endpoints pointing to production
- [ ] Feature flags configured
- [ ] Database migrations completed
- [ ] CDN assets uploaded

### iOS Release

- [ ] Build uploaded to TestFlight
- [ ] Internal testing completed
- [ ] External beta testing completed
- [ ] App Store listing updated
- [ ] Screenshots updated
- [ ] Submitted for review

### Android Release

- [ ] Build uploaded to Play Console
- [ ] Internal testing track completed
- [ ] Closed/Open beta completed
- [ ] Store listing updated
- [ ] Content rating completed
- [ ] Staged rollout started

### Post-Release

- [ ] Monitor crash reports
- [ ] Check user reviews
- [ ] Monitor API performance
- [ ] Track key metrics
- [ ] Prepare hotfix process
- [ ] Update documentation

## Rollback Procedures

### iOS Rollback

1. Cannot rollback approved version
2. Submit expedited review with fix
3. Use remote config for feature flags

### Android Rollback

1. Halt staged rollout
2. Create new release with previous APK
3. Submit for review

### Web Rollback

```bash
# Revert to previous version
git checkout tags/v1.0.0
npm run web:build
vercel --prod

# Or restore from S3 backup
aws s3 sync s3://storagespace-backup/v1.0.0/ s3://storagespace-web/
```

## Hotfix Process

1. Create hotfix branch from production
```bash
git checkout -b hotfix/critical-bug main
```

2. Fix issue and test thoroughly

3. Deploy hotfix
```bash
# Increment patch version
npm version patch

# Build and deploy
eas build --platform all --profile production
eas submit --platform all --latest
```

4. Submit expedited review (iOS)

## Security Considerations

### API Keys

Never commit production keys:
```bash
# .gitignore
.env.production
*.jks
*.p12
*.mobileprovision
```

### Certificate Management

Store securely:
- iOS certificates in Keychain
- Android keystores in secure location
- Use EAS for automated management

### Code Obfuscation

Enable ProGuard for Android:
```gradle
buildTypes {
    release {
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

## Troubleshooting

### Common iOS Issues

1. **Archive not appearing**: Check provisioning profiles
2. **Invalid binary**: Update Xcode and check entitlements
3. **Rejected for permissions**: Clarify usage descriptions

### Common Android Issues

1. **Upload key mismatch**: Check keystore configuration
2. **Version code conflict**: Increment versionCode
3. **API level issues**: Update targetSdkVersion

### Common Web Issues

1. **CORS errors**: Configure API headers
2. **PWA not installing**: Check manifest.json
3. **Performance issues**: Enable code splitting
# Troubleshooting Guide 🔧

This guide covers common issues you might encounter while setting up or running the StorageSpace app, along with step-by-step solutions.

## 🚨 Quick Solutions

### Most Common Issues

| Issue | Quick Fix |
|-------|-----------|
| App won't start | `npx expo start --clear` |
| Metro bundler error | `npx kill-port 8081` then `npm start` |
| Dependency issues | `rm -rf node_modules package-lock.json && npm install` |
| Maps not showing | Use mobile device instead of web |
| QR code not working | Update Expo Go app |

## 📱 Installation Issues

### Issue: "Command not found: npm"

**Problem**: Node.js is not installed or not in PATH

**Solution**:
```bash
# Install Node.js from official website
# Download from: https://nodejs.org/

# Verify installation
node --version
npm --version
```

### Issue: "Command not found: npx"

**Problem**: npm version is too old

**Solution**:
```bash
# Update npm
npm install -g npm@latest

# Verify npx is available
npx --version
```

### Issue: "Permission denied" errors

**Problem**: Insufficient permissions for global installs

**Solution**:
```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g @expo/cli

# Option 2: Change npm directory (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## 🚀 Startup Issues

### Issue: "Metro bundler EADDRINUSE"

**Problem**: Port 8081 is already in use

**Solution**:
```bash
# Kill process using port 8081
npx kill-port 8081

# Or find and kill manually
lsof -ti:8081 | xargs kill -9

# Start app again
npm start
```

### Issue: "Unable to resolve module"

**Problem**: Dependency resolution issues

**Solution**:
```bash
# Clear everything and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Clear Metro cache
npx expo start --clear
```

### Issue: "Expo CLI not found"

**Problem**: Expo CLI not installed or outdated

**Solution**:
```bash
# Install latest Expo CLI
npm install -g @expo/cli

# Or use npx without global install
npx expo start
```

## 📱 Device Connection Issues

### Issue: QR Code not scanning

**Problem**: Various QR code scanning issues

**Solutions**:

1. **Update Expo Go app**:
   - iOS: Update from App Store
   - Android: Update from Google Play

2. **Check network connection**:
   ```bash
   # Use tunnel mode for external networks
   npx expo start --tunnel
   ```

3. **Manual connection**:
   - Open Expo Go
   - Tap "Enter URL manually"
   - Enter the URL shown in terminal

### Issue: "Something went wrong" in Expo Go

**Problem**: App crashes or fails to load

**Solutions**:

1. **Clear Expo Go cache**:
   - iOS: Delete and reinstall Expo Go
   - Android: Go to Settings > Apps > Expo Go > Storage > Clear Cache

2. **Check app logs**:
   ```bash
   # Watch logs in terminal
   npx expo start
   # Look for error messages when app crashes
   ```

3. **Restart development server**:
   ```bash
   npx expo start --clear
   ```

## 🗺️ Maps Issues

### Issue: Maps not showing on web

**Problem**: react-native-maps doesn't support web

**Solution**: 
- Maps only work on iOS and Android
- Use mobile device or simulator for full functionality
- Web version shows placeholder message

### Issue: "Google Maps API key not found"

**Problem**: Missing or invalid Google Maps API key (future implementation)

**Solution**:
```bash
# Create .env file (when implementing backend)
echo "GOOGLE_MAPS_API_KEY=your_api_key_here" > .env
```

### Issue: Maps showing gray screen

**Problem**: Google Play Services not available

**Solutions**:
1. **Android Emulator**: Use emulator with Google APIs
2. **Physical Device**: Ensure Google Play Services is updated
3. **iOS**: Should work by default

## 🔧 Development Issues

### Issue: "TypeScript errors"

**Problem**: Type checking failures

**Solution**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Install missing type definitions
npm install --save-dev @types/react @types/react-native
```

### Issue: "React Navigation errors"

**Problem**: Navigation setup issues

**Solution**:
```bash
# Ensure all navigation dependencies are installed
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler

# For iOS, also run:
cd ios && pod install && cd ..
```

### Issue: Hot reloading not working

**Problem**: Changes not reflecting automatically

**Solutions**:
1. **Restart with cache clear**:
   ```bash
   npx expo start --clear
   ```

2. **Check Fast Refresh**:
   - Shake device to open dev menu
   - Enable "Fast Refresh"

3. **Manual refresh**:
   - Press `r` in terminal
   - Or shake device and select "Reload"

## 🖥️ Platform-Specific Issues

### iOS Issues

#### Issue: "CocoaPods not found"

**Solution**:
```bash
# Install CocoaPods
sudo gem install cocoapods

# Install pods
cd ios && pod install && cd ..
```

#### Issue: Simulator not opening

**Solution**:
```bash
# Open Xcode and install iOS Simulator
# Or try specific simulator
npx expo run:ios --simulator="iPhone 15"
```

### Android Issues

#### Issue: "Android SDK not found"

**Solution**:
1. Install Android Studio
2. Open Android Studio > SDK Manager
3. Install Android SDK (API 31+)
4. Add SDK to PATH:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### Issue: "No connected devices"

**Solution**:
1. **Emulator**: Start AVD from Android Studio
2. **Physical device**: Enable USB debugging
3. **List devices**: `adb devices`

## 📦 Dependency Issues

### Issue: Version mismatch warnings

**Problem**: Package versions don't match Expo recommendations

**Solution**:
```bash
# These warnings are usually safe to ignore
# Or update to recommended versions:
npm install @react-native-community/datetimepicker@8.4.1 react-native-gesture-handler@~2.24.0 react-native-maps@1.20.1 react-native-safe-area-context@5.4.0 react-native-screens@~4.11.1
```

### Issue: "Peer dependency warnings"

**Problem**: Missing peer dependencies

**Solution**:
```bash
# Install with legacy peer deps
npm install --legacy-peer-deps

# Or fix peer dependencies
npm install --save-peer
```

## 🌐 Network Issues

### Issue: "Network request failed"

**Problem**: Firewall or network blocking connections

**Solutions**:
1. **Check firewall settings**
2. **Use tunnel mode**:
   ```bash
   npx expo start --tunnel
   ```
3. **Try different network**

### Issue: "Unable to connect to Metro"

**Problem**: Metro bundler not accessible

**Solutions**:
1. **Restart Metro**:
   ```bash
   npx expo start --clear
   ```
2. **Check localhost access**:
   ```bash
   curl http://localhost:8081
   ```

## 🔍 Debugging Tips

### Enable Debug Mode

1. **Physical Device**: Shake device → Debug Remote JS
2. **Simulator**: Command+D (iOS) / Ctrl+M (Android) → Debug Remote JS
3. **Chrome DevTools**: Open Chrome → localhost:19001/debugger-ui

### Useful Debug Commands

```bash
# Show device logs
npx expo logs

# Show Metro bundler logs
npx expo start --verbose

# Diagnose Expo issues
npx expo doctor

# Check environment
npx expo env-info
```

### Common Error Patterns

| Error Message | Likely Cause | Solution |
|---------------|--------------|----------|
| "Invariant Violation" | Metro cache issue | Clear cache |
| "Unable to resolve module" | Missing dependency | Reinstall packages |
| "Red screen of death" | JavaScript error | Check console logs |
| "Network request failed" | Connection issue | Check network/firewall |

## 🆘 When All Else Fails

### Nuclear Option (Reset Everything)

```bash
# Save your changes first!
git stash

# Remove all generated files
rm -rf node_modules
rm package-lock.json
rm -rf .expo
rm -rf ios/Pods
rm ios/Podfile.lock

# Reinstall everything
npm install
cd ios && pod install && cd ..

# Start fresh
npx expo start --clear
```

### Get Help

1. **Check GitHub Issues**: [StorageSpace Issues](https://github.com/PresidentAnderson/storagespace/issues)
2. **Expo Community**: [forums.expo.dev](https://forums.expo.dev)
3. **React Native Community**: [reactnative.dev/help](https://reactnative.dev/help)
4. **Discord/Slack**: Join development communities

### Report Bugs

When reporting issues, include:
- Operating System (macOS, Windows, Linux)
- Node.js version (`node --version`)
- npm version (`npm --version`)
- Expo CLI version (`npx expo --version`)
- Device/Simulator details
- Full error message
- Steps to reproduce

## ✅ Verification Checklist

After fixing issues, verify:

- [ ] `npm start` works without errors
- [ ] App loads on device/simulator
- [ ] Navigation works between screens
- [ ] Maps display correctly (mobile only)
- [ ] No red error screens
- [ ] Hot reloading works
- [ ] Console shows no critical errors

---

**Still having issues?** Create an issue on GitHub with your error details and we'll help you out! 🚀
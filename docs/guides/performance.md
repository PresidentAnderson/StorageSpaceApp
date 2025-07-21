# Performance Guide

This guide covers performance optimization strategies for StorageSpace, including React Native best practices, memory management, and monitoring techniques.

## Performance Philosophy

- **60 FPS**: Maintain smooth 60fps animations
- **Fast Startup**: App should launch in under 3 seconds
- **Efficient Memory**: Keep memory usage under 150MB
- **Network Optimization**: Minimize API calls and data transfer
- **Battery Friendly**: Optimize for battery life

## Performance Metrics

### Core Web Vitals Equivalent
- **Time to Interactive (TTI)**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1

### Mobile Specific Metrics
- **JS Thread Usage**: < 70%
- **UI Thread Usage**: < 50%
- **Memory Usage**: < 150MB
- **Battery Drain**: < 5% per hour of active use
- **Bundle Size**: < 25MB

## React Native Performance

### 1. Component Optimization

#### Use React.memo for Pure Components

```typescript
import React, { memo } from 'react';

interface LocationCardProps {
  location: Location;
  onPress: (location: Location) => void;
}

export const LocationCard = memo<LocationCardProps>(({ location, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(location)}>
      <View style={styles.container}>
        <Text>{location.name}</Text>
        <Text>${location.pricing.hourly}/hour</Text>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.location.id === nextProps.location.id &&
    prevProps.location.name === nextProps.location.name &&
    prevProps.location.pricing.hourly === nextProps.location.pricing.hourly
  );
});
```

#### Optimize Expensive Calculations

```typescript
import { useMemo } from 'react';

const LocationList = ({ locations, userLocation }) => {
  // Memoize expensive calculations
  const sortedLocations = useMemo(() => {
    return locations
      .map(location => ({
        ...location,
        distance: calculateDistance(userLocation, location.coordinates)
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [locations, userLocation]);

  return (
    <FlatList
      data={sortedLocations}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <LocationCard location={item} />}
    />
  );
};
```

#### Use useCallback for Event Handlers

```typescript
import { useCallback } from 'react';

const BookingScreen = () => {
  const [bags, setBags] = useState([]);
  
  // Memoize callbacks to prevent unnecessary re-renders
  const handleAddBag = useCallback((bagType: string) => {
    setBags(prev => [...prev, { type: bagType, id: Date.now() }]);
  }, []);

  const handleRemoveBag = useCallback((bagId: string) => {
    setBags(prev => prev.filter(bag => bag.id !== bagId));
  }, []);

  return (
    <BagSelector
      onAddBag={handleAddBag}
      onRemoveBag={handleRemoveBag}
    />
  );
};
```

### 2. List Performance

#### FlatList Optimization

```typescript
const ITEM_HEIGHT = 120;

const LocationList = ({ locations }) => {
  const renderLocation = useCallback(({ item }: { item: Location }) => (
    <LocationCard location={item} />
  ), []);

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={locations}
      renderItem={renderLocation}
      keyExtractor={item => item.id}
      getItemLayout={getItemLayout}
      
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
      
      // Memory optimizations
      disableVirtualization={false}
      legacyImplementation={false}
    />
  );
};
```

#### Virtual List for Large Datasets

```typescript
import { VirtualizedList } from 'react-native';

const VirtualLocationList = ({ locations }) => {
  const getItem = (data: Location[], index: number) => data[index];
  const getItemCount = (data: Location[]) => data.length;

  return (
    <VirtualizedList
      data={locations}
      getItem={getItem}
      getItemCount={getItemCount}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <LocationCard location={item} />}
      
      // Virtualization settings
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
        minimumViewTime: 100,
      }}
    />
  );
};
```

### 3. Image Optimization

#### Lazy Loading Images

```typescript
import { useState, useEffect, useRef } from 'react';
import { Image } from 'react-native';

const LazyImage = ({ source, style, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const viewRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (viewRef.current) {
      observer.observe(viewRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <View ref={viewRef} style={style}>
      {isVisible && (
        <Image
          source={source}
          style={style}
          onLoad={() => setIsLoaded(true)}
          fadeDuration={300}
          {...props}
        />
      )}
      {!isLoaded && <ImagePlaceholder style={style} />}
    </View>
  );
};
```

#### Image Caching

```typescript
import FastImage from 'react-native-fast-image';

const OptimizedImage = ({ uri, style }) => {
  return (
    <FastImage
      source={{
        uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      style={style}
      resizeMode={FastImage.resizeMode.cover}
    />
  );
};
```

### 4. Navigation Performance

#### Lazy Screen Loading

```typescript
import { lazy } from 'react';

// Lazy load heavy screens
const MapScreen = lazy(() => import('../screens/MapScreen'));
const BookingFlowScreen = lazy(() => import('../screens/BookingFlowScreen'));

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Map" 
      component={MapScreen}
      options={{
        // Enable native transitions
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    />
  </Stack.Navigator>
);
```

#### Screen Optimization

```typescript
import { useFocusEffect } from '@react-navigation/native';

const LocationDetailsScreen = ({ route }) => {
  const [location, setLocation] = useState(null);
  const [isActive, setIsActive] = useState(false);

  // Only load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      loadLocationData(route.params.locationId);
      
      return () => {
        setIsActive(false);
        // Cleanup if needed
      };
    }, [route.params.locationId])
  );

  // Prevent updates when screen is not active
  if (!isActive) {
    return <LoadingScreen />;
  }

  return <LocationDetails location={location} />;
};
```

## State Management Performance

### 1. Context Optimization

```typescript
// Split contexts to avoid unnecessary re-renders
const UserContext = createContext(null);
const LocationContext = createContext(null);
const BookingContext = createContext(null);

// Use context selectors
const useUserSelector = (selector) => {
  const user = useContext(UserContext);
  return useMemo(() => selector(user), [user, selector]);
};

// Component only re-renders when name changes
const UserProfile = () => {
  const userName = useUserSelector(user => user?.name);
  return <Text>{userName}</Text>;
};
```

### 2. State Updates

```typescript
// Batch state updates
const [state, setState] = useState({
  locations: [],
  loading: false,
  error: null,
});

// Instead of multiple setState calls
const updateLocations = (newLocations) => {
  setState(prev => ({
    ...prev,
    locations: newLocations,
    loading: false,
    error: null,
  }));
};
```

## Network Performance

### 1. Request Optimization

```typescript
class APIOptimizer {
  private cache = new Map();
  private pendingRequests = new Map();

  async get(url: string, options = {}) {
    // Return cached response if available
    const cacheKey = this.getCacheKey(url, options);
    const cached = this.cache.get(cacheKey);
    
    if (cached && !this.isExpired(cached)) {
      return cached.data;
    }

    // Deduplicate identical requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    const request = this.fetchData(url, options);
    this.pendingRequests.set(cacheKey, request);

    try {
      const data = await request;
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        ttl: options.ttl || 300000, // 5 minutes default
      });
      return data;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  private getCacheKey(url: string, options: any) {
    return `${url}:${JSON.stringify(options)}`;
  }

  private isExpired(cached: any) {
    return Date.now() > cached.timestamp + cached.ttl;
  }
}
```

### 2. Data Prefetching

```typescript
const useLocationPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchLocation = useCallback(async (locationId: string) => {
    await queryClient.prefetchQuery(
      ['location', locationId],
      () => locationService.getById(locationId),
      {
        staleTime: 5 * 60 * 1000, // 5 minutes
      }
    );
  }, [queryClient]);

  return { prefetchLocation };
};

// Use in location list
const LocationCard = ({ location, onPress }) => {
  const { prefetchLocation } = useLocationPrefetch();

  const handlePressIn = () => {
    // Prefetch on press down, before navigation
    prefetchLocation(location.id);
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(location)}
      onPressIn={handlePressIn}
    >
      {/* Card content */}
    </TouchableOpacity>
  );
};
```

### 3. Background Sync

```typescript
import BackgroundJob from 'react-native-background-job';

const backgroundSync = () => {
  BackgroundJob.on({
    jobKey: 'syncBookings',
    period: 300000, // 5 minutes
  });

  BackgroundJob.on('syncBookings', async () => {
    try {
      const bookings = await bookingService.getUpdates();
      await AsyncStorage.setItem('cachedBookings', JSON.stringify(bookings));
    } catch (error) {
      console.log('Background sync failed:', error);
    }
  });
};
```

## Memory Management

### 1. Memory Leaks Prevention

```typescript
const useLocationSubscription = (locationId: string) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let subscription: any;

    const setupSubscription = async () => {
      subscription = locationService.subscribe(locationId, (data) => {
        if (isMounted) {
          setLocation(data);
        }
      });
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [locationId]);

  return location;
};
```

### 2. Image Memory Management

```typescript
const ImageManager = {
  cache: new Map(),
  maxCacheSize: 50,

  addToCache(uri: string, image: any) {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest items
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(uri, image);
  },

  clearCache() {
    this.cache.clear();
  },

  getMemoryUsage() {
    return this.cache.size;
  }
};
```

### 3. Component Cleanup

```typescript
const MapScreen = () => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    return () => {
      // Cleanup map resources
      if (mapRef.current) {
        mapRef.current.destroy();
      }
      
      // Clear markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, []);

  return <MapView ref={mapRef} />;
};
```

## Bundle Size Optimization

### 1. Code Splitting

```typescript
// Use dynamic imports for heavy modules
const loadMapModule = async () => {
  const { MapView } = await import('react-native-maps');
  return MapView;
};

const MapScreen = () => {
  const [MapComponent, setMapComponent] = useState(null);

  useEffect(() => {
    loadMapModule().then(setMapComponent);
  }, []);

  if (!MapComponent) {
    return <LoadingScreen />;
  }

  return <MapComponent />;
};
```

### 2. Lazy Loading

```typescript
// Lazy load non-critical features
const LazyFeature = lazy(() => 
  import('../components/AdvancedFilters').then(module => ({
    default: module.AdvancedFilters
  }))
);

const SearchScreen = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <View>
      <BasicSearch />
      {showAdvanced && (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyFeature />
        </Suspense>
      )}
    </View>
  );
};
```

## Animation Performance

### 1. Native Driver

```typescript
import { Animated } from 'react-native';

const FadeInView = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};
```

### 2. Reanimated 3

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const AnimatedButton = ({ onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Text>Tap me</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
```

## Performance Monitoring

### 1. Performance Metrics

```typescript
class PerformanceMonitor {
  private metrics = new Map();

  startTimer(label: string) {
    this.metrics.set(label, performance.now());
  }

  endTimer(label: string) {
    const start = this.metrics.get(label);
    if (start) {
      const duration = performance.now() - start;
      console.log(`${label}: ${duration.toFixed(2)}ms`);
      this.metrics.delete(label);
      return duration;
    }
  }

  measureComponent(WrappedComponent: React.ComponentType) {
    return (props: any) => {
      useEffect(() => {
        const renderStart = performance.now();
        
        return () => {
          const renderTime = performance.now() - renderStart;
          if (renderTime > 16) { // Flag slow renders
            console.warn(`Slow render: ${WrappedComponent.name} took ${renderTime.toFixed(2)}ms`);
          }
        };
      });

      return <WrappedComponent {...props} />;
    };
  }
}
```

### 2. Memory Monitoring

```typescript
const useMemoryMonitor = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (global.performance?.memory) {
        const { usedJSHeapSize, totalJSHeapSize } = global.performance.memory;
        const usage = (usedJSHeapSize / totalJSHeapSize) * 100;
        
        if (usage > 80) {
          console.warn(`High memory usage: ${usage.toFixed(1)}%`);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);
};
```

### 3. Frame Rate Monitoring

```typescript
import { InteractionManager } from 'react-native';

const useFrameRateMonitor = () => {
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        if (fps < 55) {
          console.warn(`Low FPS: ${fps}`);
        }
      }

      requestAnimationFrame(measureFrameRate);
    };

    requestAnimationFrame(measureFrameRate);
  }, []);
};
```

## Development Tools

### 1. React DevTools Profiler

```bash
# Enable profiler in development
npx react-devtools
```

### 2. Flipper Performance Plugin

```javascript
// Enable performance monitoring in Flipper
import { logger } from 'flipper';

const performanceLogger = logger.createLogger('Performance');

const logPerformance = (component: string, duration: number) => {
  performanceLogger.info({
    component,
    duration,
    timestamp: Date.now(),
  });
};
```

### 3. Bundle Analyzer

```bash
# Analyze bundle size
npx react-native-bundle-visualizer

# Metro bundle analyzer
npx @react-native-community/cli doctor
```

## Performance Best Practices

### 1. General Guidelines
- Use FlatList for long lists
- Implement proper memoization
- Optimize images and assets
- Use native driver for animations
- Minimize bridge communication

### 2. Common Pitfalls
- Avoid inline functions in render
- Don't create objects in render
- Minimize state updates
- Use keys properly in lists
- Avoid deep nesting in styles

### 3. Testing Performance
- Use performance budgets
- Test on low-end devices
- Monitor real user metrics
- Profile regularly
- Load test API endpoints
# Frontend Architecture

## Overview

The StorageSpace frontend is built with React Native and Expo, providing a unified codebase for iOS, Android, and Web platforms. The architecture emphasizes code reusability, performance, and maintainability.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   ├── forms/           # Form-specific components
│   └── layout/          # Layout components
├── screens/             # App screens/pages
├── navigation/          # Navigation configuration
├── services/            # API and external services
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── utils/               # Helper functions
├── types/               # TypeScript definitions
├── constants/           # App constants
├── assets/              # Images, fonts, etc.
└── theme/               # Theme configuration
```

## Component Architecture

### Component Hierarchy

```
App.tsx
├── NavigationContainer
│   ├── AuthNavigator
│   │   ├── LoginScreen
│   │   ├── RegisterScreen
│   │   └── ForgotPasswordScreen
│   └── AppNavigator
│       ├── TabNavigator
│       │   ├── HomeScreen
│       │   ├── MapScreen
│       │   ├── BookingsScreen
│       │   └── ProfileScreen
│       └── StackNavigator
│           ├── LocationDetailsScreen
│           ├── BookingFlowScreen
│           └── BookingConfirmationScreen
```

### Component Design Principles

#### 1. Functional Components

All components use functional components with hooks:

```typescript
// components/LocationCard.tsx
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface LocationCardProps {
  location: Location;
  onPress: (location: Location) => void;
}

export const LocationCard = memo<LocationCardProps>(({ location, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(location)}>
      <View style={styles.container}>
        <Image source={{ uri: location.image }} style={styles.image} />
        <Text style={styles.name}>{location.name}</Text>
        <Text style={styles.price}>${location.price}/hour</Text>
      </View>
    </TouchableOpacity>
  );
});
```

#### 2. Composition Pattern

Components are composed of smaller, reusable parts:

```typescript
// screens/LocationDetailsScreen.tsx
export const LocationDetailsScreen = () => {
  return (
    <ScrollView>
      <LocationHeader location={location} />
      <LocationGallery images={location.images} />
      <LocationInfo location={location} />
      <LocationFeatures features={location.features} />
      <LocationReviews locationId={location.id} />
      <BookingButton location={location} />
    </ScrollView>
  );
};
```

#### 3. Container/Presentational Pattern

Separate business logic from UI:

```typescript
// containers/LocationListContainer.tsx
export const LocationListContainer = () => {
  const { locations, loading, error } = useLocations();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <LocationList locations={locations} />;
};

// components/LocationList.tsx
export const LocationList = ({ locations }: { locations: Location[] }) => {
  return (
    <FlatList
      data={locations}
      renderItem={({ item }) => <LocationCard location={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};
```

## State Management

### Local State

Component-level state using useState:

```typescript
const [selectedDate, setSelectedDate] = useState<Date>(new Date());
const [bagCount, setBagCount] = useState<number>(1);
```

### Global State

Context API for app-wide state:

```typescript
// context/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials);
    setUser(user);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### State Management Patterns

#### 1. Custom Hooks for Logic

```typescript
// hooks/useBooking.ts
export const useBooking = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const createBooking = async (data: BookingData) => {
    setLoading(true);
    try {
      const newBooking = await bookingService.create(data);
      setBooking(newBooking);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  return { booking, createBooking, loading, error };
};
```

#### 2. Reducer Pattern for Complex State

```typescript
// reducers/bookingReducer.ts
interface BookingState {
  location: Location | null;
  dateTime: Date | null;
  duration: number;
  bags: BagSelection[];
  paymentMethod: PaymentMethod | null;
}

type BookingAction =
  | { type: 'SET_LOCATION'; payload: Location }
  | { type: 'SET_DATE_TIME'; payload: Date }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'RESET' };

const bookingReducer = (state: BookingState, action: BookingAction) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};
```

## Navigation Architecture

### Navigation Structure

```typescript
// navigation/AppNavigator.tsx
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Bookings" component={BookingsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Main" component={TabNavigator} />
    <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} />
    <Stack.Screen name="BookingFlow" component={BookingFlowScreen} />
  </Stack.Navigator>
);
```

### Navigation Patterns

#### Deep Linking

```typescript
// navigation/linking.ts
export const linking = {
  prefixes: ['storagespace://', 'https://app.storagespace.com'],
  config: {
    screens: {
      Main: {
        screens: {
          Home: 'home',
          Map: 'map',
          Bookings: 'bookings',
        },
      },
      LocationDetails: 'location/:id',
      BookingConfirmation: 'booking/:id/confirmation',
    },
  },
};
```

## Data Flow

### API Integration

```typescript
// services/api.ts
class ApiService {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: Config.API_URL,
      timeout: 10000,
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor for auth
    this.client.interceptors.request.use(async (config) => {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }
}
```

### Data Caching

```typescript
// hooks/useLocations.ts
export const useLocations = (params?: LocationParams) => {
  const queryClient = useQueryClient();
  
  return useQuery(
    ['locations', params],
    () => locationService.getAll(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onError: (error) => {
        console.error('Failed to fetch locations:', error);
      },
    }
  );
};
```

## Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load heavy screens
const MapScreen = lazy(() => import('./screens/MapScreen'));

// Use Suspense for loading state
<Suspense fallback={<LoadingScreen />}>
  <MapScreen />
</Suspense>
```

### 2. Memoization

```typescript
// Memoize expensive computations
const sortedLocations = useMemo(() => {
  return locations.sort((a, b) => a.distance - b.distance);
}, [locations]);

// Memoize components
export const LocationCard = memo(({ location }) => {
  // Component implementation
});
```

### 3. List Optimization

```typescript
<FlatList
  data={locations}
  renderItem={renderLocation}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
/>
```

## Testing Strategy

### Unit Tests

```typescript
// components/__tests__/LocationCard.test.tsx
describe('LocationCard', () => {
  it('renders location information correctly', () => {
    const location = mockLocation();
    const { getByText } = render(<LocationCard location={location} />);
    
    expect(getByText(location.name)).toBeTruthy();
    expect(getByText(`$${location.price}/hour`)).toBeTruthy();
  });
});
```

### Integration Tests

```typescript
// screens/__tests__/BookingFlow.test.tsx
describe('BookingFlow', () => {
  it('completes booking successfully', async () => {
    const { getByText, getByTestId } = render(<BookingFlowScreen />);
    
    // Select date
    fireEvent.press(getByTestId('date-picker'));
    fireEvent.press(getByText('Tomorrow'));
    
    // Select time
    fireEvent.press(getByTestId('time-slot-10am'));
    
    // Confirm booking
    fireEvent.press(getByText('Confirm Booking'));
    
    await waitFor(() => {
      expect(getByText('Booking Confirmed!')).toBeTruthy();
    });
  });
});
```

## Accessibility

### Implementation

```typescript
<TouchableOpacity
  accessible
  accessibilityLabel={`Book ${location.name} for $${location.price} per hour`}
  accessibilityHint="Double tap to view location details"
  accessibilityRole="button"
>
  <LocationCard location={location} />
</TouchableOpacity>
```

## Platform-Specific Code

```typescript
// utils/platform.ts
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
});
```
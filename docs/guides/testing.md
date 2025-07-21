# Testing Guide

This guide covers the testing strategy, setup, and best practices for StorageSpace. We use a comprehensive testing approach including unit tests, integration tests, and end-to-end tests.

## Testing Philosophy

- **Test-Driven Development (TDD)**: Write tests before implementation
- **High Coverage**: Aim for 90%+ test coverage
- **Fast Feedback**: Tests should run quickly in development
- **Reliable**: Tests should be deterministic and stable
- **Maintainable**: Tests should be easy to understand and update

## Testing Stack

### Core Testing Tools
- **Jest**: JavaScript testing framework
- **React Native Testing Library**: Component testing utilities
- **Detox**: End-to-end testing for React Native
- **MSW (Mock Service Worker)**: API mocking
- **Flipper**: Debugging and testing assistance

### Additional Tools
- **Storybook**: Component development and testing
- **Maestro**: Mobile UI testing
- **Appium**: Cross-platform testing (fallback)
- **Artillery**: Load testing

## Project Structure

```
__tests__/
├── setup/              # Test setup and configuration
├── mocks/              # Mock data and services
├── utils/              # Testing utilities
└── fixtures/           # Test fixtures

src/
├── components/
│   └── __tests__/      # Component tests
├── screens/
│   └── __tests__/      # Screen tests
├── services/
│   └── __tests__/      # Service tests
├── utils/
│   └── __tests__/      # Utility tests
└── hooks/
    └── __tests__/      # Hook tests

e2e/
├── tests/              # End-to-end tests
├── helpers/            # E2E test helpers
└── config/             # E2E configuration
```

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup/jest.setup.js'
  ],
  testMatch: [
    '**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/**/*.styles.{js,ts}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@expo|expo-.*)/)',
  ],
};
```

### Test Setup

```javascript
// __tests__/setup/jest.setup.js
import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock React Native modules
jest.mock('react-native-maps', () => {
  const MockMapView = 'MapView';
  const MockMarker = 'Marker';
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
  };
});

// Mock Expo modules
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => 
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: { latitude: 40.7128, longitude: -74.0060 }
    })
  ),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

// Global test timeout
jest.setTimeout(10000);

// Console error handler
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

## Unit Testing

### Component Testing

```typescript
// src/components/__tests__/LocationCard.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LocationCard } from '../LocationCard';
import { mockLocation } from '@tests/mocks/location';

describe('LocationCard', () => {
  const defaultProps = {
    location: mockLocation(),
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders location information correctly', () => {
    const { getByText, getByTestId } = render(
      <LocationCard {...defaultProps} />
    );

    expect(getByText(defaultProps.location.name)).toBeTruthy();
    expect(getByText(`$${defaultProps.location.pricing.hourly}/hour`)).toBeTruthy();
    expect(getByTestId('location-rating')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const { getByTestId } = render(<LocationCard {...defaultProps} />);
    
    fireEvent.press(getByTestId('location-card'));
    
    expect(defaultProps.onPress).toHaveBeenCalledWith(defaultProps.location);
  });

  it('shows availability status', () => {
    const unavailableLocation = {
      ...mockLocation(),
      availability: { total: 10, available: 0 }
    };

    const { getByText } = render(
      <LocationCard {...defaultProps} location={unavailableLocation} />
    );

    expect(getByText('Unavailable')).toBeTruthy();
  });

  it('handles loading state', () => {
    const { getByTestId } = render(
      <LocationCard {...defaultProps} loading />
    );

    expect(getByTestId('location-card-skeleton')).toBeTruthy();
  });
});
```

### Hook Testing

```typescript
// src/hooks/__tests__/useLocation.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useLocation } from '../useLocation';
import * as Location from 'expo-location';

jest.mock('expo-location');

describe('useLocation', () => {
  const mockLocation = {
    coords: {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 5,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (Location.requestForegroundPermissionsAsync as jest.Mock)
      .mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock)
      .mockResolvedValue(mockLocation);
  });

  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useLocation());

    expect(result.current.location).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('gets current location successfully', async () => {
    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.getCurrentLocation();
    });

    expect(result.current.location).toEqual(mockLocation.coords);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles permission denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock)
      .mockResolvedValue({ status: 'denied' });

    const { result } = renderHook(() => useLocation());

    await act(async () => {
      await result.current.getCurrentLocation();
    });

    expect(result.current.location).toBeNull();
    expect(result.current.error).toBe('Location permission denied');
  });
});
```

### Service Testing

```typescript
// src/services/__tests__/locationService.test.ts
import { locationService } from '../locationService';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { mockLocation } from '@tests/mocks/location';

const server = setupServer(
  rest.get('/api/locations', (req, res, ctx) => {
    const lat = req.url.searchParams.get('lat');
    const lng = req.url.searchParams.get('lng');
    
    if (!lat || !lng) {
      return res(ctx.status(400), ctx.json({ error: 'Missing coordinates' }));
    }
    
    return res(
      ctx.json({
        locations: [mockLocation()],
        total: 1,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('locationService', () => {
  it('fetches locations successfully', async () => {
    const params = { lat: 40.7128, lng: -74.0060 };
    const result = await locationService.getAll(params);

    expect(result.locations).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('handles API errors', async () => {
    server.use(
      rest.get('/api/locations', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    await expect(
      locationService.getAll({ lat: 40.7128, lng: -74.0060 })
    ).rejects.toThrow('Server error');
  });

  it('validates required parameters', async () => {
    await expect(
      locationService.getAll({})
    ).rejects.toThrow('Missing coordinates');
  });
});
```

## Integration Testing

### Screen Testing

```typescript
// src/screens/__tests__/HomeScreen.test.tsx
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { TestProviders } from '@tests/utils/TestProviders';
import { mockLocation } from '@tests/mocks/location';
import { locationService } from '@/services/locationService';

jest.mock('@/services/locationService');

describe('HomeScreen', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (locationService.getAll as jest.Mock).mockResolvedValue({
      locations: [mockLocation()],
      total: 1,
    });
  });

  const renderScreen = () => {
    return render(
      <TestProviders navigation={{ navigate: mockNavigate }}>
        <HomeScreen />
      </TestProviders>
    );
  };

  it('loads and displays locations', async () => {
    const { getByText } = renderScreen();

    await waitFor(() => {
      expect(getByText('Nearby Storage')).toBeTruthy();
    });

    expect(locationService.getAll).toHaveBeenCalled();
  });

  it('navigates to location details', async () => {
    const { getByTestId } = renderScreen();

    await waitFor(() => {
      expect(getByTestId('location-card-0')).toBeTruthy();
    });

    fireEvent.press(getByTestId('location-card-0'));

    expect(mockNavigate).toHaveBeenCalledWith('LocationDetails', {
      locationId: mockLocation().id,
    });
  });

  it('handles search input', async () => {
    const { getByTestId } = renderScreen();

    const searchInput = getByTestId('search-input');
    fireEvent.changeText(searchInput, 'cafe');

    await waitFor(() => {
      expect(locationService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ query: 'cafe' })
      );
    });
  });
});
```

### Navigation Testing

```typescript
// src/navigation/__tests__/AppNavigator.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '../AppNavigator';
import { AuthProvider } from '@/context/AuthContext';

describe('AppNavigator', () => {
  const renderNavigator = (initialUser = null) => {
    return render(
      <AuthProvider value={{ user: initialUser }}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    );
  };

  it('shows auth screens when not logged in', () => {
    const { getByTestId } = renderNavigator();
    expect(getByTestId('auth-navigator')).toBeTruthy();
  });

  it('shows main app when logged in', () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    const { getByTestId } = renderNavigator(mockUser);
    expect(getByTestId('main-navigator')).toBeTruthy();
  });
});
```

## End-to-End Testing

### Detox Configuration

```javascript
// .detoxrc.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/StorageSpace.app',
      build: 'xcodebuild -workspace ios/StorageSpace.xcworkspace -scheme StorageSpace -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_30',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
};
```

### E2E Test Example

```typescript
// e2e/tests/booking-flow.e2e.ts
import { device, element, by, expect } from 'detox';

describe('Booking Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete a booking successfully', async () => {
    // Navigate to location
    await element(by.id('location-card-0')).tap();
    await expect(element(by.id('location-details-screen'))).toBeVisible();

    // Start booking
    await element(by.id('book-now-button')).tap();
    await expect(element(by.id('booking-flow-screen'))).toBeVisible();

    // Select date
    await element(by.id('date-picker')).tap();
    await element(by.text('Tomorrow')).tap();
    await element(by.id('confirm-date')).tap();

    // Select time
    await element(by.id('time-slot-10am')).tap();
    await element(by.id('next-button')).tap();

    // Select bags
    await element(by.id('large-bag-plus')).tap();
    await element(by.id('next-button')).tap();

    // Payment
    await element(by.id('payment-method-card')).tap();
    await element(by.id('confirm-booking')).tap();

    // Verify confirmation
    await waitFor(element(by.id('booking-confirmation')))
      .toBeVisible()
      .withTimeout(5000);
    
    await expect(element(by.text('Booking Confirmed!'))).toBeVisible();
  });

  it('should handle booking cancellation', async () => {
    // Go to bookings
    await element(by.id('bookings-tab')).tap();
    
    // Find active booking
    await element(by.id('active-booking-0')).tap();
    
    // Cancel booking
    await element(by.id('cancel-booking')).tap();
    await element(by.text('Yes, Cancel')).tap();
    
    // Verify cancellation
    await expect(element(by.text('Booking Cancelled'))).toBeVisible();
  });
});
```

## Visual Testing

### Storybook Setup

```typescript
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-controls',
    '@storybook/addon-react-native-server',
  ],
};
```

### Component Stories

```typescript
// src/components/LocationCard.stories.tsx
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { LocationCard } from './LocationCard';
import { mockLocation } from '@tests/mocks/location';

export default {
  title: 'Components/LocationCard',
  component: LocationCard,
  argTypes: {
    onPress: { action: 'pressed' },
  },
} as ComponentMeta<typeof LocationCard>;

const Template: ComponentStory<typeof LocationCard> = (args) => (
  <LocationCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  location: mockLocation(),
};

export const Unavailable = Template.bind({});
Unavailable.args = {
  location: {
    ...mockLocation(),
    availability: { total: 10, available: 0 },
  },
};

export const Loading = Template.bind({});
Loading.args = {
  location: mockLocation(),
  loading: true,
};

export const HighRating = Template.bind({});
HighRating.args = {
  location: {
    ...mockLocation(),
    rating: 4.9,
    reviews: 1234,
  },
};
```

## Performance Testing

### Load Testing with Artillery

```yaml
# load-test.yml
config:
  target: 'https://api.storagespace.app'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Authorization: 'Bearer {{ $processEnvironment.API_TOKEN }}'

scenarios:
  - name: "Search and book locations"
    weight: 70
    flow:
      - get:
          url: "/v1/locations?lat=40.7128&lng=-74.0060"
      - think: 2
      - post:
          url: "/v1/bookings"
          json:
            locationId: "{{ $randomString() }}"
            startDate: "2025-01-21T10:00:00Z"
            endDate: "2025-01-21T18:00:00Z"
            bags: [{ type: "large", count: 1 }]

  - name: "User authentication"
    weight: 30
    flow:
      - post:
          url: "/v1/auth/login"
          json:
            email: "test{{ $randomNumber(1, 1000) }}@example.com"
            password: "password123"
```

### React Native Performance Testing

```typescript
// src/utils/__tests__/performance.test.ts
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  it('renders LocationCard within performance budget', async () => {
    const start = performance.now();
    
    const { unmount } = render(<LocationCard location={mockLocation()} />);
    
    const renderTime = performance.now() - start;
    expect(renderTime).toBeLessThan(16); // 60fps budget
    
    unmount();
  });

  it('search debouncing works correctly', async () => {
    jest.useFakeTimers();
    const searchFn = jest.fn();
    const debouncedSearch = debounce(searchFn, 300);
    
    // Rapid calls
    debouncedSearch('a');
    debouncedSearch('ab');
    debouncedSearch('abc');
    
    expect(searchFn).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(300);
    
    expect(searchFn).toHaveBeenCalledTimes(1);
    expect(searchFn).toHaveBeenCalledWith('abc');
    
    jest.useRealTimers();
  });
});
```

## Test Data Management

### Mock Data Factory

```typescript
// __tests__/mocks/location.ts
import { faker } from '@faker-js/faker';
import { Location } from '@/types';

export const mockLocation = (overrides: Partial<Location> = {}): Location => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  type: faker.helpers.arrayElement(['hotel', 'cafe', 'shop', 'locker']),
  address: {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    country: 'USA',
  },
  coordinates: {
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  },
  pricing: {
    hourly: faker.number.int({ min: 2, max: 8 }),
    daily: faker.number.int({ min: 15, max: 40 }),
  },
  availability: {
    total: faker.number.int({ min: 10, max: 100 }),
    available: faker.number.int({ min: 0, max: 50 }),
  },
  rating: faker.number.float({ min: 3.0, max: 5.0, precision: 0.1 }),
  reviews: faker.number.int({ min: 10, max: 1000 }),
  features: faker.helpers.arrayElements([
    '24/7', 'security', 'insurance', 'climate_control'
  ]),
  operatingHours: {
    monday: { open: '06:00', close: '22:00' },
    tuesday: { open: '06:00', close: '22:00' },
    // ... other days
  },
  images: [faker.image.url()],
  ...overrides,
});
```

### Test Utilities

```typescript
// __tests__/utils/TestProviders.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

interface TestProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  navigation?: any;
  user?: any;
}

export const TestProviders: React.FC<TestProvidersProps> = ({
  children,
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
  navigation = { navigate: jest.fn() },
  user = null,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider value={{ user, login: jest.fn(), logout: jest.fn() }}>
        <ThemeProvider>
          <NavigationContainer>
            {children}
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
```

## Running Tests

### Development Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- LocationCard.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Update snapshots
npm test -- --updateSnapshot
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      
      - run: npm ci
      - run: brew tap wix/brew
      - run: brew install applesimutils
      - run: npx detox build --configuration ios.sim.debug
      - run: npx detox test --configuration ios.sim.debug
```

## Debugging Tests

### Jest Debugging

```bash
# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand LocationCard.test.tsx

# Debug with Chrome DevTools
npm run test:debug
```

### React Native Testing Library Debugging

```typescript
import { screen, debug } from '@testing-library/react-native';

// Debug rendered component tree
debug();

// Log specific elements
console.log(screen.getByTestId('location-card'));

// Use screen queries to understand structure
screen.logTestingPlaygroundURL();
```

## Best Practices

### 1. Test Organization
- Group related tests with `describe`
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Test Independence
- Each test should be independent
- Use `beforeEach` for common setup
- Clean up after tests

### 3. Mock Strategy
- Mock external dependencies
- Use real implementations for internal code
- Mock network requests

### 4. Assertion Quality
- Use specific assertions
- Test behavior, not implementation
- Include error cases

### 5. Performance
- Keep tests fast
- Use `screen` queries instead of `container`
- Avoid unnecessary async operations
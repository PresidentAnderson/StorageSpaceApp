# Development Workflow

This guide outlines the development workflow and best practices for contributing to StorageSpace.

## Branch Strategy

We follow a Git Flow-inspired branching strategy:

```
main
├── development
│   ├── feature/user-authentication
│   ├── feature/payment-integration
│   └── bugfix/map-loading-issue
└── staging
```

### Branch Types

- **main**: Production-ready code
- **development**: Integration branch for features
- **staging**: Pre-production testing
- **feature/***: New features
- **bugfix/***: Bug fixes
- **hotfix/***: Emergency production fixes

## Development Process

### 1. Starting a New Feature

```bash
# Update your local development branch
git checkout development
git pull origin development

# Create a new feature branch
git checkout -b feature/your-feature-name

# Install/update dependencies
npm install
```

### 2. Development Guidelines

#### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check code style
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format
```

#### TypeScript

Always use TypeScript with proper typing:

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // Implementation
};

// ❌ Bad
const getUser = async (id: any) => {
  // Implementation
};
```

#### Component Structure

Follow this structure for React Native components:

```typescript
// UserProfile.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { User } from '../types';

interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### 3. Testing

#### Unit Tests

Write tests for all new functionality:

```typescript
// UserProfile.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('renders user name', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByText('John Doe')).toBeTruthy();
  });
});
```

Run tests:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

#### Integration Tests

Test API integrations:

```typescript
// api.test.ts
import { getLocations } from './api';
import { mockServer } from '../test/server';

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

test('fetches locations successfully', async () => {
  const locations = await getLocations({ lat: 40.7128, lng: -74.0060 });
  expect(locations).toHaveLength(3);
  expect(locations[0]).toHaveProperty('name');
});
```

### 4. Debugging

#### React Native Debugger

1. Install React Native Debugger
2. Run the app and shake device
3. Select "Debug JS Remotely"

#### Console Logging

Use structured logging:

```typescript
import { logger } from '../utils/logger';

// Development logging
logger.debug('User data:', userData);
logger.info('API call successful');
logger.warn('Deprecated method used');
logger.error('Failed to load locations', error);
```

#### React DevTools

```bash
# Install React DevTools
npm install -g react-devtools

# Run DevTools
react-devtools
```

### 5. Performance Optimization

#### Memoization

```typescript
import React, { useMemo, useCallback } from 'react';

const ExpensiveComponent = ({ data, onSelect }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      calculated: expensiveCalculation(item),
    }));
  }, [data]);

  // Memoize callbacks
  const handleSelect = useCallback((item) => {
    onSelect(item.id);
  }, [onSelect]);

  return <List data={processedData} onSelect={handleSelect} />;
};
```

#### List Optimization

Use FlatList for long lists:

```typescript
<FlatList
  data={locations}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <LocationCard location={item} />}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

### 6. API Integration

#### Service Layer

Create service modules for API calls:

```typescript
// services/locations.ts
import { api } from './api';
import { Location } from '../types';

export const locationService = {
  async getAll(params?: LocationParams): Promise<Location[]> {
    const { data } = await api.get('/locations', { params });
    return data.locations;
  },

  async getById(id: string): Promise<Location> {
    const { data } = await api.get(`/locations/${id}`);
    return data;
  },

  async create(location: Partial<Location>): Promise<Location> {
    const { data } = await api.post('/locations', location);
    return data;
  },
};
```

#### Error Handling

Implement consistent error handling:

```typescript
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: any
  ) {
    super(message);
  }
}

// In API calls
try {
  const data = await locationService.getAll();
} catch (error) {
  if (error instanceof ApiError) {
    // Handle specific API errors
    showError(error.message);
  } else {
    // Handle network errors
    showError('Network error. Please try again.');
  }
}
```

## Code Review Process

### 1. Pre-Submission Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] TypeScript has no errors
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with base

### 2. Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No regressions found

## Screenshots
(if applicable)

## Checklist
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

### 3. Review Guidelines

Reviewers should check:
- Code quality and style
- Test coverage
- Performance impact
- Security considerations
- Accessibility
- Documentation

## Deployment Pipeline

### 1. Development → Staging

```bash
# Merge feature to development
git checkout development
git merge feature/your-feature
git push origin development
```

Automated actions:
- Run tests
- Build app
- Deploy to staging

### 2. Staging → Production

```bash
# Create release PR
git checkout -b release/v1.2.0
git merge development

# After testing and approval
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags
```

## Tools and Extensions

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript React code snippets
- React Native Tools
- GitLens
- Error Lens

### Useful Development Tools

- **Flipper**: React Native debugging platform
- **Reactotron**: Desktop app for inspecting React Native apps
- **Charles Proxy**: HTTP debugging proxy
- **Postman**: API testing tool

## Best Practices

1. **Keep PRs Small**: Aim for <400 lines changed
2. **Write Meaningful Commits**: Use conventional commits
3. **Document Complex Logic**: Add comments for non-obvious code
4. **Test Edge Cases**: Don't just test the happy path
5. **Monitor Performance**: Use React DevTools Profiler
6. **Handle Loading States**: Always show loading indicators
7. **Implement Error Boundaries**: Catch and handle errors gracefully
8. **Use Semantic Versioning**: Follow semver for releases
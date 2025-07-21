# Environment Setup

This guide covers the setup and configuration of different environments for StorageSpace development, testing, and production.

## Environment Overview

| Environment | Purpose | URL | Auto-Deploy |
|-------------|---------|-----|-------------|
| Development | Local development | localhost:3000 | Manual |
| Preview | PR previews | preview-{pr}.storagespace.app | Yes |
| Staging | Pre-production testing | staging.storagespace.app | Yes |
| Production | Live application | storagespace.app | Manual |

## Development Environment

### Local Setup

```bash
# Clone repository
git clone https://github.com/PresidentAnderson/storagespace.git
cd storagespace

# Install dependencies
npm install

# Setup environment
cp .env.example .env.development
```

### Environment Variables

```bash
# .env.development
NODE_ENV=development
API_URL=http://localhost:3001/v1
EXPO_PUBLIC_API_URL=http://localhost:3001/v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/storagespace_dev

# External Services (Development Keys)
GOOGLE_MAPS_API_KEY=your_dev_maps_key
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false
DEBUG_MODE=true

# Development Tools
EXPO_DEVTOOLS=true
REACTOTRON_ENABLED=true
```

### Database Setup

```bash
# Start PostgreSQL (using Docker)
docker run --name postgres-dev \
  -e POSTGRES_DB=storagespace_dev \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Run migrations
npm run db:migrate

# Seed development data
npm run db:seed
```

### Starting Development

```bash
# Start API server
npm run dev:api

# Start mobile app
npm run dev

# Start web version
npm run dev:web
```

## Preview Environment

### Automatic Preview Deployments

Preview environments are automatically created for pull requests:

```yaml
# .github/workflows/preview.yml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for preview
        run: |
          npm run build:preview
        env:
          PREVIEW_URL: https://preview-${{ github.event.number }}.storagespace.app
          API_URL: https://api-preview-${{ github.event.number }}.storagespace.app
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          alias-domains: preview-${{ github.event.number }}.storagespace.app
```

### Preview Configuration

```bash
# .env.preview
NODE_ENV=preview
API_URL=https://api-preview-{PR_NUMBER}.storagespace.app
EXPO_PUBLIC_API_URL=https://api-preview-{PR_NUMBER}.storagespace.app

# Use staging database for previews
DATABASE_URL=${{ secrets.STAGING_DATABASE_URL }}

# Enable analytics for preview testing
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
DEBUG_MODE=false

# Preview-specific features
PREVIEW_MODE=true
PREVIEW_BANNER=true
```

## Staging Environment

### Infrastructure

```yaml
# infrastructure/staging.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: storagespace-staging
  namespace: staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: storagespace-staging
  template:
    metadata:
      labels:
        app: storagespace-staging
    spec:
      containers:
      - name: app
        image: storagespace:staging-latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "staging"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: staging-secrets
              key: database-url
```

### Staging Configuration

```bash
# .env.staging
NODE_ENV=staging
API_URL=https://api-staging.storagespace.app
EXPO_PUBLIC_API_URL=https://api-staging.storagespace.app

# Staging database
DATABASE_URL=postgresql://user:pass@staging-db.amazonaws.com:5432/storagespace_staging

# External services (staging keys)
GOOGLE_MAPS_API_KEY=your_staging_maps_key
STRIPE_PUBLISHABLE_KEY=pk_test_staging_...
STRIPE_SECRET_KEY=sk_test_staging_...

# Enable monitoring
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
SENTRY_DSN=your_staging_sentry_dsn

# Staging-specific settings
RATE_LIMIT_MULTIPLIER=0.5
CACHE_TTL=300
LOG_LEVEL=debug
```

### Automated Staging Deployment

```bash
# Deploy to staging on merge to development
git checkout development
git pull origin development
npm run deploy:staging
```

## Production Environment

### Infrastructure

```yaml
# infrastructure/production.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: storagespace-production
  namespace: production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: storagespace-production
  template:
    metadata:
      labels:
        app: storagespace-production
    spec:
      containers:
      - name: app
        image: storagespace:production-latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Production Configuration

```bash
# .env.production (stored as secrets)
NODE_ENV=production
API_URL=https://api.storagespace.app
EXPO_PUBLIC_API_URL=https://api.storagespace.app

# Production database cluster
DATABASE_URL=postgresql://user:pass@prod-cluster.amazonaws.com:5432/storagespace_prod
DATABASE_REPLICA_URL=postgresql://user:pass@prod-replica.amazonaws.com:5432/storagespace_prod

# Production services
GOOGLE_MAPS_API_KEY=your_production_maps_key
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Monitoring and analytics
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
SENTRY_DSN=your_production_sentry_dsn
DATADOG_API_KEY=your_datadog_key

# Performance settings
RATE_LIMIT_MULTIPLIER=1.0
CACHE_TTL=3600
LOG_LEVEL=warn
ENABLE_METRICS=true
```

### Production Deployment

```bash
# Production deployment (manual approval required)
git checkout main
git pull origin main
npm run deploy:production

# Or via GitHub Actions
gh workflow run production-deploy.yml
```

## Environment Management

### Secret Management

```bash
# Using AWS Secrets Manager
aws secretsmanager create-secret \
  --name "storagespace/production/database" \
  --secret-string '{"username":"user","password":"secure_password"}'

# Using Kubernetes secrets
kubectl create secret generic app-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=stripe-key="sk_live_..." \
  --namespace production
```

### Environment Variables Validation

```typescript
// src/config/environment.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  API_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  GOOGLE_MAPS_API_KEY: z.string().min(1),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
```

### Configuration Management

```typescript
// src/config/index.ts
const config = {
  development: {
    api: {
      url: 'http://localhost:3001',
      timeout: 10000,
      retries: 3,
    },
    features: {
      analytics: false,
      crashReporting: false,
      devTools: true,
    },
  },
  staging: {
    api: {
      url: 'https://api-staging.storagespace.app',
      timeout: 5000,
      retries: 5,
    },
    features: {
      analytics: true,
      crashReporting: true,
      devTools: false,
    },
  },
  production: {
    api: {
      url: 'https://api.storagespace.app',
      timeout: 5000,
      retries: 5,
    },
    features: {
      analytics: true,
      crashReporting: true,
      devTools: false,
    },
  },
};

export default config[process.env.NODE_ENV || 'development'];
```

## Database Management

### Environment-Specific Databases

```bash
# Development
DATABASE_URL=postgresql://localhost:5432/storagespace_dev

# Staging
DATABASE_URL=postgresql://staging-db.amazonaws.com:5432/storagespace_staging

# Production (with read replicas)
DATABASE_URL=postgresql://prod-primary.amazonaws.com:5432/storagespace_prod
DATABASE_REPLICA_URL=postgresql://prod-replica.amazonaws.com:5432/storagespace_prod
```

### Migration Strategy

```bash
# Run migrations in order
npm run db:migrate:dev     # Development
npm run db:migrate:staging # Staging
npm run db:migrate:prod    # Production (with approval)
```

### Data Seeding

```typescript
// scripts/seed.ts
const seeds = {
  development: {
    users: 100,
    locations: 50,
    bookings: 200,
  },
  staging: {
    users: 1000,
    locations: 500,
    bookings: 2000,
  },
  production: {
    // No seeding in production
  },
};

export const seedDatabase = async (env: string) => {
  const seedConfig = seeds[env];
  if (!seedConfig) return;
  
  // Seed data based on environment
};
```

## Monitoring per Environment

### Development Monitoring

```typescript
// Basic console logging
const logger = {
  info: console.log,
  warn: console.warn,
  error: console.error,
};
```

### Staging Monitoring

```typescript
// Enhanced logging with Sentry
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: config.sentry.dsn,
  environment: 'staging',
  debug: true,
});
```

### Production Monitoring

```typescript
// Full monitoring stack
import * as Sentry from '@sentry/react-native';
import { DatadogRum } from '@datadog/mobile-react-native';

// Sentry for error tracking
Sentry.init({
  dsn: config.sentry.dsn,
  environment: 'production',
  tracesSampleRate: 0.1,
});

// Datadog for performance monitoring
DatadogRum.initialize({
  applicationId: config.datadog.applicationId,
  clientToken: config.datadog.clientToken,
  environment: 'production',
});
```

## Environment Promotion

### Promotion Flow

```
Development → Staging → Production
     ↓            ↓         ↓
  Feature      Integration  Release
   Testing       Testing    Testing
```

### Automated Promotion

```yaml
# .github/workflows/promote.yml
name: Environment Promotion

on:
  workflow_dispatch:
    inputs:
      from_env:
        description: 'Source environment'
        required: true
        type: choice
        options:
        - staging
        - production
      to_env:
        description: 'Target environment'
        required: true
        type: choice
        options:
        - staging
        - production

jobs:
  promote:
    runs-on: ubuntu-latest
    steps:
      - name: Validate promotion path
        run: |
          if [[ "${{ github.event.inputs.from_env }}" == "production" ]]; then
            echo "Cannot promote from production"
            exit 1
          fi
      
      - name: Deploy to target environment
        run: |
          npm run deploy:${{ github.event.inputs.to_env }}
```

## Troubleshooting

### Environment Issues

```bash
# Check environment variables
npm run env:check

# Validate configuration
npm run config:validate

# Test connectivity
npm run health:check

# View logs
npm run logs:staging
npm run logs:production
```

### Common Problems

1. **Missing Environment Variables**
   ```bash
   Error: GOOGLE_MAPS_API_KEY is required
   Solution: Check .env file and secrets
   ```

2. **Database Connection Issues**
   ```bash
   Error: Connection refused
   Solution: Check DATABASE_URL and network access
   ```

3. **API Key Mismatches**
   ```bash
   Error: Invalid API key for environment
   Solution: Verify correct keys for each environment
   ```

### Environment Health Checks

```typescript
// src/health/checks.ts
export const healthChecks = {
  database: async () => {
    try {
      await db.raw('SELECT 1');
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },
  
  external_apis: async () => {
    const checks = await Promise.allSettled([
      fetch('https://maps.googleapis.com/maps/api/js'),
      fetch('https://api.stripe.com/v1/ping'),
    ]);
    
    return checks.map(check => ({
      status: check.status === 'fulfilled' ? 'healthy' : 'unhealthy'
    }));
  },
};
```
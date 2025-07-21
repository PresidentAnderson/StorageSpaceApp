# Rate Limiting

StorageSpace implements rate limiting to ensure fair usage and maintain service quality for all users. This guide explains our rate limiting policies and how to handle them in your applications.

## Rate Limit Overview

### Standard Limits

| User Type | Requests per Hour | Requests per Minute | Burst Limit |
|-----------|-------------------|---------------------|-------------|
| Anonymous | 60 | 10 | 20 |
| Authenticated | 600 | 60 | 100 |
| Premium | 6000 | 600 | 1000 |
| Partner API | 60000 | 6000 | 10000 |

### Endpoint-Specific Limits

Some endpoints have additional restrictions:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/login` | 5 attempts | 15 minutes |
| `/auth/register` | 3 attempts | 1 hour |
| `/auth/reset-password` | 3 attempts | 1 hour |
| `/locations/search` | 30 requests | 1 minute |
| `/bookings` (POST) | 10 bookings | 1 hour |

## Rate Limit Headers

Every API response includes rate limit information in the headers:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 599
X-RateLimit-Reset: 1642608000
X-RateLimit-Window: 3600
X-RateLimit-Policy: authenticated-user
```

### Header Descriptions

- **X-RateLimit-Limit**: Maximum requests allowed in the current window
- **X-RateLimit-Remaining**: Number of requests remaining in the current window
- **X-RateLimit-Reset**: Unix timestamp when the rate limit resets
- **X-RateLimit-Window**: Rate limit window duration in seconds
- **X-RateLimit-Policy**: The rate limit policy applied

## Rate Limit Responses

### 429 Too Many Requests

When you exceed the rate limit, you'll receive a 429 status code:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "limit": 600,
      "window": 3600,
      "resetTime": "2025-01-20T11:00:00Z",
      "retryAfter": 1800
    }
  }
}
```

The response includes:
- Current rate limit details
- When the limit resets
- Suggested retry time in seconds

## Handling Rate Limits

### 1. Exponential Backoff

Implement exponential backoff when you receive a 429 response:

```javascript
async function makeRequestWithBackoff(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
        
        console.log(`Rate limited. Retrying after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
  }
}
```

### 2. Request Queuing

Queue requests to stay within rate limits:

```javascript
class RateLimitedQueue {
  constructor(requestsPerSecond = 10) {
    this.requestsPerSecond = requestsPerSecond;
    this.interval = 1000 / requestsPerSecond;
    this.queue = [];
    this.processing = false;
  }
  
  async add(requestFunction) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFunction, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const { requestFunction, resolve, reject } = this.queue.shift();
      
      try {
        const result = await requestFunction();
        resolve(result);
      } catch (error) {
        reject(error);
      }
      
      // Wait before processing next request
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.interval));
      }
    }
    
    this.processing = false;
  }
}

// Usage
const queue = new RateLimitedQueue(10); // 10 requests per second

const result = await queue.add(() => 
  fetch('/api/locations', { headers: { 'Authorization': `Bearer ${token}` } })
);
```

### 3. Monitoring Rate Limits

Track rate limit usage to optimize your requests:

```javascript
class RateLimitMonitor {
  constructor() {
    this.metrics = {
      remaining: null,
      limit: null,
      resetTime: null,
      requests: 0,
      rateLimited: 0
    };
  }
  
  updateFromHeaders(headers) {
    this.metrics.remaining = parseInt(headers.get('X-RateLimit-Remaining'));
    this.metrics.limit = parseInt(headers.get('X-RateLimit-Limit'));
    this.metrics.resetTime = parseInt(headers.get('X-RateLimit-Reset'));
    this.metrics.requests++;
  }
  
  onRateLimit() {
    this.metrics.rateLimited++;
    console.warn(`Rate limited! ${this.metrics.rateLimited} times`);
  }
  
  getUsagePercent() {
    if (!this.metrics.limit) return 0;
    return ((this.metrics.limit - this.metrics.remaining) / this.metrics.limit) * 100;
  }
  
  shouldSlowDown() {
    return this.getUsagePercent() > 80; // Slow down when 80% used
  }
}
```

## Best Practices

### 1. Cache Responses

Cache API responses to reduce requests:

```javascript
class APICache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl
    });
  }
}

const cache = new APICache();

async function getLocations(params) {
  const cacheKey = JSON.stringify(params);
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch('/api/locations?' + new URLSearchParams(params));
  const data = await response.json();
  
  cache.set(cacheKey, data);
  return data;
}
```

### 2. Batch Requests

Combine multiple operations into single requests when possible:

```javascript
// Instead of multiple individual requests
const locations = await Promise.all(
  locationIds.map(id => fetch(`/api/locations/${id}`))
);

// Use batch endpoint
const locations = await fetch('/api/locations/batch', {
  method: 'POST',
  body: JSON.stringify({ ids: locationIds })
});
```

### 3. Use Webhooks

Replace polling with webhooks for real-time updates:

```javascript
// Instead of polling every 30 seconds
setInterval(async () => {
  const bookings = await fetch('/api/bookings');
  // Process bookings
}, 30000);

// Set up webhooks for booking updates
app.post('/webhooks/bookings', (req, res) => {
  const event = req.body;
  if (event.type === 'booking.updated') {
    updateBookingInUI(event.data.booking);
  }
  res.status(200).send('OK');
});
```

### 4. Request Prioritization

Prioritize critical requests:

```javascript
class PriorityQueue {
  constructor() {
    this.queues = {
      high: [],
      normal: [],
      low: []
    };
  }
  
  add(request, priority = 'normal') {
    this.queues[priority].push(request);
  }
  
  getNext() {
    if (this.queues.high.length > 0) return this.queues.high.shift();
    if (this.queues.normal.length > 0) return this.queues.normal.shift();
    if (this.queues.low.length > 0) return this.queues.low.shift();
    return null;
  }
}
```

## Rate Limit Bypass

### Premium Plans

Upgrade to premium for higher rate limits:

- **Premium Individual**: 10x standard limits
- **Premium Business**: 100x standard limits
- **Enterprise**: Custom limits

### Partner API Access

For high-volume applications, apply for partner API access:

```bash
POST /partner/application
{
  "companyName": "Your Company",
  "expectedVolume": "1M requests/month",
  "useCase": "Travel booking platform integration",
  "contactEmail": "api@yourcompany.com"
}
```

## Debugging Rate Limits

### Check Rate Limit Status

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -I https://api.storagespace.app/v1/rate-limit/status
```

Response:
```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 234
X-RateLimit-Reset: 1642608000
X-RateLimit-Window: 3600
```

### Monitor Usage

```javascript
// Get detailed rate limit information
const rateLimitInfo = await fetch('/api/rate-limit/info', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const info = await rateLimitInfo.json();
console.log(info);
/*
{
  "current": {
    "requests": 366,
    "limit": 600,
    "remaining": 234,
    "resetTime": "2025-01-20T11:00:00Z"
  },
  "endpoints": {
    "/locations/search": {
      "requests": 45,
      "limit": 30,
      "nextReset": "2025-01-20T10:31:00Z"
    }
  }
}
*/
```

## Common Issues

### 1. Sudden Rate Limit Hits

**Cause**: Burst of requests or inefficient API usage
**Solution**: Implement request queuing and caching

### 2. Login Rate Limits

**Cause**: Too many failed login attempts
**Solution**: Implement CAPTCHA or account lockout

### 3. Search Rate Limits

**Cause**: Real-time search on every keystroke
**Solution**: Debounce search requests

```javascript
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

const debouncedSearch = debounce(async (query) => {
  const results = await fetch(`/api/locations/search?q=${query}`);
  // Update UI with results
}, 300);
```

## Rate Limit Monitoring

### Dashboard Metrics

Monitor your rate limit usage in the developer dashboard:

- Requests per hour/day
- Rate limit hit frequency
- Top rate-limited endpoints
- Usage patterns and trends

### Alerts

Set up alerts for:
- 80% rate limit usage
- Frequent rate limit violations
- Unusual traffic patterns

### Logging

Log rate limit information for debugging:

```javascript
fetch(url, options)
  .then(response => {
    // Log rate limit headers
    console.log('Rate Limit:', {
      remaining: response.headers.get('X-RateLimit-Remaining'),
      limit: response.headers.get('X-RateLimit-Limit'),
      reset: new Date(response.headers.get('X-RateLimit-Reset') * 1000)
    });
    
    return response;
  });
```
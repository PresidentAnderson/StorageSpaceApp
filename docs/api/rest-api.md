# REST API Reference

## Base URL

```
Production: https://api.storagespace.app/v1
Staging: https://staging-api.storagespace.app/v1
Development: http://localhost:3000/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here"
}
```

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Locations

#### GET /locations
Get all storage locations with optional filters.

**Query Parameters:**
- `lat` (float): Latitude for proximity search
- `lng` (float): Longitude for proximity search
- `radius` (int): Search radius in meters (default: 5000)
- `type` (string): Filter by location type (hotel, cafe, shop, locker, storage)
- `available` (boolean): Filter by availability

**Response:**
```json
{
  "locations": [
    {
      "id": "loc_123",
      "name": "Central Station Lockers",
      "type": "locker",
      "address": "123 Main St",
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "pricing": {
        "hourly": 2,
        "daily": 15
      },
      "availability": {
        "total": 50,
        "available": 23
      },
      "features": ["24/7", "security", "insurance"],
      "rating": 4.5,
      "reviews": 234
    }
  ],
  "total": 15
}
```

#### GET /locations/:id
Get detailed information about a specific location.

**Response:**
```json
{
  "id": "loc_123",
  "name": "Central Station Lockers",
  "description": "Secure luggage storage in the heart of the city",
  "type": "locker",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "coordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "pricing": {
    "hourly": 2,
    "daily": 15,
    "weekly": 80
  },
  "operatingHours": {
    "monday": { "open": "06:00", "close": "23:00" },
    "tuesday": { "open": "06:00", "close": "23:00" }
  },
  "features": ["24/7", "security", "insurance", "climate_control"],
  "images": [
    "https://storage.app/images/loc_123_1.jpg"
  ],
  "policies": {
    "maxBagSize": "32 inches",
    "prohibitedItems": ["weapons", "perishables"],
    "cancellationPolicy": "Free cancellation up to 1 hour before"
  }
}
```

### Bookings

#### POST /bookings
Create a new booking.

**Request Body:**
```json
{
  "locationId": "loc_123",
  "startDate": "2025-01-20T10:00:00Z",
  "endDate": "2025-01-20T18:00:00Z",
  "bags": [
    {
      "type": "small",
      "count": 2
    },
    {
      "type": "large",
      "count": 1
    }
  ],
  "specialInstructions": "Will arrive around 10:15 AM",
  "paymentMethodId": "pm_123"
}
```

**Response:**
```json
{
  "booking": {
    "id": "book_456",
    "confirmationCode": "STOR-2025-ABCD",
    "qrCode": "data:image/png;base64,...",
    "status": "confirmed",
    "location": {
      "id": "loc_123",
      "name": "Central Station Lockers",
      "address": "123 Main St"
    },
    "timeline": {
      "created": "2025-01-19T15:30:00Z",
      "start": "2025-01-20T10:00:00Z",
      "end": "2025-01-20T18:00:00Z"
    },
    "pricing": {
      "subtotal": 16,
      "serviceFee": 2,
      "tax": 1.44,
      "total": 19.44
    }
  }
}
```

#### GET /bookings
Get user's bookings.

**Query Parameters:**
- `status` (string): Filter by status (active, upcoming, completed, cancelled)
- `limit` (int): Number of results (default: 20)
- `offset` (int): Pagination offset

#### GET /bookings/:id
Get specific booking details.

#### PUT /bookings/:id/extend
Extend an active booking.

**Request Body:**
```json
{
  "newEndDate": "2025-01-20T20:00:00Z"
}
```

#### POST /bookings/:id/cancel
Cancel a booking.

### User Profile

#### GET /users/profile
Get current user's profile.

#### PUT /users/profile
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567891"
  }
}
```

### Payments

#### GET /payment-methods
Get user's saved payment methods.

#### POST /payment-methods
Add a new payment method.

#### DELETE /payment-methods/:id
Remove a payment method.

### Reviews

#### POST /locations/:id/reviews
Submit a review for a location.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great service, very convenient!",
  "bookingId": "book_456"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request body is invalid",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Invalid or missing authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `INVALID_REQUEST` - Request validation failed
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Internal server error

## Rate Limiting

- Anonymous requests: 60 per hour
- Authenticated requests: 600 per hour
- Search endpoints: 30 per minute

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets
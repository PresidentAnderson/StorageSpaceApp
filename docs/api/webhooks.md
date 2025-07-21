# Webhooks

StorageSpace uses webhooks to notify your application when events happen in real-time. This allows you to build integrations that respond immediately to booking changes, payment updates, and other important events.

## Overview

Webhooks are HTTP POST requests sent to a URL you specify. When an event occurs (like a booking confirmation), StorageSpace sends a JSON payload to your webhook endpoint.

## Setting Up Webhooks

### 1. Configure Webhook URL

```bash
POST /webhooks
Authorization: Bearer <token>

{
  "url": "https://yourapp.com/webhooks/storagespace",
  "events": ["booking.created", "booking.confirmed", "payment.completed"],
  "secret": "your_webhook_secret"
}
```

### 2. Verify Webhook Signature

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express.js example
app.post('/webhooks/storagespace', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-storagespace-signature'];
  const payload = req.body;
  
  if (!verifyWebhookSignature(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = JSON.parse(payload);
  handleWebhookEvent(event);
  
  res.status(200).send('OK');
});
```

## Event Types

### Booking Events

#### booking.created
Triggered when a new booking is created.

```json
{
  "id": "evt_1234567890",
  "type": "booking.created",
  "created": "2025-01-20T10:30:00Z",
  "data": {
    "booking": {
      "id": "book_456",
      "userId": "user_123",
      "locationId": "loc_789",
      "status": "pending",
      "startDate": "2025-01-21T09:00:00Z",
      "endDate": "2025-01-21T17:00:00Z",
      "bags": [
        {
          "type": "large",
          "count": 2
        }
      ],
      "pricing": {
        "subtotal": 24.00,
        "serviceFee": 3.60,
        "total": 27.60
      }
    }
  }
}
```

#### booking.confirmed
Triggered when a booking is confirmed by the storage location.

```json
{
  "id": "evt_1234567891",
  "type": "booking.confirmed",
  "created": "2025-01-20T10:35:00Z",
  "data": {
    "booking": {
      "id": "book_456",
      "status": "confirmed",
      "confirmationCode": "STOR-2025-ABCD",
      "qrCode": "data:image/png;base64,..."
    }
  }
}
```

#### booking.checked_in
Triggered when customer checks in their bags.

```json
{
  "id": "evt_1234567892",
  "type": "booking.checked_in",
  "created": "2025-01-21T09:15:00Z",
  "data": {
    "booking": {
      "id": "book_456",
      "status": "active",
      "checkedInAt": "2025-01-21T09:15:00Z",
      "checkedInBy": "partner_staff_001"
    }
  }
}
```

#### booking.checked_out
Triggered when customer picks up their bags.

```json
{
  "id": "evt_1234567893",
  "type": "booking.checked_out",
  "created": "2025-01-21T17:30:00Z",
  "data": {
    "booking": {
      "id": "book_456",
      "status": "completed",
      "checkedOutAt": "2025-01-21T17:30:00Z",
      "checkedOutBy": "partner_staff_002"
    }
  }
}
```

#### booking.extended
Triggered when a booking is extended.

```json
{
  "id": "evt_1234567894",
  "type": "booking.extended",
  "created": "2025-01-21T15:00:00Z",
  "data": {
    "booking": {
      "id": "book_456",
      "originalEndDate": "2025-01-21T17:00:00Z",
      "newEndDate": "2025-01-21T20:00:00Z",
      "additionalCost": 9.00
    }
  }
}
```

#### booking.cancelled
Triggered when a booking is cancelled.

```json
{
  "id": "evt_1234567895",
  "type": "booking.cancelled",
  "created": "2025-01-20T11:00:00Z",
  "data": {
    "booking": {
      "id": "book_456",
      "status": "cancelled",
      "cancelledAt": "2025-01-20T11:00:00Z",
      "cancelledBy": "user",
      "reason": "change_of_plans",
      "refundAmount": 27.60
    }
  }
}
```

### Payment Events

#### payment.completed
Triggered when a payment is successfully processed.

```json
{
  "id": "evt_1234567896",
  "type": "payment.completed",
  "created": "2025-01-20T10:30:30Z",
  "data": {
    "payment": {
      "id": "pay_789",
      "bookingId": "book_456",
      "amount": 27.60,
      "currency": "USD",
      "method": "card",
      "status": "completed",
      "transactionId": "txn_abc123"
    }
  }
}
```

#### payment.failed
Triggered when a payment fails.

```json
{
  "id": "evt_1234567897",
  "type": "payment.failed",
  "created": "2025-01-20T10:29:45Z",
  "data": {
    "payment": {
      "id": "pay_789",
      "bookingId": "book_456",
      "amount": 27.60,
      "currency": "USD",
      "method": "card",
      "status": "failed",
      "errorCode": "card_declined",
      "errorMessage": "Your card was declined."
    }
  }
}
```

#### payment.refunded
Triggered when a refund is processed.

```json
{
  "id": "evt_1234567898",
  "type": "payment.refunded",
  "created": "2025-01-20T11:05:00Z",
  "data": {
    "refund": {
      "id": "ref_101",
      "paymentId": "pay_789",
      "bookingId": "book_456",
      "amount": 27.60,
      "currency": "USD",
      "status": "completed",
      "reason": "booking_cancelled"
    }
  }
}
```

### User Events

#### user.created
Triggered when a new user registers.

```json
{
  "id": "evt_1234567899",
  "type": "user.created",
  "created": "2025-01-20T09:00:00Z",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "registrationMethod": "email"
    }
  }
}
```

#### user.verified
Triggered when a user verifies their email address.

```json
{
  "id": "evt_1234567900",
  "type": "user.verified",
  "created": "2025-01-20T09:15:00Z",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "verifiedAt": "2025-01-20T09:15:00Z"
    }
  }
}
```

### Location Events

#### location.availability_changed
Triggered when location availability changes.

```json
{
  "id": "evt_1234567901",
  "type": "location.availability_changed",
  "created": "2025-01-20T14:00:00Z",
  "data": {
    "location": {
      "id": "loc_789",
      "name": "Central Station Lockers",
      "availability": {
        "total": 50,
        "available": 15,
        "occupied": 35
      }
    }
  }
}
```

## Webhook Best Practices

### 1. Idempotency

Handle duplicate events gracefully:

```javascript
const processedEvents = new Set();

function handleWebhookEvent(event) {
  if (processedEvents.has(event.id)) {
    console.log(`Event ${event.id} already processed`);
    return;
  }
  
  // Process event
  processEvent(event);
  
  // Mark as processed
  processedEvents.add(event.id);
}
```

### 2. Retry Logic

Implement exponential backoff for failed webhook deliveries:

```javascript
async function processWebhook(event, attempt = 1) {
  const maxAttempts = 3;
  
  try {
    await handleEvent(event);
  } catch (error) {
    if (attempt < maxAttempts) {
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      setTimeout(() => processWebhook(event, attempt + 1), delay);
    } else {
      console.error(`Failed to process webhook after ${maxAttempts} attempts`);
    }
  }
}
```

### 3. Event Ordering

Events may arrive out of order. Use timestamps to determine sequence:

```javascript
function handleBookingEvents(event) {
  const { booking } = event.data;
  const existingBooking = getBooking(booking.id);
  
  // Only process if event is newer
  if (!existingBooking || new Date(event.created) > new Date(existingBooking.lastUpdated)) {
    updateBooking(booking);
  }
}
```

### 4. Error Handling

Return appropriate HTTP status codes:

```javascript
app.post('/webhooks', (req, res) => {
  try {
    const event = req.body;
    
    // Validate event
    if (!isValidEvent(event)) {
      return res.status(400).send('Invalid event');
    }
    
    // Process event
    processEvent(event);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal server error');
  }
});
```

## Testing Webhooks

### 1. Using ngrok for Local Development

```bash
# Install ngrok
npm install -g ngrok

# Expose local port
ngrok http 3000

# Use the ngrok URL for webhook endpoint
# https://abc123.ngrok.io/webhooks
```

### 2. Webhook Testing Tool

```javascript
// Simple webhook testing server
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhooks/test', (req, res) => {
  console.log('Received webhook:');
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).send('OK');
});

app.listen(3000, () => {
  console.log('Webhook test server listening on port 3000');
});
```

## Webhook Security

### 1. Verify Request Source

Check the webhook signature to ensure requests come from StorageSpace:

```javascript
const verifySignature = (payload, signature, secret) => {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return signature === expected;
};
```

### 2. Use HTTPS

Always use HTTPS for webhook endpoints to ensure data integrity.

### 3. Validate Event Structure

```javascript
const eventSchema = {
  id: 'string',
  type: 'string',
  created: 'string',
  data: 'object'
};

function validateEvent(event) {
  return Object.keys(eventSchema).every(key => 
    typeof event[key] === eventSchema[key]
  );
}
```

## Rate Limits

- Maximum 1000 webhook deliveries per minute per endpoint
- Failed deliveries are retried up to 3 times with exponential backoff
- Endpoints consistently failing may be temporarily disabled

## Monitoring

Monitor webhook delivery success in your StorageSpace dashboard:

- Delivery attempts and success rates
- Response times
- Error rates and common failure reasons
- Event volume over time
# Response Types

## SendMailResponse

The main response type returned when sending an email.

```typescript
type SendMailResponse = {
  success: boolean;
  code: number;
  error?: Error;
  message?: string;
  payload?: any;
}
```

### Properties

- `success`: Boolean indicating if the email was sent successfully
- `code`: HTTP status code or provider-specific response code
- `error`: Error object if the request failed (optional)
- `message`: Human-readable response message (optional)
- `payload`: Raw provider response data (optional)

### Success Response Example

```typescript
{
  success: true,
  code: 200,
  message: 'Email sent successfully',
  payload: {
    providerId: 'msg_123456',
    timestamp: '2024-03-21T10:30:00Z'
  }
}
```

### Error Response Example

```typescript
{
  success: false,
  code: 400,
  error: new Error('Invalid recipient email address'),
  message: 'Failed to send email: Invalid recipient email address',
  payload: {
    errorCode: 'INVALID_EMAIL',
    details: {
      field: 'to.email',
      value: 'invalid-email'
    }
  }
}
```

## Common Response Codes

### Success Codes

- `200`: Email sent successfully
- `201`: Email queued for delivery
- `202`: Email accepted for delivery

### Error Codes

- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid API key)
- `403`: Forbidden (insufficient permissions)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error (provider error)

## Provider-Specific Responses

Each email provider may include additional information in the `payload` field. Here are some examples:

### SendGrid

```typescript
{
  success: true,
  code: 202,
  message: 'Email queued',
  payload: {
    messageId: 'sg_123456',
    remainingCredits: 9950
  }
}
```

### Mailchimp

```typescript
{
  success: true,
  code: 200,
  message: 'Email sent',
  payload: {
    _id: 'mc_123456',
    status: 'sent',
    email: 'recipient@example.com'
  }
}
```

### Mailjet

```typescript
{
  success: true,
  code: 200,
  message: 'Email processed',
  payload: {
    messageId: 'mj_123456',
    sent: [
      {
        email: 'recipient@example.com',
        messageId: 'mj_123456_1'
      }
    ]
  }
}
```

## Error Handling

Example of handling different response types:

```typescript
try {
  const response = await unmail.sendMail({
    from: { email: 'sender@example.com' },
    to: [{ email: 'recipient@example.com' }],
    subject: 'Test',
    text: 'Hello'
  });

  if (response.success) {
    console.log('Email sent:', response.message);
    console.log('Provider ID:', response.payload.messageId);
  } else {
    console.error('Failed:', response.message);
    console.error('Error details:', response.payload);
  }
} catch (error) {
  console.error('Exception:', error.message);
}
```

## Next Steps

- [Core API](./core.md) - Main API documentation
- [Types Reference](./types.md) - Type definitions
- [Drivers Overview](/drivers/overview) - Email provider implementations

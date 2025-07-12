# Core API Reference

## Unmail Class

The main class for sending emails through any provider.

### Constructor

```typescript
private constructor(driver: UnmailDriver)
```

The constructor is private. Use the `createUnmail` factory function to create instances.

### Factory Function

```typescript
static async make(driver: UnmailDriver): Promise<Unmail>
```

Creates a new Unmail instance with the specified driver.

### Methods

#### sendMail

```typescript
async sendMail(options: SendMailOptions): Promise<SendMailResponse>
```

Sends an email using the configured driver.

##### Parameters

- `options`: [SendMailOptions](/api/types#sendmailoptions) - Email configuration options

##### Returns

- [SendMailResponse](/api/types#sendmailresponse) - The response from the email provider

##### Example

```typescript
const response = await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  subject: 'Test Email',
  text: 'Hello World'
});

if (response.success) {
  console.log('Email sent successfully');
} else {
  console.error('Failed to send email:', response.error);
}
```

## createUnmail

```typescript
async function createUnmail(driver: UnmailDriver): Promise<Unmail>
```

A convenience function to create a new Unmail instance. This is the recommended way to create Unmail instances.

### Parameters

- `driver`: [UnmailDriver](/api/types#unmaildriver) - The email provider driver to use

### Returns

- `Promise<Unmail>` - A new Unmail instance

### Example

```typescript
import { createUnmail, SendGridDriver } from 'unmail';

const unmail = await createUnmail(
  new SendGridDriver('YOUR_API_KEY')
);
```

## Error Handling

The Unmail class uses a standardized error handling approach:

- All errors are wrapped in a consistent format
- Provider-specific errors are normalized
- Detailed error messages are provided
- HTTP status codes are included when applicable

Example error handling:

```typescript
try {
  await unmail.sendMail({
    from: { email: 'sender@example.com' },
    to: [{ email: 'invalid-email' }], // Invalid email
    subject: 'Test',
    text: 'Hello'
  });
} catch (error) {
  console.log('Error code:', error.code);
  console.log('Error message:', error.message);
  console.log('Provider response:', error.payload);
}
```

## Next Steps

- [Types Reference](./types.md) - Detailed type definitions
- [Response Types](./responses.md) - API response formats
- [Drivers Overview](/drivers/overview) - Email provider implementations

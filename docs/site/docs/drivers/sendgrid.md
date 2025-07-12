# SendGrid Driver

The SendGrid driver provides integration with SendGrid's email service, offering reliable delivery and advanced features for transactional emails.

## Installation

```bash
# Install Unmail and SendGrid dependency
npm install unmail @sendgrid/mail
```

## Setup

```typescript
import { createUnmail, SendGridDriver } from 'unmail';

const driver = new SendGridDriver('YOUR_SENDGRID_API_KEY');
const unmail = await createUnmail(driver);
```

## Basic Usage

### Send a Simple Email

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com', name: 'Sender Name' },
  to: [{ email: 'recipient@example.com', name: 'Recipient Name' }],
  subject: 'Hello from SendGrid',
  text: 'This is a test email',
  html: '<h1>This is a test email</h1>'
});
```

### Using Templates

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  templateId: 'd-123456789',
  templateData: [{
    email: 'recipient@example.com',
    data: {
      name: 'John',
      resetLink: 'https://example.com/reset'
    }
  }]
});
```

### With Attachments

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  subject: 'Document Attached',
  text: 'Please find the attached document',
  attachments: [{
    filename: 'document.pdf',
    content: Buffer.from('...'),
    contentType: 'application/pdf',
    disposition: 'attachment'
  }]
});
```

## SendGrid-Specific Features

### Categories

SendGrid categories can be added using tags:

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  subject: 'Categorized Email',
  text: 'This email has categories',
  tags: [
    { name: 'category', value: 'welcome' },
    { name: 'user_type', value: 'new' }
  ]
});
```

### Custom Headers

Add SendGrid-specific headers:

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  subject: 'Email with Custom Headers',
  text: 'This email has custom headers',
  headers: {
    'x-sg-custom-header': 'custom-value',
    'x-sg-campaign-id': 'campaign_123'
  }
});
```

## Response Handling

SendGrid-specific response format:

```typescript
try {
  const response = await unmail.sendMail({
    from: { email: 'sender@example.com' },
    to: [{ email: 'recipient@example.com' }],
    subject: 'Test Email',
    text: 'Hello'
  });

  if (response.success) {
    console.log('SendGrid message ID:', response.payload.messageId);
  }
} catch (error) {
  console.error('SendGrid error:', error.message);
  // SendGrid-specific error handling
  if (error.code === 401) {
    console.error('Invalid API key');
  }
}
```

## Best Practices

1. **API Key Security**
   - Store your SendGrid API key in environment variables
   - Use restricted API keys with minimum required permissions

2. **Template Management**
   - Use SendGrid's dynamic templates for consistent emails
   - Test templates in SendGrid's UI before using in code

3. **Error Handling**
   - Implement proper error handling for rate limits
   - Monitor bounces and spam reports

4. **Performance**
   - Use batch sending for multiple recipients
   - Implement proper retry logic for failed sends

## Common Issues

### Rate Limiting

SendGrid has rate limits based on your plan:

```typescript
try {
  await unmail.sendMail(options);
} catch (error) {
  if (error.code === 429) {
    // Implement retry logic
    console.log('Rate limit exceeded');
  }
}
```

### Invalid Sender

SendGrid requires sender verification:

```typescript
// Ensure sender is verified in SendGrid
await unmail.sendMail({
  from: { email: 'verified@yourdomain.com' },
  // ... other options
});
```

## Next Steps

- [Mailchimp Driver](./mailchimp.md)
- [Mailjet Driver](./mailjet.md)
- [Core API](/api/core)
- [SendGrid API Documentation](https://docs.sendgrid.com)

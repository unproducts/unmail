# Quick Start

## Basic Setup

```typescript
import { createUnmail, SendGridDriver } from 'unmail';

const unmail = await createUnmail(
  new SendGridDriver('YOUR_API_KEY')
);
```

## Sending a Simple Email

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com', name: 'Sender Name' },
  to: [{ email: 'recipient@example.com', name: 'Recipient Name' }],
  subject: 'Hello from Unmail',
  text: 'This is a plain text email',
  html: '<h1>This is an HTML email</h1>'
});
```

## Using CC and BCC

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  cc: [{ email: 'cc@example.com' }],
  bcc: [{ email: 'bcc@example.com' }],
  subject: 'Email with CC and BCC',
  text: 'This email has CC and BCC recipients'
});
```

## Adding Attachments

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  subject: 'Email with Attachment',
  text: 'Please find the attached file',
  attachments: [{
    filename: 'document.pdf',
    content: Buffer.from('...'),
    contentType: 'application/pdf',
    disposition: 'attachment'
  }]
});
```

## Using Templates

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  templateId: 'template_123',
  templateData: [{
    email: 'recipient@example.com',
    data: {
      name: 'John Doe',
      product: 'Awesome Product'
    }
  }]
});
```

## Adding Custom Headers

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  subject: 'Email with Custom Headers',
  text: 'This email has custom headers',
  headers: {
    'X-Custom-Header': 'Custom Value',
    'X-Campaign-ID': 'campaign_123'
  }
});
```

## Using Tags

```typescript
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  subject: 'Tagged Email',
  text: 'This email has tags',
  tags: [
    { name: 'category', value: 'marketing' },
    { name: 'priority', value: 'high' }
  ]
});
```

## Error Handling

```typescript
try {
  await unmail.sendMail({
    from: { email: 'sender@example.com' },
    to: [{ email: 'recipient@example.com' }],
    subject: 'Test Email',
    text: 'Hello World'
  });
} catch (error) {
  console.error('Failed to send email:', error.message);
}
```

## Testing with Mock Driver

```typescript
import { createUnmail, MockerDriver } from 'unmail';

const mockDriver = new MockerDriver();
const unmail = await createUnmail(mockDriver);

// Send test email - no actual email will be sent
await unmail.sendMail({
  from: { email: 'test@example.com' },
  to: [{ email: 'recipient@example.com' }],
  subject: 'Test Email',
  text: 'This is a test'
});
```

## Next Steps

- [API Reference](/api/core) - Explore the complete API
- [Drivers](/drivers/overview) - Learn about specific provider implementations

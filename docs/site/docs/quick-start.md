# Quick Start

Unmail is an extensible, type-safe library for sending emails through multiple providers with a single interface.

## Installation

```bash
npm install @unproducts/unmail
```

## Basic Setup
Configure Unmail with your preferred email service provider in just a few lines of code.

```typescript
import { createUnmail, SendGridDriver } from 'unmail';

const unmail = await createUnmail(
  new SendGridDriver('YOUR_API_KEY')
);
```

## Sending a Simple Email
Start with a basic email - includes both plain text and HTML versions for maximum compatibility.

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
Add carbon copy (CC) and blind carbon copy (BCC) recipients to your emails.

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
Include files, documents, and images with your emails using the attachments feature.

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
Leverage email templates with dynamic data for consistent, personalized communications.

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
Customize email headers for advanced functionality and tracking capabilities.

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
Add metadata tags to your emails for better organization and analytics.

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
Implement robust error handling to manage email sending failures gracefully.

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
Use the built-in mock driver for development and testing without sending real emails.

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

- [Extending Unmail](/docs/extending-unmail) - Learn how to create your own drivers
- [Drivers](/docs/drivers) - Learn about specific provider implementations

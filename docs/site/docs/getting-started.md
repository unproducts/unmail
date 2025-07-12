# Getting Started

Unmail is a unified email service provider library for Node.js that lets you send emails through multiple providers using a single interface.

## Quick Setup

```bash
npm install unmail
```

## Basic Usage

```typescript
import { createUnmail, SendGridDriver } from 'unmail';

// Initialize with your preferred provider
const unmail = await createUnmail(new SendGridDriver('YOUR_API_KEY'));

// Send an email
await unmail.sendMail({
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  subject: 'Hello',
  text: 'This is a test email'
});
```

## Supported Providers

- SendGrid
- Mailchimp
- Mailjet
- MailerSend
- Resend
- Postmark
- Mocker (for testing)

## Key Features

- 📧 Single API for all email providers
- 🔒 Type-safe with TypeScript
- 📎 Attachments, templates, CC/BCC support
- 🧪 Built-in test driver
- 🚀 Easy provider switching

## Next Steps

- [Installation](./installation.md) - Detailed setup guide
- [Quick Start](./quick-start.md) - Complete usage examples
- [API Reference](/api/core) - Full API documentation

# Email Provider Drivers

Unmail supports multiple email service providers through its driver system. Each driver implements a common interface while handling provider-specific requirements and features.

## Available Drivers

### SendGrid
- Industry standard for transactional emails
- Excellent deliverability rates
- Rich template system
- [Learn more](./sendgrid.md)

### Mailchimp
- Powerful marketing automation
- Template management
- Analytics and tracking
- [Learn more](./mailchimp.md)

### Mailjet
- European email service provider
- GDPR compliant
- Advanced analytics
- [Learn more](./mailjet.md)

### MailerSend
- Modern email API
- Built-in template editor
- SMS capabilities
- [Learn more](./mailersend.md)

### Resend
- Developer-first email service
- Simple API
- React email support
- [Learn more](./resend.md)

### Postmark
- Focused on transactional email
- High deliverability
- Detailed bounce handling
- [Learn more](./postmark.md)

### Mocker (Testing)
- Mock driver for testing
- No actual emails sent
- Response simulation
- [Learn more](./mocker.md)

## Driver Interface

All drivers implement the `UnmailDriver` interface:

```typescript
interface UnmailDriver {
  sendMail(options: SendMailOptions): Promise<SendMailResponse>;
}
```

## Common Setup Pattern

Most drivers follow a similar initialization pattern:

```typescript
import { createUnmail, SendGridDriver } from 'unmail';

// Initialize the driver
const driver = new SendGridDriver('YOUR_API_KEY');

// Create Unmail instance
const unmail = await createUnmail(driver);
```

## Driver Selection Guide

Choose your driver based on your needs:

### Development/Testing
- **Mocker**: Perfect for development and testing

### Transactional Emails
- **SendGrid**: Large-scale, reliable delivery
- **Postmark**: High deliverability focus
- **Mailjet**: European infrastructure

### Marketing Emails
- **Mailchimp**: Marketing automation
- **MailerSend**: Combined transactional & marketing
- **Resend**: Modern developer experience

## Feature Comparison

| Feature | SendGrid | Mailchimp | Mailjet | MailerSend | Resend | Postmark |
|---------|----------|-----------|----------|------------|---------|-----------|
| Templates | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Attachments | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| HTML Email | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Analytics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Webhooks | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| EU Servers | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |

## Creating Custom Drivers

You can create custom drivers by implementing the `UnmailDriver` interface:

```typescript
import { UnmailDriver, SendMailOptions, SendMailResponse } from 'unmail';

class CustomDriver implements UnmailDriver {
  async sendMail(options: SendMailOptions): Promise<SendMailResponse> {
    // Implement your custom email sending logic
    return {
      success: true,
      code: 200,
      message: 'Email sent via custom driver'
    };
  }
}
```

## Next Steps

- [SendGrid Driver](./sendgrid.md)
- [Mailchimp Driver](./mailchimp.md)
- [Mailjet Driver](./mailjet.md)
- [Core API](/api/core)

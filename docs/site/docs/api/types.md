# Types Reference

## Core Types

### SendMailOptions

Options for sending an email.

```typescript
type SendMailOptions = {
  from: Sender;
  to: Recipients;
  cc?: Recipients;
  bcc?: Recipients;
  replyTo?: Identity;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  templateId?: string;
  templateData?: { email: string; data: Record<string, any> }[];
  tags?: Tags;
}
```

### Identity

Represents an email address with an optional name.

```typescript
type Identity = {
  email: string;
  name?: string;
}
```

### Sender

The email sender (extends Identity).

```typescript
type Sender = Identity;
```

### Recipients

Array of email recipients.

```typescript
type Recipients = Identity[];
```

### Attachment

Email attachment configuration.

```typescript
type Attachment = {
  content: string | Buffer;
  contentType: string;
  filename: string;
  disposition: 'inline' | 'attachment';
  cid?: string;
  hostedPath?: string;
}
```

### Tag

Email tag for categorization and tracking.

```typescript
type Tag = {
  name: string;
  value: string;
}
```

### Tags

Array of email tags.

```typescript
type Tags = Tag[];
```

## Response Types

### SendMailResponse

Response from sending an email.

```typescript
type SendMailResponse = {
  success: boolean;
  code: number;
  error?: Error;
  message?: string;
  payload?: any;
}
```

## Driver Interface

### UnmailDriver

Abstract interface that all email provider drivers must implement.

```typescript
interface UnmailDriver {
  sendMail(options: SendMailOptions): Promise<SendMailResponse>;
}
```

## Usage Examples

### Basic Email with Types

```typescript
const options: SendMailOptions = {
  from: {
    email: 'sender@example.com',
    name: 'John Doe'
  },
  to: [{
    email: 'recipient@example.com',
    name: 'Jane Smith'
  }],
  subject: 'Hello',
  text: 'Plain text content',
  html: '<p>HTML content</p>'
};
```

### Email with Attachments

```typescript
const options: SendMailOptions = {
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
};
```

### Template Email

```typescript
const options: SendMailOptions = {
  from: { email: 'sender@example.com' },
  to: [{ email: 'recipient@example.com' }],
  templateId: 'welcome_template',
  templateData: [{
    email: 'recipient@example.com',
    data: {
      name: 'Jane',
      activationLink: 'https://example.com/activate'
    }
  }]
};
```

## Next Steps

- [Core API](./core.md) - Main API documentation
- [Response Types](./responses.md) - API response formats
- [Drivers Overview](/drivers/overview) - Email provider implementations

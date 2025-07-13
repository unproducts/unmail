# API Reference
This section documents important sub types used throughout the Unmail API.



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

## SendMailOptions

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

## Core Types

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

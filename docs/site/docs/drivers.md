# Drivers

Unmail supports multiple email service providers through its driver system. Each driver implements a common interface while handling provider-specific requirements.

## SendGrid Driver
```typescript
import { SendGridDriver } from 'unmail';

const driver = new SendGridDriver({
  token: 'YOUR_API_KEY'  // SendGrid API Key
});
```

| Option | Type | Description |
|--------|------|-------------|
| token | string | SendGrid API Key |

## Postmark Driver
```typescript
import { PostmarkDriver } from 'unmail';

const driver = new PostmarkDriver({
  token: 'YOUR_SERVER_TOKEN'  // Postmark Server Token
});
```

| Option | Type | Description |
|--------|------|-------------|
| token | string | Postmark Server Token |

## MailerSend Driver
```typescript
import { MailerSendDriver } from 'unmail';

const driver = new MailerSendDriver({
  token: 'YOUR_API_KEY'  // MailerSend API Key
});
```

| Option | Type | Description |
|--------|------|-------------|
| token | string | MailerSend API Key |

**Limitations**:
- Does not support hosted attachments.

## Resend Driver
```typescript
import { ResendDriver } from 'unmail';

const driver = new ResendDriver({
  token: 'YOUR_API_KEY',  // Resend API Key
  externaliseInlineAttachments: false  // Optional: Convert inline attachments to external URLs
});
```

| Option | Type | Description |
|--------|------|-------------|
| token | string | Resend API Key |
| externaliseInlineAttachments | boolean? | Whether to convert inline attachments to external URLs |

**Limitations**:
- Does not support templates yet
- Inline attachments require `externaliseInlineAttachments` option

## Mailjet Driver
```typescript
import { MailjetDriver } from 'unmail';

const driver = new MailjetDriver({
  token: 'YOUR_API_KEY',      // Mailjet API Key
  secretKey: 'YOUR_SECRET'    // Mailjet Secret Key
});
```

| Option | Type | Description |
|--------|------|-------------|
| token | string | Mailjet API Key |
| secretKey | string | Mailjet Secret Key |

**Limitations**:
- Does not support hosted attachments

## Mailchimp Driver (Mandrill)
```typescript
import { MailchimpDriver } from 'unmail';

const driver = new MailchimpDriver({
  token: 'YOUR_API_KEY'  // Mailchimp/Mandrill API Key
});
```

| Option | Type | Description |
|--------|------|-------------|
| token | string | Mailchimp/Mandrill API Key |

**Limitations**:
- Does not support hosted attachments

## Mock Driver
```typescript
import { MockerDriver } from 'unmail';

const driver = new MockerDriver({
  mode: 'success',                    // Optional: 'success' or 'failure'
  message: 'Custom message',          // Optional: Custom response message
  code: 200,                         // Optional: Custom response code
  handleResponse: (response) => {}    // Optional: Custom response handler
});
```

| Option | Type | Description |
|--------|------|-------------|
| mode | 'success' \| 'failure'? | Response mode |
| message | string? | Custom response message |
| code | number? | Custom response code |
| handleResponse | ((response: SendMailResponse) => void)? | Custom response handler |

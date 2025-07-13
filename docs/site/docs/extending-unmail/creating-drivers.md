# Creating Custom Drivers

Unmail's driver system allows you to integrate any email service provider with a unified interface. This guide will walk you through creating a custom driver.

## Driver Structure

A driver in Unmail is created using the `defineUnmailDriver` helper function. Here's the basic structure:

```typescript
import { defineUnmailDriver } from '@unproducts/unmail';
import {
  PayloadModifier,
  DEFAULT_PAYLOAD_MODIFIER,
  NOOP_SET_PAYLOAD_MODIFIER
} from '@unproducts/unmail/drivers/internal/utils';

export type CustomOptions = {
  token: string;
  // Add any other configuration options
};

const driver = defineUnmailDriver<CustomOptions>((options) => {
  // Setup API client, utilities, etc.
  let payloadModifier: PayloadModifier = DEFAULT_PAYLOAD_MODIFIER;

  const setPayloadModifier = (modifier: PayloadModifier) => {
    payloadModifier = modifier;
  };

  const sendMail = async (options: SendMailOptions) => {
    // Implement email sending logic
  };

  return {
    type: 'custom-provider',
    options: options,
    sendMail,
    setPayloadModifier,
  };
});
```

## Utility Functions

Unmail provides several utility functions to help with common driver tasks. Here's a detailed look at each utility:

### DEFAULT_PAYLOAD_MODIFIER

The default implementation of payload modification that returns the payload unchanged. Use this as the initial value for payload modifiers.

```typescript
const DEFAULT_PAYLOAD_MODIFIER = (payload: any) => payload;
```

### NOOP_SET_PAYLOAD_MODIFIER

A no-operation implementation of the setPayloadModifier function. Useful when payload modification is not needed.

```typescript
const NOOP_SET_PAYLOAD_MODIFIER = () => {};
```

### mailStringFromIdentity

Converts an Identity object to a formatted email string.

```typescript
const emailString = mailStringFromIdentity({
  email: 'user@example.com',
  name: 'John Doe'
}); // Returns: "John Doe <user@example.com>"
```

| Parameter | Type | Description |
|-----------|------|-------------|
| identity | Identity | Object containing email and optional name |

### hasInlineAttachments

Checks if the provided attachments array contains any inline attachments.

```typescript
if (hasInlineAttachments(options.attachments)) {
  // Handle inline attachments
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| attachments | Attachment[] \| undefined | Array of email attachments |
| Returns | boolean | True if any attachment has disposition 'inline' |

### hasHostedAttachments

Checks if the provided attachments array contains any hosted attachments (attachments with hostedPath).

```typescript
if (hasHostedAttachments(options.attachments)) {
  // Handle hosted attachments
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| attachments | Attachment[] | Array of email attachments |
| Returns | boolean | True if any attachment has hostedPath property |

### PayloadModifier Type

A type definition for functions that modify API payloads before sending.

```typescript
type PayloadModifier = (payload: any) => any;
```

| Parameter | Type | Description |
|-----------|------|-------------|
| payload | any | The original API payload |
| Returns | any | The modified API payload |

## Payload Modification

The payload modifier system allows users to customize the API payload before it's sent to the provider. Here's how it works:

1. Each driver must implement the `setPayloadModifier` function
2. The function should be called just before making the API request
3. Users can modify the payload for specific requirements

## Implementation Notes

- Always validate provider-specific requirements
- Handle rate limits appropriately
- Document any feature limitations
- Consider implementing retry logic if needed

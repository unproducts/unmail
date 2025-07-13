# Modifying Payloads

Unmail provides a powerful system to modify API payloads before they are sent to the email service provider. This allows you to customize requests without creating a new driver. Provided payload modifier function is called just before sending the request.

## Usage

Every driver in Unmail exposes a `setPayloadModifier` method that accepts a function to modify the outgoing payload:

```typescript
import { SendGridDriver } from '@unproducts/unmail';

const driver = SendGridDriver({
  token: 'your-api-key'
});

driver.setPayloadModifier((payload) => {
  // Modify and return the payload
  return payload;
});
```

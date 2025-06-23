import MailchimpDriver from '../src/drivers/mailchimp';
import { createUnmail } from '../src';

import dotenv from 'dotenv';
dotenv.config();

const TEST_TARGET_EMAIL = process.env.TEST_TARGET_EMAIL!;

const API_KEY = process.env.MAILCHIMP_API_KEY!;
const DOMAIN = process.env.MAILCHIMP_DOMAIN!;

if (!API_KEY) {
  throw new Error('MAILCHIMP_API_KEY is not set');
}

if (!DOMAIN) {
  throw new Error('MAILCHIMP_DOMAIN is not set');
}

if (!TEST_TARGET_EMAIL) {
  throw new Error('TEST_TARGET_EMAIL is not set');
}

const driver = new MailchimpDriver({
  token: API_KEY,
});

const mailer = await createUnmail({
  driver,
});

// Test 1: Send plain text email
const r1 = mailer.sendMail({
  from: { email: `test-unmail@${DOMAIN}`, name: 'Unmail by Unproducts' },
  subject: 'Test email from Mailchimp driver - Plain Text',
  to: [{ email: TEST_TARGET_EMAIL }],
  text: 'This is a test email sent via Mailchimp Transactional API using plain text.',
});

// Test 2: Send HTML email
const r2 = mailer.sendMail({
  from: { email: `test-unmail@${DOMAIN}`, name: 'Unmail by Unproducts' },
  subject: 'Test email from Mailchimp driver - HTML',
  to: [{ email: TEST_TARGET_EMAIL }],
  html: '<h1>Test Email</h1><p>This is a <strong>test email</strong> sent via Mailchimp Transactional API using HTML.</p>',
  text: 'This is a test email sent via Mailchimp Transactional API using HTML.',
});

// Test 3: Send email with CC and BCC
const r3 = mailer.sendMail({
  from: { email: `test-unmail@${DOMAIN}`, name: 'Unmail by Unproducts' },
  subject: 'Test email from Mailchimp driver - CC/BCC',
  to: [{ email: TEST_TARGET_EMAIL, name: 'Primary Recipient' }],
  cc: [{ email: TEST_TARGET_EMAIL, name: 'CC Recipient' }],
  bcc: [{ email: TEST_TARGET_EMAIL, name: 'BCC Recipient' }],
  html: '<h1>Test Email with CC/BCC</h1><p>This email was sent with CC and BCC recipients.</p>',
  text: 'This email was sent with CC and BCC recipients.',
});

// Test 4: Send email with tags and headers
const r4 = mailer.sendMail({
  from: { email: `test-unmail@${DOMAIN}`, name: 'Unmail by Unproducts' },
  subject: 'Test email from Mailchimp driver - Tags & Headers',
  to: [{ email: TEST_TARGET_EMAIL }],
  html: '<h1>Test Email with Tags</h1><p>This email includes custom tags and headers.</p>',
  text: 'This email includes custom tags and headers.',
  tags: [
    { name: 'test', value: 'true' },
    { name: 'environment', value: 'development' }
  ],
  headers: {
    'X-Custom-Header': 'test-value',
    'X-Priority': 'high'
  },
});

// Test 5: Send email with reply-to
const r5 = mailer.sendMail({
  from: { email: `test-unmail@${DOMAIN}`, name: 'Unmail by Unproducts' },
  subject: 'Test email from Mailchimp driver - Reply-To',
  to: [{ email: TEST_TARGET_EMAIL }],
  replyTo: { email: `reply@${DOMAIN}`, name: 'Reply Handler' },
  html: '<h1>Test Email with Reply-To</h1><p>This email has a custom reply-to address.</p>',
  text: 'This email has a custom reply-to address.',
});

// Test 6: Send template email (if you have a template)
// Uncomment and modify this test if you have a Mailchimp template set up
/*
const r6 = mailer.sendMail({
  from: { email: `test-unmail@${DOMAIN}`, name: 'Unmail by Unproducts' },
  subject: 'Test email from Mailchimp driver - Template',
  to: [{ email: TEST_TARGET_EMAIL }],
  templateId: 'your-template-name',
  templateData: [
    {
      email: TEST_TARGET_EMAIL,
      data: {
        name: 'John Doe',
        company: 'Test Company',
        action_url: 'https://example.com/action'
      },
    },
  ],
});
*/

console.log('Running Mailchimp driver tests...');
console.log(await Promise.all([r1, r2, r3, r4, r5]));

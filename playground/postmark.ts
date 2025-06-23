import PostmarkDriver from '../src/drivers/postmark';
import { createUnmail } from '../src';

import dotenv from 'dotenv';
dotenv.config();

const TEST_TARGET_EMAIL = process.env.TEST_TARGET_EMAIL!;

const SERVER_TOKEN = process.env.POSTMARK_SERVER_TOKEN!;
const DOMAIN = process.env.POSTMARK_DOMAIN!;

if (!SERVER_TOKEN) {
  throw new Error('POSTMARK_SERVER_TOKEN is not set');
}

if (!DOMAIN) {
  throw new Error('POSTMARK_DOMAIN is not set');
}

if (!TEST_TARGET_EMAIL) {
  throw new Error('TEST_TARGET_EMAIL is not set');
}

const driver = new PostmarkDriver({
  serverToken: SERVER_TOKEN,
});

const mailer = await createUnmail({
  driver,
});

const r1 = mailer.sendMail({
  from: { email: `test-unmail@${DOMAIN}`, name: 'Unmail by Unproducts' },
  subject: 'This is test email',
  to: [{ email: TEST_TARGET_EMAIL }],
  text: 'This is test email',
});

const r2 = mailer.sendMail({
  from: { email: `test-unmail@${DOMAIN}` },
  subject: 'This is test email',
  to: [{ email: TEST_TARGET_EMAIL }],
  html: '<b>This is test email</b>',
});

const r3 = mailer.sendMail({
  from: { email: `test-unmail@${DOMAIN}` },
  subject: 'This is test email with template',
  to: [{ email: TEST_TARGET_EMAIL }],
  templateId: '123456', // Replace with actual Postmark template ID
  templateData: [
    {
      email: TEST_TARGET_EMAIL,
      data: { name: 'John Doe', company: "John's Company" },
    },
  ],
});

console.log(await Promise.all([r1, r2, r3]));

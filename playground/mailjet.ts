import MailjetDriver from '../src/drivers/mailjet';
import { createUnmail } from '../src';

import dotenv from 'dotenv';
dotenv.config();

const TEST_TARGET_EMAIL = process.env.TEST_TARGET_EMAIL!;

const API_KEY = process.env.MAILJET_API_KEY!;
const SECRET_KEY = process.env.MAILJET_SECRET_KEY!;
const DOMAIN = process.env.MAILJET_DOMAIN!;

if (!API_KEY) {
  throw new Error('MAILJET_API_KEY is not set');
}

if (!SECRET_KEY) {
  throw new Error('MAILJET_SECRET_KEY is not set');
}

if (!DOMAIN) {
  throw new Error('MAILJET_DOMAIN is not set');
}

if (!TEST_TARGET_EMAIL) {
  throw new Error('TEST_TARGET_EMAIL is not set');
}

const driver = new MailjetDriver({
  token: API_KEY,
  secretKey: SECRET_KEY,
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
  templateId: '123456', // Replace with actual Mailjet template ID
  templateData: [
    {
      email: TEST_TARGET_EMAIL,
      data: { name: 'John Doe', company: "John's Company" },
    },
  ],
});

console.log(await Promise.all([r1, r2, r3]));

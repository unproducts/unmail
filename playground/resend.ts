import ResendDriver from '../src/drivers/resend';
import { createUnmail } from '../src';

import dotenv from 'dotenv';
dotenv.config();

const TEST_TARGET_EMAIL = process.env.TEST_TARGET_EMAIL!;

const KEY = process.env.RESEND_TOKEN!;
const DOMAIN = process.env.RESEND_DOMAIN!;

const driver = new ResendDriver({
  apiKey: KEY,
  externaliseInlineAttachments: true,
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

console.log(await Promise.all([r1, r2]));

import MailerSendDriver from '../src/drivers/mailersend';
import { createUnmail } from '../src';

import dotenv from 'dotenv';
dotenv.config();

const TEST_TARGET_EMAIL = process.env.TEST_TARGET_EMAIL!;

const KEY = process.env.MAILERSEND_TOKEN!;
const DOMAIN = process.env.MAILERSEND_DOMAIN!;

(async () => {
  const driver = new MailerSendDriver({
    auth: KEY,
  });

  const mailer = await createUnmail({
    driver,
  });

  const r1 = mailer.sendMail({
    from: { email: `test-unmail@${DOMAIN}` },
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
    subject: 'This is test email',
    to: [{ email: TEST_TARGET_EMAIL }],
    templateId: '3yxj6ljoxp54do2r',
    templateData: [
      {
        email: TEST_TARGET_EMAIL,
        data: { name: 'John Doe', account_name: "John's Profilecity Account", support_email: 'john@profilecity.xyz' },
      },
    ],
  });

  console.log(await Promise.all([r1, r2, r3]));
})().catch(console.log);

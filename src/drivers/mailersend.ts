import { Attachment, EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

import { SendMailOptions, SendMailResponse } from './internal/types';
import { UnmailDriver } from './internal/abstract';
import { hasHostedAttachments } from './internal/utils';

export type MailerSendDriverOptions = { auth: string };

export default class MailerSendDriver extends UnmailDriver<MailerSendDriverOptions, GAxiosErrorMock> {
  private mailerSend: MailerSend | undefined;

  constructor(options: MailerSendDriverOptions) {
    super(options, 'mailersend');
  }

  async init(): Promise<void> {
    this.mailerSend = new MailerSend({
      apiKey: this.options.auth,
    });
  }

  async sendMail0(options: SendMailOptions): Promise<SendMailResponse<any>> {
    if (!this.mailerSend) {
      throw this.composeProcessingError('mailersend instance unavailable');
    }

    if (hasHostedAttachments(options.attachments)) {
      throw this.composeProcessingError('mailersend doesnt allow hosted attachments');
    }

    const from = new Sender(options.from.email, options.from.name);
    const to: Recipient[] = options.to.map((t) => new Recipient(t.email, t.name));
    const replyTo: Recipient = options.replyTo ? new Recipient(options.replyTo.email, options.replyTo.name) : from;
    const cc: Recipient[] = options.cc ? options.cc.map((t) => new Recipient(t.email, t.name)) : [];
    const bcc: Recipient[] = options.bcc ? options.bcc.map((t) => new Recipient(t.email, t.name)) : [];
    const subject = options.subject;
    const contentType: 'html' | 'text' | 'template' = options.templateId ? 'template' : options.html ? 'html' : 'text';

    const headers: { name: string; value: string }[] = options.headers
      ? Object.keys(options.headers).map((k) => ({ name: k, value: (options.headers as any)[k] }))
      : [];

    const attachments = options.attachments
      ? options.attachments.map((a) => {
          const content = Buffer.isBuffer(a.content)
            ? a.content.toString('base64')
            : Buffer.from(a.content).toString('base64');
          return new Attachment(content, a.filename, a.disposition, a.cid);
        })
      : [];

    const emailOptions = new EmailParams().setFrom(from).setTo(to).setCc(cc).setBcc(bcc).setReplyTo(replyTo);

    if (subject) {
      emailOptions.setSubject(subject);
    }
    if (attachments) {
      emailOptions.setAttachments(attachments);
    }
    if (headers) {
      emailOptions.setHeaders(headers);
    }

    switch (contentType) {
      case 'html': {
        emailOptions.setHtml(options.html as string);
        break;
      }
      case 'template': {
        emailOptions.setTemplateId(options.templateId as string);
        const personalisations = options.templateData || [];
        emailOptions.setPersonalization(personalisations);
        break;
      }
      case 'text': {
        emailOptions.setText(options.text as string);
        break;
      }
      default: {
        this.composeProcessingError('Invalid content type detected');
        break;
      }
    }

    try {
      const apiResponse = await this.mailerSend.email.send(emailOptions);
      return {
        success: true,
        code: apiResponse.statusCode,
        error: undefined,
        message: apiResponse.body,
      };
    } catch (error) {
      const e = error as GAxiosErrorMock;
      return {
        success: false,
        code: e.status || 500,
        error: e,
        message: e.message,
      };
    }
  }
}

/**
 * https://github.com/googleapis/gaxios/blob/main/src/common.ts
 */
interface GAxiosErrorMock extends Error {
  status?: number;
  code?: string;
}

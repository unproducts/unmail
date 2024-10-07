export const DRIVER_NAME = 'mailersend';

import { Attachment, EmailParams, MailerSend, Recipient, Sender } from 'mailersend';

import { SendMailOptions, SendMailResponse } from '../types';
import { makeValidationErrorComposer, makeProcessingErrorComposer } from './utils/error';
import { UnmailDriver } from '../abstract';

const composeValidationError = makeValidationErrorComposer(DRIVER_NAME);
const composeProcessingError = makeProcessingErrorComposer(DRIVER_NAME);

export type MailerSendDriverOptions = { auth: string };

export default class MailerSendDriver extends UnmailDriver<MailerSendDriverOptions, GAxiosErrorMock> {
  private mailerSend: MailerSend | undefined;

  constructor(options: MailerSendDriverOptions) {
    super(options);
  }

  async init(): Promise<void> {
    this.mailerSend = new MailerSend({
      apiKey: this.options.auth,
    });
  }

  async sendMail(options: SendMailOptions): Promise<SendMailResponse<any>> {
    if (!this.mailerSend) {
      throw composeProcessingError('mailer send instance unavailable');
    }
    this.validateOptions(options);

    const from = new Sender(options.from.email, options.from.name);
    const to: Recipient[] = options.to.map((t) => new Recipient(t.email, t.name));
    const replyTo: Recipient = options.replyTo ? new Recipient(options.replyTo.email, options.replyTo.name) : from;
    const cc: Recipient[] = options.cc ? options.cc.map((t) => new Recipient(t.email, t.name)) : [];
    const bcc: Recipient[] = options.bcc ? options.bcc.map((t) => new Recipient(t.email, t.name)) : [];
    const subject = options.subject;
    const contentType: 'html' | 'text' | 'template' = options.templateId ? 'template' : options.html ? 'html' : 'text';

    const attachments = options.attachments
      ? options.attachments.map((a) => {
          let content: string;
          if (Buffer.isBuffer(a.content)) {
            content = a.content.toString('base64');
          } else {
            content = Buffer.from(a.content).toString('base64');
          }
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

    switch (contentType) {
      case 'html':
        emailOptions.setHtml(options.html as string);
        break;
      case 'template':
        emailOptions.setTemplateId(options.templateId as string);
        const personalisations = options.templateData || [];
        emailOptions.setPersonalization(personalisations);
        break;
      case 'text':
        emailOptions.setText(options.text as string);
        break;
      default:
        composeProcessingError('Invalid content type detected');
        break;
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

  private validateOptions(options: SendMailOptions) {
    if (!options.from) {
      throw composeValidationError("'from' required");
    }

    if (!options.to || !Array.isArray(options.to) || options.to.length == 0) {
      throw composeValidationError("'to' required and cannot be empty");
    }

    if (!options.templateId) {
      if (!options.subject) {
        throw composeValidationError("'subject' is required if template not being used");
      }
      if (!options.html && !options.text) {
        throw composeValidationError("either 'text' or 'html' is required if template not being used");
      }
    }

    if (options.attachments && Array.isArray(options.attachments) && options.attachments.length > 0) {
      options.attachments.forEach((a, i) => {
        if (!a.disposition) {
          throw composeValidationError("'disposition' missing from attachment[" + i + ']');
        }
        if (a.disposition != 'inline' && a.disposition != 'attachment') {
          throw composeValidationError("'disposition' can only be 'attachment' or 'inline'");
        }
        if (a.disposition === 'inline' && !a.cid) {
          throw composeValidationError("'cid' is mandatory to send attachments 'inline'");
        }
        if (!Buffer.isBuffer(a.content) && typeof a.content != 'string') {
          throw composeValidationError("'content' can only be either buffer or string. attachment[" + i + ']');
        }
      });
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

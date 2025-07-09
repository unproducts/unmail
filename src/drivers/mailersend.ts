import axios, { AxiosError } from 'axios';

import { SendMailOptions, SendMailResponse } from './internal/types';
import { UnmailDriver } from './internal/abstract';
import { hasHostedAttachments } from './internal/utils';

export type MailerSendDriverOptions = { token: string };

export default class MailerSendDriver extends UnmailDriver<MailerSendDriverOptions, AxiosError> {
  constructor(options: MailerSendDriverOptions) {
    super(options, 'mailersend');
  }

  async init(): Promise<void> {
    this.apiClient = axios.create({
      baseURL: 'https://api.mailersend.com/v1',
      headers: {
        Authorization: `Bearer ${this.options.token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMail0(options: SendMailOptions): Promise<SendMailResponse> {
    if (hasHostedAttachments(options.attachments)) {
      throw this.composeProcessingError('mailersend doesnt allow hosted attachments');
    }

    // Prepare the payload for MailerSend API
    let payload: any = {
      from: {
        email: options.from.email,
        name: options.from.name,
      },
      to: options.to.map((t) => ({
        email: t.email,
        name: t.name,
      })),
    };

    if (options.cc && options.cc.length > 0) {
      payload.cc = options.cc.map((c) => ({
        email: c.email,
        name: c.name,
      }));
    }

    if (options.bcc && options.bcc.length > 0) {
      payload.bcc = options.bcc.map((b) => ({
        email: b.email,
        name: b.name,
      }));
    }

    if (options.replyTo) {
      payload.reply_to = {
        email: options.replyTo.email,
        name: options.replyTo.name,
      };
    }

    if (options.subject) {
      payload.subject = options.subject;
    }

    if (options.templateId) {
      payload.template_id = options.templateId;
      if (options.templateData) {
        payload.personalization = options.templateData;
      }
    } else if (options.html) {
      payload.html = options.html;
    } else if (options.text) {
      payload.text = options.text;
    }

    if (options.headers) {
      payload.headers = Object.keys(options.headers).map((key) => ({
        name: key,
        value: options.headers![key],
      }));
    }

    if (options.attachments && options.attachments.length > 0) {
      payload.attachments = options.attachments.map((a) => {
        const content = Buffer.isBuffer(a.content)
          ? a.content.toString('base64')
          : Buffer.from(a.content).toString('base64');

        return {
          content,
          filename: a.filename,
          disposition: a.disposition || 'attachment',
          id: a.cid,
        };
      });
    }

    if (this.modifyApiPayload) {
      payload = this.modifyApiPayload(payload);
    }

    try {
      const apiResponse = await this.apiClient.post('/email', payload);
      return {
        success: true,
        code: apiResponse.status,
        error: undefined,
        message: JSON.stringify(apiResponse.data),
      };
    } catch (error) {
      const e = error as AxiosError;
      return {
        success: false,
        code: e.response?.status || 500,
        error: e,
        message: JSON.stringify(e.response?.data || e.message),
        payload: payload,
      };
    }
  }
}

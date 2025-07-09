import axios, { AxiosError } from 'axios';

import { SendMailOptions, SendMailResponse } from './internal/types';
import { UnmailDriver } from './internal/abstract';
import { hasHostedAttachments } from './internal/utils';

export type MailjetDriverOptions = {
  token: string;
  secretKey: string;
};

export default class MailjetDriver extends UnmailDriver<MailjetDriverOptions, AxiosError> {
  constructor(options: MailjetDriverOptions) {
    super(options, 'mailjet');
  }

  async init(): Promise<void> {
    const basicAuth = Buffer.from(`${this.options.token}:${this.options.secretKey}`).toString('base64');

    this.apiClient = axios.create({
      baseURL: 'https://api.mailjet.com/v3.1',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMail0(options: SendMailOptions): Promise<SendMailResponse> {
    if (hasHostedAttachments(options.attachments)) {
      throw this.composeProcessingError('mailjet doesnt allow hosted attachments');
    }

    // Prepare the payload for Mailjet API v3.1
    let payload: any = {
      Messages: [
        {
          From: {
            Email: options.from.email,
            Name: options.from.name,
          },
          To: options.to.map((t) => ({
            Email: t.email,
            Name: t.name,
          })),
        },
      ],
    };

    const message = payload.Messages[0];

    if (options.cc && options.cc.length > 0) {
      message.Cc = options.cc.map((c) => ({
        Email: c.email,
        Name: c.name,
      }));
    }

    if (options.bcc && options.bcc.length > 0) {
      message.Bcc = options.bcc.map((b) => ({
        Email: b.email,
        Name: b.name,
      }));
    }

    if (options.replyTo) {
      message.ReplyTo = {
        Email: options.replyTo.email,
        Name: options.replyTo.name,
      };
    }

    if (options.subject) {
      message.Subject = options.subject;
    }

    if (options.templateId) {
      message.TemplateID = parseInt(options.templateId);
      message.TemplateLanguage = true;
      if (options.templateData && options.templateData.length > 0) {
        // Mailjet template variables are set per message
        message.Variables = options.templateData[0].data;
      }
    } else if (options.html) {
      message.HTMLPart = options.html;
    } else if (options.text) {
      message.TextPart = options.text;
    }

    if (options.headers) {
      message.Headers = options.headers;
    }

    if (options.attachments && options.attachments.length > 0) {
      message.Attachments = [];
      message.InlinedAttachments = [];

      options.attachments.forEach((a) => {
        const content = Buffer.isBuffer(a.content)
          ? a.content.toString('base64')
          : Buffer.from(a.content).toString('base64');

        const attachment = {
          ContentType: a.contentType,
          Filename: a.filename,
          Base64Content: content,
        };

        if (a.disposition === 'inline') {
          message.InlinedAttachments.push({
            ...attachment,
            ContentID: a.cid,
          });
        } else {
          message.Attachments.push(attachment);
        }
      });
    }

    if (this.modifyApiPayload) {
      payload = this.modifyApiPayload(payload);
    }

    try {
      const apiResponse = await this.apiClient.post('/send', payload);
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

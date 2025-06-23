import axios, { AxiosError } from 'axios';

import { SendMailOptions, SendMailResponse } from './internal/types';
import { UnmailDriver } from './internal/abstract';
import { mailStringFromIdentity } from './internal/utils';

export type PostmarkDriverOptions = {
  serverToken: string;
};

export default class PostmarkDriver extends UnmailDriver<PostmarkDriverOptions, AxiosError> {

  constructor(options: PostmarkDriverOptions) {
    super(options, 'postmark');
  }

  async init(): Promise<void> {
    this.apiClient = axios.create({
      baseURL: 'https://api.postmarkapp.com',
      headers: {
        'X-Postmark-Server-Token': this.options.serverToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
  }

  async sendMail0(options: SendMailOptions): Promise<SendMailResponse> {
    // Prepare the payload for Postmark API
    let payload: any = {
      From: mailStringFromIdentity(options.from),
      To: options.to.map(mailStringFromIdentity).join(','),
      MessageStream: 'outbound'
    };

    if (options.cc && options.cc.length > 0) {
      payload.Cc = options.cc.map(mailStringFromIdentity).join(',');
    }

    if (options.bcc && options.bcc.length > 0) {
      payload.Bcc = options.bcc.map(mailStringFromIdentity).join(',');
    }

    if (options.replyTo) {
      payload.ReplyTo = mailStringFromIdentity(options.replyTo);
    }

    if (options.subject) {
      payload.Subject = options.subject;
    }

    if (options.templateId) {
      payload.TemplateId = parseInt(options.templateId);
      if (options.templateData && options.templateData.length > 0) {
        // Postmark template model is per message
        payload.TemplateModel = options.templateData[0].data;
      }
    } else if (options.html) {
      payload.HtmlBody = options.html;
    } else if (options.text) {
      payload.TextBody = options.text;
    }

    if (options.tags && options.tags.length > 0) {
      // Postmark supports single tag, use the first one
      payload.Tag = options.tags[0].name;
    }

    if (options.headers) {
      payload.Headers = Object.keys(options.headers).map(key => ({
        Name: key,
        Value: options.headers![key]
      }));
    }

    if (options.attachments && options.attachments.length > 0) {
      payload.Attachments = options.attachments.map(a => {
        const content = Buffer.isBuffer(a.content)
          ? a.content.toString('base64')
          : Buffer.from(a.content).toString('base64');

        const attachment: any = {
          Name: a.filename,
          Content: content,
          ContentType: a.contentType
        };

        if (a.disposition === 'inline' && a.cid) {
          attachment.ContentID = a.cid;
        }

        return attachment;
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

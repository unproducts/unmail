import axios, { AxiosInstance, AxiosError } from 'axios';

import { UnmailDriver } from './internal/abstract';
import { SendMailOptions, SendMailResponse } from './internal/types';
import { hasInlineAttachments, mailStringFromIdentity } from './internal/utils';

export type ResendDriverOptions = {
  token: string;
  externaliseInlineAttachments?: boolean;
};

export default class ResendDriver extends UnmailDriver<ResendDriverOptions, AxiosError> {
  constructor(options: ResendDriverOptions) {
    super(options, 'resend');
  }

  async init(): Promise<void> {
    this.apiClient = axios.create({
      baseURL: 'https://api.resend.com',
      headers: {
        Authorization: `Bearer ${this.options.token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  protected async sendMail0(options: SendMailOptions): Promise<SendMailResponse<AxiosError>> {
    if (!(options.text || options.html) && options.templateId) {
      throw this.composeProcessingError('resend doesnt support templates yet');
    }

    if (!this.options.externaliseInlineAttachments && hasInlineAttachments(options.attachments)) {
      throw this.composeProcessingError(
        'resend doesnt support inline attachments. If you want to automatically convert it to external, set `externaliseInlineAttachments` to true in driver options.'
      );
    }

    const from = mailStringFromIdentity(options.from);

    // Prepare the payload for Resend API
    let payload: any = {
      from,
      to: options.to.map(mailStringFromIdentity),
      subject: options.subject as string,
    };

    if (options.cc && options.cc.length > 0) {
      payload.cc = options.cc.map(mailStringFromIdentity);
    }

    if (options.bcc && options.bcc.length > 0) {
      payload.bcc = options.bcc.map(mailStringFromIdentity);
    }

    if (options.replyTo) {
      payload.reply_to = mailStringFromIdentity(options.replyTo);
    }

    if (options.html) {
      payload.html = options.html;
    } else if (options.text) {
      payload.text = options.text;
    }

    if (options.tags) {
      payload.tags = options.tags;
    }

    if (options.headers) {
      payload.headers = options.headers;
    }

    if (options.attachments && options.attachments.length > 0) {
      payload.attachments = options.attachments.map((a) => {
        const attachment: any = {
          filename: a.filename,
        };

        if (a.hostedPath) {
          attachment.path = a.hostedPath;
        } else {
          attachment.content = Buffer.isBuffer(a.content)
            ? a.content.toString('base64')
            : Buffer.from(a.content).toString('base64');
        }

        if (a.contentType) {
          attachment.contentType = a.contentType;
        }

        return attachment;
      });
    }

    if (this.modifyApiPayload) {
      payload = this.modifyApiPayload(payload);
    }

    try {
      const apiResponse = await this.apiClient.post('/emails', payload);

      if (apiResponse.data && apiResponse.data.id) {
        return {
          success: true,
          code: apiResponse.status,
          error: undefined,
          message: apiResponse.data.id,
        };
      } else {
        return {
          success: false,
          code: apiResponse.status,
          message: 'No ID returned from Resend API',
          error: undefined,
        };
      }
    } catch (error) {
      const e = error as AxiosError;
      if (e.response?.data) {
        const errorData = e.response.data as any;
        const errorMessage = errorData.message || e.message;

        return {
          success: false,
          code: e.response.status || 500,
          message: errorMessage,
          error: e,
        };
      } else {
        return {
          success: false,
          code: 500,
          message: e.message,
          error: e,
        };
      }
    }
  }
}

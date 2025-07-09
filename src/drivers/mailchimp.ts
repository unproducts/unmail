import axios, { AxiosError } from 'axios';

import { SendMailOptions, SendMailResponse } from './internal/types';
import { UnmailDriver } from './internal/abstract';
import { hasHostedAttachments } from './internal/utils';

export type MailchimpDriverOptions = {
  token: string;
};

export default class MailchimpDriver extends UnmailDriver<MailchimpDriverOptions, AxiosError> {
  constructor(options: MailchimpDriverOptions) {
    super(options, 'mailchimp');
  }

  async init(): Promise<void> {
    this.apiClient = axios.create({
      baseURL: 'https://mandrillapp.com/api/1.0',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMail0(options: SendMailOptions): Promise<SendMailResponse<AxiosError>> {
    if (hasHostedAttachments(options.attachments)) {
      throw this.composeProcessingError('mailchimp doesnt allow hosted attachments');
    }

    // Determine if we're sending with template or regular send
    const endpoint = options.templateId ? '/messages/send-template.json' : '/messages/send.json';

    // Prepare the base message payload for Mailchimp API
    const message: any = {
      from_email: options.from.email,
      from_name: options.from.name || options.from.email,
      to: options.to.map((t) => ({
        email: t.email,
        name: t.name,
        type: 'to',
      })),
    };

    if (options.cc && options.cc.length > 0) {
      const ccRecipients = options.cc.map((c) => ({
        email: c.email,
        name: c.name,
        type: 'cc',
      }));
      message.to = [...message.to, ...ccRecipients];
    }

    if (options.bcc && options.bcc.length > 0) {
      const bccRecipients = options.bcc.map((b) => ({
        email: b.email,
        name: b.name,
        type: 'bcc',
      }));
      message.to = [...message.to, ...bccRecipients];
    }

    if (options.replyTo) {
      message.headers = message.headers || {};
      message.headers['Reply-To'] = options.replyTo.name
        ? `${options.replyTo.name} <${options.replyTo.email}>`
        : options.replyTo.email;
    }

    if (options.subject) {
      message.subject = options.subject;
    }

    // For non-template emails, add content
    if (!options.templateId) {
      if (options.html) {
        message.html = options.html;
      }
      if (options.text) {
        message.text = options.text;
      }
    }

    // Add custom headers
    if (options.headers) {
      message.headers = { ...message.headers, ...options.headers };
    }

    // Add tags
    if (options.tags && options.tags.length > 0) {
      message.tags = options.tags.map((tag) => tag.name || tag.value);
    }

    // Add attachments
    if (options.attachments && options.attachments.length > 0) {
      message.attachments = options.attachments.map((a) => {
        const content = Buffer.isBuffer(a.content)
          ? a.content.toString('base64')
          : Buffer.from(a.content).toString('base64');

        return {
          type: a.contentType,
          name: a.filename,
          content: content,
        };
      });
    }

    // Prepare the main payload
    let payload: any = {
      key: this.options.token,
      message: message,
    };

    // For template-based emails
    if (options.templateId) {
      payload.template_name = options.templateId;
      payload.template_content = [];

      // Add template data as global merge vars
      if (options.templateData && options.templateData.length > 0) {
        payload.global_merge_vars = [];
        // Mailchimp expects template data as global merge vars
        const templateVars = options.templateData[0]?.data || {};
        for (const [key, value] of Object.entries(templateVars)) {
          payload.global_merge_vars.push({
            name: key,
            content: value,
          });
        }
      }
    }

    if (this.modifyApiPayload) {
      payload = this.modifyApiPayload(payload);
    }

    try {
      const apiResponse = await this.apiClient.post(endpoint, payload);

      // Mailchimp returns an array of results, one per recipient
      if (apiResponse.data && Array.isArray(apiResponse.data)) {
        const results = apiResponse.data;
        const firstResult = results[0];

        if (firstResult && firstResult.status === 'sent') {
          return {
            success: true,
            code: apiResponse.status,
            error: undefined,
            message: firstResult._id || 'Email sent successfully',
          };
        } else {
          return {
            success: false,
            code: apiResponse.status,
            message: firstResult?.reject_reason || 'Unknown error',
            error: undefined,
          };
        }
      } else {
        return {
          success: false,
          code: apiResponse.status,
          message: 'Unexpected response format from Mailchimp API',
          error: undefined,
        };
      }
    } catch (error) {
      const e = error as AxiosError;
      if (e.response?.data) {
        const errorData = e.response.data as any;
        const errorMessage = errorData.message || errorData.name || e.message;

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

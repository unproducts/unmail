import axios, { AxiosError } from 'axios';

import { defineUnmailDriver } from './internal/abstract';
import { SendMailOptions } from './internal/types';
import { AuthenticationOptions, DEFAULT_PAYLOAD_MODIFIER, PayloadModifier } from './internal/utils';

export type SendGridDriverOptions = AuthenticationOptions;

export default defineUnmailDriver<SendGridDriverOptions>((driverOptions) => {
  let modifyApiPayload = DEFAULT_PAYLOAD_MODIFIER;
  const setPayloadModifier = (payloadModifier: PayloadModifier) => {
    modifyApiPayload = payloadModifier;
  };

  const apiClient = axios.create({
    baseURL: 'https://api.sendgrid.com',
    headers: {
      Authorization: `Bearer ${driverOptions.token}`,
      'Content-Type': 'application/json',
    },
  });

  const sendMail = async (options: SendMailOptions) => {
    // Prepare the personalizations array for SendGrid API
    const personalizations: any[] = [
      {
        to: options.to.map((t) => ({
          email: t.email,
          name: t.name,
        })),
      },
    ];

    // Add CC and BCC to the first personalization
    if (options.cc && options.cc.length > 0) {
      personalizations[0].cc = options.cc.map((c) => ({
        email: c.email,
        name: c.name,
      }));
    }

    if (options.bcc && options.bcc.length > 0) {
      personalizations[0].bcc = options.bcc.map((b) => ({
        email: b.email,
        name: b.name,
      }));
    }

    if (options.subject) {
      personalizations[0].subject = options.subject;
    }

    // Handle templates
    if (options.templateId) {
      personalizations[0].dynamic_template_data = {};
      if (options.templateData && options.templateData.length > 0) {
        // SendGrid dynamic template data is per personalization
        personalizations[0].dynamic_template_data = options.templateData[0].data;
      }
    }

    // Prepare the main payload for SendGrid API
    let payload: any = {
      personalizations,
      from: {
        email: options.from.email,
        name: options.from.name,
      },
    };

    if (options.replyTo) {
      payload.reply_to = {
        email: options.replyTo.email,
        name: options.replyTo.name,
      };
    }

    if (options.templateId) {
      payload.template_id = options.templateId;
    } else {
      // Add content for non-template emails
      payload.content = [];
      if (options.text) {
        payload.content.push({
          type: 'text/plain',
          value: options.text,
        });
      }
      if (options.html) {
        payload.content.push({
          type: 'text/html',
          value: options.html,
        });
      }
    }

    if (options.tags && options.tags.length > 0) {
      // SendGrid uses categories instead of tags
      payload.categories = options.tags.map((tag) => tag.name).slice(0, 10); // Max 10 categories
    }

    if (options.headers) {
      payload.headers = options.headers;
    }

    if (options.attachments && options.attachments.length > 0) {
      payload.attachments = options.attachments.map((a) => {
        const content = Buffer.isBuffer(a.content)
          ? a.content.toString('base64')
          : Buffer.from(a.content).toString('base64');

        const attachment: any = {
          content,
          filename: a.filename,
          type: a.contentType,
          disposition: a.disposition || 'attachment',
        };

        if (a.disposition === 'inline' && a.cid) {
          attachment.content_id = a.cid;
        }

        return attachment;
      });
    }

    payload = modifyApiPayload(payload);

    try {
      const apiResponse = await apiClient.post('/v3/mail/send', payload);
      return {
        success: true,
        code: apiResponse.status,
        error: undefined,
        message: 'Email sent successfully',
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
  };

  return {
    type: 'sendgrid',
    options: driverOptions,
    sendMail,
    setPayloadModifier,
  };
});

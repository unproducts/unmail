import axios, { AxiosError } from 'axios';

import { defineUnmailDriver } from './internal/abstract';
import { SendMailOptions } from './internal/types';
import {
  AuthenticationOptions,
  DEFAULT_PAYLOAD_MODIFIER,
  hasInlineAttachments,
  mailStringFromIdentity,
  PayloadModifier,
} from './internal/utils';
import { makeProcessingErrorComposer } from './internal/error';

export type ResendDriverOptions = AuthenticationOptions & {
  externaliseInlineAttachments?: boolean;
};

export default defineUnmailDriver<ResendDriverOptions>((driverOptions) => {
  const composeProcessingError = makeProcessingErrorComposer('resend');

  let modifyApiPayload = DEFAULT_PAYLOAD_MODIFIER;
  const setPayloadModifier = (payloadModifier: PayloadModifier) => {
    modifyApiPayload = payloadModifier;
  };

  const apiClient = axios.create({
    baseURL: 'https://api.resend.com',
    headers: {
      Authorization: `Bearer ${driverOptions.token}`,
      'Content-Type': 'application/json',
    },
  });

  const sendMail = async (options: SendMailOptions) => {
    if (!(options.text || options.html) && options.templateId) {
      throw composeProcessingError('resend doesnt support templates yet');
    }

    if (!driverOptions.externaliseInlineAttachments && hasInlineAttachments(options.attachments)) {
      throw composeProcessingError(
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

    payload = modifyApiPayload(payload);

    try {
      const apiResponse = await apiClient.post('/emails', payload);

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
  };

  return {
    type: 'resend',
    options: driverOptions,
    sendMail,
    setPayloadModifier,
  };
});

import { Resend } from 'resend';

import { UnmailDriver } from '../abstract';
import { SendMailOptions, SendMailResponse } from '../types';
import { hasInlineAttachments, mailStringFromIdentity } from '../utils';

export type ResendDriverOptions = { apiKey: string; externaliseInlineAttachments?: boolean };

export default class ResendDriver extends UnmailDriver<ResendDriverOptions> {
  private resendInstance: Resend | undefined;

  constructor(options: ResendDriverOptions) {
    super(options, 'resend');
  }

  init(): Promise<void> {
    this.resendInstance = new Resend(this.options.apiKey);
    return Promise.resolve();
  }

  protected async sendMail0(options: SendMailOptions): Promise<SendMailResponse<ResendError>> {
    if (!this.resendInstance) {
      throw this.composeProcessingError('resend instance unavailable');
    }

    if (!(options.text || options.html) && options.templateId) {
      throw this.composeProcessingError('resend doesnt support templates yet');
    }

    if (!this.options.externaliseInlineAttachments && hasInlineAttachments(options.attachments)) {
      throw this.composeProcessingError(
        'resend doesnt support inline attachments. If you want to automatically convert it to external, set `externaliseInlineAttachments` to true in driver options.'
      );
    }

    const from = mailStringFromIdentity(options.from);

    console.log(from);

    const to = options.to.map((v) => v.email);
    const subject = options.subject as string;
    const cc = options.cc?.map((cc) => cc.email);
    const bcc = options.bcc?.map((bcc) => bcc.email);
    const replyTo = options.replyTo?.email;
    const contentType: 'html' | 'text' = options.html ? 'html' : 'text';
    const content: string = (contentType === 'html' ? options.html : options.text) as string;
    const tags = options.tags;

    const attachments: ResendAttachment[] | undefined = options.attachments?.map((a) => {
      let content: string | undefined = undefined;
      let path: string | undefined = undefined;
      if (a.hostedPath) {
        path = a.hostedPath;
      } else {
        content = Buffer.isBuffer(a.content) ? a.content.toString('base64') : Buffer.from(a.content).toString('base64');
      }
      return {
        content,
        contentType: a.contentType,
        path,
        filename: a.filename,
      };
    });

    try {
      const response = await this.resendInstance.emails.send({
        from,
        to,
        subject,
        cc,
        bcc,
        replyTo,
        [contentType]: content,
        tags,
        attachments,
        // TODO: investigate and support.
        react: undefined,
      });
      if (response.data) {
        return {
          success: !!response.data?.id,
          code: 201,
          error: undefined,
          message: undefined,
        };
      } else if (response.error) {
        return {
          success: false,
          code: RESEND_ERROR_CODES_BY_KEY[response.error.name],
          message: response.error.message,
          error: new ResendError(response.error.message, response.error.name),
        };
      } else {
        throw new Error(
          'Invalid state. Both data and error are missing. This is likely a bug from unmail. Feel free to report the issue.'
        );
      }
    } catch (error) {
      const e = error as Error;
      return {
        success: false,
        code: 500,
        message: e.message,
        error: new ResendError('Application Error', 'application_error'),
      };
    }
  }
}

type ResendAttachment = {
  /** Content of an attached file. */
  content?: string | Buffer;
  /** Name of attached file. */
  filename?: string | false | undefined;
  /** Path where the attachment file is hosted */
  path?: string;
  /** Optional content type for the attachment, if not set will be derived from the filename property */
  contentType?: string;
};

// https://github.com/resend/resend-node/blob/canary/src/error.ts
class ResendError extends Error {
  public readonly name: RESEND_ERROR_CODE_KEY;

  public constructor(message: string, name: RESEND_ERROR_CODE_KEY) {
    super();
    this.message = message;
    this.name = name;
  }
}

export const RESEND_ERROR_CODES_BY_KEY = {
  missing_required_field: 422,
  invalid_access: 422,
  invalid_parameter: 422,
  invalid_region: 422,
  rate_limit_exceeded: 429,
  missing_api_key: 401,
  invalid_api_Key: 403,
  invalid_from_address: 403,
  validation_error: 403,
  not_found: 404,
  method_not_allowed: 405,
  application_error: 500,
  internal_server_error: 500,
} as const;

export type RESEND_ERROR_CODE_KEY = keyof typeof RESEND_ERROR_CODES_BY_KEY;

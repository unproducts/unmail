import { makeProcessingErrorComposer, makeValidationErrorComposer } from './error';
import { SendMailOptions, SendMailResponse } from '../../types';

export abstract class UnmailDriver<DriverOptions = any, E extends Error = Error> {
  protected readonly DRIVER_NAME: string;

  readonly options: DriverOptions;
  protected readonly composeValidationError;
  protected readonly composeProcessingError;

  constructor(options: DriverOptions, DRIVER_NAME: string) {
    this.options = options;
    this.DRIVER_NAME = DRIVER_NAME;

    this.composeValidationError = makeValidationErrorComposer(DRIVER_NAME);
    this.composeProcessingError = makeProcessingErrorComposer(DRIVER_NAME);
  }

  abstract init(): Promise<void>;
  protected abstract sendMail0(options: SendMailOptions): Promise<SendMailResponse<E>>;

  sendMail(options: SendMailOptions): Promise<SendMailResponse<E>> {
    this.validateOptions(options);
    return this.sendMail0(options);
  }

  getDriverName() {
    return this.DRIVER_NAME;
  }

  protected validateOptions(options: SendMailOptions) {
    if (!options.from) {
      throw this.composeValidationError("'from' required");
    }

    if (!options.to || !Array.isArray(options.to) || options.to.length === 0) {
      throw this.composeValidationError("'to' required and cannot be empty");
    }

    if (!options.templateId) {
      if (!options.subject) {
        throw this.composeValidationError("'subject' is required if template not being used");
      }
      if (!options.html && !options.text) {
        throw this.composeValidationError("either 'text' or 'html' is required if template not being used");
      }
    }

    if (options.attachments && Array.isArray(options.attachments) && options.attachments.length > 0) {
      for (const [i, a] of options.attachments.entries()) {
        if (!a.disposition) {
          throw this.composeValidationError("'disposition' missing from attachment[" + i + ']');
        }
        if (a.disposition != 'inline' && a.disposition != 'attachment') {
          throw this.composeValidationError("'disposition' can only be 'attachment' or 'inline'");
        }
        if (a.disposition === 'inline' && !a.cid) {
          throw this.composeValidationError("'cid' is mandatory to send attachments 'inline'");
        }
        if (!Buffer.isBuffer(a.content) && typeof a.content != 'string') {
          throw this.composeValidationError("'content' can only be either buffer or string. attachment[" + i + ']');
        }
      }
    }
  }
}

import { SendMailOptions, SendMailResponse } from './types';

export abstract class UnmailDriver<DriverOptions = any, E extends Error = Error> {
  readonly options: DriverOptions;

  constructor(options: DriverOptions) {
    this.options = options;
  }

  abstract init(): Promise<void>;
  abstract sendMail(options: SendMailOptions): Promise<SendMailResponse<E>>;
}

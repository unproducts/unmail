import { UnmailDriver } from './drivers/internal/abstract';
import { SendMailOptions, SendMailResponse } from './drivers/internal/types';

export class Unmail<DriverOptions = any, SendError extends Error = Error> {
  private readonly driver: UnmailDriver<DriverOptions, SendError>;

  private constructor(driver: UnmailDriver<DriverOptions, SendError>) {
    this.driver = driver;
  }

  async sendMail(options: SendMailOptions): Promise<SendMailResponse<SendError>> {
    return this.driver.sendMail(options);
  }

  static async make<AuthDetails = any, SendError extends Error = Error>(driver: UnmailDriver<AuthDetails, SendError>) {
    const unmail = new Unmail(driver);
    await unmail.driver.init();
    return unmail;
  }
}

export type CreateUnmailOptions<DriverOptions = any, SendError extends Error = Error> = {
  driver: UnmailDriver<DriverOptions, SendError>;
};

export const createUnmail = async <DriverOptions = any, SendError extends Error = Error>(
  options: CreateUnmailOptions<DriverOptions, SendError>
) => {
  return Unmail.make(options.driver);
};

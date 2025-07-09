import { UnmailDriver } from './drivers/internal/abstract';
import { SendMailOptions, SendMailResponse } from './drivers/internal/types';

export class Unmail {
  private readonly driver: UnmailDriver;

  private constructor(driver: UnmailDriver) {
    this.driver = driver;
  }

  async sendMail(options: SendMailOptions): Promise<SendMailResponse> {
    return this.driver.sendMail(options);
  }

  static async make(driver: UnmailDriver) {
    const unmail = new Unmail(driver);
    return unmail;
  }
}

export const createUnmail = async (driver: UnmailDriver) => {
  return Unmail.make(driver);
};

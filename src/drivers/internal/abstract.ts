import { SendMailOptions, SendMailResponse } from './types';
import { baseMailOptionsValidation } from './validation';

export type UnmailDriver<O extends DriverOptions = DriverOptions> = {
  options: Readonly<O>;
  type: string;
  sendMail(options: SendMailOptions): Promise<SendMailResponse>;
  setPayloadModifier(modifyApiPayload: (request: any) => any): void;
};

export type DriverOptions = {};

export const defineUnmailDriver = <O extends DriverOptions = DriverOptions>(fn: (driverOptions: O) => UnmailDriver) => {
  return (driverOptions: O) => {
    // Instantiate driver with options
    const driver = fn(driverOptions);

    // Wrap driver's sendMail method with base line validation
    const sendMail = (options: SendMailOptions) => {
      baseMailOptionsValidation(options, driver.type);
      return driver.sendMail(options);
    };

    return {
      ...driver,
      sendMail,
    };
  };
};

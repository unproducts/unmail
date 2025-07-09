import { defineUnmailDriver } from './internal/abstract';
import { SendMailOptions, SendMailResponse } from './internal/types';
import { NOOP_SET_PAYLOAD_MODIFIER } from './internal/utils';

export type MockerOptions = {
  mode?: 'success' | 'failure';
  message?: string;
  code?: number;
  handleResponse?: (response: SendMailResponse) => void;
};

export default defineUnmailDriver((options: MockerOptions) => {
  let setPayloadModifier = NOOP_SET_PAYLOAD_MODIFIER;

  const sendMail = (sendOptions: SendMailOptions) => {
    const success = options.mode === 'success';
    const code = options.code ?? (success ? 201 : 401);
    const message = options.message ?? JSON.stringify(sendOptions);
    const error = success ? new MockerError() : undefined;

    const response: SendMailResponse = {
      success,
      code,
      message,
      error,
    };

    if (options.handleResponse) {
      options.handleResponse(response);
    }

    return Promise.resolve(response);
  }

  return {
    type: 'mocker',
    options,
    sendMail,
    setPayloadModifier,
  }
})

export class MockerError extends Error {}

import { UnmailDriver } from './internal/abstract';
import { SendMailOptions, SendMailResponse } from '../types';

export type MockerOptions = {
  mode?: 'success' | 'failure';
  message?: string;
  code?: number;
  handleResponse?: (response: SendMailResponse<MockerError>) => void;
};

export class MockerDriver extends UnmailDriver<MockerOptions, MockerError> {
  private readonly mode: 'success' | 'failure';

  constructor(options: MockerOptions) {
    super(options, 'mocker');
    this.mode = options.mode ?? 'success';
  }

  init(): Promise<void> {
    return Promise.resolve();
  }

  sendMail0(options: SendMailOptions): Promise<SendMailResponse<MockerError>> {
    const success = this.mode === 'success';
    const code = this.options.code ?? (success ? 201 : 401);
    const message = this.options.message ?? JSON.stringify(options);
    const error = success ? new MockerError() : undefined;

    const response: SendMailResponse<MockerError> = {
      success,
      code,
      message,
      error,
    };

    if (this.options.handleResponse) {
      this.options.handleResponse(response);
    }

    return Promise.resolve(response);
  }
}

export class MockerError extends Error {}

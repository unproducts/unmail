import { defineUnmailDriver } from './internal/abstract';
import { SendMailOptions, SendMailResponse } from './internal/types';
import { NOOP_SET_PAYLOAD_MODIFIER } from './internal/utils';

export type MockerOptions = {
  mode?: 'success' | 'failure';
  message?: string;
  code?: number;
  handleResponse?: (response: SendMailResponse, request: SendMailOptions) => void;
  logPrettyMail?: (prettyString: string) => void;
};

const makePrettyMail = (request: SendMailOptions, response: SendMailResponse): string => {
  if (!response.success) {
    return `❌ Mail Sending Failed
Code: ${response.code}
Message: ${response.message}
${response.error ? `Error: ${response.error.message}` : ''}`;
  }

  const formatIdentities = (identities?: { email: string; name?: string }[]) => {
    if (!identities?.length) return '';
    return identities.map((id) => (id.name ? `${id.name} <${id.email}>` : id.email)).join(', ');
  };

  const mailContent = request.html || request.text || '(no content)';

  return `✉️  Mail Details
───────────────
From: ${formatIdentities([request.from])}
To: ${formatIdentities(request.to)}
${request.cc?.length ? `CC: ${formatIdentities(request.cc)}\n` : ''}${request.bcc?.length ? `BCC: ${formatIdentities(request.bcc)}\n` : ''}${request.replyTo ? `Reply-To: ${formatIdentities([request.replyTo])}\n` : ''}Subject: ${request.subject || '(no subject)'}
───────────────
${mailContent}
───────────────
✓ Sent successfully (Code: ${response.code})`;
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
      options.handleResponse(response, sendOptions);
    }

    if (options.logPrettyMail) {
      options.logPrettyMail(makePrettyMail(sendOptions, response));
    }

    return Promise.resolve(response);
  };

  return {
    type: 'mocker',
    options,
    sendMail,
    setPayloadModifier,
  };
});

export class MockerError extends Error {}

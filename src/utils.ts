import { Attachment, Identity } from './types';

export const mailStringFromIdentity = (identity: Identity) => {
  if (identity.name) {
    return `${identity.name} <${identity.email}>`;
  }
  return identity.email;
};

export const hasInlineAttachments = (attachments?: Attachment[]) =>
  attachments && attachments.filter((a) => a.disposition === 'inline').length !== 0;

export const hasHostedAttachments = (attachments?: Attachment[]) =>
  attachments && attachments.filter((a) => !!a.hostedPath).length !== 0;

import { Attachment, Identity } from './types';

export const mailStringFromIdentity = (identity: Identity) => {
  if (identity.name) {
    return `${identity.name} <${identity.email}>`;
  }
  return identity.email;
};

export const hasInlineAttachments = (attachments?: Attachment[]) =>
  attachments && attachments.some((a) => a.disposition === 'inline');

export const hasHostedAttachments = (attachments?: Attachment[]) =>
  attachments && attachments.some((a) => !!a.hostedPath);

export type PayloadModifier = (request: any) => any;
export const DEFAULT_PAYLOAD_MODIFIER: PayloadModifier = (request) => request;
export const NOOP_SET_PAYLOAD_MODIFIER = (payloadModifier: PayloadModifier) => payloadModifier;

export type AuthenticationOptions = { token: string };

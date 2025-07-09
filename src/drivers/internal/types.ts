import { AxiosError } from 'axios';

export type Identity = {
  email: string;
  name?: string;
};

export type Attachment = {
  content: string | Buffer;
  contentType: string;
  filename: string;
  disposition: 'inline' | 'attachment';
  cid?: string;
  hostedPath?: string;
};

export type Sender = Identity;
export type Recipients = Identity[];

export type Tag = { name: string; value: string };
export type Tags = Tag[];

export type SendMailOptions = {
  from: Sender;
  to: Recipients;
  cc?: Recipients;
  bcc?: Recipients;
  replyTo?: Identity;
  subject?: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  templateId?: string;
  templateData?: { email: string; data: Record<string, any> }[];
  tags?: Tags;
};

export type SendMailResponse = {
  success: boolean;
  code: number;
  error?: Error;
  message?: string;
  payload?: any;
};

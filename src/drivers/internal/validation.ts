import { makeValidationErrorComposer } from "./error";
import { SendMailOptions } from "./types";

export const baseMailOptionsValidation = (options: SendMailOptions, driverName: string) => {
  const composeValidationError = makeValidationErrorComposer(driverName);

  if (!options.from) {
    throw composeValidationError("'from' required");
  }

  if (!options.to || !Array.isArray(options.to) || options.to.length === 0) {
    throw composeValidationError("'to' required and cannot be empty");
  }

  if (!options.templateId) {
    if (!options.subject) {
      throw composeValidationError("'subject' is required if template not being used");
    }
    if (!options.html && !options.text) {
      throw composeValidationError("either 'text' or 'html' is required if template not being used");
    }
  }

  if (options.attachments && Array.isArray(options.attachments) && options.attachments.length > 0) {
    for (const [i, a] of options.attachments.entries()) {
      if (!a.disposition) {
        throw composeValidationError("'disposition' missing from attachment[" + i + ']');
      }
      if (a.disposition != 'inline' && a.disposition != 'attachment') {
        throw composeValidationError("'disposition' can only be 'attachment' or 'inline'");
      }
      if (a.disposition === 'inline' && !a.cid) {
        throw composeValidationError("'cid' is mandatory to send attachments 'inline'");
      }
      if (!Buffer.isBuffer(a.content) && typeof a.content != 'string') {
        throw composeValidationError("'content' can only be either buffer or string. attachment[" + i + ']');
      }
    }
  }
};

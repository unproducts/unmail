export const makeErrorComposer = (driverName: string, precomposeMessage?: string) => (message: string) => {
  const error = `[@unproducts/unmail] [driver ${driverName}]${precomposeMessage ? ' ' + precomposeMessage : ''} ${message}`;
  return new Error(error);
};

export const makeValidationErrorComposer = (driverName: string) => makeErrorComposer(driverName, 'Validation Error:');
export const makeProcessingErrorComposer = (driverName: string) => makeErrorComposer(driverName, 'Processing Error:');

/**
 * This is a helper function, which properly formats ouput data properly to
 * be sent as a response.
 *
 * @param result - Any value or object resulting from an API operation
 * @param message - (optional) Response message
 * @returns Formatted object to be sent as a response
 */
export function formatResponse(result: any, message?: string) {
  return {
    ...(message && { message: message }),
    result: result,
  };
}

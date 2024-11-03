/**
 * Represents a standard API response structure.
 *
 * @property {boolean} success - Indicates if the API request was successful.
 * @property {string} [message] - Optional message providing additional information about the response or error.
 * @property {Object} [data] - Optional data returned by the API, if the request was successful.
 */
export type APIResponse = {
  success: boolean;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  data?: Object;
};

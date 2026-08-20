export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

export const FORMAT_CONSTANTS = {
  DATE_DEFAULT: 'dd MMM yyyy',
  DATE_TIME: 'dd MMM yyyy, HH:mm',
  CURRENCY_CODE: 'USD',
  CURRENCY_DISPLAY: 'symbol'
};

export const MESSAGE_CONSTANTS = {
  SUCCESS: {
    SAVED: 'Successfully saved.',
    DELETED: 'Successfully deleted.',
    UPDATED: 'Successfully updated.'
  },
  ERROR: {
    GENERIC: 'An unexpected error occurred. Please try again later.',
    NETWORK: 'Network connection lost. Please check your internet connection.',
    UNAUTHORIZED: 'Your session has expired. Please log in again.',
    FORBIDDEN: 'You do not have permission to perform this action.'
  }
};

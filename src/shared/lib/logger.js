/* Centralized logging so we can wire Sentry/Datadog without touching feature code. */
export const logger = {
  info: (message, context = {}) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, context);
  },
  warn: (message, context = {}) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, context);
  },
  error: (message, context = {}) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, context);
  },
};

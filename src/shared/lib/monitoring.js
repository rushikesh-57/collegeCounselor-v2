import { logger } from './logger';

export function captureException(error, context = {}) {
  logger.error(error?.message || 'Unexpected error', { ...context, stack: error?.stack });
}

export function captureApiMetric({ endpoint, durationMs, success }) {
  logger.info('api_call', { endpoint, durationMs, success });
}

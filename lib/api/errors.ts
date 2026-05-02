export type ApiError = {
  message: string;
  status?: number;
  code?: string;
};

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return { message: error.message || 'Unexpected server error' };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return { message: 'Unexpected server error' };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

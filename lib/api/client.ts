import { sleep } from './errors';

type ApiRequestOptions = {
  retries?: number;
  fallbackMessage?: string;
  headers?: HeadersInit;
};

export async function postJsonWithRetry<T>(
  path: string,
  body: unknown,
  options: ApiRequestOptions = {},
): Promise<T> {
  const retries = options.retries ?? 2;
  const fallbackMessage = options.fallbackMessage ?? 'Request failed. Please try again.';

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...options.headers },
        body: JSON.stringify(body),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = payload?.error || payload?.message || fallbackMessage;
        throw new Error(message);
      }

      return payload as T;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const backoffMs = 300 * 2 ** attempt;
        await sleep(backoffMs);
      }
    }
  }

  if (lastError instanceof Error) throw lastError;
  throw new Error(fallbackMessage);
}

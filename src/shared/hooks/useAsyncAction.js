import { useCallback, useState } from 'react';

export function useAsyncAction(action) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const execute = useCallback(async (...args) => {
    setError('');
    setLoading(true);
    try {
      return await action(...args);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error occurred.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [action]);

  return { execute, loading, error, setError };
}

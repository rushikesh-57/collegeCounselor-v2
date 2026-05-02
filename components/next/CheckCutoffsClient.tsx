'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/next/DataTable';
import { postJsonWithRetry } from '@/lib/api/client';
import { useToast } from '@/components/next/feedback/ToastProvider';

type Row = Record<string, string | number | null>;

function unwrapRows(payload: unknown) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const maybe = payload as { data?: unknown; rows?: unknown };
    if (Array.isArray(maybe.data)) return maybe.data;
    if (Array.isArray(maybe.rows)) return maybe.rows;
  }
  return [];
}

export default function CheckCutoffsClient() {
  const { showToast } = useToast();
  const [loadingData, setLoadingData] = useState(true);
  const [loadingResult, setLoadingResult] = useState(false);
  const [error, setError] = useState('');
  const [fallback, setFallback] = useState('');
  const [collegeData, setCollegeData] = useState<Row[]>([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    postJsonWithRetry<unknown>('/api/college-data', {}, { retries: 2, fallbackMessage: 'Unable to load college data.' })
      .then((payload) => setCollegeData(unwrapRows(payload) as Row[]))
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Unable to load college data.';
        setError(message);
        setFallback('Please refresh in a few seconds.');
        showToast(message, 'error');
      })
      .finally(() => setLoadingData(false));
  }, [showToast]);

  const colleges = useMemo(
    () => [...new Set(collegeData.map((row) => String(row.college_name || '')).filter(Boolean))].sort(),
    [collegeData],
  );

  const branches = useMemo(
    () => [...new Set(collegeData.filter((row) => row.college_name === selectedCollege).map((row) => String(row.branch_name || '')).filter(Boolean))].sort(),
    [collegeData, selectedCollege],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setFallback('');
    setLoadingResult(true);

    try {
      const payload = await postJsonWithRetry<unknown>(
        '/api/check-cutoff',
        { college_name: selectedCollege, branch_name: selectedBranch },
        { retries: 2, fallbackMessage: 'Unable to fetch cutoffs.' },
      );
      setRows(unwrapRows(payload) as Row[]);
      showToast('Cutoff results loaded.', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to fetch cutoffs.';
      setError(message);
      setFallback('Try again in a few seconds or choose a different branch.');
      showToast(message, 'error');
    } finally {
      setLoadingResult(false);
    }
  }

  return (
    <section className="card">
      <h1>Check Cutoffs</h1>
      <p>Review CAP cutoff history by college and branch.</p>

      {loadingData ? <div className="skeleton-block" /> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {fallback ? <p className="fallback-text">{fallback}</p> : null}

      {!loadingData ? (
        <form onSubmit={submit} className="form-inline">
          <label>College<select value={selectedCollege} onChange={(e) => { setSelectedCollege(e.target.value); setSelectedBranch(''); }} required><option value="">Select</option>{colleges.map((name) => <option key={name}>{name}</option>)}</select></label>
          <label>Branch<select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} required><option value="">Select</option>{branches.map((name) => <option key={name}>{name}</option>)}</select></label>
          <button type="submit" disabled={loadingResult || !selectedCollege || !selectedBranch}>{loadingResult ? 'Checking...' : 'Check'}</button>
        </form>
      ) : null}

      <div style={{ marginTop: '1rem' }}>
        <DataTable rows={rows} />
      </div>
    </section>
  );
}

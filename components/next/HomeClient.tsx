'use client';

import { FormEvent, useMemo, useState } from 'react';
import DataTable from '@/components/next/DataTable';
import { branchList, casteOptions, defaultFormData, districtList, homeDistrictGroups } from '@/lib/form-options';
import { postJsonWithRetry } from '@/lib/api/client';
import { useToast } from '@/components/next/feedback/ToastProvider';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Row = Record<string, string | number | null>;

const yesNoFields = [
  ['ews', 'EWS'],
  ['pwd', 'Disability'],
  ['def', 'Defence'],
  ['tfws', 'TFWS'],
  ['orphan', 'Orphan'],
  ['mi', 'Minority'],
] as const;

function validateMobileNumber(value: string) {
  return /^\d{10}$/.test(value || '');
}

function downloadBase64File(payload: { base64: string; filename: string; mimeType: string }) {
  const binary = atob(payload.base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: payload.mimeType }));
  const link = document.createElement('a');
  link.href = url;
  link.download = payload.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function unwrapRows(payload: unknown) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === 'object') {
    const maybe = payload as { data?: unknown; rows?: unknown };
    if (Array.isArray(maybe.data)) return maybe.data;
    if (Array.isArray(maybe.rows)) return maybe.rows;
  }
  return [];
}

export default function HomeClient() {
  const { showToast } = useToast();
  const [form, setForm] = useState(defaultFormData);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState('');
  const [fallback, setFallback] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const setField = (field: string, value: string | string[]) => setForm((current) => ({ ...current, [field]: value }));
  const rowCountText = useMemo(() => `${rows.length} recommendation rows`, [rows.length]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setFallback('');

    if (!validateMobileNumber(form.mobileNumber)) {
      setError('Enter a valid 10-digit mobile number.');
      showToast('Please enter a valid 10-digit mobile number.', 'error');
      return;
    }

    if (!form.rank || !form.homeUniversity) {
      setError('Rank and 12th board exam district are required.');
      showToast('Rank and district are required.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData } = supabaseBrowser
        ? await supabaseBrowser.auth.getSession()
        : { data: { session: null } };
      const accessToken = sessionData.session?.access_token;
      const payload = await postJsonWithRetry<unknown>('/api/recommend-colleges', form, {
        retries: 2,
        fallbackMessage: 'Unable to fetch recommendations right now.',
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      setRows(unwrapRows(payload) as Row[]);
      showToast('Recommendations updated.', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to fetch recommendations.';
      setError(message);
      setFallback('Try again in a few seconds. If this repeats, narrow your filters and retry.');
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function exportFile(type: 'excel' | 'pdf') {
    setExporting(true);
    setError('');
    setFallback('');
    try {
      const payload = await postJsonWithRetry<{ base64: string; filename: string; mimeType: string }>(
        type === 'excel' ? '/api/export-excel' : '/api/export-pdf',
        { rows },
        { retries: 1, fallbackMessage: 'Export service unavailable. Please retry.' },
      );
      downloadBase64File(payload);
      showToast(`${type.toUpperCase()} download started.`, 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Export failed.';
      setError(message);
      setFallback('Export failed. You can retry or refresh the page.');
      showToast(message, 'error');
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <section className="card">
        <h1>Find safer engineering college options</h1>
        <p>Enter your MHT-CET rank and preferences for a personalized recommendation list.</p>
        <form id="check-colleges-form" onSubmit={submit} className="form-grid">
          <label>Mobile Number<input value={form.mobileNumber} maxLength={10} onChange={(e) => setField('mobileNumber', e.target.value.replace(/\D/g, ''))} /></label>
          <label>State Rank<input type="number" value={form.rank} onChange={(e) => setField('rank', e.target.value)} /></label>
          <label>Gender<select value={form.gender} onChange={(e) => setField('gender', e.target.value)}><option>Male</option><option>Female</option></select></label>
          <label>Caste<select value={form.caste} onChange={(e) => setField('caste', e.target.value)}>{casteOptions.map((c) => <option key={c}>{c}</option>)}</select></label>

          {yesNoFields.map(([key, label]) => (
            <label key={key}>{label}<select value={String(form[key])} onChange={(e) => setField(key, e.target.value)}><option>No</option><option>Yes</option></select></label>
          ))}

          <label>12th Board Exam District<select value={form.homeUniversity} onChange={(e) => setField('homeUniversity', e.target.value)}><option value="">Select</option>{homeDistrictGroups.map((d) => <option key={d}>{d}</option>)}</select></label>
          <label>Preferred Districts<select multiple value={form.preferredDistricts} onChange={(e) => setField('preferredDistricts', Array.from(e.target.selectedOptions).map((o) => o.value))}>{districtList.map((d) => <option key={d}>{d}</option>)}</select></label>
          <label>Preferred Branches<select multiple value={form.preferredBranches} onChange={(e) => setField('preferredBranches', Array.from(e.target.selectedOptions).map((o) => o.value))}>{branchList.map((b) => <option key={b}>{b}</option>)}</select></label>

          <div className="form-actions">
            <button type="submit" disabled={loading}>{loading ? 'Loading suggestions...' : 'Get Suggestions'}</button>
            <button type="button" onClick={() => { setForm(defaultFormData); setRows([]); setError(''); setFallback(''); }}>Reset</button>
          </div>
        </form>
        {loading ? <div className="skeleton-block" /> : null}
        {error ? <p className="error-text">{error}</p> : null}
        {fallback ? <p className="fallback-text">{fallback}</p> : null}
      </section>

      <div className="sticky-cta-wrap">
        <button type="submit" form="check-colleges-form" className="sticky-cta" disabled={loading}>
          {loading ? 'Checking colleges...' : 'Check Colleges'}
        </button>
      </div>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h2>Recommendation Results</h2>
        <p>{rowCountText}</p>
        <div className="form-actions" style={{ marginBottom: '0.75rem' }}>
          <button type="button" onClick={() => exportFile('excel')} disabled={!rows.length || exporting}>Export Excel</button>
          <button type="button" onClick={() => exportFile('pdf')} disabled={!rows.length || exporting}>Export PDF</button>
        </div>
        <DataTable rows={rows} />
      </section>
    </>
  );
}

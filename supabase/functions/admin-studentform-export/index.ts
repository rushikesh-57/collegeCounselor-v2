import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';
import { toBase64 } from '../_shared/validation.ts';

function csvEscape(value: unknown): string {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const expected = Deno.env.get('ADMIN_EXPORT_SECRET');
    if (!expected || request.headers.get('x-admin-secret') !== expected) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }
    const supabase = serviceClient();
    const { data, error } = await supabase.from('student_forms').select('*').order('updated_at', { ascending: false });
    if (error) throw error;
    const rows = data ?? [];
    const columns = rows.length ? Object.keys(rows[0]) : [];
    const csv = [columns.join(','), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(','))].join('\n');
    return jsonResponse({ base64: toBase64(csv), filename: 'StudentForm.csv', mimeType: 'text/csv;charset=utf-8' });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});

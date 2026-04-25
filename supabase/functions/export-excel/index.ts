import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { requireJsonObject, toBase64 } from '../_shared/validation.ts';

function csvEscape(value: unknown): string {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const body = requireJsonObject(await request.json());
    const rows = Array.isArray(body.rows) ? body.rows as Record<string, unknown>[] : [];
    const columns = rows.length ? Object.keys(rows[0]) : [];
    const csv = [
      columns.map(csvEscape).join(','),
      ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')),
    ].join('\n');
    return jsonResponse({
      base64: toBase64(csv),
      filename: 'College_List.csv',
      mimeType: 'text/csv;charset=utf-8',
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});

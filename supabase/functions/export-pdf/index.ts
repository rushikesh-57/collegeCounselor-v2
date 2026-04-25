import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1';
import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { requireJsonObject, toBase64 } from '../_shared/validation.ts';

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const body = requireJsonObject(await request.json());
    const rows = Array.isArray(body.rows) ? body.rows as Record<string, unknown>[] : [];
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    let page = pdf.addPage([842, 595]);
    let y = 550;

    page.drawText('College Recommendation List', { x: 40, y, font: bold, size: 16, color: rgb(0.1, 0.16, 0.3) });
    y -= 28;
    const columns = ['college_name', 'branch_name', 'category', 'cap_round_1'];
    page.drawText(columns.map((column) => column.replaceAll('_', ' ')).join(' | '), { x: 40, y, font: bold, size: 9 });
    y -= 18;

    for (const row of rows.slice(0, 120)) {
      if (y < 40) {
        page = pdf.addPage([842, 595]);
        y = 550;
      }
      const line = columns.map((column) => String(row[column] ?? '')).join(' | ').slice(0, 160);
      page.drawText(line, { x: 40, y, font, size: 8 });
      y -= 14;
    }

    const bytes = await pdf.save();
    return jsonResponse({
      base64: toBase64(bytes),
      filename: 'College_List.pdf',
      mimeType: 'application/pdf',
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});

import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';
import { requireJsonObject, stringArray } from '../_shared/validation.ts';

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const body = request.method === 'POST' ? requireJsonObject(await request.json()) : {};
    const districts = stringArray(body.districtList);
    const supabase = serviceClient();
    let query = supabase.from('branches').select('core_branch, colleges!inner(district)').not('core_branch', 'is', null);
    if (districts.length) query = query.in('colleges.district', districts);
    const { data, error } = await query;
    if (error) throw error;
    return jsonResponse([...new Set((data ?? []).map((row) => row.core_branch).filter(Boolean))].sort());
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});

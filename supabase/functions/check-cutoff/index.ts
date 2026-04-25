import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';
import { requireJsonObject } from '../_shared/validation.ts';

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const body = requireJsonObject(await request.json());
    const collegeName = String(body.college_name ?? '');
    const branchName = String(body.branch_name ?? '');
    if (!collegeName || !branchName) return jsonResponse([]);

    const supabase = serviceClient();
    const { data, error } = await supabase
      .from('cutoff_rounds')
      .select('branch_code, category, cap_round_1, cap_round_2, cap_round_3, cap_round_4, branches!inner(branch_name, colleges!inner(college_name))')
      .eq('branches.branch_name', branchName)
      .eq('branches.colleges.college_name', collegeName)
      .order('category');
    if (error) throw error;
    return jsonResponse((data ?? []).map((row) => ({
      branch_code: row.branch_code,
      category: row.category,
      cap_round_1: row.cap_round_1,
      cap_round_2: row.cap_round_2,
      cap_round_3: row.cap_round_3,
      cap_round_4: row.cap_round_4,
    })));
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});

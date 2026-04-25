import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const supabase = serviceClient();
    const { data, error } = await supabase
      .from('branches')
      .select('branch_code, branch_name, core_branch, colleges!inner(college_name, district)')
      .order('branch_name');
    if (error) throw error;
    return jsonResponse((data ?? []).map((row) => ({
      branch_code: row.branch_code,
      branch_name: row.branch_name,
      core_branch: row.core_branch,
      college_name: row.colleges.college_name,
      district: row.colleges.district,
    })));
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});

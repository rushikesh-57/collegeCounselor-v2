import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';
import { normalizeYesNo, requireJsonObject, stringArray } from '../_shared/validation.ts';

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;

  try {
    const body = requireJsonObject(await request.json());
    const mobileNumber = String(body.mobileNumber ?? '');
    const rank = Number(body.rank);
    if (!/^[0-9]{10}$/.test(mobileNumber)) return jsonResponse({ error: 'Valid mobile number is required' }, 400);
    if (!Number.isFinite(rank) || rank <= 0) return jsonResponse({ error: 'Valid rank is required' }, 400);

    const payload = {
      mobile_number: mobileNumber,
      rank,
      gender: String(body.gender ?? 'Male'),
      caste: String(body.caste ?? 'OPEN'),
      ews: normalizeYesNo(body.ews),
      pwd: normalizeYesNo(body.pwd),
      def: normalizeYesNo(body.def),
      tfws: normalizeYesNo(body.tfws),
      orphan: normalizeYesNo(body.orphan),
      mi: normalizeYesNo(body.mi),
      home_university: String(body.homeUniversity ?? ''),
      preferred_districts: stringArray(body.preferredDistricts),
      preferred_branches: stringArray(body.preferredBranches),
    };

    const supabase = serviceClient();
    const { error: upsertError } = await supabase.from('student_forms').upsert(payload);
    if (upsertError) throw upsertError;

    const { data, error } = await supabase.rpc('get_college_recommendations', {
      p_rank: payload.rank,
      p_gender: payload.gender,
      p_caste: payload.caste,
      p_ews: payload.ews,
      p_pwd: payload.pwd,
      p_def: payload.def,
      p_tfws: payload.tfws,
      p_orphan: payload.orphan,
      p_mi: payload.mi,
      p_home_district_group: payload.home_university,
      p_preferred_districts: payload.preferred_districts,
      p_preferred_branches: payload.preferred_branches,
      p_year: 2025,
    });
    if (error) throw error;
    return jsonResponse(data ?? []);
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});

import { handleOptions, jsonResponse } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';
import { normalizeYesNo, requireJsonObject, stringArray } from '../_shared/validation.ts';

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;

  try {
    const body = requireJsonObject(await request.json());
    const authHeader = request.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '').trim();
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
    const { data: userResult } = token
      ? await supabase.auth.getUser(token)
      : { data: { user: null } };
    const userId = userResult.user?.id ?? null;

    const { data: formRow, error: upsertError } = await supabase
      .from('student_forms')
      .upsert({ ...payload, user_id: userId }, { onConflict: 'mobile_number' })
      .select('id')
      .single();
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

    if (userId) {
      await supabase.from('recommendation_runs').insert({
        user_id: userId,
        student_form_id: formRow?.id ?? null,
        rank: payload.rank,
        filters: {
          gender: payload.gender,
          caste: payload.caste,
          ews: payload.ews,
          pwd: payload.pwd,
          def: payload.def,
          tfws: payload.tfws,
          orphan: payload.orphan,
          mi: payload.mi,
          home_university: payload.home_university,
          preferred_districts: payload.preferred_districts,
          preferred_branches: payload.preferred_branches,
        },
        result_count: data?.length ?? 0,
      });
    }

    return jsonResponse(data ?? []);
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
});

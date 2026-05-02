create or replace function public.get_college_recommendations(
  p_rank numeric,
  p_gender text,
  p_caste text,
  p_ews text,
  p_pwd text,
  p_def text,
  p_tfws text,
  p_orphan text,
  p_mi text,
  p_home_district_group text,
  p_preferred_districts text[] default '{}',
  p_preferred_branches text[] default '{}',
  p_year integer default 2025
)
returns table (
  branch_code text,
  branch_name text,
  core_branch text,
  college_name text,
  district text,
  university_name text,
  category text,
  cap_round_1 numeric,
  cap_round_2 numeric,
  cap_round_3 numeric,
  cap_round_4 numeric,
  chance_bucket text
)
language plpgsql
stable
as $$
declare
  v_home_university text;
  v_gender_prefix text;
begin
  select hum.university_name into v_home_university
  from public.home_university_maps hum
  where hum.district_group = p_home_district_group;

  v_home_university := coalesce(v_home_university, p_home_district_group);
  v_gender_prefix := case when lower(p_gender) = 'female' then 'L' else 'G' end;

  return query
  with joined as (
    select
      b.branch_code,
      b.branch_name,
      b.core_branch,
      c.college_name,
      c.district,
      u.university_name,
      u.is_state_level,
      cr.category,
      cr.cap_round_1,
      cr.cap_round_2,
      cr.cap_round_3,
      cr.cap_round_4
    from public.cutoff_rounds cr
    join public.branches b on b.branch_code = cr.branch_code
    join public.colleges c on c.college_code = b.college_code
    join public.universities u on u.university_id = c.university_id
    where cr.year = p_year
      and cr.cap_round_1 is not null
      and (coalesce(array_length(p_preferred_districts, 1), 0) = 0 or c.district = any(p_preferred_districts))
      and (coalesce(array_length(p_preferred_branches, 1), 0) = 0 or b.core_branch = any(p_preferred_branches))
      and (
        cr.category like (v_gender_prefix || p_caste || '%')
        or (p_pwd = 'Yes' and cr.category like ('PWD%' || p_caste || '%'))
        or (p_def = 'Yes' and cr.category like ('DEF%' || p_caste || '%'))
        or (p_ews = 'Yes' and cr.category = 'EWS')
        or (p_tfws = 'Yes' and cr.category = 'TFWS')
        or (p_orphan = 'Yes' and cr.category = 'ORPHAN')
        or (p_mi = 'Yes' and cr.category = 'MI')
      )
      and (
        u.is_state_level
        or (u.university_name = v_home_university and (right(cr.category, 1) in ('H', 'S') or cr.category in ('EWS', 'TFWS', 'ORPHAN', 'MI')))
        or (u.university_name <> v_home_university and (right(cr.category, 1) in ('O', 'S') or cr.category in ('EWS', 'TFWS', 'ORPHAN', 'MI')))
      )
  ),
  best_per_branch as (
    select distinct on (joined.branch_code)
      joined.*,
      case when joined.cap_round_1 > p_rank then 'high' else 'low' end as chance_bucket
    from joined
    order by joined.branch_code, joined.cap_round_1 desc
  ),
  low_rows as (
    select * from best_per_branch
    where best_per_branch.cap_round_1 < p_rank
    order by best_per_branch.cap_round_1 desc
    limit 40
  ),
  high_rows as (
    select * from best_per_branch
    where best_per_branch.cap_round_1 > p_rank
    order by best_per_branch.cap_round_1 asc
    limit greatest(60, 100 - (select count(*) from low_rows))
  ),
  combined as (
    select * from low_rows
    union all
    select * from high_rows
  )
  select
    combined.branch_code,
    combined.branch_name,
    combined.core_branch,
    combined.college_name,
    combined.district,
    combined.university_name,
    combined.category,
    combined.cap_round_1,
    combined.cap_round_2,
    combined.cap_round_3,
    combined.cap_round_4,
    combined.chance_bucket
  from combined
  order by combined.cap_round_1 asc;
end;
$$;

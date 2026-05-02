create extension if not exists pgcrypto with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'counselor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_forms
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.student_forms
  drop constraint if exists student_forms_pkey;

alter table public.student_forms
  add constraint student_forms_pkey primary key (id);

create unique index if not exists student_forms_mobile_number_key
  on public.student_forms (mobile_number);

create index if not exists idx_student_forms_user_id
  on public.student_forms (user_id);

create table if not exists public.recommendation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  student_form_id uuid references public.student_forms(id) on delete set null,
  rank numeric not null,
  filters jsonb not null default '{}'::jsonb,
  result_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_recommendation_runs_user_id_created_at
  on public.recommendation_runs (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.recommendation_runs enable row level security;

drop policy if exists "profiles are readable by owner" on public.profiles;
create policy "profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles are insertable by owner" on public.profiles;
create policy "profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles are updatable by owner" on public.profiles;
create policy "profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "student forms readable by owner" on public.student_forms;
create policy "student forms readable by owner"
  on public.student_forms for select
  using (auth.uid() = user_id);

drop policy if exists "student forms insertable by owner" on public.student_forms;
create policy "student forms insertable by owner"
  on public.student_forms for insert
  with check (auth.uid() = user_id);

drop policy if exists "student forms updatable by owner" on public.student_forms;
create policy "student forms updatable by owner"
  on public.student_forms for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "recommendation runs readable by owner" on public.recommendation_runs;
create policy "recommendation runs readable by owner"
  on public.recommendation_runs for select
  using (auth.uid() = user_id);

drop policy if exists "recommendation runs insertable by owner" on public.recommendation_runs;
create policy "recommendation runs insertable by owner"
  on public.recommendation_runs for insert
  with check (auth.uid() = user_id);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

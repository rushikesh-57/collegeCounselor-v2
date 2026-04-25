create extension if not exists vector with schema extensions;

create table public.universities (
  university_id integer primary key,
  university_name text not null unique,
  is_state_level boolean not null default false
);

create table public.home_university_maps (
  district_group text primary key,
  university_name text not null references public.universities(university_name)
);

create table public.colleges (
  college_code text primary key,
  college_name text not null,
  university_id integer references public.universities(university_id),
  district text
);

create table public.branches (
  branch_code text primary key,
  branch_name text not null,
  college_code text not null references public.colleges(college_code),
  core_branch text
);

create table public.cutoff_rounds (
  id bigint generated always as identity primary key,
  year integer not null default 2025,
  branch_code text not null references public.branches(branch_code),
  category text not null,
  cap_round_1 numeric,
  cap_round_2 numeric,
  cap_round_3 numeric,
  cap_round_4 numeric,
  created_at timestamptz not null default now(),
  unique (year, branch_code, category)
);

create table public.student_forms (
  mobile_number text primary key check (mobile_number ~ '^[0-9]{10}$'),
  rank numeric not null,
  gender text not null,
  caste text not null,
  ews text not null default 'No',
  pwd text not null default 'No',
  def text not null default 'No',
  tfws text not null default 'No',
  orphan text not null default 'No',
  mi text not null default 'No',
  home_university text not null,
  preferred_districts text[] not null default '{}',
  preferred_branches text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rag_documents (
  id bigint generated always as identity primary key,
  title text not null,
  storage_path text,
  created_at timestamptz not null default now()
);

create table public.rag_chunks (
  id bigint generated always as identity primary key,
  document_id bigint references public.rag_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding extensions.vector(768),
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create index idx_colleges_university_id on public.colleges(university_id);
create index idx_colleges_district on public.colleges(district);
create index idx_branches_college_code on public.branches(college_code);
create index idx_branches_core_branch on public.branches(core_branch);
create index idx_cutoff_branch_code on public.cutoff_rounds(branch_code);
create index idx_cutoff_category on public.cutoff_rounds(category);
create index idx_cutoff_year_category on public.cutoff_rounds(year, category);
create index idx_rag_chunks_embedding on public.rag_chunks using ivfflat (embedding extensions.vector_cosine_ops) with (lists = 100);

alter table public.universities enable row level security;
alter table public.home_university_maps enable row level security;
alter table public.colleges enable row level security;
alter table public.branches enable row level security;
alter table public.cutoff_rounds enable row level security;
alter table public.student_forms enable row level security;
alter table public.rag_documents enable row level security;
alter table public.rag_chunks enable row level security;

create policy "public read universities" on public.universities for select using (true);
create policy "public read home maps" on public.home_university_maps for select using (true);
create policy "public read colleges" on public.colleges for select using (true);
create policy "public read branches" on public.branches for select using (true);
create policy "public read cutoff rounds" on public.cutoff_rounds for select using (true);
create policy "public read rag docs" on public.rag_documents for select using (true);
create policy "public read rag chunks" on public.rag_chunks for select using (true);

insert into public.universities (university_id, university_name, is_state_level) values
  (1, 'Dr. Babasaheb Ambedkar Marathwada University', false),
  (2, 'Swami Ramanand Teerth Marathwada University, Nanded', false),
  (3, 'Mumbai University', false),
  (4, 'Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon', false),
  (5, 'Savitribai Phule Pune University', false),
  (6, 'Shivaji University', false),
  (7, 'Punyashlok Ahilyadevi Holkar Solapur University', false),
  (8, 'Sant Gadge Baba Amravati University', false),
  (9, 'Rashtrasant Tukadoji Maharaj Nagpur University', false),
  (10, 'Gondwana University', false),
  (11, 'Autonomous Institute', true),
  (12, 'SNDT Women''s University', true),
  (13, 'Dr. Babasaheb Ambedkar Technological University,Lonere', true),
  (14, 'Deemed to be University', true)
on conflict (university_id) do nothing;

insert into public.home_university_maps (district_group, university_name) values
  ('Chhatrapati Sambhajinagar, Beed, Jalna, Dharashiv', 'Dr. Babasaheb Ambedkar Marathwada University'),
  ('Nanded, Hingoli, Latur, Nanded, Parbhani', 'Swami Ramanand Teerth Marathwada University, Nanded'),
  ('Mumbai City, Mumbai Suburban, Ratnagiri, Raigad, Palghar, Sindhudurg, Thane', 'Mumbai University'),
  ('Jalgaon Dhule, Jalgaon, Nandurbar', 'Kavayitri Bahinabai Chaudhari North Maharashtra University, Jalgaon'),
  ('Pune, Ahmednagar, Nashik', 'Savitribai Phule Pune University'),
  ('Kolhapur, Sangli, Satara', 'Shivaji University'),
  ('Solapur', 'Punyashlok Ahilyadevi Holkar Solapur University'),
  ('Akola, Amravati, Buldana, Washim, Yavatmal', 'Sant Gadge Baba Amravati University'),
  ('Bhandara, Gondia, Nagpur, Wardha', 'Rashtrasant Tukadoji Maharaj Nagpur University'),
  ('Chandrapur, Gadchiroli', 'Gondwana University')
on conflict (district_group) do nothing;

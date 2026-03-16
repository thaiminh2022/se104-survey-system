create type survey_status as enum ('draft', 'published', 'archived');
create type section_end_behavior as enum ('continue', 'submit', 'end_survey');

create table public.surveys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status survey_status not null default 'draft',
  image text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  order_index int not null,
  end_behavior section_end_behavior not null default 'continue',
  config jsonb not null default '{}'::jsonb,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (survey_id, order_index)
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  order_index int not null,
  title text not null,
  image text,
  description text,
  question_type text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (section_id, order_index)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  submitted_at timestamptz not null default now()
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  answer_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (submission_id, question_id)
);
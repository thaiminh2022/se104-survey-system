create table if not exists public.survey_allowed_respondents (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone not null default now(),
  constraint survey_allowed_respondents_email_check
    check (email = lower(btrim(email)) and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create unique index if not exists survey_allowed_respondents_survey_email_key
  on public.survey_allowed_respondents (survey_id, email);

alter table public.survey_allowed_respondents enable row level security;

create or replace function public.get_published_survey_access_status(p_survey_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  allowed_count integer;
  respondent_email text;
begin
  if not exists (
    select 1
    from public.surveys s
    where s.id = p_survey_id
      and s.state = 'published'::public.survey_status
  ) then
    return 'not_found';
  end if;

  select count(*)
  into allowed_count
  from public.survey_allowed_respondents sar
  where sar.survey_id = p_survey_id;

  if allowed_count = 0 then
    return 'allowed';
  end if;

  respondent_email := lower(auth.email());

  if respondent_email is null then
    return 'auth_required';
  end if;

  if exists (
    select 1
    from public.survey_allowed_respondents sar
    where sar.survey_id = p_survey_id
      and sar.email = respondent_email
  ) then
    return 'allowed';
  end if;

  return 'denied';
end;
$$;

create or replace function public.can_access_published_survey(p_survey_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.get_published_survey_access_status(p_survey_id) = 'allowed';
$$;

grant execute on function public.get_published_survey_access_status(uuid) to anon, authenticated;
grant execute on function public.can_access_published_survey(uuid) to anon, authenticated;

grant all on table public.survey_allowed_respondents to anon;
grant all on table public.survey_allowed_respondents to authenticated;
grant all on table public.survey_allowed_respondents to service_role;

create policy "owners can manage allowed respondents"
on public.survey_allowed_respondents
to authenticated
using (
  exists (
    select 1
    from public.surveys s
    where s.id = survey_allowed_respondents.survey_id
      and s.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.surveys s
    where s.id = survey_allowed_respondents.survey_id
      and s.user_id = auth.uid()
  )
);

drop policy if exists "anonymous users can create anonymous submissions for published " on public.submissions;
create policy "anonymous users can create anonymous submissions for published "
on public.submissions
for insert
to anon
with check (
  user_id is null
  and public.can_access_published_survey(survey_id)
);

drop policy if exists "anonymous users can insert answers for anonymous submissions" on public.answers;
create policy "anonymous users can insert answers for anonymous submissions"
on public.answers
for insert
to anon
with check (
  exists (
    select 1
    from public.submissions sub
    where sub.id = answers.submission_id
      and sub.user_id is null
      and public.can_access_published_survey(sub.survey_id)
  )
);

drop policy if exists "authenticated users can create submissions for published survey" on public.submissions;
create policy "authenticated users can create submissions for published survey"
on public.submissions
for insert
to authenticated
with check (
  public.can_access_published_survey(survey_id)
  and (user_id = auth.uid() or user_id is null)
);

drop policy if exists "authenticated users can insert answers for valid submissions" on public.answers;
create policy "authenticated users can insert answers for valid submissions"
on public.answers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.submissions sub
    where sub.id = answers.submission_id
      and public.can_access_published_survey(sub.survey_id)
      and (sub.user_id = auth.uid() or sub.user_id is null)
  )
);

drop policy if exists "public can read published surveys" on public.surveys;
create policy "public can read published surveys"
on public.surveys
for select
to authenticated, anon
using (
  state = 'published'::public.survey_status
  and public.can_access_published_survey(id)
);

drop policy if exists "public can read questions of published surveys" on public.questions;
create policy "public can read questions of published surveys"
on public.questions
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.sections sec
    where sec.id = questions.section_id
      and public.can_access_published_survey(sec.survey_id)
  )
);

drop policy if exists "public can read sections of published surveys" on public.sections;
create policy "public can read sections of published surveys"
on public.sections
for select
to anon, authenticated
using (
  public.can_access_published_survey(survey_id)
);

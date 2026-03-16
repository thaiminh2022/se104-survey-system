alter table public.answers enable row level security;

create policy "survey owners can read answers of their surveys"
on public.answers
for select
to authenticated
using (
  exists (
    select 1
    from public.submissions sub
    join public.surveys s on s.id = sub.survey_id
    where sub.id = answers.submission_id
      and s.user_id = (select auth.uid())
  )
);

create policy "authenticated users can read answers of their own submissions"
on public.answers
for select
to authenticated
using (
  exists (
    select 1
    from public.submissions sub
    where sub.id = answers.submission_id
      and sub.user_id = (select auth.uid())
  )
);

create policy "authenticated users can insert answers for valid submissions"
on public.answers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.submissions sub
    join public.surveys s on s.id = sub.survey_id
    where sub.id = answers.submission_id
      and s.state = 'published'
      and (
        sub.user_id = (select auth.uid())
        or sub.user_id is null
      )
  )
);

create policy "anonymous users can insert answers for anonymous submissions"
on public.answers
for insert
to anon
with check (
  exists (
    select 1
    from public.submissions sub
    join public.surveys s on s.id = sub.survey_id
    where sub.id = answers.submission_id
      and s.state = 'published'
      and sub.user_id is null
  )
);
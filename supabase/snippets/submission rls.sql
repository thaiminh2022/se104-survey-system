alter table public.submissions enable row level security;

create policy "survey owners can read submissions of their surveys"
on public.submissions
for select
to authenticated
using (
  exists (
    select 1
    from public.surveys s
    where s.id = submissions.survey_id
      and s.user_id = auth.uid()
  )
);

create policy "authenticated users can read their own submissions"
on public.submissions
for select
to authenticated
using (
  user_id = auth.uid()
);

create policy "authenticated users can create submissions for published surveys"
on public.submissions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.surveys s
    where s.id = submissions.survey_id
      and s.status = 'published'
  )
  and (
    user_id = auth.uid()
    or user_id is null
  )
);

create policy "anonymous users can create anonymous submissions for published surveys"
on public.submissions
for insert
to anon
with check (
  user_id is null
  and exists (
    select 1
    from public.surveys s
    where s.id = submissions.survey_id
      and s.status = 'published'
  )
);
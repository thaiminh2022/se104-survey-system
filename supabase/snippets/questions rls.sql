alter table public.questions enable row level security;

create policy "owners can manage questions of their surveys"
on public.questions
for all
to authenticated
using (
  exists (
    select 1
    from public.sections sec
    join public.surveys s on s.id = sec.survey_id
    where sec.id = questions.section_id
      and s.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.sections sec
    join public.surveys s on s.id = sec.survey_id
    where sec.id = questions.section_id
      and s.user_id = (select auth.uid())
  )
);

create policy "public can read questions of published surveys"
on public.questions
for select
to anon
using (
  exists (
    select 1
    from public.sections sec
    join public.surveys s on s.id = sec.survey_id
    where sec.id = questions.section_id
      and s.state = 'published'
  )
);
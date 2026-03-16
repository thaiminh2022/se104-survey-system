alter table public.sections enable row level security;

create policy "owners can manage sections of their surveys"
on public.sections
for all
to authenticated
using (
  exists (
    select 1
    from public.surveys s
    where s.id = sections.survey_id
      and s.user_id = (select auth.uid()) 
  )
)
with check (
  exists (
    select 1
    from public.surveys s
    where s.id = sections.survey_id
      and s.user_id = (select auth.uid()) 
  )
);

create policy "public can read sections of published surveys"
on public.sections
for select
to anon
using (
  exists (
    select 1
    from public.surveys s
    where s.id = sections.survey_id
      and s.state = 'published'
  )
);
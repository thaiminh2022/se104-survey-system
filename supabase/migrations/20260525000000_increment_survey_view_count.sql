alter table public.surveys
  add column if not exists view_count integer not null default 0;

create or replace function public.increment_survey_view_count(p_survey_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.surveys
  set view_count = view_count + 1
  where id = p_survey_id
    and state = 'published'::public.survey_status;
end;
$$;

grant execute on function public.increment_survey_view_count(uuid) to anon;
grant execute on function public.increment_survey_view_count(uuid) to authenticated;

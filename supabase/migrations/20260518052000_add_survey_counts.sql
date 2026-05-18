alter table public.surveys
  add column if not exists view_count integer not null default 0,
  add column if not exists submission_count integer not null default 0;

alter table public.surveys
  add constraint surveys_view_count_nonnegative check (view_count >= 0),
  add constraint surveys_submission_count_nonnegative check (submission_count >= 0);

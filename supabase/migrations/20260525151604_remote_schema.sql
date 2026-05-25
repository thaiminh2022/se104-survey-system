set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_survey_submission_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  -- When a submission is created
  if tg_op = 'INSERT' then
    update public.surveys
    set submission_count = submission_count + 1
    where id = new.survey_id;

    return new;
  end if;

  -- When a submission is deleted
  if tg_op = 'DELETE' then
    update public.surveys
    set submission_count = greatest(submission_count - 1, 0)
    where id = old.survey_id;

    return old;
  end if;

  -- When a submission changes survey_id
  if tg_op = 'UPDATE' then
    if old.survey_id is distinct from new.survey_id then
      update public.surveys
      set submission_count = greatest(submission_count - 1, 0)
      where id = old.survey_id;

      update public.surveys
      set submission_count = submission_count + 1
      where id = new.survey_id;
    end if;

    return new;
  end if;

  return null;
end;
$function$
;



create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";

create type "public"."section_end_behavior" as enum ('continue', 'submit', 'end_survey');

create type "public"."survey_status" as enum ('draft', 'published', 'archived');


  create table "public"."answers" (
    "id" uuid not null default gen_random_uuid(),
    "submission_id" uuid not null,
    "question_id" uuid not null,
    "answer_data" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."answers" enable row level security;


  create table "public"."questions" (
    "id" uuid not null default gen_random_uuid(),
    "section_id" uuid not null,
    "order_index" integer not null,
    "title" text not null,
    "image" text,
    "description" text,
    "question_type" text not null,
    "config" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."questions" enable row level security;


  create table "public"."sections" (
    "id" uuid not null default gen_random_uuid(),
    "survey_id" uuid not null,
    "order_index" integer not null,
    "end_behavior" public.section_end_behavior not null default 'continue'::public.section_end_behavior,
    "config" jsonb not null default '{}'::jsonb,
    "title" text not null,
    "description" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."sections" enable row level security;


  create table "public"."submissions" (
    "id" uuid not null default gen_random_uuid(),
    "survey_id" uuid not null,
    "user_id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "submitted_at" timestamp with time zone not null default now()
      );


alter table "public"."submissions" enable row level security;


  create table "public"."surveys" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "state" public.survey_status not null default 'draft'::public.survey_status,
    "image" text,
    "description" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."surveys" enable row level security;

CREATE UNIQUE INDEX answers_pkey ON public.answers USING btree (id);

CREATE UNIQUE INDEX answers_submission_id_question_id_key ON public.answers USING btree (submission_id, question_id);

CREATE UNIQUE INDEX questions_pkey ON public.questions USING btree (id);

CREATE UNIQUE INDEX questions_section_id_order_index_key ON public.questions USING btree (section_id, order_index);

CREATE UNIQUE INDEX sections_pkey ON public.sections USING btree (id);

CREATE UNIQUE INDEX sections_survey_id_order_index_key ON public.sections USING btree (survey_id, order_index);

CREATE UNIQUE INDEX submissions_pkey ON public.submissions USING btree (id);

CREATE UNIQUE INDEX surveys_pkey ON public.surveys USING btree (id);

alter table "public"."answers" add constraint "answers_pkey" PRIMARY KEY using index "answers_pkey";

alter table "public"."questions" add constraint "questions_pkey" PRIMARY KEY using index "questions_pkey";

alter table "public"."sections" add constraint "sections_pkey" PRIMARY KEY using index "sections_pkey";

alter table "public"."submissions" add constraint "submissions_pkey" PRIMARY KEY using index "submissions_pkey";

alter table "public"."surveys" add constraint "surveys_pkey" PRIMARY KEY using index "surveys_pkey";

alter table "public"."answers" add constraint "answers_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE not valid;

alter table "public"."answers" validate constraint "answers_question_id_fkey";

alter table "public"."answers" add constraint "answers_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE not valid;

alter table "public"."answers" validate constraint "answers_submission_id_fkey";

alter table "public"."answers" add constraint "answers_submission_id_question_id_key" UNIQUE using index "answers_submission_id_question_id_key";

alter table "public"."questions" add constraint "questions_section_id_fkey" FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE not valid;

alter table "public"."questions" validate constraint "questions_section_id_fkey";

alter table "public"."questions" add constraint "questions_section_id_order_index_key" UNIQUE using index "questions_section_id_order_index_key";

alter table "public"."sections" add constraint "sections_survey_id_fkey" FOREIGN KEY (survey_id) REFERENCES public.surveys(id) ON DELETE CASCADE not valid;

alter table "public"."sections" validate constraint "sections_survey_id_fkey";

alter table "public"."sections" add constraint "sections_survey_id_order_index_key" UNIQUE using index "sections_survey_id_order_index_key";

alter table "public"."submissions" add constraint "submissions_survey_id_fkey" FOREIGN KEY (survey_id) REFERENCES public.surveys(id) ON DELETE CASCADE not valid;

alter table "public"."submissions" validate constraint "submissions_survey_id_fkey";

alter table "public"."submissions" add constraint "submissions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."submissions" validate constraint "submissions_user_id_fkey";

alter table "public"."surveys" add constraint "surveys_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."surveys" validate constraint "surveys_user_id_fkey";

grant delete on table "public"."answers" to "anon";

grant insert on table "public"."answers" to "anon";

grant references on table "public"."answers" to "anon";

grant select on table "public"."answers" to "anon";

grant trigger on table "public"."answers" to "anon";

grant truncate on table "public"."answers" to "anon";

grant update on table "public"."answers" to "anon";

grant delete on table "public"."answers" to "authenticated";

grant insert on table "public"."answers" to "authenticated";

grant references on table "public"."answers" to "authenticated";

grant select on table "public"."answers" to "authenticated";

grant trigger on table "public"."answers" to "authenticated";

grant truncate on table "public"."answers" to "authenticated";

grant update on table "public"."answers" to "authenticated";

grant delete on table "public"."answers" to "service_role";

grant insert on table "public"."answers" to "service_role";

grant references on table "public"."answers" to "service_role";

grant select on table "public"."answers" to "service_role";

grant trigger on table "public"."answers" to "service_role";

grant truncate on table "public"."answers" to "service_role";

grant update on table "public"."answers" to "service_role";

grant delete on table "public"."questions" to "anon";

grant insert on table "public"."questions" to "anon";

grant references on table "public"."questions" to "anon";

grant select on table "public"."questions" to "anon";

grant trigger on table "public"."questions" to "anon";

grant truncate on table "public"."questions" to "anon";

grant update on table "public"."questions" to "anon";

grant delete on table "public"."questions" to "authenticated";

grant insert on table "public"."questions" to "authenticated";

grant references on table "public"."questions" to "authenticated";

grant select on table "public"."questions" to "authenticated";

grant trigger on table "public"."questions" to "authenticated";

grant truncate on table "public"."questions" to "authenticated";

grant update on table "public"."questions" to "authenticated";

grant delete on table "public"."questions" to "service_role";

grant insert on table "public"."questions" to "service_role";

grant references on table "public"."questions" to "service_role";

grant select on table "public"."questions" to "service_role";

grant trigger on table "public"."questions" to "service_role";

grant truncate on table "public"."questions" to "service_role";

grant update on table "public"."questions" to "service_role";

grant delete on table "public"."sections" to "anon";

grant insert on table "public"."sections" to "anon";

grant references on table "public"."sections" to "anon";

grant select on table "public"."sections" to "anon";

grant trigger on table "public"."sections" to "anon";

grant truncate on table "public"."sections" to "anon";

grant update on table "public"."sections" to "anon";

grant delete on table "public"."sections" to "authenticated";

grant insert on table "public"."sections" to "authenticated";

grant references on table "public"."sections" to "authenticated";

grant select on table "public"."sections" to "authenticated";

grant trigger on table "public"."sections" to "authenticated";

grant truncate on table "public"."sections" to "authenticated";

grant update on table "public"."sections" to "authenticated";

grant delete on table "public"."sections" to "service_role";

grant insert on table "public"."sections" to "service_role";

grant references on table "public"."sections" to "service_role";

grant select on table "public"."sections" to "service_role";

grant trigger on table "public"."sections" to "service_role";

grant truncate on table "public"."sections" to "service_role";

grant update on table "public"."sections" to "service_role";

grant delete on table "public"."submissions" to "anon";

grant insert on table "public"."submissions" to "anon";

grant references on table "public"."submissions" to "anon";

grant select on table "public"."submissions" to "anon";

grant trigger on table "public"."submissions" to "anon";

grant truncate on table "public"."submissions" to "anon";

grant update on table "public"."submissions" to "anon";

grant delete on table "public"."submissions" to "authenticated";

grant insert on table "public"."submissions" to "authenticated";

grant references on table "public"."submissions" to "authenticated";

grant select on table "public"."submissions" to "authenticated";

grant trigger on table "public"."submissions" to "authenticated";

grant truncate on table "public"."submissions" to "authenticated";

grant update on table "public"."submissions" to "authenticated";

grant delete on table "public"."submissions" to "service_role";

grant insert on table "public"."submissions" to "service_role";

grant references on table "public"."submissions" to "service_role";

grant select on table "public"."submissions" to "service_role";

grant trigger on table "public"."submissions" to "service_role";

grant truncate on table "public"."submissions" to "service_role";

grant update on table "public"."submissions" to "service_role";

grant delete on table "public"."surveys" to "anon";

grant insert on table "public"."surveys" to "anon";

grant references on table "public"."surveys" to "anon";

grant select on table "public"."surveys" to "anon";

grant trigger on table "public"."surveys" to "anon";

grant truncate on table "public"."surveys" to "anon";

grant update on table "public"."surveys" to "anon";

grant delete on table "public"."surveys" to "authenticated";

grant insert on table "public"."surveys" to "authenticated";

grant references on table "public"."surveys" to "authenticated";

grant select on table "public"."surveys" to "authenticated";

grant trigger on table "public"."surveys" to "authenticated";

grant truncate on table "public"."surveys" to "authenticated";

grant update on table "public"."surveys" to "authenticated";

grant delete on table "public"."surveys" to "service_role";

grant insert on table "public"."surveys" to "service_role";

grant references on table "public"."surveys" to "service_role";

grant select on table "public"."surveys" to "service_role";

grant trigger on table "public"."surveys" to "service_role";

grant truncate on table "public"."surveys" to "service_role";

grant update on table "public"."surveys" to "service_role";


  create policy "anonymous users can insert answers for anonymous submissions"
  on "public"."answers"
  as permissive
  for insert
  to anon
with check ((EXISTS ( SELECT 1
   FROM (public.submissions sub
     JOIN public.surveys s ON ((s.id = sub.survey_id)))
  WHERE ((sub.id = answers.submission_id) AND (s.state = 'published'::public.survey_status) AND (sub.user_id IS NULL)))));



  create policy "authenticated users can insert answers for valid submissions"
  on "public"."answers"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM (public.submissions sub
     JOIN public.surveys s ON ((s.id = sub.survey_id)))
  WHERE ((sub.id = answers.submission_id) AND (s.state = 'published'::public.survey_status) AND ((sub.user_id = ( SELECT auth.uid() AS uid)) OR (sub.user_id IS NULL))))));



  create policy "authenticated users can read answers of their own submissions"
  on "public"."answers"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.submissions sub
  WHERE ((sub.id = answers.submission_id) AND (sub.user_id = ( SELECT auth.uid() AS uid))))));



  create policy "survey owners can read answers of their surveys"
  on "public"."answers"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.submissions sub
     JOIN public.surveys s ON ((s.id = sub.survey_id)))
  WHERE ((sub.id = answers.submission_id) AND (s.user_id = ( SELECT auth.uid() AS uid))))));



  create policy "owners can manage questions of their surveys"
  on "public"."questions"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.sections sec
     JOIN public.surveys s ON ((s.id = sec.survey_id)))
  WHERE ((sec.id = questions.section_id) AND (s.user_id = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM (public.sections sec
     JOIN public.surveys s ON ((s.id = sec.survey_id)))
  WHERE ((sec.id = questions.section_id) AND (s.user_id = ( SELECT auth.uid() AS uid))))));



  create policy "public can read questions of published surveys"
  on "public"."questions"
  as permissive
  for select
  to anon
using ((EXISTS ( SELECT 1
   FROM (public.sections sec
     JOIN public.surveys s ON ((s.id = sec.survey_id)))
  WHERE ((sec.id = questions.section_id) AND (s.state = 'published'::public.survey_status)))));



  create policy "owners can manage sections of their surveys"
  on "public"."sections"
  as permissive
  for all
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.surveys s
  WHERE ((s.id = sections.survey_id) AND (s.user_id = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM public.surveys s
  WHERE ((s.id = sections.survey_id) AND (s.user_id = ( SELECT auth.uid() AS uid))))));



  create policy "public can read sections of published surveys"
  on "public"."sections"
  as permissive
  for select
  to anon
using ((EXISTS ( SELECT 1
   FROM public.surveys s
  WHERE ((s.id = sections.survey_id) AND (s.state = 'published'::public.survey_status)))));



  create policy "anonymous users can create anonymous submissions for published "
  on "public"."submissions"
  as permissive
  for insert
  to anon
with check (((user_id IS NULL) AND (EXISTS ( SELECT 1
   FROM public.surveys s
  WHERE ((s.id = submissions.survey_id) AND (s.state = 'published'::public.survey_status))))));



  create policy "authenticated users can create submissions for published survey"
  on "public"."submissions"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT 1
   FROM public.surveys s
  WHERE ((s.id = submissions.survey_id) AND (s.state = 'published'::public.survey_status)))) AND ((user_id = ( SELECT auth.uid() AS uid)) OR (user_id IS NULL))));



  create policy "authenticated users can read their own submissions"
  on "public"."submissions"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "survey owners can read submissions of their surveys"
  on "public"."submissions"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.surveys s
  WHERE ((s.id = submissions.survey_id) AND (s.user_id = ( SELECT auth.uid() AS uid))))));



  create policy "authenticated users can create surveys for themselves"
  on "public"."surveys"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "owners can delete their own surveys"
  on "public"."surveys"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "owners can update their own surveys"
  on "public"."surveys"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "public can read published surveys"
  on "public"."surveys"
  as permissive
  for select
  to anon, authenticated
using ((state = 'published'::public.survey_status));




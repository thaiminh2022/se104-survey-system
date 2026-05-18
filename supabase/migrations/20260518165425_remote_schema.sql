


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."question_types" AS ENUM (
    'single-choice',
    'multiple-choice',
    'rating-scale',
    'likert-scale',
    'short-text',
    'long-text',
    'dropdown',
    'yes-no',
    'matrix',
    'ranking',
    'date-time',
    'consent',
    'number'
);


ALTER TYPE "public"."question_types" OWNER TO "postgres";


CREATE TYPE "public"."section_end_behavior" AS ENUM (
    'continue',
    'submit',
    'end_survey'
);


ALTER TYPE "public"."section_end_behavior" OWNER TO "postgres";


CREATE TYPE "public"."survey_status" AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE "public"."survey_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_survey_submission_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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
$$;


ALTER FUNCTION "public"."update_survey_submission_count"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."answers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "submission_id" "uuid" NOT NULL,
    "question_id" "uuid" NOT NULL,
    "answer_data" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "answer_type" "public"."question_types" NOT NULL
);


ALTER TABLE "public"."answers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section_id" "uuid" NOT NULL,
    "order_index" integer NOT NULL,
    "title" "text" NOT NULL,
    "image" "text",
    "description" "text",
    "question_type" "text" NOT NULL,
    "config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "required" boolean DEFAULT false NOT NULL,
    CONSTRAINT "questions_question_type_check" CHECK (("question_type" = ANY (ARRAY['single-choice'::"text", 'multiple-choice'::"text", 'rating-scale'::"text", 'likert-scale'::"text", 'short-text'::"text", 'long-text'::"text", 'dropdown'::"text", 'yes-no'::"text", 'matrix'::"text", 'ranking'::"text", 'date-time'::"text", 'consent'::"text", 'number'::"text"])))
);


ALTER TABLE "public"."questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "survey_id" "uuid" NOT NULL,
    "order_index" integer NOT NULL,
    "end_behavior" "public"."section_end_behavior" DEFAULT 'continue'::"public"."section_end_behavior" NOT NULL,
    "config" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "survey_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "submitted_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."surveys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "state" "public"."survey_status" DEFAULT 'draft'::"public"."survey_status" NOT NULL,
    "image" "text",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "submission_count" integer DEFAULT 0 NOT NULL,
    "view_count" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "surveys_submission_count_check" CHECK (("submission_count" >= 0)),
    CONSTRAINT "surveys_view_count_check" CHECK (("view_count" >= 0))
);


ALTER TABLE "public"."surveys" OWNER TO "postgres";


ALTER TABLE ONLY "public"."answers"
    ADD CONSTRAINT "answers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."answers"
    ADD CONSTRAINT "answers_submission_id_question_id_key" UNIQUE ("submission_id", "question_id");



ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_section_id_order_index_key" UNIQUE ("section_id", "order_index");



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_survey_id_order_index_key" UNIQUE ("survey_id", "order_index");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."surveys"
    ADD CONSTRAINT "surveys_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "submissions_count_trigger" AFTER INSERT OR DELETE OR UPDATE OF "survey_id" ON "public"."submissions" FOR EACH ROW EXECUTE FUNCTION "public"."update_survey_submission_count"();



ALTER TABLE ONLY "public"."answers"
    ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."answers"
    ADD CONSTRAINT "answers_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sections"
    ADD CONSTRAINT "sections_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "public"."surveys"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "public"."surveys"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."surveys"
    ADD CONSTRAINT "surveys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "anonymous users can create anonymous submissions for published " ON "public"."submissions" FOR INSERT TO "anon" WITH CHECK ((("user_id" IS NULL) AND (EXISTS ( SELECT 1
   FROM "public"."surveys" "s"
  WHERE (("s"."id" = "submissions"."survey_id") AND ("s"."state" = 'published'::"public"."survey_status"))))));



CREATE POLICY "anonymous users can insert answers for anonymous submissions" ON "public"."answers" FOR INSERT TO "anon" WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."submissions" "sub"
     JOIN "public"."surveys" "s" ON (("s"."id" = "sub"."survey_id")))
  WHERE (("sub"."id" = "answers"."submission_id") AND ("s"."state" = 'published'::"public"."survey_status") AND ("sub"."user_id" IS NULL)))));



CREATE POLICY "authenticated users can create submissions for published survey" ON "public"."submissions" FOR INSERT TO "authenticated" WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."surveys" "s"
  WHERE (("s"."id" = "submissions"."survey_id") AND ("s"."state" = 'published'::"public"."survey_status")))) AND (("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("user_id" IS NULL))));



CREATE POLICY "authenticated users can create surveys for themselves" ON "public"."surveys" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "authenticated users can insert answers for valid submissions" ON "public"."answers" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."submissions" "sub"
     JOIN "public"."surveys" "s" ON (("s"."id" = "sub"."survey_id")))
  WHERE (("sub"."id" = "answers"."submission_id") AND ("s"."state" = 'published'::"public"."survey_status") AND (("sub"."user_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("sub"."user_id" IS NULL))))));



CREATE POLICY "authenticated users can read answers of their own submissions" ON "public"."answers" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."submissions" "sub"
  WHERE (("sub"."id" = "answers"."submission_id") AND ("sub"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "authenticated users can read their own submissions" ON "public"."submissions" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "owners can delete their own surveys" ON "public"."surveys" FOR DELETE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "owners can manage questions of their surveys" ON "public"."questions" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."sections" "sec"
     JOIN "public"."surveys" "s" ON (("s"."id" = "sec"."survey_id")))
  WHERE (("sec"."id" = "questions"."section_id") AND ("s"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."sections" "sec"
     JOIN "public"."surveys" "s" ON (("s"."id" = "sec"."survey_id")))
  WHERE (("sec"."id" = "questions"."section_id") AND ("s"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "owners can manage sections of their surveys" ON "public"."sections" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."surveys" "s"
  WHERE (("s"."id" = "sections"."survey_id") AND ("s"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."surveys" "s"
  WHERE (("s"."id" = "sections"."survey_id") AND ("s"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "owners can update their own surveys" ON "public"."surveys" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "public can read published surveys" ON "public"."surveys" FOR SELECT TO "authenticated", "anon" USING (("state" = 'published'::"public"."survey_status"));



CREATE POLICY "public can read questions of published surveys" ON "public"."questions" FOR SELECT TO "anon" USING ((EXISTS ( SELECT 1
   FROM ("public"."sections" "sec"
     JOIN "public"."surveys" "s" ON (("s"."id" = "sec"."survey_id")))
  WHERE (("sec"."id" = "questions"."section_id") AND ("s"."state" = 'published'::"public"."survey_status")))));



CREATE POLICY "public can read sections of published surveys" ON "public"."sections" FOR SELECT TO "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."surveys" "s"
  WHERE (("s"."id" = "sections"."survey_id") AND ("s"."state" = 'published'::"public"."survey_status")))));



CREATE POLICY "survey owners can read answers of their surveys" ON "public"."answers" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."submissions" "sub"
     JOIN "public"."surveys" "s" ON (("s"."id" = "sub"."survey_id")))
  WHERE (("sub"."id" = "answers"."submission_id") AND ("s"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "survey owners can read submissions of their surveys" ON "public"."submissions" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."surveys" "s"
  WHERE (("s"."id" = "submissions"."survey_id") AND ("s"."user_id" = ( SELECT "auth"."uid"() AS "uid"))))));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."update_survey_submission_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_survey_submission_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_survey_submission_count"() TO "service_role";
























GRANT ALL ON TABLE "public"."answers" TO "anon";
GRANT ALL ON TABLE "public"."answers" TO "authenticated";
GRANT ALL ON TABLE "public"."answers" TO "service_role";



GRANT ALL ON TABLE "public"."questions" TO "anon";
GRANT ALL ON TABLE "public"."questions" TO "authenticated";
GRANT ALL ON TABLE "public"."questions" TO "service_role";



GRANT ALL ON TABLE "public"."sections" TO "anon";
GRANT ALL ON TABLE "public"."sections" TO "authenticated";
GRANT ALL ON TABLE "public"."sections" TO "service_role";



GRANT ALL ON TABLE "public"."submissions" TO "anon";
GRANT ALL ON TABLE "public"."submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."submissions" TO "service_role";



GRANT ALL ON TABLE "public"."surveys" TO "anon";
GRANT ALL ON TABLE "public"."surveys" TO "authenticated";
GRANT ALL ON TABLE "public"."surveys" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

drop policy "public can read published surveys" on "public"."surveys";


  create policy "public can read published surveys"
  on "public"."surveys"
  as permissive
  for select
  to anon, authenticated
using ((state = 'published'::public.survey_status));




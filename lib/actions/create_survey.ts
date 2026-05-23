"use server";

import {
  QuestionInsert,
  SectionInsert,
  SurveyInsert,
} from "@/lib/types/db_schema";
import { createError } from "@/lib/types/errors";
import { Survey } from "@/lib/types/question-type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { isPlaywrightE2E } from "@/lib/e2e/fixtures";

export async function submitSurvey(s: Survey, isDraft: boolean) {
  if (isPlaywrightE2E()) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/surveys");
    redirect("/dashboard/surveys");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return createError(error, error.message);
  }

  const userId = data.user.id;

  const surveySchema: SurveyInsert = {
    user_id: userId,
    title: s.title,
    description: s.description,
    state: isDraft ? "draft" : "published",
  };

  const surveyInsertRes = await supabase
    .from("surveys")
    .insert([surveySchema])
    .select("id")
    .limit(1)
    .single();

  if (surveyInsertRes.error) {
    return createError(
      surveyInsertRes.error,
      `Survey insert error: ${surveyInsertRes.error.message}`,
    );
  }

  const surveyId = surveyInsertRes.data.id as string;

  const sectionSchemas: SectionInsert[] = s.sections.map((sec, index) => ({
    id: sec.id,
    survey_id: surveyId,
    order_index: index,
    end_behavior: "continue",
    config: "{}",
    title: sec.title,
    description: sec.description,
  }));

  if (sectionSchemas.length > 0) {
    const sectionInsertRes = await supabase
      .from("sections")
      .insert(sectionSchemas);

    if (sectionInsertRes.error) {
      return createError(
        sectionInsertRes.error,
        `Section insert error: ${sectionInsertRes.error.message}`,
      );
    }
  }

  const questionSchemas: QuestionInsert[] = s.sections.flatMap((sec) =>
    sec.questions.map((q, index) => ({
      section_id: sec.id,
      order_index: index,
      title: q.title,
      question_type: q.question_type,
      config: q.config,
      description: q.description,
      required: q.required,
    })),
  );

  if (questionSchemas.length > 0) {
    const questionsInsertRes = await supabase
      .from("questions")
      .insert(questionSchemas);

    if (questionsInsertRes.error) {
      return createError(
        questionsInsertRes.error,
        `Question insert error: ${questionsInsertRes.error.message}`,
      );
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/surveys");
  redirect("/dashboard/surveys");
}

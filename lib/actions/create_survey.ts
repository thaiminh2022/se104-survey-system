"use server";

import { QuestionInsert, SectionInsert, SurveyInsert } from "@/types/db_schema";
import { ActionState, createError } from "@/types/errors";
import { Survey } from "@/types/question-type";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export async function submitSurvey(s: Survey) {
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
    state: "draft",
  };

  const surveyInsertRes = await supabase
    .from("surveys")
    .insert([surveySchema])
    .select("id")
    .limit(1)
    .single();

  if (surveyInsertRes.error) {
    return createError(surveyInsertRes.error, surveyInsertRes.error.message);
  }

  const surveyId = surveyInsertRes.data.id as string;
  // insert them sections

  const sectionAndQuestions = s.sections.map((sec, i) => {
    const index = i;
    const sectionSchema: SectionInsert = {
      survey_id: surveyId,
      order_index: index,
      end_behavior: "continue",
      config: null,
      title: sec.title,
      description: sec.description,
    };

    const questionSchemas = sec.questions.map((q, j) => {
      const jndex = j;
      const questionSchema: QuestionInsert = {
        section_id: sec.id,
        order_index: jndex,
        title: q.title,
        question_type: q.question_type,
        config: JSON.stringify(q.config),
        required: q.required,
      };

      return questionSchema;
    });

    return { sectionSchema, questionSchemas };
  });

  const errors: ActionState<unknown>[] = [];
  sectionAndQuestions.forEach(async ({ sectionSchema, questionSchemas }) => {
    const sectionInsertRes = await supabase
      .from("sections")
      .insert([sectionSchema]);

    if (sectionInsertRes.error) {
      errors.push(
        createError(sectionInsertRes.error, sectionInsertRes.error.message),
      );
      return;
    }

    const questionsInsertRes = await supabase
      .from("questions")
      .insert(questionSchemas);

    if (questionsInsertRes.error) {
      errors.push(
        createError(questionsInsertRes.error, questionsInsertRes.error.message),
      );
    }
  });
  if (errors.length > 0) {
    return createError(errors, "Multiple error");
  }

  revalidatePath("/dashboard/surveys");
  redirect("/dashboard/surveys");
}

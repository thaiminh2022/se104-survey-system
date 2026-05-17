"use server";

import type { AnswerForm } from "@/lib/types/answer-type";
import { AnswerInsert, SubmissionInsert } from "@/lib/types/db_schema";
import { createError, createSuccess } from "@/lib/types/errors";
import { createClient } from "../supabase/server";

export async function fakeSubmitSurveyResponse(
  surveyId: string,
  answerForm: AnswerForm,
) {
  const submission: SubmissionInsert = {
    survey_id: surveyId,
    user_id: "test- user",
    submitted_at: new Date(),
  };
  const answerRows: AnswerInsert[] = Object.entries(answerForm.answers).map(
    ([questionId, answer]) =>
      ({
        submission_id: submission.id, // This will be set by the database
        question_id: questionId,
        answer_type: answer.answer_type,
        answer: answer.config,
      }) as AnswerInsert,
  );
  console.log(submission);
  console.log(answerRows);

  return createSuccess(null);
}
export async function submitSurveyResponse(surveyId: string, answerForm: AnswerForm) {
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();
  if (userRes.error) {
    return createError(userRes.error, userRes.error.message);
  }
  const user = userRes.data.user;
} 

export async function getUser() {
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();

  if (userRes.error) {
    return createError(userRes.error, userRes.error.message);
  }
  return createSuccess(userRes.data.user);
}

"use server";

import type { AnswerForm } from "@/lib/types/answer-type";
import { AnswerInsert, SubmissionInsert } from "@/lib/types/db_schema";
import { createError, createSuccess } from "@/lib/types/errors";
import { createClient } from "../supabase/server";
import { getUser } from "./read_user";

export async function fakeSubmitSurveyResponse(
  surveyId: string,
  answerForm: AnswerForm,
) {
  const submission: SubmissionInsert = {
    survey_id: surveyId,
    user_id: "test-user",
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

export async function submitSurveyResponse(
  surveyId: string,
  answerForm: AnswerForm,
) {
  const submission: SubmissionInsert = {
    survey_id: surveyId,
    user_id: "test-user",
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

  if (answerRows.length == 0) {
    return createError(null, "No answers");
  }

  const userRes = await getUser();
  let userId = "empty";
  if (userRes.success === true) {
    userId = userRes.data.id;
  }
  const supabase = await createClient();
  const submissionInsertRes = await supabase
    .from("submissions")
    .insert([submission])
    .select("id")
    .limit(1)
    .single();

  if (submissionInsertRes.error) {
    return createError(
      submissionInsertRes.error,
      submissionInsertRes.error.message,
    );
  }
  const submissionId: string = submissionInsertRes.data.id;
  const answers = answerRows.flatMap((x) => {
    return {
      ...x,
      submission_id: submissionId,
    } as AnswerInsert;
  });

  const answersInsertRes = await supabase
    .from("answers")
    .insert(answers)
    .select();

  if (answersInsertRes.error) {
    return createError(answersInsertRes.error, answersInsertRes.error.message);
  }

  return createSuccess(null);
}

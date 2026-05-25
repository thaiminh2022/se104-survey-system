"use server";

import { isPlaywrightE2E } from "@/lib/e2e/fixtures";
import type { AnswerForm } from "@/lib/types/answer-type";
import {
  AnswerInsert,
  QuestionRow,
  SectionRow,
  SubmissionInsert,
  SurveyRow,
} from "@/lib/types/db_schema";
import { createError, createSuccess } from "@/lib/types/errors";
import {
  Question,
  QuestionConfigByType,
  QuestionTypes,
  Section,
  Survey,
} from "@/lib/types/question-type";
import { validateSurveyResponse } from "@/lib/validations/survey_response";
import { createClient } from "../supabase/server";
import { getPublishedSurveyAccessStatus } from "./read_survey";
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
        answer_data: answer.config,
        answer_type: answer.answer_type,
      }) as AnswerInsert,
  );
  return createSuccess(null);
}

export async function submitSurveyResponse(
  surveyId: string,
  answerForm: AnswerForm,
) {
  const responseAnswers = answerForm.answers ?? {};
  if (Object.keys(responseAnswers).length === 0) {
    return createError(null, "No answers");
  }

  if (isPlaywrightE2E()) {
    return createSuccess(null);
  }

  const userRes = await getUser();
  let userId = null;
  if (userRes.success === true) {
    userId = userRes.data.id;
  }

  const submission: SubmissionInsert = {
    survey_id: surveyId,
    user_id: userId,
    submitted_at: new Date(),
  };
  const answerRows: AnswerInsert[] = Object.entries(responseAnswers).map(
    ([questionId, answer]) =>
      ({
        submission_id: submission.id, // This will be set by the database
        question_id: questionId,
        answer_data: answer.config,
        answer_type: answer.answer_type,
      }) as AnswerInsert,
  );
  const supabase = await createClient();
  const accessRes = await getPublishedSurveyAccessStatus(supabase, surveyId);

  if (!accessRes.success) {
    return accessRes;
  }

  if (accessRes.data === "auth_required") {
    return createError(null, "Authentication required for this survey.");
  }

  if (accessRes.data === "denied") {
    return createError(null, "You are not allowed to submit this survey.");
  }

  if (accessRes.data === "not_found") {
    return createError(null, "Survey not found");
  }

  const surveyRes = await getPublishedSurveyForResponseValidation(
    supabase,
    surveyId,
  );

  if (!surveyRes.success) {
    return surveyRes;
  }

  const responseValidation = validateSurveyResponse(surveyRes.data, {
    answers: responseAnswers,
  });

  if (!responseValidation.success) {
    return createError(
      null,
      responseValidation.message ?? "Please complete all required questions.",
    );
  }

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

async function getPublishedSurveyForResponseValidation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  surveyId: string,
) {
  const { data: surveyData, error: surveyError } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", surveyId)
    .eq("state", "published")
    .limit(1)
    .single();

  if (surveyError) {
    return createError(surveyError, surveyError.message);
  }

  const surveyRow = surveyData as SurveyRow;
  const { data: sectionsData, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("survey_id", surveyId)
    .order("order_index", { ascending: true });

  if (sectionsError) {
    return createError(sectionsError, sectionsError.message);
  }

  const sections: Section[] = (sectionsData as SectionRow[]).map(
    (sectionRow) => ({
      id: sectionRow.id,
      title: sectionRow.title,
      description: sectionRow.description ?? "",
      questions: [],
    }),
  );

  for (const section of sections) {
    const { data: questionsData, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("section_id", section.id)
      .order("order_index", { ascending: true });

    if (questionsError) {
      return createError(questionsError, questionsError.message);
    }

    section.questions = (questionsData as QuestionRow[]).map(toQuestion);
  }

  return createSuccess<Survey>({
    id: surveyRow.id,
    title: surveyRow.title,
    state: surveyRow.state,
    description: surveyRow.description ?? "",
    sections,
  });
}

function toQuestion(questionRow: QuestionRow): Question {
  return {
    id: questionRow.id,
    title: questionRow.title,
    description: questionRow.description ?? "",
    question_type: questionRow.question_type as QuestionTypes,
    config: parseQuestionConfig(questionRow.config),
    required: questionRow.required,
  } as Question;
}

function parseQuestionConfig(
  config: unknown,
): QuestionConfigByType[QuestionTypes] {
  if (typeof config === "string") {
    try {
      return JSON.parse(config) as QuestionConfigByType[QuestionTypes];
    } catch {
      return {};
    }
  }

  if (config && typeof config === "object") {
    return config as QuestionConfigByType[QuestionTypes];
  }

  return {};
}

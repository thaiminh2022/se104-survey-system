"use server";

import type { Answer, AnswerConfigByType } from "@/types/answer-type";
import type { AnswerInsert, QuestionRow, SectionRow, SurveyRow } from "@/types/db_schema";
import { createError, createSuccess, type ActionState } from "@/types/errors";
import type { QuestionTypes } from "@/types/question-type";
import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export type SubmitSurveyResponseState = ActionState<{ submissionId: string }>;


export async function fakeSubmitSurveyResponse(
  _previousState: SubmitSurveyResponseState,
  formData: FormData,
) {
  console.log("Fake submit survey response called");
  console.log(formData);
  const surveyId = formData.get("survey_id");
  const answerPayload = formData.get("answer_payload");

  if (typeof surveyId !== "string" || !surveyId) {
    return createError("Missing survey id", "Missing survey id");
  }

  if (typeof answerPayload !== "string") {
    return createError("Missing answer payload", "Missing answer payload");
  }

  let rawAnswers: RawAnswers;
  try {
    rawAnswers = JSON.parse(answerPayload) as RawAnswers;
  } catch (error) {
    return createError(error, "Invalid answer payload");
  }
  console.log("Received survey response", { surveyId, rawAnswers });
  return createSuccess({ submissionId: "fake-submission-id" });
}

export async function submitSurveyResponse(
  _previousState: SubmitSurveyResponseState,
  formData: FormData,
): Promise<SubmitSurveyResponseState> {
  const surveyId = formData.get("survey_id");
  const answerPayload = formData.get("answer_payload");

  if (typeof surveyId !== "string" || !surveyId) {
    return createError("Missing survey id", "Missing survey id");
  }

  if (typeof answerPayload !== "string") {
    return createError("Missing answer payload", "Missing answer payload");
  }

  let rawAnswers: RawAnswers;
  try {
    rawAnswers = JSON.parse(answerPayload) as RawAnswers;
  } catch (error) {
    return createError(error, "Invalid answer payload");
  }

  const supabase = await createClient();
  const userResult = await supabase.auth.getUser();
  if (userResult.error || !userResult.data.user) {
    return createError(
      userResult.error ?? "Unauthenticated",
      "You must be signed in to submit this survey",
    );
  }

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

  const survey = surveyData as SurveyRow;
  const { data: sectionData, error: sectionError } = await supabase
    .from("sections")
    .select("*")
    .eq("survey_id", survey.id);

  if (sectionError) {
    return createError(sectionError, sectionError.message);
  }

  const sections = sectionData as SectionRow[];
  const sectionIds = sections.map((section) => section.id);

  if (sectionIds.length === 0) {
    return createError("Survey has no sections", "Survey has no sections");
  }

  const { data: questionData, error: questionError } = await supabase
    .from("questions")
    .select("*")
    .in("section_id", sectionIds);

  if (questionError) {
    return createError(questionError, questionError.message);
  }

  const questions = questionData as QuestionRow[];
  const missingRequiredQuestion = questions.find((question) => {
    if (!question.required) {
      return false;
    }

    return isEmptyAnswer(rawAnswers[question.id]);
  });

  if (missingRequiredQuestion) {
    return createError(
      missingRequiredQuestion.id,
      `Missing required answer: ${missingRequiredQuestion.title}`,
    );
  }

  const { data: submissionData, error: submissionError } = await supabase
    .from("submissions")
    .insert([
      {
        survey_id: survey.id,
        user_id: userResult.data.user.id,
        submmited_at: new Date().toISOString(),
      },
    ])
    .select("id")
    .limit(1)
    .single();

  if (submissionError) {
    return createError(submissionError, submissionError.message);
  }

  const submissionId = submissionData.id as string;
  const answerRows = questions.reduce<AnswerInsert[]>((rows, question) => {
    const value = rawAnswers[question.id];
    if (isEmptyAnswer(value)) {
      return rows;
    }

    const answer = toAnswer(question, value);
    rows.push({
      submission_id: submissionId,
      question_id: question.id,
      answer: answer.config as AnswerInsert["answer"],
      answer_data: answer as AnswerInsert["answer_data"],
    });
    return rows;
  }, []);

  if (answerRows.length > 0) {
    const { error: answerError } = await supabase.from("answers").insert(answerRows);

    if (answerError) {
      return createError(answerError, answerError.message);
    }
  }

  revalidatePath(`/surveys/${survey.id}`);
  return createSuccess({ submissionId });
}

function isEmptyAnswer(value: RawAnswerValue | undefined) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  );
}

function toAnswer(question: QuestionRow, value: RawAnswerValue): Answer {
  const answerType = question.question_type as QuestionTypes;
  const config = toAnswerConfig(answerType, value);

  return {
    question_id: question.id,
    answer_type: answerType,
    config,
  } as Answer;
}

function toAnswerConfig<TType extends QuestionTypes>(
  answerType: TType,
  value: RawAnswerValue,
): AnswerConfigByType[TType] {
  switch (answerType) {
    case "short-answer":
    case "long-answer":
    case "datetime":
      return { answer: String(value ?? "") } as AnswerConfigByType[TType];
    case "multiple-choice":
    case "dropdown":
      return { selected_option: String(value ?? "") } as AnswerConfigByType[TType];
    case "checkbox":
      return {
        selected_options: Array.isArray(value) ? value.map(String) : [],
      } as AnswerConfigByType[TType];
    case "number":
      return { answer: Number(value) } as AnswerConfigByType[TType];
    case "rating":
      return { rating: Number(value) } as AnswerConfigByType[TType];
  }
}

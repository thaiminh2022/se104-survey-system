"use server";

import {
  AnswerRow,
  QuestionRow,
  SectionRow,
  SurveyRow,
  SurveyRowJoinSectionRowJoinQuestionRow,
  SurveyRowJoinSubmissionRow,
} from "@/lib/types/db_schema";
import { createError, createSuccess } from "@/lib/types/errors";
import { createClient } from "../supabase/server";
import { getUser } from "./read_user";

export type QuestionAnswerAnalyticsRow = QuestionRow & {
  answers: Pick<AnswerRow, "id" | "question_id" | "answer_data" | "created_at">[];
};

export type QuestionAnswerAnalyticsSection = SectionRow & {
  questions: QuestionAnswerAnalyticsRow[];
};

export async function getSurveyAnalyticsRowsForUser() {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;

  const { data: surveysRows, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("user_id", user.id)
    .order("submission_count", { ascending: false })
    .order("view_count", { ascending: false });

  if (error) {
    return createError(error, error.message);
  }

  return createSuccess<SurveyRow[]>(surveysRows as SurveyRow[]);
}

export async function getSurveyAnalytics(surveyId: string) {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;

  const res = await supabase
    .from("surveys")
    .select(
      `
      *,
      submissions(*) 
    `,
    )
    .eq("user_id", user.id)
    .eq("id", surveyId)
    .limit(1)
    .single();

  if (res.error) {
    return createError(res.error, res.error.message);
  }

  if (!res.data) {
    return createSuccess(null);
  }

  return createSuccess(res.data as SurveyRowJoinSubmissionRow);
}

export async function getQuestionAnswerAnalytics(surveyId: string) {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;

  const surveyRes = await supabase
    .from("surveys")
    .select(
      `
      *,
      sections(
        *,
        questions(*)
      )
    `,
    )
    .eq("id", surveyId)
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (surveyRes.error) {
    return createError(surveyRes.error, surveyRes.error.message);
  }

  const survey = surveyRes.data as SurveyRowJoinSectionRowJoinQuestionRow;
  const sections = [...survey.sections].sort(
    (a, b) => a.order_index - b.order_index,
  );
  if (sections.length === 0) {
    return createSuccess<QuestionAnswerAnalyticsSection[]>([]);
  }

  const questions = sections
    .flatMap((section) => section.questions)
    .sort((a, b) => a.order_index - b.order_index);
  const questionIds = questions.map((question) => question.id);
  const answers =
    questionIds.length > 0
      ? await supabase
          .from("answers")
          .select("id, question_id, answer_data, created_at")
          .in("question_id", questionIds)
      : { data: [], error: null };

  if (answers.error) {
    return createError(answers.error, answers.error.message);
  }

  const answersByQuestion = new Map<string, QuestionAnswerAnalyticsRow["answers"]>();
  (answers.data as QuestionAnswerAnalyticsRow["answers"]).forEach((answer) => {
    const questionAnswers = answersByQuestion.get(answer.question_id) ?? [];
    questionAnswers.push(answer);
    answersByQuestion.set(answer.question_id, questionAnswers);
  });

  const questionsBySection = new Map<string, QuestionAnswerAnalyticsRow[]>();
  questions.forEach((question) => {
    const sectionQuestions = questionsBySection.get(question.section_id) ?? [];
    sectionQuestions.push({
      ...question,
      answers: answersByQuestion.get(question.id) ?? [],
    });
    questionsBySection.set(question.section_id, sectionQuestions);
  });

  return createSuccess<QuestionAnswerAnalyticsSection[]>(
    sections.map((section) => ({
      ...section,
      questions: (questionsBySection.get(section.id) ?? []).sort(
        (a, b) => a.order_index - b.order_index,
      ),
    })),
  );
}

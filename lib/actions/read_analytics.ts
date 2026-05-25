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
import {
  e2eSections,
  e2eSubmissions,
  e2eSurveyRows,
  getE2ESurveyAnalytics,
  isPlaywrightE2E,
} from "@/lib/e2e/fixtures";

export type QuestionAnswerAnalyticsRow = QuestionRow & {
  answers: Pick<AnswerRow, "id" | "question_id" | "answer_data" | "created_at">[];
};

export type QuestionAnswerAnalyticsSection = SectionRow & {
  questions: QuestionAnswerAnalyticsRow[];
};

export async function getSurveyAnalyticsRowsForUser() {
  if (isPlaywrightE2E()) {
    return createSuccess<SurveyRow[]>(e2eSurveyRows);
  }

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
    .order("created_at", { ascending: false });

  if (error) {
    return createError(error, error.message);
  }

  const surveyIds = (surveysRows ?? []).map((survey) => survey.id);
  const submissionsRes =
    surveyIds.length > 0
      ? await supabase
          .from("submissions")
          .select("id, survey_id, submitted_at")
          .in("survey_id", surveyIds)
      : { data: [], error: null };

  if (submissionsRes.error) {
    return createError(submissionsRes.error, submissionsRes.error.message);
  }

  const submissionCounts = new Map<string, number>();
  for (const submission of submissionsRes.data ?? []) {
    const count = submissionCounts.get(submission.survey_id) ?? 0;
    submissionCounts.set(submission.survey_id, count + 1);
  }

  const surveys = (surveysRows ?? [])
    .map((survey) =>
      normalizeSurveyMetrics(
        survey as Partial<SurveyRow>,
        submissionCounts.get(survey.id) ?? 0,
      ),
    )
    .sort(
      (a, b) =>
        b.submission_count - a.submission_count ||
        b.view_count - a.view_count ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  return createSuccess<SurveyRow[]>(surveys);
}

export async function getSurveyAnalytics(surveyId: string) {
  if (isPlaywrightE2E()) {
    return createSuccess(
      surveyId === "e2e-survey" ? getE2ESurveyAnalytics() : null,
    );
  }

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

  const survey = res.data as Partial<SurveyRowJoinSubmissionRow>;
  const submissions = survey.submissions ?? [];

  return createSuccess({
    ...normalizeSurveyMetrics(survey, submissions.length),
    submissions,
  } as SurveyRowJoinSubmissionRow);
}

export async function getQuestionAnswerAnalytics(surveyId: string) {
  if (isPlaywrightE2E()) {
    if (surveyId !== "e2e-survey") {
      return createSuccess<QuestionAnswerAnalyticsSection[]>([]);
    }

    return createSuccess<QuestionAnswerAnalyticsSection[]>(
      e2eSections.map((section) => ({
        ...section,
        questions: section.questions.map((question) => ({
          ...question,
          answers: e2eSubmissions.flatMap((submission) =>
            submission.answers
              .filter((answer) => answer.question_id === question.id)
              .map(({ id, question_id, answer_data, created_at }) => ({
                id,
                question_id,
                answer_data,
                created_at,
              })),
          ),
        })),
      })),
    );
  }

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

function normalizeSurveyMetrics(
  survey: Partial<SurveyRow>,
  fallbackSubmissionCount = 0,
): SurveyRow {
  return {
    ...(survey as SurveyRow),
    submission_count: Number(
      survey.submission_count ?? fallbackSubmissionCount ?? 0,
    ),
    view_count: Number(survey.view_count ?? 0),
  };
}

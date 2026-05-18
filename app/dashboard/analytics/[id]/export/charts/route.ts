import type {
  QuestionAnswerAnalyticsRow,
  QuestionAnswerAnalyticsSection,
} from "@/lib/actions/read_analytics";
import {
  buildChartReport,
  ChartReportSurvey,
  getChartReportFilename,
} from "@/lib/exports/chart_report";
import { createClient } from "@/lib/supabase/server";
import type { AnswerRow } from "@/lib/types/db_schema";
import { NextRequest } from "next/server";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, props: Props) {
  const { id } = await props.params;
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();

  if (userRes.error) {
    return new Response(userRes.error.message, { status: 401 });
  }

  const user = userRes.data.user;
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get("format") === "pdf" ? "pdf" : "json";

  if (format !== "json") {
    return new Response("PDF chart export is not implemented.", {
      status: 400,
    });
  }

  const surveyRes = await supabase
    .from("surveys")
    .select(
      `
      *,
      submissions(*),
      sections(
        *,
        questions(*)
      )
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (surveyRes.error) {
    return new Response(surveyRes.error.message, { status: 404 });
  }

  const survey = surveyRes.data as ChartReportSurvey;
  const questions = survey.sections.flatMap((section) => section.questions);
  const questionIds = questions.map((question) => question.id);
  const answersRes =
    questionIds.length > 0
      ? await supabase
          .from("answers")
          .select("id, submission_id, question_id, answer_data, created_at")
          .in("question_id", questionIds)
      : { data: [], error: null };

  if (answersRes.error) {
    return new Response(answersRes.error.message, { status: 500 });
  }

  const answersByQuestion = new Map<string, AnswerRow[]>();
  (answersRes.data as AnswerRow[]).forEach((answer) => {
    const questionAnswers = answersByQuestion.get(answer.question_id) ?? [];
    questionAnswers.push(answer);
    answersByQuestion.set(answer.question_id, questionAnswers);
  });

  const sectionsWithAnswers: QuestionAnswerAnalyticsSection[] =
    survey.sections.map((section) => ({
      ...section,
      questions: section.questions.map(
        (question) =>
          ({
            ...question,
            answers: answersByQuestion.get(question.id) ?? [],
          }) satisfies QuestionAnswerAnalyticsRow,
      ),
    }));

  const report = buildChartReport(
    {
      ...survey,
      sections: sectionsWithAnswers,
    },
    {
      includeSummary: searchParams.get("summary") === "1",
      includeSubmissionTimeline: searchParams.get("submissions") === "1",
      includeAnswerDistributions: searchParams.get("answers") === "1",
    },
  );

  return new Response(report, {
    headers: {
      "Content-Disposition": `attachment; filename="${getChartReportFilename(
        survey.title,
      )}"`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

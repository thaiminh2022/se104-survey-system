import {
  buildSurveyCsv,
  getSurveyCsvFilename,
  SurveyCsvExportData,
  SurveyCsvExportOptions,
} from "@/lib/exports/survey_csv";
import {
  e2eSections,
  e2eSubmissions,
  e2eSurveyRows,
  isPlaywrightE2E,
} from "@/lib/e2e/fixtures";
import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, props: Props) {
  const { id } = await props.params;
  const options = getExportOptions(request.nextUrl.searchParams);

  if (isPlaywrightE2E() && request.cookies.get("e2e-auth")?.value !== "1") {
    return new Response("Not authenticated", { status: 401 });
  }

  if (isPlaywrightE2E() && id === "e2e-survey") {
    const survey = {
      id,
      title: e2eSurveyRows[0].title,
      sections: e2eSections,
      submissions: e2eSubmissions,
    } satisfies SurveyCsvExportData;
    const csv = buildSurveyCsv(survey, options);

    return new Response(csv, {
      headers: {
        "Content-Disposition": `attachment; filename="${getSurveyCsvFilename(
          survey.title,
        )}"`,
        "Content-Type": "text/csv; charset=utf-8",
      },
    });
  }

  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();

  if (userRes.error) {
    return new Response(userRes.error.message, { status: 401 });
  }

  const user = userRes.data.user;
  const surveyRes = await supabase
    .from("surveys")
    .select(
      `
      id,
      title,
      sections(
        *,
        questions(*)
      ),
      submissions(
        *,
        answers(*)
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

  const survey = surveyRes.data as SurveyCsvExportData;
  const csv = buildSurveyCsv(survey, options);
  const filename = getSurveyCsvFilename(survey.title);

  return new Response(csv, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "text/csv; charset=utf-8",
    },
  });
}

function getExportOptions(searchParams: URLSearchParams): SurveyCsvExportOptions {
  return {
    shape: searchParams.get("shape") === "wide" ? "wide" : "long",
    includeSubmissionMeta: searchParams.get("submissionMeta") === "1",
    includeQuestionMeta: searchParams.get("questionMeta") === "1",
    includeEmptyAnswers: searchParams.get("emptyAnswers") === "1",
  };
}

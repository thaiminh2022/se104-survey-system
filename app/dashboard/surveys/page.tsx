import SurveyList, {
  type SurveyListRow,
} from "@/components/dashboard/surveys/SurveyList";
import { getSurveyDashboardRowsForUser } from "@/lib/actions/read_survey";

export default async function Page() {
  const surveys = await getSurveyDashboardRowsForUser();
  if (!surveys.success) {
    return <>Cannot fetch surveys {surveys.error}</>;
  }

  const surveyRows = surveys.data.map(
    (survey): SurveyListRow => ({
      id: survey.id,
      title: survey.title,
      description: survey.description,
      state: survey.state,
      created_at: toIsoDate(survey.created_at),
      submission_count: survey.submission_count ?? 0,
      last_response_at: survey.last_response_at
        ? toIsoDate(survey.last_response_at)
        : null,
    }),
  );

  return <SurveyList surveys={surveyRows} />;
}

function toIsoDate(value: Date | string) {
  return new Date(value).toISOString();
}

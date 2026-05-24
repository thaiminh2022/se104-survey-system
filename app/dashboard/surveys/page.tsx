import SurveyList, {
  type SurveyListRow,
} from "@/components/dashboard/surveys/SurveyList";
import ErrorState from "@/components/dashboard/ErrorState";
import { getSurveyDashboardRowsForUser } from "@/lib/actions/read_survey";

export default async function Page() {
  const surveys = await getSurveyDashboardRowsForUser();
  if (!surveys.success) {
    return (
      <main className="mx-auto w-3/4 py-6 lg:w-1/2">
        <ErrorState
          title="Cannot load surveys"
          message={surveys.message}
        />
      </main>
    );
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

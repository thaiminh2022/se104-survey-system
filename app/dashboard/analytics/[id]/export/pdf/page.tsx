import QuestionAnswerChart from "@/components/dashboard/analytics/QuestionAnswerChart";
import SubmissionCountChart from "@/components/dashboard/analytics/SubmissionCountChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getQuestionAnswerAnalytics,
  getSurveyAnalytics,
} from "@/lib/actions/read_analytics";
import { getQuestionAnswerCharts } from "@/lib/charts/question_answer_charts";
import { getSubmissionCount } from "@/lib/charts/survey_charts";
import AutoPrint from "./AutoPrint";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    summary?: string;
    submissions?: string;
    answers?: string;
  }>;
};

export default async function PdfExportPage(props: Props) {
  const [{ id }, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);
  const includeSummary = searchParams.summary === "1";
  const includeSubmissionTimeline = searchParams.submissions === "1";
  const includeAnswerDistributions = searchParams.answers === "1";
  const surveyResult = await getSurveyAnalytics(id);

  if (!surveyResult.success) {
    return (
      <PrintShell>
        <CenteredMessage title="Cannot load analytics" text={surveyResult.message} />
      </PrintShell>
    );
  }

  if (!surveyResult.data) {
    return (
      <PrintShell>
        <CenteredMessage title="Survey not found" text="No analytics are available." />
      </PrintShell>
    );
  }

  const survey = surveyResult.data;
  const conversion =
    survey.view_count > 0
      ? Math.round((survey.submission_count / survey.view_count) * 100)
      : 0;
  const submissionChartData = getSubmissionCount(survey.submissions);
  const questionCharts = includeAnswerDistributions
    ? await getPrintableQuestionCharts(id)
    : [];

  return (
    <PrintShell>
      <AutoPrint />
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-8 bg-white px-6 py-10 text-slate-950 print:min-h-0 print:max-w-none print:px-0 print:py-0">
        <header className="w-full text-center">
          <p className="text-sm uppercase text-slate-500">Analytics report</p>
          <h1 className="mt-2 text-3xl font-semibold">{survey.title}</h1>
          {survey.description ? (
            <p className="mt-2 text-sm text-slate-600">{survey.description}</p>
          ) : null}
        </header>

        {includeSummary ? (
          <section className="grid w-full gap-4 sm:grid-cols-3">
            <MetricCard label="Views" value={survey.view_count} />
            <MetricCard label="Submissions" value={survey.submission_count} />
            <MetricCard label="Conversion" value={`${conversion}%`} />
          </section>
        ) : null}

        {includeSubmissionTimeline ? (
          <PrintableChart title="Submissions over time">
            <SubmissionCountChart data={submissionChartData} />
          </PrintableChart>
        ) : null}

        {includeAnswerDistributions
          ? questionCharts.map((chart) => (
              <PrintableChart
                key={chart.id}
                title={chart.title}
                description={`${chart.answerCount.toLocaleString("en-US")} answers${
                  chart.note ? ` - ${chart.note}` : ""
                }`}
              >
                <QuestionAnswerChart chart={chart} />
              </PrintableChart>
            ))
          : null}

        {!includeSummary &&
        !includeSubmissionTimeline &&
        !includeAnswerDistributions ? (
          <CenteredMessage
            title="No report content selected"
            text="Go back and select at least one report section."
          />
        ) : null}
      </section>
    </PrintShell>
  );
}

async function getPrintableQuestionCharts(surveyId: string) {
  const result = await getQuestionAnswerAnalytics(surveyId);

  if (!result.success) {
    return [];
  }

  return getQuestionAnswerCharts(result.data);
}

function PrintShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @media print {
          aside { display: none !important; }
          body { background: white !important; }
          main, section { break-inside: avoid; }
          [data-slot="chart"] { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
      <main className="min-h-screen bg-white text-slate-950 print:min-h-0">
        {children}
      </main>
    </>
  );
}

function PrintableChart({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full break-inside-avoid rounded-md border border-slate-200 bg-white p-6 shadow-sm print:border-slate-300 print:shadow-none">
      <div className="mb-5 text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        ) : null}
      </div>
      <div className="mx-auto max-w-3xl">{children}</div>
    </section>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <Card className="border-slate-200 bg-white text-center shadow-none">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-500">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-semibold">
        {typeof value === "number" ? value.toLocaleString("en-US") : value}
      </CardContent>
    </Card>
  );
}

function CenteredMessage({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-slate-950">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}

import SubmissionCountChart from "@/components/dashboard/analytics/SubmissionCountChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { getSurveyAnalytics } from "@/lib/actions/read_survey";
import { getSubmissionCount } from "@/lib/charts/survey_charts";
import type { SurveyStatus } from "@/lib/types/db_schema";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };


export default async function SurveyAnalyticsPage(props: Props) {
  const { id } = await props.params;
  const surveysResult = await getSurveyAnalytics(id);

  if (!surveysResult.success) {
    return (
      <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Cannot load analytics</CardTitle>
              <CardDescription>{surveysResult.message}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  const survey = surveysResult.data;
  if (!survey) {
    return notFound();
  }

  const conversion =
    survey.view_count > 0
      ? Math.round((survey.submission_count / survey.view_count) * 100)
      : 0;

  const submissionChartData = getSubmissionCount(survey.submissions);

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header>
          <Link
            href="/dashboard/analytics"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Analytics
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {survey.title}
            </h1>
            <StatusBadge status={survey.state} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {survey.description || "No description provided."}
          </p>
        </header>
        <h2>Views And Submission</h2>
        <section className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Views" value={survey.view_count} />
          <MetricCard label="Submissions" value={survey.submission_count} />
          <Card>
            <CardHeader>
              <CardDescription>Conversion</CardDescription>
              <CardTitle className="text-3xl font-semibold">
                {conversion}%
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Submissions divided by views
            </CardContent>
          </Card>
        </section>

        <h2>Actions</h2>
        <section>
          <Link href={`/dashboard/analytics/${id}/export`}>
            <Button>Export</Button>
          </Link>
        </section>
        <div className="w-full border-2 border-accent"></div>
        <h2>Charts</h2>
        <section>
          <SubmissionCountChart />
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl font-semibold">
          {value.toLocaleString("en-US")}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Persisted on the survey row
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: SurveyStatus }) {
  const variant =
    status === "published"
      ? "default"
      : status === "archived"
        ? "outline"
        : "secondary";

  return <Badge variant={variant}>{status}</Badge>;
}

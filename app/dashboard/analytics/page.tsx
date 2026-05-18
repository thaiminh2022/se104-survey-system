import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSurveyAnalyticsRowsForUser } from "@/lib/actions/read_analytics";
import type { SurveyRow, SurveyStatus } from "@/lib/types/db_schema";
import {
  IconClipboardCheck,
  IconChartArcs,
  IconEye,
  IconTrendingUp,
} from "@tabler/icons-react";
import Link from "next/link";

export default async function Analytics() {
  const surveysResult = await getSurveyAnalyticsRowsForUser();

  if (!surveysResult.success) {
    return (
      <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <AnalyticsHeader />
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Cannot load analytics</CardTitle>
              <CardDescription>{surveysResult.message}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    );
  }

  const surveys = surveysResult.data;
  const totalViews = surveys.reduce((sum, survey) => sum + survey.view_count, 0);
  const totalSubmissions = surveys.reduce(
    (sum, survey) => sum + survey.submission_count,
    0,
  );
  const averageConversion =
    totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 100) : 0;
  const activeSurveys = surveys.filter(
    (survey) => survey.state === "published",
  ).length;

  const metrics = [
    {
      label: "Views",
      value: formatNumber(totalViews),
      note: "Published survey page loads",
      icon: <IconEye className="size-5" />,
    },
    {
      label: "Submissions",
      value: formatNumber(totalSubmissions),
      note: "Completed responses",
      icon: <IconClipboardCheck className="size-5" />,
    },
    {
      label: "Conversion",
      value: `${averageConversion}%`,
      note: "Submissions divided by views",
      icon: <IconTrendingUp className="size-5" />,
    },
    {
      label: "Published",
      value: formatNumber(activeSurveys),
      note: "Currently visible surveys",
      icon: <IconEye className="size-5" />,
    },
  ];

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <AnalyticsHeader />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader className="gap-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <CardDescription>{metric.label}</CardDescription>
                  <CardTitle className="text-3xl font-semibold">
                    {metric.value}
                  </CardTitle>
                </div>
                <div className="text-muted-foreground">{metric.icon}</div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {metric.note}
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Survey performance</CardTitle>
            <CardDescription>
              Counts are read from the persisted survey counters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {surveys.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-3 pr-4 font-medium">Survey</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Views
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Submissions
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Conversion
                      </th>
                      <th className="py-3 pl-4 text-right font-medium">
                        Created
                      </th>
                      <th className="py-3 pl-4 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {surveys.map((survey) => (
                      <SurveyAnalyticsRow key={survey.id} survey={survey} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-border bg-background px-4 py-8 text-center">
                <p className="font-medium">No survey analytics yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create and publish a survey to begin collecting views and
                  submissions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function AnalyticsHeader() {
  return (
    <header>
      <p className="text-sm font-medium text-muted-foreground">
        Survey workspace
      </p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Analytics</h1>
    </header>
  );
}

function SurveyAnalyticsRow({ survey }: { survey: SurveyRow }) {
  const conversion =
    survey.view_count > 0
      ? Math.round((survey.submission_count / survey.view_count) * 100)
      : 0;

  return (
    <tr>
      <td className="max-w-[320px] py-4 pr-4">
        <Link
          href={`/dashboard/analytics/${survey.id}`}
          className="block truncate font-medium hover:underline"
        >
          {survey.title}
        </Link>
        <div className="truncate text-xs text-muted-foreground">
          {survey.description || "No description provided."}
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={survey.state} />
      </td>
      <td className="px-4 py-4 text-right tabular-nums">
        {formatNumber(survey.view_count)}
      </td>
      <td className="px-4 py-4 text-right tabular-nums">
        {formatNumber(survey.submission_count)}
      </td>
      <td className="px-4 py-4 text-right tabular-nums">{conversion}%</td>
      <td className="py-4 pl-4 text-right text-muted-foreground">
        {new Date(survey.created_at).toLocaleDateString()}
      </td>
      <td className="py-4 pl-4 text-right">
        <Button asChild size="sm" variant="outline">
          <Link href={`/dashboard/analytics/${survey.id}`}>
            <IconChartArcs />
            View
          </Link>
        </Button>
      </td>
    </tr>
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

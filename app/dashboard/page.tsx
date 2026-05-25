import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState, {
  EmptyStateAction,
} from "@/components/dashboard/EmptyState";
import ErrorState from "@/components/dashboard/ErrorState";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  IconArrowRight,
  IconEye,
  IconFilePlus,
  IconPencil,
  IconShare,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  getRecentSurveyRowsForUser,
  getSurveyRowForUser,
} from "@/lib/actions/read_survey";
import type { SurveyRow, SurveyStatus } from "@/lib/types/db_schema";

export default async function DashboardPage() {
  const [surveysResult, recentSurveysResult] = await Promise.all([
    getSurveyRowForUser(),
    getRecentSurveyRowsForUser(5),
  ]);

  if (!surveysResult.success) {
    return (
      <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <DashboardHeader />
          <div className="mt-6">
            <ErrorState
              title="Cannot load dashboard"
              message={surveysResult.message}
            />
          </div>
        </div>
      </main>
    );
  }

  if (!recentSurveysResult.success) {
    return (
      <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <DashboardHeader />
          <div className="mt-6">
            <ErrorState
              title="Cannot load dashboard"
              message={recentSurveysResult.message}
            />
          </div>
        </div>
      </main>
    );
  }

  const surveys = surveysResult.data;
  const publishedSurveys = surveys.filter(
    (survey) => survey.state === "published",
  ).length;
  const totalViews = surveys.reduce(
    (sum, survey) => sum + (survey.view_count ?? 0),
    0,
  );
  const totalSubmissions = surveys.reduce(
    (sum, survey) => sum + (survey.submission_count ?? 0),
    0,
  );
  const recentSurveys = recentSurveysResult.data;

  const metrics = [
    {
      label: "Total surveys",
      value: surveys.length.toString(),
      note: "Owned by your account",
    },
    {
      label: "Published",
      value: publishedSurveys.toString(),
      note: "Available to respondents",
    },
    {
      label: "Views",
      value: totalViews.toLocaleString("en-US"),
      note: "From published survey pages",
    },
    {
      label: "Submissions",
      value: totalSubmissions.toLocaleString("en-US"),
      note: "Completed responses",
    },
  ];

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <DashboardHeader />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="text-3xl font-semibold">
                  {metric.value}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {metric.note}
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <Card>
            <CardHeader className="gap-3 sm:grid-cols-[1fr_auto]">
              <div>
                <CardTitle className="text-lg">Recent surveys</CardTitle>
                <CardDescription>
                  Latest surveys returned from your account.
                </CardDescription>
              </div>
              <CardAction>
                <Button asChild variant="ghost">
                  <Link href="/dashboard/surveys">
                    All surveys
                    <IconArrowRight />
                  </Link>
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSurveys.length > 0 ? (
                recentSurveys.map((survey, index) => (
                  <SurveyListItem key={survey.id} survey={survey} showSeparator={index > 0} />
                ))
              ) : (
                <EmptyState
                  title="No surveys yet"
                  description="Create your first survey to start collecting responses."
                  action={
                    <EmptyStateAction>
                      <Link href="/dashboard/surveys/create">
                        <IconFilePlus />
                        Create survey
                      </Link>
                    </EmptyStateAction>
                  }
                />
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

function DashboardHeader() {
  return (
    <header>
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Survey workspace
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </div>
    </header>
  );
}

function SurveyListItem({
  survey,
  showSeparator,
}: {
  survey: SurveyRow;
  showSeparator: boolean;
}) {
  return (
    <div>
      {showSeparator ? <Separator className="mb-4" /> : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-medium">{survey.title}</h2>
            <StatusBadge status={survey.state} />
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {survey.description || "No description provided."}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              Created {new Date(survey.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/surveys/${survey.id}/edit`}>
              <IconPencil />
              Edit
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/surveys/${survey.id}/share`}>
              <IconShare />
              Share
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href={`/surveys/${survey.id}`}>
              <IconEye />
              View
            </Link>
          </Button>
        </div>
      </div>
    </div>
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

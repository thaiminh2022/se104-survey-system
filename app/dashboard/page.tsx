import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  IconClipboardList,
  IconEye,
  IconFilePlus,
  IconPencil,
  IconShare,
} from "@tabler/icons-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

type SurveyStatus = "draft" | "published" | "archived";

type DashboardSurvey = {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  responses: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
};

const surveys: DashboardSurvey[] = [
  {
    id: "student-feedback",
    title: "Student Feedback Form",
    description: "Course experience, lecturer feedback, and learning outcomes.",
    status: "published",
    responses: 128,
    completionRate: 86,
    createdAt: "May 12, 2026",
    updatedAt: "2 hours ago",
  },
  {
    id: "event-registration",
    title: "Event Registration Survey",
    description: "Collect attendance, preferences, and session interests.",
    status: "draft",
    responses: 0,
    completionRate: 0,
    createdAt: "May 15, 2026",
    updatedAt: "Yesterday",
  },
  {
    id: "product-research",
    title: "Product Research Pulse",
    description: "Measure feature demand and user satisfaction.",
    status: "published",
    responses: 64,
    completionRate: 72,
    createdAt: "May 8, 2026",
    updatedAt: "3 days ago",
  },
];

const totalResponses = surveys.reduce((sum, survey) => sum + survey.responses, 0);
const publishedSurveys = surveys.filter(
  (survey) => survey.status === "published",
).length;
const draftSurveys = surveys.filter((survey) => survey.status === "draft").length;
const averageCompletion = Math.round(
  surveys.reduce((sum, survey) => sum + survey.completionRate, 0) /
    surveys.length,
);

const metrics = [
  {
    label: "Total surveys",
    value: surveys.length.toString(),
    note: "Across all workspaces",
  },
  {
    label: "Published",
    value: publishedSurveys.toString(),
    note: "Collecting responses",
  },
  {
    label: "Drafts",
    value: draftSurveys.toString(),
    note: "Need review before launch",
  },
  {
    label: "Responses",
    value: totalResponses.toString(),
    note: `${averageCompletion}% average completion`,
  },
];

const recentActivity = [
  "Student Feedback Form received 18 new responses",
  "Product Research Pulse completion rate increased to 72%",
  "Event Registration Survey was edited yesterday",
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Survey workspace
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <ThemeToggle />
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard/surveys">
                <IconClipboardList />
                View surveys
              </Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/dashboard/surveys/create">
                <IconFilePlus />
                Create survey
              </Link>
            </Button>
          </div>
        </header>

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

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Card>
            <CardHeader className="gap-3 sm:grid-cols-[1fr_auto]">
              <div>
                <CardTitle className="text-lg">Recent surveys</CardTitle>
                <CardDescription>
                  Replace this local array with Supabase data when the
                  connection is ready.
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
              {surveys.map((survey, index) => (
                <div key={survey.id}>
                  {index > 0 ? <Separator className="mb-4" /> : null}
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-medium">{survey.title}</h2>
                        <StatusBadge status={survey.status} />
                      </div>
                      <p className="max-w-2xl text-sm text-muted-foreground">
                        {survey.description}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>{survey.responses} responses</span>
                        <span>{survey.completionRate}% completion</span>
                        <span>Created {survey.createdAt}</span>
                        <span>Updated {survey.updatedAt}</span>
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
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response health</CardTitle>
                <CardDescription>
                  Snapshot of survey performance placeholders.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <HealthRow label="Average completion" value={`${averageCompletion}%`} />
                <HealthRow label="Published surveys" value={publishedSurveys.toString()} />
                <HealthRow label="Drafts waiting" value={draftSurveys.toString()} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent activity</CardTitle>
                <CardDescription>
                  Useful events to replace with audit logs later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((item) => (
                  <div
                    key={item}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
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

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

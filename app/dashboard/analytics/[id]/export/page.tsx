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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SurveyStatus } from "@/lib/types/db_schema";
import {
  IconArrowLeft,
  IconChartPie,
  IconDownload,
  IconFileSpreadsheet,
} from "@tabler/icons-react";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function Page(props: Props) {
  const { id } = await props.params;

  return (
    <main className="min-h-screen bg-muted/20 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header>
          <Link
            href={`/dashboard/analytics/${id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <IconArrowLeft className="size-4" />
            Analytics
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">Export</h1>
          </div>
        </header>

        <form action={`/dashboard/analytics/${id}/export/csv`} method="get">
          <Card>
            <CardHeader className="gap-3 sm:grid-cols-[1fr_auto]">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconFileSpreadsheet className="size-5 text-muted-foreground" />
                  Response data
                </CardTitle>
                <CardDescription>
                  Export raw response data for spreadsheet analysis.
                </CardDescription>
              </div>
              <CardAction>
                <Button type="submit">
                  <IconDownload />
                  Export CSV
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <OptionGroup title="CSV shape">
                <RadioGroup defaultValue="long" name="shape">
                  <RadioOption
                    id="csv-long"
                    value="long"
                    label="Long format"
                    description="One row per answer. Best for filtering and pivot tables."
                  />
                  <RadioOption
                    id="csv-wide"
                    value="wide"
                    label="Wide format"
                    description="One row per submission with a column for each question."
                  />
                </RadioGroup>
              </OptionGroup>

              <OptionGroup title="Include">
                <CheckboxOption
                  id="include-submission"
                  label="Submission metadata"
                  description="Submission id, user id, created date, and submitted date."
                  name="submissionMeta"
                  value="1"
                  defaultChecked
                />
                <CheckboxOption
                  id="include-question"
                  label="Question metadata"
                  description="Question id, title, type, and section."
                  name="questionMeta"
                  value="1"
                  defaultChecked
                />
                <CheckboxOption
                  id="include-empty"
                  label="Empty answers"
                  description="Keep rows for skipped optional questions."
                  name="emptyAnswers"
                  value="1"
                />
              </OptionGroup>
            </CardContent>
          </Card>
        </form>

        <form>
          <Card>
            <CardHeader className="gap-3 sm:grid-cols-[1fr_auto]">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconChartPie className="size-5 text-muted-foreground" />
                  Analytics report
                </CardTitle>
                <CardDescription>
                  Export summarized metrics and chart-ready aggregates.
                </CardDescription>
              </div>
              <CardAction>
                <Button variant="outline" disabled>
                  <IconDownload />
                  Export report
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <OptionGroup title="Report content">
                <CheckboxOption
                  id="report-summary"
                  label="Summary metrics"
                  description="Views, submissions, conversion, and status."
                  defaultChecked
                />
                <CheckboxOption
                  id="report-submissions"
                  label="Submission timeline"
                  description="Daily, monthly, yearly, and all-time counts."
                  defaultChecked
                />
                <CheckboxOption
                  id="report-answers"
                  label="Answer distributions"
                  description="Aggregated counts for chartable question types."
                  defaultChecked
                />
              </OptionGroup>

              <OptionGroup title="Format">
                <RadioGroup defaultValue="json">
                  <RadioOption
                    id="report-json"
                    value="json"
                    label="JSON"
                    description="Best for importing into another tool."
                  />
                  <RadioOption
                    id="report-pdf"
                    value="pdf"
                    label="PDF"
                    description="Best for sharing a static report."
                  />
                </RadioGroup>
              </OptionGroup>
            </CardContent>
          </Card>
        </form>
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
    </Card>
  );
}

function OptionGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function CheckboxOption({
  id,
  label,
  description,
  defaultChecked,
  name,
  value,
}: {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  name?: string;
  value?: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border bg-background p-3">
      <Checkbox
        id={id}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
      />
      <div className="grid gap-1">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function RadioOption({
  id,
  value,
  label,
  description,
}: {
  id: string;
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border bg-background p-3">
      <RadioGroupItem id={id} value={value} />
      <div className="grid gap-1">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
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

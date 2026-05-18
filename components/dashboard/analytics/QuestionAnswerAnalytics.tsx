"use client";

import QuestionAnswerChart from "@/components/dashboard/analytics/QuestionAnswerChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getQuestionAnswerAnalytics } from "@/lib/actions/read_analytics";
import {
  getQuestionAnswerCharts,
  QuestionAnswerChart as QuestionAnswerChartData,
} from "@/lib/charts/question_answer_charts";
import { IconChartBar } from "@tabler/icons-react";
import { useState, useTransition } from "react";

type Props = {
  surveyId: string;
};

export default function QuestionAnswerAnalytics({ surveyId }: Props) {
  const [charts, setCharts] = useState<QuestionAnswerChartData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function loadCharts() {
    setError(null);

    startTransition(async () => {
      const result = await getQuestionAnswerAnalytics(surveyId);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setCharts(getQuestionAnswerCharts(result.data));
    });
  }

  if (charts === null) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-border bg-background p-4">
        <p className="text-sm text-muted-foreground">
          Answer charts are loaded on demand because they read all answers for
          this survey.
        </p>
        <Button type="button" onClick={loadCharts} disabled={isPending}>
          <IconChartBar />
          {isPending ? "Loading..." : "Load answer charts"}
        </Button>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    );
  }

  if (charts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-background px-4 py-8 text-center">
        <p className="font-medium">No questions available</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add questions to this survey before analyzing answer charts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {charts.length} questions loaded
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={loadCharts}
          disabled={isPending}
        >
          {isPending ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {charts.map((chart) => (
        <Card key={chart.id}>
          <CardHeader>
            <CardTitle>{chart.title}</CardTitle>
            <CardDescription>
              {chart.answerCount.toLocaleString("en-US")} answers
              {chart.note ? ` - ${chart.note}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionAnswerChart chart={chart} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { generateChartColors } from "@/lib/charts/colors";
import type { QuestionAnswerChart as QuestionAnswerChartData } from "@/lib/charts/question_answer_charts";
import { Pie, PieChart } from "recharts";

const chartConfig = {
  count: {
    label: "Answers",
    color: "#2563eb",
  },
} satisfies ChartConfig;

type Props = {
  chart: QuestionAnswerChartData;
};

export default function QuestionAnswerChart({ chart }: Props) {
  if (chart.data.length === 0 && chart.samples.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground">
        No chartable answers yet
      </div>
    );
  }

  if (chart.data.length === 0) {
    return (
      <div className="space-y-2">
        {chart.samples.map((sample, index) => (
          <p
            key={`${chart.id}-${index}`}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            {sample}
          </p>
        ))}
      </div>
    );
  }

  const colors = generateChartColors(chart.data.length);
  const data = chart.data.map((item, index) => ({
    ...item,
    fill: colors[index],
  }));
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(220px,320px)_1fr] md:items-center">
      <ChartContainer
        config={chartConfig}
        className="aspect-square max-h-72 w-full"
      >
        <PieChart accessibilityLayer>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="label" hideLabel />}
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            innerRadius={48}
            outerRadius={88}
            strokeWidth={2}
          ></Pie>
        </PieChart>
      </ChartContainer>

      <div className="grid gap-2 text-sm">
        {data.map((item) => {
          const percentage =
            total > 0 ? Math.round((item.count / total) * 100) : 0;

          return (
            <div
              key={item.label}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2"
            >
              <span
                className="size-2.5 rounded-sm"
                style={{ backgroundColor: item.fill }}
              />
              <span className="truncate text-muted-foreground">
                {item.label}
              </span>
              <span className="font-medium tabular-nums">
                {item.count.toLocaleString("en-US")} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { SubmissionCount } from "@/lib/types/charts";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  count: {
    label: "Submissions",
    color: "#2563eb",
  },
} satisfies ChartConfig;

type Props = {
  data: SubmissionCount[];
};

type TimeBucket = "day" | "month" | "year" | "all";

export default function SubmissionCountChart({ data }: Props) {
  const [bucket, setBucket] = useState<TimeBucket>("day");
  const chartData = useMemo(() => groupSubmissionCounts(data, bucket), [data, bucket]);

  if (data.length === 0) {
    return (
      <div className="flex min-h-36 items-center justify-center rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground">
        No submissions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Select value={bucket} onValueChange={(value) => setBucket(value as TimeBucket)}>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ChartContainer config={chartConfig} className="h-52 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function groupSubmissionCounts(data: SubmissionCount[], bucket: TimeBucket) {
  if (bucket === "day") {
    return data;
  }

  if (bucket === "all") {
    return [
      {
        date: "All",
        count: data.reduce((sum, item) => sum + item.count, 0),
      },
    ];
  }

  const counts = new Map<string, number>();

  data.forEach((item) => {
    const key = bucket === "month" ? item.date.slice(0, 7) : item.date.slice(0, 4);
    counts.set(key, (counts.get(key) ?? 0) + item.count);
  });

  return Array.from(counts.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({ date, count }));
}

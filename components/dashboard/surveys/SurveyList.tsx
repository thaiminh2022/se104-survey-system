"use client";

import ChangeStateSurveyButton from "@/components/dashboard/surveys/ChangeStateSurveyBtn";
import SurveyActionsDropdown from "@/components/dashboard/surveys/SurveyActionsDropdown";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { SurveyStatus } from "@/lib/types/db_schema";
import { IconClock, IconMessageCircle, IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";

export type SurveyListRow = {
  id: string;
  title: string;
  description: string | null;
  state: SurveyStatus;
  created_at: string;
  submission_count: number;
  last_response_at: string | null;
};

type SurveyListProps = {
  surveys: SurveyListRow[];
};

export default function SurveyList({ surveys }: SurveyListProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredSurveys = useMemo(() => {
    if (normalizedQuery === "") {
      return surveys;
    }

    return surveys.filter((survey) => {
      const searchableText = `${survey.title} ${survey.description ?? ""}`;

      return searchableText.toLowerCase().includes(normalizedQuery);
    });
  }, [normalizedQuery, surveys]);

  return (
    <div className="mx-auto w-3/4 lg:w-1/2">
      <div className="my-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Your surveys</h1>
        <div className="relative w-full sm:max-w-xs">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="Search surveys..."
            aria-label="Search surveys"
          />
        </div>
      </div>

      {filteredSurveys.length > 0 ? (
        filteredSurveys.map((survey) => (
          <SurveyCard key={survey.id} survey={survey} />
        ))
      ) : (
        <Card className="mt-3 border-dashed">
          <CardHeader>
            <CardTitle>No surveys found</CardTitle>
            <CardDescription>
              No surveys match your current search.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

function SurveyCard({ survey }: { survey: SurveyListRow }) {
  return (
    <Card className="mt-3">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>{survey.title}</CardTitle>
          <StatusBadge status={survey.state} />
          <Badge variant="link">
            Created {formatDate(survey.created_at)}
          </Badge>
        </div>
        <CardDescription>{survey.description}</CardDescription>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <IconMessageCircle className="size-4" />
            {formatResponseCount(survey.submission_count)}
          </span>
          <span className="inline-flex items-center gap-1">
            <IconClock className="size-4" />
            {formatLastResponse(survey.last_response_at)}
          </span>
        </div>
        <CardAction className="flex flex-wrap gap-3">
          <SurveyActionsDropdown surveyId={survey.id} />
          <ChangeStateSurveyButton surveyId={survey.id} state={survey.state} />
        </CardAction>
      </CardHeader>
    </Card>
  );
}

function StatusBadge({ status }: { status: SurveyStatus }) {
  return (
    <Badge variant={status === "draft" ? "secondary" : "default"}>
      {status}
    </Badge>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

function formatResponseCount(count: number) {
  return `${count.toLocaleString()} ${count === 1 ? "response" : "responses"}`;
}

function formatLastResponse(value: string | null) {
  if (!value) {
    return "No responses yet";
  }

  return `Last response ${formatDate(value)}`;
}

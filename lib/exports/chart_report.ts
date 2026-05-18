import type { QuestionAnswerAnalyticsSection } from "@/lib/actions/read_analytics";
import { getQuestionAnswerCharts } from "@/lib/charts/question_answer_charts";
import { getSubmissionCount } from "@/lib/charts/survey_charts";
import type { SubmissionCount } from "@/lib/types/charts";
import type {
  SectionRow,
  SubmissionRow,
  SurveyRow,
} from "@/lib/types/db_schema";

export type ChartReportExportOptions = {
  includeSummary: boolean;
  includeSubmissionTimeline: boolean;
  includeAnswerDistributions: boolean;
};

export type ChartReportSurvey = SurveyRow & {
  submissions: SubmissionRow[];
  sections: QuestionAnswerAnalyticsSection[];
};

export function buildChartReport(
  survey: ChartReportSurvey,
  options: ChartReportExportOptions,
) {
  const report = {
    exported_at: new Date().toISOString(),
    survey: {
      id: survey.id,
      title: survey.title,
      state: survey.state,
    },
    summary: options.includeSummary ? buildSummary(survey) : undefined,
    submission_timeline: options.includeSubmissionTimeline
      ? buildSubmissionTimeline(survey.submissions)
      : undefined,
    answer_distributions: options.includeAnswerDistributions
      ? getQuestionAnswerCharts(sortSectionsForReport(survey.sections))
      : undefined,
  };

  return JSON.stringify(report, null, 2);
}

export function getChartReportFilename(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${slug || "survey"}-chart-report.json`;
}

function buildSummary(survey: ChartReportSurvey) {
  return {
    view_count: survey.view_count,
    submission_count: survey.submission_count,
    conversion_rate:
      survey.view_count > 0 ? survey.submission_count / survey.view_count : 0,
    created_at: new Date(survey.created_at).toISOString(),
  };
}

function buildSubmissionTimeline(submissions: SubmissionRow[]) {
  const daily = getSubmissionCount(submissions);

  return {
    day: daily,
    month: groupSubmissionCounts(daily, "month"),
    year: groupSubmissionCounts(daily, "year"),
    all: [
      {
        date: "All",
        count: daily.reduce((sum, item) => sum + item.count, 0),
      },
    ],
  };
}

function groupSubmissionCounts(
  data: SubmissionCount[],
  bucket: "month" | "year",
) {
  const counts = new Map<string, number>();

  data.forEach((item) => {
    const key = bucket === "month" ? item.date.slice(0, 7) : item.date.slice(0, 4);
    counts.set(key, (counts.get(key) ?? 0) + item.count);
  });

  return Array.from(counts.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({ date, count }));
}

function sortSectionsForReport(sections: QuestionAnswerAnalyticsSection[]) {
  return [...sections]
    .sort((a, b) => a.order_index - b.order_index)
    .map((section) => ({
      ...section,
      questions: [...section.questions].sort(
        (a, b) => a.order_index - b.order_index,
      ),
    }));
}

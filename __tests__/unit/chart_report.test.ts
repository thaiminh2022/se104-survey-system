import { describe, expect, test, vi } from "vitest";

import {
  buildChartReport,
  getChartReportFilename,
  type ChartReportSurvey,
} from "@/lib/exports/chart_report";

const CREATED_AT = new Date("2026-05-20T01:00:00.000Z");

function makeSurvey(overrides: Partial<ChartReportSurvey> = {}): ChartReportSurvey {
  return {
    id: "survey-1",
    user_id: "user-1",
    title: "Course Survey",
    state: "published",
    image: null,
    description: null,
    submission_count: 3,
    view_count: 6,
    created_at: CREATED_AT,
    submissions: [
      {
        id: "submission-1",
        survey_id: "survey-1",
        user_id: null,
        created_at: CREATED_AT,
        submitted_at: new Date("2026-05-20T02:00:00.000Z"),
      },
      {
        id: "submission-2",
        survey_id: "survey-1",
        user_id: null,
        created_at: CREATED_AT,
        submitted_at: new Date("2026-05-20T04:00:00.000Z"),
      },
      {
        id: "submission-3",
        survey_id: "survey-1",
        user_id: null,
        created_at: CREATED_AT,
        submitted_at: new Date("2026-06-01T02:00:00.000Z"),
      },
    ],
    sections: [
      {
        id: "section-1",
        survey_id: "survey-1",
        order_index: 1,
        end_behavior: "continue",
        config: {},
        title: "General",
        description: null,
        created_at: CREATED_AT,
        questions: [
          {
            id: "question-1",
            section_id: "section-1",
            order_index: 1,
            title: "Pick one",
            image: null,
            description: null,
            question_type: "single-choice",
            config: {},
            created_at: CREATED_AT,
            required: false,
            answers: [
              {
                id: "answer-1",
                question_id: "question-1",
                created_at: CREATED_AT,
                answer_data: {
                  use_other: false,
                  selected_option: "A",
                },
              },
            ],
          },
        ],
      },
    ],
    ...overrides,
  };
}

describe("chart report export", () => {
  test("includes summary, timelines, and answer distributions when requested", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-23T12:00:00.000Z"));

    const report = JSON.parse(
      buildChartReport(makeSurvey(), {
        includeSummary: true,
        includeSubmissionTimeline: true,
        includeAnswerDistributions: true,
      }),
    );

    expect(report).toMatchObject({
      exported_at: "2026-05-23T12:00:00.000Z",
      survey: {
        id: "survey-1",
        title: "Course Survey",
        state: "published",
      },
      summary: {
        view_count: 6,
        submission_count: 3,
        conversion_rate: 0.5,
        created_at: "2026-05-20T01:00:00.000Z",
      },
      submission_timeline: {
        day: [
          { date: "2026-05-20", count: 2 },
          { date: "2026-06-01", count: 1 },
        ],
        month: [
          { date: "2026-05", count: 2 },
          { date: "2026-06", count: 1 },
        ],
        year: [{ date: "2026", count: 3 }],
        all: [{ date: "All", count: 3 }],
      },
      answer_distributions: [
        {
          id: "question-1",
          title: "Pick one",
          answerCount: 1,
          data: [{ label: "A", count: 1 }],
        },
      ],
    });

    vi.useRealTimers();
  });

  test("omits disabled report sections", () => {
    const report = JSON.parse(
      buildChartReport(makeSurvey(), {
        includeSummary: false,
        includeSubmissionTimeline: false,
        includeAnswerDistributions: false,
      }),
    );

    expect(report.summary).toBeUndefined();
    expect(report.submission_timeline).toBeUndefined();
    expect(report.answer_distributions).toBeUndefined();
  });

  test("uses zero conversion rate when there are no views", () => {
    const report = JSON.parse(
      buildChartReport(makeSurvey({ view_count: 0 }), {
        includeSummary: true,
        includeSubmissionTimeline: false,
        includeAnswerDistributions: false,
      }),
    );

    expect(report.summary.conversion_rate).toBe(0);
  });

  test("generates stable chart report filenames", () => {
    expect(getChartReportFilename("  Student Feedback: SE104 / 2026!  ")).toBe(
      "student-feedback-se104-2026-chart-report.json",
    );
    expect(getChartReportFilename("!!!")).toBe("survey-chart-report.json");
  });
});

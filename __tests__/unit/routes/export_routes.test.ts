import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";

const { createClient } = vi.hoisted(() => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient,
}));

function makeSingleQuery(result: unknown) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    limit: vi.fn(() => query),
    single: vi.fn(async () => result),
  };

  return query;
}

function makeAnswersQuery(result: unknown) {
  const query = {
    select: vi.fn(() => query),
    in: vi.fn(async () => result),
  };

  return query;
}

const createdAt = new Date("2026-05-20T01:00:00.000Z");

const csvSurvey = {
  id: "survey-1",
  title: "Course Survey",
  sections: [
    {
      id: "section-1",
      survey_id: "survey-1",
      order_index: 1,
      end_behavior: "continue",
      config: {},
      title: "General",
      description: null,
      created_at: createdAt,
      questions: [
        {
          id: "question-1",
          section_id: "section-1",
          order_index: 1,
          title: "Name",
          image: null,
          description: null,
          question_type: "short-text",
          config: {},
          created_at: createdAt,
          required: false,
        },
      ],
    },
  ],
  submissions: [
    {
      id: "submission-1",
      survey_id: "survey-1",
      user_id: null,
      created_at: createdAt,
      submitted_at: new Date("2026-05-20T02:00:00.000Z"),
      answers: [
        {
          id: "answer-1",
          submission_id: "submission-1",
          question_id: "question-1",
          created_at: createdAt,
          answer_data: { text: "Minh" },
        },
      ],
    },
  ],
};

const chartSurvey = {
  id: "survey-1",
  user_id: "user-1",
  title: "Course Survey",
  state: "published",
  image: null,
  description: null,
  submission_count: 1,
  view_count: 2,
  created_at: createdAt,
  submissions: [
    {
      id: "submission-1",
      survey_id: "survey-1",
      user_id: null,
      created_at: createdAt,
      submitted_at: new Date("2026-05-20T02:00:00.000Z"),
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
      created_at: createdAt,
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
          created_at: createdAt,
          required: false,
        },
      ],
    },
  ],
};

function mockAuthenticatedClient(from: ReturnType<typeof vi.fn>) {
  createClient.mockResolvedValue({
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: { id: "user-1" } },
        error: null,
      })),
    },
    from,
  });
}

describe("analytics CSV export route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns 401 when the user is not authenticated", async () => {
    createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: null },
          error: { message: "Not authenticated" },
        })),
      },
    });

    const { GET } = await import(
      "@/app/dashboard/analytics/[id]/export/csv/route"
    );

    const response = await GET(
      new NextRequest("https://example.test/dashboard/analytics/survey-1/export/csv"),
      { params: Promise.resolve({ id: "survey-1" }) },
    );

    expect(response.status).toBe(401);
    await expect(response.text()).resolves.toBe("Not authenticated");
  });

  test("returns a CSV attachment for the authenticated owner", async () => {
    const surveyQuery = makeSingleQuery({ data: csvSurvey, error: null });
    const from = vi.fn(() => surveyQuery);
    mockAuthenticatedClient(from);

    const { GET } = await import(
      "@/app/dashboard/analytics/[id]/export/csv/route"
    );

    const response = await GET(
      new NextRequest(
        "https://example.test/dashboard/analytics/survey-1/export/csv?shape=wide&submissionMeta=1&questionMeta=1",
      ),
      { params: Promise.resolve({ id: "survey-1" }) },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/csv; charset=utf-8");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="course-survey-responses.csv"',
    );
    await expect(response.text()).resolves.toBe(
      [
        "submission_id,respondent_user_id,submitted_at,submission_created_at,General / Name",
        "submission-1,,2026-05-20T02:00:00.000Z,2026-05-20T01:00:00.000Z,Minh",
      ].join("\r\n"),
    );
    expect(surveyQuery.eq).toHaveBeenCalledWith("id", "survey-1");
    expect(surveyQuery.eq).toHaveBeenCalledWith("user_id", "user-1");
  });
});

describe("analytics chart export route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("rejects PDF export because it is not implemented", async () => {
    mockAuthenticatedClient(vi.fn());

    const { GET } = await import(
      "@/app/dashboard/analytics/[id]/export/charts/route"
    );

    const response = await GET(
      new NextRequest(
        "https://example.test/dashboard/analytics/survey-1/export/charts?format=pdf",
      ),
      { params: Promise.resolve({ id: "survey-1" }) },
    );

    expect(response.status).toBe(400);
    await expect(response.text()).resolves.toBe(
      "PDF chart export is not implemented.",
    );
  });

  test("returns a JSON chart report attachment", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-23T12:00:00.000Z"));

    const surveyQuery = makeSingleQuery({ data: chartSurvey, error: null });
    const answersQuery = makeAnswersQuery({
      data: [
        {
          id: "answer-1",
          submission_id: "submission-1",
          question_id: "question-1",
          created_at: createdAt,
          answer_data: { use_other: false, selected_option: "A" },
        },
      ],
      error: null,
    });
    const from = vi.fn((table: string) => {
      if (table === "surveys") return surveyQuery;
      if (table === "answers") return answersQuery;
      throw new Error(`Unexpected table ${table}`);
    });
    mockAuthenticatedClient(from);

    const { GET } = await import(
      "@/app/dashboard/analytics/[id]/export/charts/route"
    );

    const response = await GET(
      new NextRequest(
        "https://example.test/dashboard/analytics/survey-1/export/charts?summary=1&submissions=1&answers=1",
      ),
      { params: Promise.resolve({ id: "survey-1" }) },
    );
    const report = JSON.parse(await response.text());

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="course-survey-chart-report.json"',
    );
    expect(report).toMatchObject({
      exported_at: "2026-05-23T12:00:00.000Z",
      summary: {
        view_count: 2,
        submission_count: 1,
        conversion_rate: 0.5,
      },
      answer_distributions: [
        {
          id: "question-1",
          data: [{ label: "A", count: 1 }],
        },
      ],
    });
    expect(answersQuery.in).toHaveBeenCalledWith("question_id", ["question-1"]);

    vi.useRealTimers();
  });
});

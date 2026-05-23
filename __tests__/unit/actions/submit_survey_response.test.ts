import { beforeEach, describe, expect, test, vi } from "vitest";

const { createClient, getUser } = vi.hoisted(() => ({
  createClient: vi.fn(),
  getUser: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient,
}));

vi.mock("@/lib/actions/read_user", () => ({
  getUser,
}));

function makeSubmissionQuery(result: unknown) {
  const query = {
    insert: vi.fn(() => query),
    select: vi.fn(() => query),
    limit: vi.fn(() => query),
    single: vi.fn(async () => result),
  };

  return query;
}

function makeAnswersQuery(result: unknown) {
  const query = {
    insert: vi.fn(() => query),
    select: vi.fn(async () => result),
  };

  return query;
}

describe("submitSurveyResponse action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUser.mockResolvedValue({ success: false, message: "Not signed in" });
  });

  test("returns an error when there are no answers", async () => {
    const { submitSurveyResponse } = await import(
      "@/lib/actions/submit_survey_response"
    );

    const result = await submitSurveyResponse("survey-1", { answers: {} });

    expect(result).toEqual({
      success: false,
      error: null,
      message: "No answers",
    });
    expect(createClient).not.toHaveBeenCalled();
  });

  test("inserts an anonymous submission and its answers", async () => {
    const submissionQuery = makeSubmissionQuery({
      data: { id: "submission-1" },
      error: null,
    });
    const answersQuery = makeAnswersQuery({ data: [], error: null });
    const from = vi.fn((table: string) => {
      if (table === "submissions") return submissionQuery;
      if (table === "answers") return answersQuery;
      throw new Error(`Unexpected table ${table}`);
    });

    createClient.mockResolvedValue({ from });

    const { submitSurveyResponse } = await import(
      "@/lib/actions/submit_survey_response"
    );

    const result = await submitSurveyResponse("survey-1", {
      answers: {
        "question-1": {
          answer_type: "short-text",
          config: { text: "Good course" },
        },
      },
    });

    expect(result).toEqual({ success: true, data: null });
    expect(submissionQuery.insert).toHaveBeenCalledWith([
      {
        survey_id: "survey-1",
        user_id: null,
        submitted_at: expect.any(Date),
      },
    ]);
    expect(answersQuery.insert).toHaveBeenCalledWith([
      {
        submission_id: "submission-1",
        question_id: "question-1",
        answer_type: "short-text",
        answer_data: { text: "Good course" },
      },
    ]);
  });

  test("uses the signed-in user id when available", async () => {
    getUser.mockResolvedValue({
      success: true,
      data: { id: "user-1" },
    });
    const submissionQuery = makeSubmissionQuery({
      data: { id: "submission-1" },
      error: null,
    });
    const answersQuery = makeAnswersQuery({ data: [], error: null });
    const from = vi.fn((table: string) =>
      table === "submissions" ? submissionQuery : answersQuery,
    );

    createClient.mockResolvedValue({ from });

    const { submitSurveyResponse } = await import(
      "@/lib/actions/submit_survey_response"
    );

    await submitSurveyResponse("survey-1", {
      answers: {
        "question-1": {
          answer_type: "yes-no",
          config: { value: true },
        },
      },
    });

    expect(submissionQuery.insert).toHaveBeenCalledWith([
      {
        survey_id: "survey-1",
        user_id: "user-1",
        submitted_at: expect.any(Date),
      },
    ]);
  });

  test("returns the submission insert error", async () => {
    const submissionQuery = makeSubmissionQuery({
      data: null,
      error: { message: "insert failed" },
    });
    const from = vi.fn(() => submissionQuery);

    createClient.mockResolvedValue({ from });

    const { submitSurveyResponse } = await import(
      "@/lib/actions/submit_survey_response"
    );

    const result = await submitSurveyResponse("survey-1", {
      answers: {
        "question-1": {
          answer_type: "short-text",
          config: { text: "Answer" },
        },
      },
    });

    expect(result).toEqual({
      success: false,
      error: { message: "insert failed" },
      message: "insert failed",
    });
  });

  test("returns the answers insert error", async () => {
    const submissionQuery = makeSubmissionQuery({
      data: { id: "submission-1" },
      error: null,
    });
    const answersQuery = makeAnswersQuery({
      data: null,
      error: { message: "answer insert failed" },
    });
    const from = vi.fn((table: string) =>
      table === "submissions" ? submissionQuery : answersQuery,
    );

    createClient.mockResolvedValue({ from });

    const { submitSurveyResponse } = await import(
      "@/lib/actions/submit_survey_response"
    );

    const result = await submitSurveyResponse("survey-1", {
      answers: {
        "question-1": {
          answer_type: "short-text",
          config: { text: "Answer" },
        },
      },
    });

    expect(result).toEqual({
      success: false,
      error: { message: "answer insert failed" },
      message: "answer insert failed",
    });
  });
});

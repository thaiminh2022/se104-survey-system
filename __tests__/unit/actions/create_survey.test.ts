import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Survey } from "@/lib/types/question-type";

const { createClient, redirect, revalidatePath } = vi.hoisted(() => ({
  createClient: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`redirect:${url}`);
  }),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient,
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

vi.mock("next/cache", () => ({
  revalidatePath,
}));

function makeSurveyInsertQuery(result: unknown) {
  const query = {
    insert: vi.fn(() => query),
    select: vi.fn(() => query),
    limit: vi.fn(() => query),
    single: vi.fn(async () => result),
  };

  return query;
}

function makeInsertOnlyQuery(result: unknown) {
  const query = {
    insert: vi.fn(async () => result),
  };

  return query;
}

const survey: Survey = {
  id: "local-survey",
  title: "Course feedback",
  description: "Tell us what worked",
  state: "draft",
  sections: [
    {
      id: "section-1",
      title: "Basics",
      description: "About the class",
      questions: [
        {
          id: "question-1",
          title: "Your rating",
          description: "Pick one",
          question_type: "rating-scale",
          config: {
            min: 0,
            max: 5,
            minLabel: "Low",
            maxLabel: "High",
          },
          required: true,
        },
      ],
    },
    {
      id: "section-2",
      title: "Final",
      description: "",
      questions: [
        {
          id: "question-2",
          title: "Comment",
          description: "",
          question_type: "short-text",
          config: {},
          required: false,
        },
      ],
    },
  ],
};

describe("submitSurvey action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("returns an auth error when Supabase cannot get the user", async () => {
    createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: null },
          error: { message: "Not authenticated" },
        })),
      },
    });

    const { submitSurvey } = await import("@/lib/actions/create_survey");

    await expect(submitSurvey(survey, true)).resolves.toEqual({
      success: false,
      error: { message: "Not authenticated" },
      message: "Not authenticated",
    });
  });

  test("inserts survey, sections, and questions before redirecting", async () => {
    const surveyInsertQuery = makeSurveyInsertQuery({
      data: { id: "survey-1" },
      error: null,
    });
    const sectionInsertQuery = makeInsertOnlyQuery({ error: null });
    const questionInsertQuery = makeInsertOnlyQuery({ error: null });
    const from = vi.fn((table: string) => {
      if (table === "surveys") return surveyInsertQuery;
      if (table === "sections") return sectionInsertQuery;
      if (table === "questions") return questionInsertQuery;
      throw new Error(`Unexpected table ${table}`);
    });

    createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: { id: "user-1" } },
          error: null,
        })),
      },
      from,
    });

    const { submitSurvey } = await import("@/lib/actions/create_survey");

    await expect(submitSurvey(survey, false)).rejects.toThrow(
      "redirect:/dashboard/surveys",
    );

    expect(surveyInsertQuery.insert).toHaveBeenCalledWith([
      {
        user_id: "user-1",
        title: "Course feedback",
        description: "Tell us what worked",
        state: "published",
      },
    ]);
    expect(sectionInsertQuery.insert).toHaveBeenCalledWith([
      {
        id: "section-1",
        survey_id: "survey-1",
        order_index: 0,
        end_behavior: "continue",
        config: "{}",
        title: "Basics",
        description: "About the class",
      },
      {
        id: "section-2",
        survey_id: "survey-1",
        order_index: 1,
        end_behavior: "continue",
        config: "{}",
        title: "Final",
        description: "",
      },
    ]);
    expect(questionInsertQuery.insert).toHaveBeenCalledWith([
      {
        section_id: "section-1",
        order_index: 0,
        title: "Your rating",
        question_type: "rating-scale",
        config: {
          min: 0,
          max: 5,
          minLabel: "Low",
          maxLabel: "High",
        },
        description: "Pick one",
        required: true,
      },
      {
        section_id: "section-2",
        order_index: 0,
        title: "Comment",
        question_type: "short-text",
        config: {},
        description: "",
        required: false,
      },
    ]);
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/surveys");
  });

  test("returns section insert errors and skips question insert", async () => {
    const surveyInsertQuery = makeSurveyInsertQuery({
      data: { id: "survey-1" },
      error: null,
    });
    const sectionInsertQuery = makeInsertOnlyQuery({
      error: { message: "section failed" },
    });
    const questionInsertQuery = makeInsertOnlyQuery({ error: null });
    const from = vi.fn((table: string) => {
      if (table === "surveys") return surveyInsertQuery;
      if (table === "sections") return sectionInsertQuery;
      if (table === "questions") return questionInsertQuery;
      throw new Error(`Unexpected table ${table}`);
    });

    createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn(async () => ({
          data: { user: { id: "user-1" } },
          error: null,
        })),
      },
      from,
    });

    const { submitSurvey } = await import("@/lib/actions/create_survey");

    await expect(submitSurvey(survey, true)).resolves.toEqual({
      success: false,
      error: { message: "section failed" },
      message: "Section insert error: section failed",
    });
    expect(questionInsertQuery.insert).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});

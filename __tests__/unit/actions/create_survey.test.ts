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

function makeUpdateQuery(result: unknown) {
  let eqCallCount = 0;
  const query = {
    update: vi.fn(() => query),
    eq: vi.fn(() => {
      eqCallCount += 1;
      return eqCallCount === 1 ? query : result;
    }),
  };

  return query;
}

function makeDeleteQuery(result: unknown) {
  const query = {
    delete: vi.fn(() => query),
    in: vi.fn(async () => result),
  };

  return query;
}

function makeSectionSelectQuery(result: unknown) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(async () => result),
  };

  return query;
}

function makeQuestionSelectQuery(result: unknown) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(async () => result),
  };

  return query;
}

function makeUpsertQuery(result: unknown) {
  const query = {
    upsert: vi.fn(async () => result),
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

describe("updateSurvey action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("updates survey, removes missing sections and questions, upserts current rows, then redirects", async () => {
    const editedSurvey: Survey = {
      ...survey,
      id: "survey-1",
      title: "Updated course feedback",
      state: "published",
      sections: [
        {
          ...survey.sections[0],
          title: "Updated basics",
          questions: [
            {
              ...survey.sections[0].questions[0],
              title: "Updated rating",
            },
          ],
        },
      ],
    };
    const surveyUpdateQuery = makeUpdateQuery({ error: null });
    const sectionSelectQuery = makeSectionSelectQuery({
      data: [{ id: "section-1" }, { id: "section-removed" }],
      error: null,
    });
    const sectionDeleteQuery = makeDeleteQuery({ error: null });
    const sectionUpsertQuery = makeUpsertQuery({ error: null });
    const questionSelectQuery = makeQuestionSelectQuery({
      data: [{ id: "question-1" }, { id: "question-removed" }],
      error: null,
    });
    const questionDeleteQuery = makeDeleteQuery({ error: null });
    const questionUpsertQuery = makeUpsertQuery({ error: null });
    const tableCalls = new Map<string, number>();
    const from = vi.fn((table: string) => {
      const call = tableCalls.get(table) ?? 0;
      tableCalls.set(table, call + 1);

      if (table === "surveys") return surveyUpdateQuery;
      if (table === "sections" && call === 0) return sectionSelectQuery;
      if (table === "sections" && call === 1) return sectionDeleteQuery;
      if (table === "sections" && call === 2) return sectionUpsertQuery;
      if (table === "questions" && call === 0) return questionSelectQuery;
      if (table === "questions" && call === 1) return questionDeleteQuery;
      if (table === "questions" && call === 2) return questionUpsertQuery;
      throw new Error(`Unexpected ${table} call ${call}`);
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

    const { updateSurvey } = await import("@/lib/actions/create_survey");

    await expect(updateSurvey(editedSurvey, false)).rejects.toThrow(
      "redirect:/dashboard/surveys",
    );

    expect(surveyUpdateQuery.update).toHaveBeenCalledWith({
      title: "Updated course feedback",
      description: "Tell us what worked",
      state: "published",
    });
    expect(surveyUpdateQuery.eq).toHaveBeenNthCalledWith(1, "id", "survey-1");
    expect(surveyUpdateQuery.eq).toHaveBeenNthCalledWith(2, "user_id", "user-1");
    expect(sectionDeleteQuery.in).toHaveBeenCalledWith("id", ["section-removed"]);
    expect(sectionUpsertQuery.upsert).toHaveBeenCalledWith(
      [
        {
          id: "section-1",
          survey_id: "survey-1",
          order_index: 0,
          end_behavior: "continue",
          config: {},
          title: "Updated basics",
          description: "About the class",
        },
      ],
      { onConflict: "id" },
    );
    expect(questionDeleteQuery.in).toHaveBeenCalledWith("id", [
      "question-removed",
    ]);
    expect(questionUpsertQuery.upsert).toHaveBeenCalledWith(
      [
        {
          id: "question-1",
          section_id: "section-1",
          order_index: 0,
          title: "Updated rating",
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
      ],
      { onConflict: "id" },
    );
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/surveys");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/analytics");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/analytics/survey-1");
    expect(revalidatePath).toHaveBeenCalledWith("/surveys/survey-1");
  });

  test("returns publish validation errors before opening Supabase", async () => {
    const invalidSurvey: Survey = {
      ...survey,
      id: "survey-1",
      title: "",
    };

    const { updateSurvey } = await import("@/lib/actions/create_survey");

    await expect(updateSurvey(invalidSurvey, false)).resolves.toEqual({
      success: false,
      error: null,
      message: "Survey title cannot be empty.",
    });
    expect(createClient).not.toHaveBeenCalled();
  });
});

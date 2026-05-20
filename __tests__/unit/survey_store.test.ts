import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function loadStore() {
  vi.resetModules();
  return import("@/lib/stores/survey_store");
}

describe("survey store", () => {
  beforeEach(() => {
    let id = 0;
    vi.spyOn(crypto, "randomUUID").mockImplementation(
      () => `uuid-${++id}` as ReturnType<Crypto["randomUUID"]>,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a draft survey with one section and one short-text question", async () => {
    const { useSurveyStore } = await loadStore();

    expect(useSurveyStore.getState().survey).toMatchObject({
      id: "uuid-1",
      title: "New survey",
      state: "draft",
      description: "",
      sections: [
        {
          id: "uuid-2",
          title: "New section",
          description: "",
          questions: [
            {
              id: "uuid-3",
              title: "New question",
              description: "",
              question_type: "short-text",
              config: {},
              required: false,
            },
          ],
        },
      ],
    });
  });

  it("adds sections and does not delete the final remaining section", async () => {
    const { useSurveyStore } = await loadStore();
    const firstSectionId = useSurveyStore.getState().survey.sections[0].id;

    const secondSectionId = useSurveyStore.getState().addSection();
    expect(useSurveyStore.getState().survey.sections).toHaveLength(2);

    useSurveyStore.getState().deleteSection(firstSectionId);
    expect(useSurveyStore.getState().survey.sections).toHaveLength(1);
    expect(useSurveyStore.getState().survey.sections[0].id).toBe(secondSectionId);

    useSurveyStore.getState().deleteSection(secondSectionId);
    expect(useSurveyStore.getState().survey.sections).toHaveLength(1);
  });

  it("adds questions with default config for the requested type", async () => {
    const { useSurveyStore } = await loadStore();
    const sectionId = useSurveyStore.getState().survey.sections[0].id;

    const questionId = useSurveyStore.getState().addQuestion(sectionId, "matrix");
    const question = useSurveyStore
      .getState()
      .survey.sections[0].questions.find((item) => item.id === questionId);

    expect(question).toMatchObject({
      question_type: "matrix",
      config: {
        rows: ["Row 1"],
        columns: ["Column 1"],
        multiplePerRow: false,
      },
    });
  });

  it("returns null when adding a question to a missing section", async () => {
    const { useSurveyStore } = await loadStore();

    expect(useSurveyStore.getState().addQuestion("missing-section")).toBeNull();
  });

  it("updates survey, section, and question fields", async () => {
    const { useSurveyStore } = await loadStore();
    const sectionId = useSurveyStore.getState().survey.sections[0].id;
    const questionId = useSurveyStore.getState().survey.sections[0].questions[0].id;

    useSurveyStore.getState().updateSurveyTitle("Published survey");
    useSurveyStore.getState().updateSurveyDescription("Course feedback");
    useSurveyStore.getState().updateSectionTitle(sectionId, "Basics");
    useSurveyStore.getState().updateSectionDescription(sectionId, "About the course");
    useSurveyStore.getState().updateQuestionTitle(sectionId, questionId, "Your name");
    useSurveyStore
      .getState()
      .updateQuestionDescription(sectionId, questionId, "Use your full name");
    useSurveyStore.getState().updateQuestionRequired(sectionId, questionId, true);

    expect(useSurveyStore.getState().survey).toMatchObject({
      title: "Published survey",
      description: "Course feedback",
      sections: [
        {
          title: "Basics",
          description: "About the course",
          questions: [
            {
              title: "Your name",
              description: "Use your full name",
              required: true,
            },
          ],
        },
      ],
    });
  });

  it("resets question config when the question type changes", async () => {
    const { useSurveyStore } = await loadStore();
    const sectionId = useSurveyStore.getState().survey.sections[0].id;
    const questionId = useSurveyStore.getState().survey.sections[0].questions[0].id;

    useSurveyStore.getState().updateQuestionConfig(sectionId, questionId, {
      placeholder: "Custom placeholder",
    });
    useSurveyStore.getState().updateQuestionType(sectionId, questionId, "yes-no");

    expect(useSurveyStore.getState().survey.sections[0].questions[0]).toMatchObject({
      question_type: "yes-no",
      config: {
        yesLabel: "Yes",
        noLabel: "No",
      },
    });
  });
});

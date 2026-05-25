import { describe, expect, test } from "vitest";
import type { Survey } from "@/lib/types/question-type";
import { validateSurveyForPublish } from "@/lib/validations/survey_publish";

const validSurvey: Survey = {
  id: "survey-1",
  title: "Course feedback",
  description: "",
  state: "draft",
  sections: [
    {
      id: "section-1",
      title: "Basics",
      description: "",
      questions: [
        {
          id: "question-1",
          title: "Favorite topic",
          description: "",
          question_type: "single-choice",
          config: {
            options: ["UI", "Backend"],
            haveOther: false,
          },
          required: true,
        },
      ],
    },
  ],
};

describe("validateSurveyForPublish", () => {
  test("accepts a valid survey", () => {
    expect(validateSurveyForPublish(validSurvey)).toEqual({ success: true });
  });

  test("rejects a blank survey title", () => {
    expect(
      validateSurveyForPublish({
        ...validSurvey,
        title: "   ",
      }),
    ).toEqual({
      success: false,
      message: "Survey title cannot be empty.",
    });
  });

  test("rejects sections without questions", () => {
    expect(
      validateSurveyForPublish({
        ...validSurvey,
        sections: [
          {
            ...validSurvey.sections[0],
            questions: [],
          },
        ],
      }),
    ).toEqual({
      success: false,
      message: "Section 1 must contain at least one question.",
    });
  });

  test("rejects empty option values", () => {
    expect(
      validateSurveyForPublish({
        ...validSurvey,
        sections: [
          {
            ...validSurvey.sections[0],
            questions: [
              {
                ...validSurvey.sections[0].questions[0],
                config: {
                  options: ["UI", "   "],
                  haveOther: false,
                },
              },
            ],
          },
        ],
      }),
    ).toEqual({
      success: false,
      message: "Section 1, Question 1 option 2 cannot be empty.",
    });
  });

  test("requires ranking questions to have at least two options", () => {
    expect(
      validateSurveyForPublish({
        ...validSurvey,
        sections: [
          {
            ...validSurvey.sections[0],
            questions: [
              {
                id: "question-ranking",
                title: "Rank topics",
                description: "",
                question_type: "ranking",
                config: {
                  options: ["Only one"],
                },
                required: true,
              },
            ],
          },
        ],
      }),
    ).toEqual({
      success: false,
      message: "Section 1, Question 1 must have at least 2 options.",
    });
  });
});

import { describe, expect, test } from "vitest";
import type { AnswerForm } from "@/lib/types/answer-type";
import type { Survey } from "@/lib/types/question-type";
import {
  getMissingRequiredQuestionIds,
  validateSurveyResponse,
} from "@/lib/validations/survey_response";

function makeSurvey(questionOverrides: Partial<Survey["sections"][number]["questions"][number]> = {}): Survey {
  return {
    id: "survey-1",
    title: "Course feedback",
    description: "",
    state: "published",
    sections: [
      {
        id: "section-1",
        title: "Basics",
        description: "",
        questions: [
          {
            id: "question-1",
            title: "Age",
            description: "",
            question_type: "number",
            config: {
              isInteger: true,
              isRange: false,
              min: 0,
              max: 120,
            },
            required: true,
            ...questionOverrides,
          } as Survey["sections"][number]["questions"][number],
        ],
      },
    ],
  };
}

describe("validateSurveyResponse", () => {
  test("reports missing required questions", () => {
    const survey = makeSurvey();

    expect(getMissingRequiredQuestionIds(survey.sections[0], {})).toEqual([
      "question-1",
    ]);
    expect(validateSurveyResponse(survey, { answers: {} })).toEqual({
      success: false,
      missingQuestionIds: ["question-1"],
      message: "Please complete all required questions.",
    });
  });

  test("accepts valid required number answers", () => {
    const survey = makeSurvey();
    const answerForm: AnswerForm = {
      answers: {
        "question-1": {
          answer_type: "number",
          config: {
            is_range: false,
            answer: 20,
          },
        },
      },
    };

    expect(validateSurveyResponse(survey, answerForm)).toEqual({
      success: true,
      missingQuestionIds: [],
    });
  });

  test("rejects required number answers outside allowed bounds", () => {
    const survey = makeSurvey();

    expect(
      validateSurveyResponse(survey, {
        answers: {
          "question-1": {
            answer_type: "number",
            config: {
              is_range: false,
              answer: 121,
            },
          },
        },
      }),
    ).toMatchObject({
      success: false,
      missingQuestionIds: ["question-1"],
    });
  });

  test("rejects decimal answers for integer number questions", () => {
    const survey = makeSurvey();

    expect(
      validateSurveyResponse(survey, {
        answers: {
          "question-1": {
            answer_type: "number",
            config: {
              is_range: false,
              answer: 20.5,
            },
          },
        },
      }),
    ).toMatchObject({
      success: false,
      missingQuestionIds: ["question-1"],
    });
  });

  test("accepts valid required number range answers", () => {
    const survey = makeSurvey({
      config: {
        isInteger: true,
        isRange: true,
        min: 0,
        max: 120,
      },
    });

    expect(
      validateSurveyResponse(survey, {
        answers: {
          "question-1": {
            answer_type: "number",
            config: {
              is_range: true,
              from: 18,
              to: 30,
            },
          },
        },
      }),
    ).toEqual({
      success: true,
      missingQuestionIds: [],
    });
  });

  test("rejects invalid required number ranges", () => {
    const survey = makeSurvey({
      config: {
        isInteger: true,
        isRange: true,
        min: 0,
        max: 120,
      },
    });

    expect(
      validateSurveyResponse(survey, {
        answers: {
          "question-1": {
            answer_type: "number",
            config: {
              is_range: true,
              from: 30,
              to: 18,
            },
          },
        },
      }),
    ).toMatchObject({
      success: false,
      missingQuestionIds: ["question-1"],
    });
  });
});

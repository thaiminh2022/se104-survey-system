import { describe, expect, it } from "vitest";

import {
  buildSurveyCsv,
  getSurveyCsvFilename,
  type SurveyCsvExportData,
  type SurveyCsvExportOptions,
} from "@/lib/exports/survey_csv";
import type {
  AnswerRow,
  QuestionRow,
  SectionRow,
  SubmissionRow,
} from "@/lib/types/db_schema";

const CREATED_AT = new Date("2026-05-20T01:00:00.000Z");

function section(
  id: string,
  orderIndex: number,
  title: string,
  questions: QuestionRow[],
): SectionRow & { questions: QuestionRow[] } {
  return {
    id,
    survey_id: "survey-1",
    order_index: orderIndex,
    end_behavior: "continue",
    config: {},
    title,
    description: null,
    created_at: CREATED_AT,
    questions,
  };
}

function question(
  id: string,
  sectionId: string,
  orderIndex: number,
  title: string,
  questionType: string,
): QuestionRow {
  return {
    id,
    section_id: sectionId,
    order_index: orderIndex,
    title,
    image: null,
    description: null,
    question_type: questionType,
    config: {},
    created_at: CREATED_AT,
    required: false,
  };
}

function submission(id: string, answers: AnswerRow[]): SubmissionRow & { answers: AnswerRow[] } {
  return {
    id,
    survey_id: "survey-1",
    user_id: null,
    created_at: CREATED_AT,
    submitted_at: new Date("2026-05-20T02:00:00.000Z"),
    answers,
  };
}

function answer(
  id: string,
  questionId: string,
  answerData: AnswerRow["answer_data"],
): AnswerRow {
  return {
    id,
    submission_id: "submission-1",
    question_id: questionId,
    created_at: CREATED_AT,
    answer_data: answerData,
  };
}

const defaultOptions: SurveyCsvExportOptions = {
  shape: "long",
  includeSubmissionMeta: true,
  includeQuestionMeta: true,
  includeEmptyAnswers: false,
};

describe("survey CSV export", () => {
  it("exports long-form rows in section and question order", () => {
    const survey: SurveyCsvExportData = {
      id: "survey-1",
      title: "Course Survey",
      sections: [
        section("section-2", 2, "Second Section", [
          question("question-3", "section-2", 1, "Final comment", "short-text"),
        ]),
        section("section-1", 1, "First Section", [
          question("question-2", "section-1", 2, "Rating", "rating-scale"),
          question("question-1", "section-1", 1, "Favorite option", "single-choice"),
        ]),
      ],
      submissions: [
        submission("submission-1", [
          answer("answer-1", "question-1", {
            use_other: false,
            selected_option: "Option A",
          }),
          answer("answer-2", "question-2", { rating: 5 }),
          answer("answer-3", "question-3", { text: "Good class" }),
        ]),
      ],
    };

    expect(buildSurveyCsv(survey, defaultOptions)).toBe(
      [
        "submission_id,respondent_user_id,submitted_at,submission_created_at,section_title,question_id,question_title,question_type,answer",
        "submission-1,,2026-05-20T02:00:00.000Z,2026-05-20T01:00:00.000Z,First Section,question-1,Favorite option,single-choice,Option A",
        "submission-1,,2026-05-20T02:00:00.000Z,2026-05-20T01:00:00.000Z,First Section,question-2,Rating,rating-scale,5",
        "submission-1,,2026-05-20T02:00:00.000Z,2026-05-20T01:00:00.000Z,Second Section,question-3,Final comment,short-text,Good class",
      ].join("\r\n"),
    );
  });

  it("exports wide-form rows with unique question headers and escaped cells", () => {
    const survey: SurveyCsvExportData = {
      id: "survey-1",
      title: "Course Survey",
      sections: [
        section("section-1", 1, "General", [
          question("question-1", "section-1", 1, "Feedback", "long-text"),
          question("question-2", "section-1", 2, "Feedback", "multiple-choice"),
        ]),
      ],
      submissions: [
        submission("submission-1", [
          answer("answer-1", "question-1", {
            text: 'Loved "labs", but wanted more examples',
          }),
          answer("answer-2", "question-2", {
            use_other: false,
            selected_options: ["Videos", "Slides"],
          }),
        ]),
      ],
    };

    expect(
      buildSurveyCsv(survey, {
        ...defaultOptions,
        shape: "wide",
        includeSubmissionMeta: false,
      }),
    ).toBe(
      [
        "General / Feedback,General / Feedback (2)",
        '"Loved ""labs"", but wanted more examples",Videos; Slides',
      ].join("\r\n"),
    );
  });

  it("includes empty answer cells when requested", () => {
    const survey: SurveyCsvExportData = {
      id: "survey-1",
      title: "Course Survey",
      sections: [
        section("section-1", 1, "General", [
          question("question-1", "section-1", 1, "Name", "short-text"),
          question("question-2", "section-1", 2, "Agree", "yes-no"),
        ]),
      ],
      submissions: [
        submission("submission-1", [
          answer("answer-1", "question-1", { text: "Minh" }),
        ]),
      ],
    };

    expect(
      buildSurveyCsv(survey, {
        ...defaultOptions,
        includeSubmissionMeta: false,
        includeQuestionMeta: true,
        includeEmptyAnswers: true,
      }),
    ).toBe(
      [
        "section_title,question_id,question_title,question_type,answer",
        "General,question-1,Name,short-text,Minh",
        "General,question-2,Agree,yes-no,",
      ].join("\r\n"),
    );
  });

  it("generates stable CSV filenames from survey titles", () => {
    expect(getSurveyCsvFilename("  Student Feedback: SE104 / 2026!  ")).toBe(
      "student-feedback-se104-2026-responses.csv",
    );
    expect(getSurveyCsvFilename("!!!")).toBe("survey-responses.csv");
  });
});

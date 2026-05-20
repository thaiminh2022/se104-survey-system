import { describe, expect, it } from "vitest";

import {
  getQuestionAnswerCharts,
  type QuestionAnswerChart,
} from "@/lib/charts/question_answer_charts";
import type { QuestionAnswerAnalyticsSection } from "@/lib/actions/read_analytics";

const CREATED_AT = new Date("2026-05-20T01:00:00.000Z");

function makeChartFixture(): QuestionAnswerAnalyticsSection[] {
  return [
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
              answer_data: { use_other: false, selected_option: "A" },
            },
            {
              id: "answer-2",
              question_id: "question-1",
              created_at: CREATED_AT,
              answer_data: { use_other: false, selected_option: "A" },
            },
            {
              id: "answer-3",
              question_id: "question-1",
              created_at: CREATED_AT,
              answer_data: { use_other: true, other_answer: "Custom" },
            },
          ],
        },
        {
          id: "question-2",
          section_id: "section-1",
          order_index: 2,
          title: "Matrix",
          image: null,
          description: null,
          question_type: "matrix",
          config: {},
          created_at: CREATED_AT,
          required: false,
          answers: [
            {
              id: "answer-4",
              question_id: "question-2",
              created_at: CREATED_AT,
              answer_data: {
                rows: {
                  Quality: "High",
                  Support: ["Fast", "Helpful"],
                },
              },
            },
          ],
        },
        {
          id: "question-3",
          section_id: "section-1",
          order_index: 3,
          title: "Comment",
          image: null,
          description: null,
          question_type: "long-text",
          config: {},
          created_at: CREATED_AT,
          required: false,
          answers: [
            {
              id: "answer-5",
              question_id: "question-3",
              created_at: CREATED_AT,
              answer_data: { text: "Useful" },
            },
            {
              id: "answer-6",
              question_id: "question-3",
              created_at: CREATED_AT,
              answer_data: { text: "Clear" },
            },
          ],
        },
      ],
    },
  ];
}

describe("question answer charts", () => {
  it("counts chartable answer values and sorts by count then label", () => {
    const [singleChoiceChart] = getQuestionAnswerCharts(makeChartFixture());

    expect(singleChoiceChart).toMatchObject<QuestionAnswerChart>({
      id: "question-1",
      title: "Pick one",
      questionType: "single-choice",
      answerCount: 3,
      data: [
        { label: "A", count: 2 },
        { label: "Other: Custom", count: 1 },
      ],
      samples: [],
    });
  });

  it("labels matrix values with their row names", () => {
    const [, matrixChart] = getQuestionAnswerCharts(makeChartFixture());

    expect(matrixChart.data).toEqual([
      { label: "Quality: High", count: 1 },
      { label: "Support: Fast", count: 1 },
      { label: "Support: Helpful", count: 1 },
    ]);
    expect(matrixChart.note).toBe("Matrix answers are grouped by row and selected value.");
  });

  it("keeps text answers as samples instead of chart buckets", () => {
    const [, , textChart] = getQuestionAnswerCharts(makeChartFixture());

    expect(textChart.data).toEqual([]);
    expect(textChart.samples).toEqual(["Useful", "Clear"]);
    expect(textChart.note).toBe("Text answers are shown as recent samples.");
  });
});

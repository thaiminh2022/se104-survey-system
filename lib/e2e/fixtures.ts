import type {
  AnswerRow,
  QuestionRow,
  SectionRow,
  SubmissionRow,
  SurveyRow,
  SurveyRowJoinSubmissionRow,
} from "@/lib/types/db_schema";

export function isPlaywrightE2E() {
  return process.env.PLAYWRIGHT_E2E === "1";
}

export const e2eUser = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "e2e@example.com",
};

const createdAt = new Date("2026-05-20T01:00:00.000Z");

export const e2eSurveyRows: SurveyRow[] = [
  {
    id: "e2e-survey",
    user_id: e2eUser.id,
    title: "E2E Published Survey",
    state: "published",
    image: null,
    description: "Fixture survey for browser tests",
    submission_count: 2,
    view_count: 4,
    created_at: createdAt,
  },
  {
    id: "e2e-draft",
    user_id: e2eUser.id,
    title: "E2E Draft Survey",
    state: "draft",
    image: null,
    description: "Draft fixture survey",
    submission_count: 0,
    view_count: 0,
    created_at: createdAt,
  },
];

export const e2eSections: (SectionRow & { questions: QuestionRow[] })[] = [
  {
    id: "e2e-section-1",
    survey_id: "e2e-survey",
    order_index: 1,
    end_behavior: "continue",
    config: {},
    title: "Basics",
    description: null,
    created_at: createdAt,
    questions: [
      {
        id: "e2e-question-1",
        section_id: "e2e-section-1",
        order_index: 1,
        title: "Your name",
        image: null,
        description: null,
        question_type: "short-text",
        config: { placeholder: "Name" },
        created_at: createdAt,
        required: true,
      },
      {
        id: "e2e-question-2",
        section_id: "e2e-section-1",
        order_index: 2,
        title: "Pick one",
        image: null,
        description: null,
        question_type: "single-choice",
        config: { options: ["A", "B"], haveOther: false },
        created_at: createdAt,
        required: true,
      },
    ],
  },
  {
    id: "e2e-section-2",
    survey_id: "e2e-survey",
    order_index: 2,
    end_behavior: "continue",
    config: {},
    title: "Details",
    description: null,
    created_at: createdAt,
    questions: [
      {
        id: "e2e-question-3",
        section_id: "e2e-section-2",
        order_index: 1,
        title: "Agree?",
        image: null,
        description: null,
        question_type: "yes-no",
        config: { yesLabel: "Yes", noLabel: "No" },
        created_at: createdAt,
        required: true,
      },
      {
        id: "e2e-question-4",
        section_id: "e2e-section-2",
        order_index: 2,
        title: "Accept terms",
        image: null,
        description: null,
        question_type: "consent",
        config: { label: "I agree to participate." },
        created_at: createdAt,
        required: true,
      },
    ],
  },
];

export const e2eSubmissions: (SubmissionRow & { answers: AnswerRow[] })[] = [
  {
    id: "e2e-submission-1",
    survey_id: "e2e-survey",
    user_id: null,
    created_at: createdAt,
    submitted_at: new Date("2026-05-20T02:00:00.000Z"),
    answers: [
      answer("e2e-answer-1", "e2e-submission-1", "e2e-question-1", {
        text: "Minh",
      }),
      answer("e2e-answer-2", "e2e-submission-1", "e2e-question-2", {
        use_other: false,
        selected_option: "A",
      }),
      answer("e2e-answer-3", "e2e-submission-1", "e2e-question-3", {
        value: true,
      }),
      answer("e2e-answer-4", "e2e-submission-1", "e2e-question-4", {
        accepted: true,
      }),
    ],
  },
  {
    id: "e2e-submission-2",
    survey_id: "e2e-survey",
    user_id: null,
    created_at: createdAt,
    submitted_at: new Date("2026-05-21T02:00:00.000Z"),
    answers: [
      answer("e2e-answer-5", "e2e-submission-2", "e2e-question-1", {
        text: "Alex",
      }),
      answer("e2e-answer-6", "e2e-submission-2", "e2e-question-2", {
        use_other: false,
        selected_option: "B",
      }),
    ],
  },
];

export function getE2ESurveyAnalytics(): SurveyRowJoinSubmissionRow {
  return {
    ...e2eSurveyRows[0],
    submissions: e2eSubmissions,
  };
}

function answer(
  id: string,
  submissionId: string,
  questionId: string,
  answerData: AnswerRow["answer_data"],
): AnswerRow {
  return {
    id,
    submission_id: submissionId,
    question_id: questionId,
    created_at: createdAt,
    answer_data: answerData,
  };
}

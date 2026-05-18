import type {
  AnswerRow,
  QuestionRow,
  SectionRow,
  SubmissionRow,
  SurveyRow,
} from "@/lib/types/db_schema";
import type { QuestionTypes } from "@/lib/types/question-type";

export type SurveyCsvExportOptions = {
  shape: "long" | "wide";
  includeSubmissionMeta: boolean;
  includeQuestionMeta: boolean;
  includeEmptyAnswers: boolean;
};

export type SurveyCsvExportData = Pick<SurveyRow, "id" | "title"> & {
  sections: (SectionRow & { questions: QuestionRow[] })[];
  submissions: (SubmissionRow & { answers: AnswerRow[] })[];
};

type OrderedQuestion = QuestionRow & {
  section_title: string;
};

export function buildSurveyCsv(
  survey: SurveyCsvExportData,
  options: SurveyCsvExportOptions,
) {
  const questions = getOrderedQuestions(survey.sections);

  if (options.shape === "wide") {
    return buildWideSurveyCsv(survey.submissions, questions, options);
  }

  return buildLongSurveyCsv(survey.submissions, questions, options);
}

export function getSurveyCsvFilename(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${slug || "survey"}-responses.csv`;
}

function buildLongSurveyCsv(
  submissions: SurveyCsvExportData["submissions"],
  questions: OrderedQuestion[],
  options: SurveyCsvExportOptions,
) {
  const header = [
    ...(options.includeSubmissionMeta
      ? [
          "submission_id",
          "respondent_user_id",
          "submitted_at",
          "submission_created_at",
        ]
      : []),
    ...(options.includeQuestionMeta
      ? ["section_title", "question_id", "question_title", "question_type"]
      : []),
    "answer",
  ];

  const rows = submissions.flatMap((submission) => {
    const answersByQuestion = new Map(
      submission.answers.map((answer) => [answer.question_id, answer]),
    );
    const rowQuestions = options.includeEmptyAnswers
      ? questions
      : questions.filter((question) => answersByQuestion.has(question.id));

    return rowQuestions.map((question) => {
      const answer = answersByQuestion.get(question.id);

      return [
        ...(options.includeSubmissionMeta
          ? [
              submission.id,
              submission.user_id ?? "",
              formatDate(submission.submitted_at),
              formatDate(submission.created_at),
            ]
          : []),
        ...(options.includeQuestionMeta
          ? [
              question.section_title,
              question.id,
              question.title,
              question.question_type,
            ]
          : []),
        answer
          ? serializeAnswer(question.question_type as QuestionTypes, answer.answer_data)
          : "",
      ];
    });
  });

  return toCsv([header, ...rows]);
}

function buildWideSurveyCsv(
  submissions: SurveyCsvExportData["submissions"],
  questions: OrderedQuestion[],
  options: SurveyCsvExportOptions,
) {
  const questionHeaders = getUniqueQuestionHeaders(questions, options);
  const header = [
    ...(options.includeSubmissionMeta
      ? [
          "submission_id",
          "respondent_user_id",
          "submitted_at",
          "submission_created_at",
        ]
      : []),
    ...questionHeaders,
  ];

  const rows = submissions.map((submission) => {
    const answersByQuestion = new Map(
      submission.answers.map((answer) => [answer.question_id, answer]),
    );

    return [
      ...(options.includeSubmissionMeta
        ? [
            submission.id,
            submission.user_id ?? "",
            formatDate(submission.submitted_at),
            formatDate(submission.created_at),
          ]
        : []),
      ...questions.map((question) => {
        const answer = answersByQuestion.get(question.id);
        return answer
          ? serializeAnswer(question.question_type as QuestionTypes, answer.answer_data)
          : "";
      }),
    ];
  });

  return toCsv([header, ...rows]);
}

function getOrderedQuestions(sections: SurveyCsvExportData["sections"]) {
  return [...sections]
    .sort((a, b) => a.order_index - b.order_index)
    .flatMap((section) =>
      [...section.questions]
        .sort((a, b) => a.order_index - b.order_index)
        .map((question) => ({
          ...question,
          section_title: section.title,
        })),
    );
}

function getUniqueQuestionHeaders(
  questions: OrderedQuestion[],
  options: SurveyCsvExportOptions,
) {
  const seen = new Map<string, number>();

  return questions.map((question) => {
    const base = options.includeQuestionMeta
      ? `${question.section_title} / ${question.title}`
      : question.id;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    return count === 0 ? base : `${base} (${count + 1})`;
  });
}

function serializeAnswer(questionType: QuestionTypes, answerData: unknown) {
  if (!isRecord(answerData)) {
    return stringifyValue(answerData);
  }

  switch (questionType) {
    case "single-choice":
      return answerData.use_other === true
        ? stringifyValue(answerData.other_answer)
        : stringifyValue(answerData.selected_option);
    case "multiple-choice":
      if (answerData.use_other === true) {
        return stringifyValue(answerData.other_answer);
      }
      return Array.isArray(answerData.selected_options)
        ? answerData.selected_options.map(stringifyValue).join("; ")
        : "";
    case "rating-scale":
      return stringifyValue(answerData.rating);
    case "likert-scale":
    case "dropdown":
      return stringifyValue(answerData.selected_option);
    case "short-text":
    case "long-text":
      return stringifyValue(answerData.text);
    case "yes-no":
      return typeof answerData.value === "boolean"
        ? answerData.value
          ? "Yes"
          : "No"
        : "";
    case "matrix":
      return isRecord(answerData.rows)
        ? Object.entries(answerData.rows)
            .map(([row, value]) => `${row}: ${stringifyValue(value)}`)
            .join("; ")
        : "";
    case "ranking":
      return Array.isArray(answerData.ranked_options)
        ? answerData.ranked_options.map(stringifyValue).join("; ")
        : "";
    case "date-time":
      return stringifyValue(answerData.value);
    case "consent":
      return typeof answerData.accepted === "boolean"
        ? answerData.accepted
          ? "Accepted"
          : "Declined"
        : "";
    case "number":
      if (answerData.is_range === true) {
        return `${stringifyValue(answerData.from)} - ${stringifyValue(answerData.to)}`;
      }
      return stringifyValue(answerData.answer);
  }
}

function toCsv(rows: unknown[][]) {
  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}

function escapeCsvCell(value: unknown) {
  const text = stringifyValue(value);

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function stringifyValue(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(stringifyValue).join("; ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function formatDate(value: Date | string) {
  return new Date(value).toISOString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

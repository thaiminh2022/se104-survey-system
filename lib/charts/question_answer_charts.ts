import type { QuestionAnswerAnalyticsSection } from "@/lib/actions/read_analytics";
import type { QuestionTypes } from "@/lib/types/question-type";

export type QuestionAnswerChartDatum = {
  label: string;
  count: number;
};

export type QuestionAnswerChart = {
  id: string;
  title: string;
  questionType: QuestionTypes;
  answerCount: number;
  data: QuestionAnswerChartDatum[];
  samples: string[];
  note?: string;
};

export function getQuestionAnswerCharts(
  sections: QuestionAnswerAnalyticsSection[],
): QuestionAnswerChart[] {
  return sections.flatMap((section) =>
    section.questions.map((question) => {
      const values = question.answers.flatMap((answer) =>
        getChartValues(question.question_type as QuestionTypes, answer.answer_data),
      );

      const data = Array.from(countValues(values).entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

      return {
        id: question.id,
        title: question.title,
        questionType: question.question_type as QuestionTypes,
        answerCount: question.answers.length,
        data,
        samples: getSamples(
          question.question_type as QuestionTypes,
          question.answers.map((answer) => answer.answer_data),
        ),
        note: getQuestionNote(question.question_type as QuestionTypes),
      };
    }),
  );
}

function countValues(values: string[]) {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const label = value.trim();
    if (!label) {
      return;
    }

    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return counts;
}

function getChartValues(questionType: QuestionTypes, answerData: unknown) {
  if (!isRecord(answerData)) {
    return [];
  }

  switch (questionType) {
    case "single-choice":
      if (answerData.use_other === true) {
        return [formatOtherAnswer(answerData.other_answer)];
      }
      return getStringValue(answerData.selected_option);
    case "multiple-choice":
      if (answerData.use_other === true) {
        return [formatOtherAnswer(answerData.other_answer)];
      }
      return Array.isArray(answerData.selected_options)
        ? answerData.selected_options.filter(isString)
        : [];
    case "dropdown":
    case "likert-scale":
      return getStringValue(answerData.selected_option);
    case "rating-scale":
      return getNumberValue(answerData.rating);
    case "yes-no":
      return typeof answerData.value === "boolean"
        ? [answerData.value ? "Yes" : "No"]
        : [];
    case "consent":
      return typeof answerData.accepted === "boolean"
        ? [answerData.accepted ? "Accepted" : "Declined"]
        : [];
    case "number":
      if (answerData.is_range === true) {
        return typeof answerData.from === "number" &&
          typeof answerData.to === "number"
          ? [`${answerData.from} - ${answerData.to}`]
          : [];
      }
      return getNumberValue(answerData.answer);
    case "date-time":
      return getStringValue(answerData.value);
    case "matrix":
      return getMatrixValues(answerData.rows);
    case "ranking":
      return Array.isArray(answerData.ranked_options)
        ? answerData.ranked_options.filter(isString)
        : [];
    case "short-text":
    case "long-text":
      return [];
  }
}

function getSamples(questionType: QuestionTypes, answers: unknown[]) {
  if (questionType !== "short-text" && questionType !== "long-text") {
    return [];
  }

  return answers
    .flatMap((answerData) => {
      if (!isRecord(answerData)) {
        return [];
      }

      return getStringValue(answerData.text);
    })
    .filter(Boolean)
    .slice(0, 5);
}

function getQuestionNote(questionType: QuestionTypes) {
  switch (questionType) {
    case "short-text":
    case "long-text":
      return "Text answers are shown as recent samples.";
    case "ranking":
      return "Ranking answers count each ranked option once.";
    case "matrix":
      return "Matrix answers are grouped by row and selected value.";
    default:
      return undefined;
  }
}

function getStringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? [value] : [];
}

function getNumberValue(value: unknown) {
  return typeof value === "number" ? [value.toString()] : [];
}

function getMatrixValues(rows: unknown) {
  if (!isRecord(rows)) {
    return [];
  }

  return Object.entries(rows).flatMap(([row, value]) => {
    if (Array.isArray(value)) {
      return value.filter(isString).map((item) => `${row}: ${item}`);
    }

    return typeof value === "string" && value.trim() ? [`${row}: ${value}`] : [];
  });
}

function formatOtherAnswer(value: unknown) {
  return typeof value === "string" && value.trim() ? `Other: ${value}` : "Other";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

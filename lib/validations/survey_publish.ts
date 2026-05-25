import type {
  MatrixQuestionConfig,
  Question,
  QuestionTypes,
  RankingQuestionConfig,
  Survey,
} from "@/lib/types/question-type";

export type SurveyPublishValidationResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

const OPTION_QUESTION_TYPES = [
  "single-choice",
  "multiple-choice",
  "dropdown",
  "likert-scale",
] as const satisfies readonly QuestionTypes[];

export function validateSurveyForPublish(
  survey: Survey,
): SurveyPublishValidationResult {
  if (isBlank(survey.title)) {
    return createValidationError("Survey title cannot be empty.");
  }

  if (survey.sections.length === 0) {
    return createValidationError("Survey must contain at least one section.");
  }

  for (const [sectionIndex, section] of survey.sections.entries()) {
    const sectionLabel = `Section ${sectionIndex + 1}`;

    if (isBlank(section.title)) {
      return createValidationError(`${sectionLabel} title cannot be empty.`);
    }

    if (section.questions.length === 0) {
      return createValidationError(
        `${sectionLabel} must contain at least one question.`,
      );
    }

    for (const [questionIndex, question] of section.questions.entries()) {
      const questionLabel = `${sectionLabel}, Question ${questionIndex + 1}`;

      if (isBlank(question.title)) {
        return createValidationError(`${questionLabel} title cannot be empty.`);
      }

      const questionValidation = validateQuestionConfig(
        question,
        questionLabel,
      );

      if (!questionValidation.success) {
        return questionValidation;
      }
    }
  }

  return { success: true };
}

function validateQuestionConfig(
  question: Question,
  questionLabel: string,
): SurveyPublishValidationResult {
  if (isOptionQuestionType(question.question_type)) {
    const options = getOptions(question.config);
    return validateOptionList(options, questionLabel, "option", 1);
  }

  if (question.question_type === "matrix") {
    const config = question.config as MatrixQuestionConfig;
    const rowValidation = validateOptionList(
      config.rows,
      questionLabel,
      "row",
      1,
    );
    if (!rowValidation.success) {
      return rowValidation;
    }

    return validateOptionList(config.columns, questionLabel, "column", 1);
  }

  if (question.question_type === "ranking") {
    const config = question.config as RankingQuestionConfig;
    return validateOptionList(config.options, questionLabel, "option", 2);
  }

  return { success: true };
}

function validateOptionList(
  options: string[] | undefined,
  questionLabel: string,
  itemLabel: string,
  minimumCount: number,
): SurveyPublishValidationResult {
  const values = options ?? [];

  if (values.length < minimumCount) {
    return createValidationError(
      `${questionLabel} must have at least ${minimumCount} ${itemLabel}${minimumCount === 1 ? "" : "s"}.`,
    );
  }

  const emptyIndex = values.findIndex(isBlank);

  if (emptyIndex !== -1) {
    return createValidationError(
      `${questionLabel} ${itemLabel} ${emptyIndex + 1} cannot be empty.`,
    );
  }

  return { success: true };
}

function getOptions(config: unknown) {
  if (!isRecord(config) || !Array.isArray(config.options)) {
    return [];
  }

  return config.options.filter((option): option is string => {
    return typeof option === "string";
  });
}

function isOptionQuestionType(type: QuestionTypes) {
  return (OPTION_QUESTION_TYPES as readonly QuestionTypes[]).includes(type);
}

function isBlank(value: unknown) {
  return typeof value !== "string" || value.trim().length === 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createValidationError(
  message: string,
): SurveyPublishValidationResult {
  return {
    success: false,
    message,
  };
}

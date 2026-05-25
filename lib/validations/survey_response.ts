import type { Answer, AnswerForm } from "@/lib/types/answer-type";
import type { Question, Section, Survey } from "@/lib/types/question-type";

type ValidationResult = {
  success: boolean;
  missingQuestionIds: string[];
  message?: string;
};

export function validateSurveyResponse(
  survey: Survey,
  answerForm: AnswerForm,
): ValidationResult {
  const missingQuestionIds = survey.sections.flatMap((section) =>
    getMissingRequiredQuestionIds(section, answerForm.answers),
  );

  if (missingQuestionIds.length === 0) {
    return { success: true, missingQuestionIds };
  }

  return {
    success: false,
    missingQuestionIds,
    message: getValidationMessage(survey, missingQuestionIds),
  };
}

export function getMissingRequiredQuestionIds(
  section: Section,
  answers: AnswerForm["answers"] | undefined,
) {
  return section.questions.flatMap((question) => {
    const answer = answers?.[question.id];

    return question.required && !hasValidRequiredAnswer(question, answer)
      ? [question.id]
      : [];
  });
}

function hasValidRequiredAnswer(question: Question, answer: Answer | undefined) {
  if (answer == undefined || answer.answer_type !== question.question_type) {
    return false;
  }

  switch (answer.answer_type) {
    case "single-choice":
      if (answer.config.use_other) {
        return answer.config.other_answer.trim() !== "";
      }
      return answer.config.selected_option.trim() !== "";
    case "multiple-choice":
      if (answer.config.use_other) {
        return answer.config.other_answer.trim() !== "";
      }
      return answer.config.selected_options.length > 0;
    case "rating-scale":
      return answer.config.rating >= 0 && answer.config.rating <= 5;
    case "likert-scale":
      return answer.config.selected_option.trim() !== "";
    case "short-text":
      return answer.config.text.trim() !== "";
    case "long-text":
      return answer.config.text.trim() !== "";
    case "dropdown":
      return answer.config.selected_option.trim() !== "";
    case "yes-no":
      return typeof answer.config.value === "boolean";
    case "matrix": {
      const matrixQuestion = question as Question<"matrix">;

      return matrixQuestion.config.rows.every((row) => {
        const rowAnswer = answer.config.rows[row];

        return Array.isArray(rowAnswer)
          ? rowAnswer.length > 0
          : typeof rowAnswer === "string" && rowAnswer.trim() !== "";
      });
    }
    case "ranking": {
      const rankingQuestion = question as Question<"ranking">;
      const rankedOptions = answer.config.ranked_options;
      const allowedOptions = new Set(rankingQuestion.config.options);
      const uniqueRankedOptions = new Set(rankedOptions);

      return (
        rankedOptions.length === rankingQuestion.config.options.length &&
        uniqueRankedOptions.size === rankedOptions.length &&
        rankedOptions.every((option) => allowedOptions.has(option))
      );
    }
    case "date-time":
      return answer.config.value.trim() !== "";
    case "consent":
      return answer.config.accepted === true;
    case "number":
      return true;
  }
}

function getValidationMessage(survey: Survey, missingQuestionIds: string[]) {
  const missingQuestions = survey.sections.flatMap((section) =>
    section.questions.filter((question) =>
      missingQuestionIds.includes(question.id),
    ),
  );

  if (missingQuestions.some((question) => question.question_type === "matrix")) {
    return "Please complete all required matrix rows.";
  }

  if (
    missingQuestions.some((question) => question.question_type === "ranking")
  ) {
    return "Please complete the full ranking question.";
  }

  if (missingQuestions.some((question) => question.question_type === "consent")) {
    return "Please accept the required consent.";
  }

  return "Please complete all required questions.";
}

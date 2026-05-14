"use client";

import {
  DateTimeQuestionConfig,
  DropdownQuestionConfig,
  LikertScaleQuestionConfig,
  MatrixQuestionConfig,
  NumberQuestionConfig,
  Question,
  QuestionConfigByType,
  QuestionTypes,
  RankingQuestionConfig,
  Section,
  ShortTextQuestionConfig,
  SingleChoiceQuestionConfig,
  Survey,
} from "@/types/question-type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

function getDefaultQuestion(): Question {
  const config = getDefaultConfigForQuestionType("short-text") as ShortTextQuestionConfig;
  
  const q: Question = {
    id: crypto.randomUUID(),
    title: "New question",
    description: "",
    config: config,
    question_type: "short-text",
    required: false,
  }

  return q;
}

function getDefaultConfigForQuestionType(t: QuestionTypes): QuestionConfigByType[QuestionTypes] {
  switch (t) {
    case "single-choice":
      const scConfig: SingleChoiceQuestionConfig = {
        options: ["Option 1"],
        haveOther: false,
      };
      return scConfig;
    case "multiple-choice":
      return {
        options: ["Option 1"],
        haveOther: false,
      };
    case "rating-scale":
      return {
        min: 0,
        max: 5,
        minLabel: "Low",
        maxLabel: "High",
      };
    case "likert-scale":
      const likertConfig: LikertScaleQuestionConfig = {
        options: [
          "Strongly disagree",
          "Disagree",
          "Neutral",
          "Agree",
          "Strongly agree",
        ],
      };
      return likertConfig;
    case "short-text":
      return {};
    case "long-text":
      return {};
    case "dropdown":
      const dropdownConfig: DropdownQuestionConfig = {
        options: ["Option 1"],
      };
      return dropdownConfig;
    case "yes-no":
      return {
        yesLabel: "Yes",
        noLabel: "No",
      };
    case "matrix":
      const matrixConfig: MatrixQuestionConfig = {
        rows: ["Row 1"],
        columns: ["Column 1"],
        multiplePerRow: false,
      };
      return matrixConfig;
    case "ranking":
      const rankingConfig: RankingQuestionConfig = {
        options: ["Option 1", "Option 2"],
      };
      return rankingConfig;
    case "date-time":
      const dtConfig: DateTimeQuestionConfig = {
        mode: "date",
      };
      return dtConfig;
    case "consent":
      return {
        label: "I agree to the terms above.",
      };
    case "number":
      const nConfig: NumberQuestionConfig = {
        isInteger: true,
        isRange: false,
        min: 0,
        max: 100,
      };
      return nConfig;
  }
}

function getDefaultSection(): Section {
  return {
    id: crypto.randomUUID(),
    title: "New section",
    description: "",
    questions: [getDefaultQuestion()],
  };
}

type SurveyStore = {
  survey: Survey;
  addSection: () => void;
  deleteSection: (sectionID: string) => void;
  addQuestion: (sectionID: string) => void;
  deleteQuestion: (sectionID: string, questionID: string) => void;
  updateQuestionType: (
    sectionID: string,
    questionID: string,
    type: QuestionTypes,
  ) => void;
  updateQuestionConfig: (
    sectionID: string,
    questionID: string,
    config: QuestionConfigByType[QuestionTypes],
  ) => void;
  updateSurveyTitle: (title: string) => void;
  updateSurveyDescription: (description: string) => void;
  updateSectionTitle: (sectionID: string, title: string) => void;
  updateSectionDescription: (sectionID: string, description: string) => void;
  updateQuestionTitle: (
    sectionID: string,
    questionID: string,
    title: string,
  ) => void;
  updateQuestionDescription: (
    sectionID: string,
    questionID: string,
    description: string,
  ) => void;
  updateQuestionRequired: (
    sectionID: string,
    questionID: string,
    newValue: boolean,
  ) => void;
};

export const useSurveyStore = create<SurveyStore>()(
  immer((set) => ({
    survey: {
      id: crypto.randomUUID(),
      title: "New survey",
      state: "draft",
      description: "",
      sections: [getDefaultSection()],
    },

    // --- Section Actions ---
    addSection: () =>
      set((state) => {
        state.survey.sections.push(getDefaultSection());
      }),

    deleteSection: (sectionID) =>
      set((state) => {
        if (state.survey.sections.length <= 1) {
          return;
        }
        state.survey.sections = state.survey.sections.filter(
          (s) => s.id !== sectionID,
        );
      }),

    updateSectionTitle: (sectionID, title) =>
      set((state) => {
        const section = state.survey.sections.find((s) => s.id === sectionID);
        if (section) {
          section.title = title;
        }
      }),

    updateSectionDescription: (sectionID, description) =>
      set((state) => {
        const section = state.survey.sections.find((s) => s.id === sectionID);
        if (section) {
          section.description = description;
        }
      }),

    // --- Question Actions ---
    addQuestion: (sectionID) =>
      set((state) => {
        const section = state.survey.sections.find((s) => s.id === sectionID);
        if (section) {
          section.questions.push(getDefaultQuestion());
        }
      }),

    deleteQuestion: (sectionID, questionID) =>
      set((state) => {
        const section = state.survey.sections.find((s) => s.id === sectionID);
        if (section) {
          section.questions = section.questions.filter(
            (q) => q.id !== questionID,
          );
        }
      }),

    updateQuestionType: (sectionID, questionID, type) =>
      set((state) => {
        const section = state.survey.sections.find((s) => s.id === sectionID);
        if (!section) {
          return;
        }
        const question = section.questions.find((q) => q.id === questionID);
        if (question) {
          question.question_type = type;
          question.config = getDefaultConfigForQuestionType(type);
        }
      }),

    updateQuestionConfig: (sectionID, questionID, config) =>
      set((state) => {
        const section = state.survey.sections.find((s) => s.id === sectionID);
        if (!section) {
          return;
        }
        const question = section.questions.find((q) => q.id === questionID);

        if (question) {
          question.config = config;
        }
      }),

    updateQuestionTitle: (sectionID, questionID, title) =>
      set((state) => {
        const section = state.survey.sections.find((s) => s.id === sectionID);
        if (!section) {
          return;
        }
        const question = section.questions.find((q) => q.id === questionID);
        if (question) {
          question.title = title;
        }
      }),

    updateQuestionDescription: (sectionID, questionID, description) =>
      set((state) => {
        const section = state.survey.sections.find((s) => s.id === sectionID);
        if (!section) {
          return;
        }
        const question = section.questions.find((q) => q.id === questionID);
        if (question) {
          question.description = description;
        }
      }),

    // --- Survey Actions ---
    updateSurveyTitle: (title) =>
      set((state) => {
        state.survey.title = title;
      }),

    updateSurveyDescription: (description) =>
      set((state) => {
        state.survey.description = description;
      }),

    updateQuestionRequired: (sectionID, questionID, newValue) => {
      set((state) => {
        const section = state.survey.sections.find((s) => s.id === sectionID);
        if (!section) {
          return;
        }
        const question = section.questions.find((q) => q.id === questionID);
        if (question) {
          question.required = newValue;
        }
      });
    },
  })),
);

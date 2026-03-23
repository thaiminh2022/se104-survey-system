"use client";

import {
  CheckBoxConfig,
  Question,
  QuestionConfig,
  QuestionTypes,
  Section,
  Survey,
} from "@/types/survey-create/question-type";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

function getDefaultQuestion(): Question {
  const checkboxConfig: CheckBoxConfig = {
    haveOther: false,
    options: [],
  };
  return {
    id: crypto.randomUUID(),
    title: "Title",
    description: "",
    question_type: "checkbox",
    config: checkboxConfig,
    required: false,
  };
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
    config: QuestionConfig,
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
      title: "New survey",
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
          section.title = description;
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

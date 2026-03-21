"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  CheckBoxConfig,
  Question,
  QuestionConfig,
  QuestionTypes,
  Section,
  Survey,
} from "@/types/survey-create/question-type";

function getDefaultQuestion(): Question {
  const checkboxConfig: CheckBoxConfig = {
    haveOther: false,
    options: [],
  };
  return {
    title: "Title",
    description: "",
    question_type: "checkbox",
    config: checkboxConfig,
    required: false,
  };
}

function getDefaultSection(): Section {
  return {
    title: "New section",
    description: "",
    questions: [getDefaultQuestion()],
  };
}

type SurveyStore = {
  survey: Survey;
  addSection: () => void;
  deleteSection: (sectionIndex: number) => void;
  addQuestion: (sectionIndex: number) => void;
  deleteQuestion: (sectionIndex: number, questionIndex: number) => void;
  updateQuestionType: (sIdx: number, qIdx: number, type: QuestionTypes) => void;
  updateQuestionConfig: (
    sIdx: number,
    qIdx: number,
    config: QuestionConfig,
  ) => void;
  updateSurveyTitle: (title: string) => void;
  updateSurveyDescription: (description: string) => void;
  updateSectionTitle: (sIdx: number, title: string) => void;
  updateSectionDescription: (sIdx: number, description: string) => void;
  updateQuestionTitle: (sIdx: number, qIdx: number, title: string) => void;
  updateQuestionDescription: (
    sIdx: number,
    qIdx: number,
    description: string,
  ) => void;
  updateQuestionRequired: (
    sIdx: number,
    qIdx: number,
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

    deleteSection: (sIdx) =>
      set((state) => {
        if (state.survey.sections.length <= 1) {
          return;
        }

        state.survey.sections.splice(sIdx, 1);
      }),

    updateSectionTitle: (sIdx, title) =>
      set((state) => {
        state.survey.sections[sIdx].title = title;
      }),

    updateSectionDescription: (sIdx, description) =>
      set((state) => {
        state.survey.sections[sIdx].description = description;
      }),

    // --- Question Actions ---
    addQuestion: (sIdx) =>
      set((state) => {
        state.survey.sections[sIdx].questions.push(getDefaultQuestion());
      }),

    deleteQuestion: (sIdx, qIdx) =>
      set((state) => {
        if (state.survey.sections[sIdx].questions.length <= 1) {
          return;
        }
        state.survey.sections[sIdx].questions.splice(qIdx, 1);
      }),

    updateQuestionType: (sIdx, qIdx, type) =>
      set((state) => {
        state.survey.sections[sIdx].questions[qIdx].question_type = type;
      }),

    updateQuestionConfig: (sIdx, qIdx, config) =>
      set((state) => {
        state.survey.sections[sIdx].questions[qIdx].config = config;
      }),

    updateQuestionTitle: (sIdx, qIdx, title) =>
      set((state) => {
        state.survey.sections[sIdx].questions[qIdx].title = title;
      }),

    updateQuestionDescription: (sIdx, qIdx, description) =>
      set((state) => {
        state.survey.sections[sIdx].questions[qIdx].description = description;
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
    updateQuestionRequired: (sIndex, qIndex, newValue) => {
      set((state) => {
        state.survey.sections[sIndex].questions[qIndex].required = newValue;
      });
    },
  })),
);

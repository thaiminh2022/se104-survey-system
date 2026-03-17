"use client";

import { create } from "zustand";
import {
  CheckBoxConfig,
  Question,
  QuestionConfig,
  QuestionTypes,
  Section,
  Survey,
} from "@/types/survey-create/question-type";

function getDefaultSection() {
  const defaultSection: Section = {
    title: "New section",
    description: "",
    questions: [getDefaultQuestion()],
  };
  return defaultSection;
}

function getDefaultQuestion() {
  const checkboxConfig: CheckBoxConfig = {
    haveOther: false,
    options: [],
  };

  const defaultQuestion: Question = {
    title: "Title",
    description: "",
    question_type: "checkbox",
    config: checkboxConfig,
  };
  return defaultQuestion;
}

type SurveyStore = {
  survey: Survey;
  addSection: () => void;
  addQuestion: (sectionIndex: number) => void;
  updateQuestionType: (
    sectionIndex: number,
    questionIndex: number,
    type: QuestionTypes,
  ) => void;
  updateQuestionConfig: (
    sectionIndex: number,
    questionIndex: number,
    config: QuestionConfig,
  ) => void;
  updateSurveyTitle: (title: string) => void;
  updateSurveyDescription: (description: string) => void;
  updateSectionTitle: (sectionIndex: number, title: string) => void;
  updateSectionDescription: (sectionIndex: number, description: string) => void;
  updateQuestionTitle: (
    sectionIndex: number,
    questionIndex: number,
    title: string,
  ) => void;
  updateQuestionDescription: (
    sectionIndex: number,
    questionIndex: number,
    description: string,
  ) => void;
};

export const useSurveyStore = create<SurveyStore>((set) => ({
  survey: {
    title: "New survey",
    description: "",
    sections: [getDefaultSection()],
  },
  addSection: () =>
    set((state) => {
      return {
        survey: {
          ...state.survey,
          sections: [...state.survey.sections, getDefaultSection()],
        },
      };
    }),
  addQuestion: (sectionIndex: number) =>
    set((state) => {
      const sections = [...state.survey.sections];
      const updateSection = sections[sectionIndex];

      sections[sectionIndex] = {
        ...updateSection,
        questions: [...updateSection.questions, getDefaultQuestion()],
      };

      return {
        survey: {
          ...state.survey,
          sections: sections,
        },
      };
    }),
  updateQuestionType: (sectionIndex, questionIndex, type) =>
    set((state) => {
      const updatedSections = [...state.survey.sections];
      const targetSection = updatedSections[sectionIndex];
      const updatedQuestions = [...targetSection.questions];

      updatedQuestions[questionIndex].question_type = type;

      updatedSections[sectionIndex] = {
        ...targetSection,
        questions: updatedQuestions,
      };

      return {
        survey: {
          ...state.survey,
          sections: updatedSections,
        },
      };
    }),

  updateQuestionConfig: (sectionIndex, questionIndex, config) =>
    set((state) => {
      const updatedSections = [...state.survey.sections];
      const targetSection = updatedSections[sectionIndex];
      const updatedQuestions = [...targetSection.questions];

      updatedQuestions[questionIndex].config = config;

      updatedSections[sectionIndex] = {
        ...targetSection,
        questions: updatedQuestions,
      };

      return {
        survey: {
          ...state.survey,
          sections: updatedSections,
        },
      };
    }),

  updateSurveyTitle: (title) =>
    set((state) => ({
      survey: {
        ...state.survey,
        title,
      },
    })),
  updateSurveyDescription: (description) =>
    set((state) => ({
      survey: {
        ...state.survey,
        description,
      },
    })),
  updateSectionTitle: (sectionIndex, title) =>
    set((state) => {
      const updatedSections = [...state.survey.sections];
      updatedSections[sectionIndex].title = title;
      return {
        survey: {
          ...state.survey,
          sections: updatedSections,
        },
      };
    }),
  updateSectionDescription: (sectionIndex, description) =>
    set((state) => {
      const updatedSections = [...state.survey.sections];
      updatedSections[sectionIndex].description = description;
      return {
        survey: {
          ...state.survey,
          sections: updatedSections,
        },
      };
    }),
  updateQuestionTitle: (sectionIndex, questionIndex, title) =>
    set((state) => {
      const updatedSections = [...state.survey.sections];
      const targetSection = updatedSections[sectionIndex];
      const updatedQuestions = [...targetSection.questions];

      updatedQuestions[questionIndex].title = title;

      updatedSections[sectionIndex] = {
        ...targetSection,
        questions: updatedQuestions,
      };

      return {
        survey: {
          ...state.survey,
          sections: updatedSections,
        },
      };
    }),
  updateQuestionDescription: (sectionIndex, questionIndex, description) =>
    set((state) => {
      const updatedSections = [...state.survey.sections];
      const targetSection = updatedSections[sectionIndex];
      const updatedQuestions = [...targetSection.questions];

      updatedQuestions[questionIndex].description = description;

      updatedSections[sectionIndex] = {
        ...targetSection,
        questions: updatedQuestions,
      };

      return {
        survey: {
          ...state.survey,
          sections: updatedSections,
        },
      };
    }),
}));

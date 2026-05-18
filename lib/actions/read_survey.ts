"use server";

import {
  QuestionRow,
  SectionRow,
  SurveyRow,
  SurveyStatus,
} from "@/lib/types/db_schema";
import { createError, createSuccess } from "@/lib/types/errors";
import {
  ConsentQuestionConfig,
  DateTimeQuestionConfig,
  DropdownQuestionConfig,
  LikertScaleQuestionConfig,
  LongTextQuestionConfig,
  MatrixQuestionConfig,
  MultipleChoiceQuestionConfig,
  NumberQuestionConfig,
  Question,
  QUESTION_TYPES,
  QuestionConfigByType,
  QuestionTypes,
  RankingQuestionConfig,
  RatingScaleQuestionConfig,
  Section,
  ShortTextQuestionConfig,
  SingleChoiceQuestionConfig,
  Survey,
  YesNoQuestionConfig,
} from "@/lib/types/question-type";
import { faker } from "@faker-js/faker";
import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { getUser } from "./read_user";

export async function getSurveyRowForUser() {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;

  const { data: surveysRows, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return createError(error, error.message);
  }

  const surveys = surveysRows as SurveyRow[];
  return createSuccess<SurveyRow[]>(surveys);
}

export async function getRecentSurveyRowsForUser(limit = 5) {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;

  const { data: surveysRows, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return createError(error, error.message);
  }

  return createSuccess<SurveyRow[]>(surveysRows as SurveyRow[]);
}

export async function getSurveyAnalyticsRowsForUser() {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;

  const { data: surveysRows, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("user_id", user.id)
    .order("submission_count", { ascending: false })
    .order("view_count", { ascending: false });

  if (error) {
    return createError(error, error.message);
  }

  return createSuccess<SurveyRow[]>(surveysRows as SurveyRow[]);
}

export async function updateSurveyStatus(id: string, status: SurveyStatus) {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;
  const { data, error } = await supabase
    .from("surveys")
    .update({ state: status })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .limit(1)
    .single();

  if (error) {
    return createError(error, error.message);
  }
  revalidatePath("/dashboard/surveys");
  return createSuccess(data);
}
export async function deleteSurvey(id: string) {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;
  const { error } = await supabase
    .from("surveys")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    return createError(error, error.message);
  }
  revalidatePath("/dashboard/surveys");
}

export async function getSurveyById(id: string) {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;

  // fetch survey data

  const { data: surveyData, error: surveyError } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (surveyError) {
    return createError(surveyError, surveyError.message);
  }
  const surveyRow = surveyData as SurveyRow;

  // fetch sections
  const { data: sectionsData, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("survey_id", id)
    .order("order_index", { ascending: true });

  if (sectionsError) {
    return createError(sectionsError, sectionsError.message);
  }
  const sectionsRows = sectionsData as SectionRow[];
  const sections: Section[] = sectionsRows.map((s) => {
    const section: Section = {
      id: s.id,
      title: s.title,
      description: s.description ?? "",
      questions: [],
    };
    return section;
  });

  // get questions per section
  for (const s of sections) {
    const { data: questionsData, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("section_id", s.id)
      .order("order_index", { ascending: true });
    if (questionsError) {
      return createError(questionsError, questionsError.message);
    }
    const questionsRows = questionsData as QuestionRow[];
    const questions: Question[] = questionsRows.map(toQuestion);
    s.questions = questions;
  }

  const s: Survey = {
    id: surveyRow.id,
    title: surveyRow.title,
    state: surveyRow.state,
    description: surveyRow.description ?? "",
    sections: sections,
  };
  return createSuccess(s);
}

export async function getPublishedSurveyById(id: string) {
  const supabase = await createClient();
  const { data: surveyData, error: surveyError } = await supabase
    .from("surveys")
    .select("*")
    .eq("id", id)
    .eq("state", "published")
    .limit(1)
    .single();

  if (surveyError) {
    return createError(surveyError, surveyError.message);
  }

  const surveyRow = surveyData as SurveyRow;

  const { data: sectionsData, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("survey_id", id)
    .order("order_index", { ascending: true });

  if (sectionsError) {
    return createError(sectionsError, sectionsError.message);
  }

  const sections: Section[] = (sectionsData as SectionRow[]).map(
    (sectionRow) => ({
      id: sectionRow.id,
      title: sectionRow.title,
      description: sectionRow.description ?? "",
      questions: [],
    }),
  );

  for (const section of sections) {
    const { data: questionsData, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("section_id", section.id)
      .order("order_index", { ascending: true });

    if (questionsError) {
      return createError(questionsError, questionsError.message);
    }

    section.questions = (questionsData as QuestionRow[]).map(toQuestion);
  }

  return createSuccess<Survey>({
    id: surveyRow.id,
    title: surveyRow.title,
    state: surveyRow.state,
    description: surveyRow.description ?? "",
    sections,
  });
}

// this function is for testing only, it will return a fake survey without checking the user or fetching from db
export async function getFakeSurveyById(id: string) {
  // u faker-js to generate fake survey data
  // generate sections and questions with faker-js
  const sections = Array.from({ length: 2 }).map((_, i) => {
    const questions = Array.from({ length: 5 }).map((_, j) => {
      const questionType: QuestionTypes =
        faker.helpers.arrayElement(QUESTION_TYPES);
      let config: QuestionConfigByType[QuestionTypes] = {};
      switch (questionType) {
        case "single-choice":
          config = {
            options: Array.from({ length: 4 }).map(() => faker.lorem.words(3)),
            haveOther: faker.datatype.boolean(),
          } as SingleChoiceQuestionConfig;
          break;
        case "multiple-choice":
          config = {
            options: Array.from({ length: 4 }).map(() => faker.lorem.words(3)),
            haveOther: faker.datatype.boolean(),
          } as MultipleChoiceQuestionConfig;
          break;
        case "rating-scale":
          config = {
            min: 0,
            max: 5,
            minLabel: "Low",
            maxLabel: "High",
          } as RatingScaleQuestionConfig;
          break;
        case "likert-scale":
          config = {
            options: [
              "Strongly disagree",
              "Disagree",
              "Neutral",
              "Agree",
              "Strongly agree",
            ],
          } as LikertScaleQuestionConfig;
          break;
        case "short-text":
          config = {
            placeholder: faker.lorem.sentence(),
          } as ShortTextQuestionConfig;
          break;
        case "long-text":
          config = {
            placeholder: faker.lorem.sentence(),
          } as LongTextQuestionConfig;
          break;
        case "dropdown":
          config = {
            options: Array.from({ length: 4 }).map(() => faker.lorem.words(3)),
          } as DropdownQuestionConfig;
          break;
        case "yes-no":
          config = {
            yesLabel: "Yes",
            noLabel: "No",
          } as YesNoQuestionConfig;
          break;
        case "matrix":
          config = {
            rows: Array.from({ length: 3 }).map(() => faker.lorem.words(2)),
            columns: Array.from({ length: 4 }).map(() => faker.lorem.words(2)),
            multiplePerRow: faker.datatype.boolean(),
          } as MatrixQuestionConfig;
          break;
        case "ranking":
          config = {
            options: Array.from({ length: 4 }).map(() => faker.lorem.words(3)),
          } as RankingQuestionConfig;
          break;
        case "date-time":
          config = {
            mode: faker.helpers.arrayElement(["date", "time", "datetime"]),
          } as DateTimeQuestionConfig;
          break;
        case "consent":
          config = {
            label: "I agree to participate in this survey.",
          } as ConsentQuestionConfig;
          break;
        case "number":
          config = {
            isInteger: faker.datatype.boolean(),
            isRange: true,
            min: faker.number.int({ min: 0, max: 100 }),
            max: faker.number.int({ min: 101, max: 1000 }),
          } as NumberQuestionConfig;
          break;
      }

      const q: Question = {
        id: faker.string.uuid(),
        title: `Question ${j + 1} of Section ${i + 1}: ${faker.lorem.sentence()}`,
        description: `This is the description for question ${j + 1} of section ${i + 1}`,
        question_type: questionType,
        config: config,
        required: j % 2 === 0,
      } as Question;
      return q;
    });

    const s: Section = {
      id: faker.string.uuid(),
      title: `Section ${i + 1}: ${faker.lorem.sentence()}`,
      description: `This is the description for section ${i + 1}`,
      questions: questions,
    };
    return s;
  });

  const survey: Survey = {
    id,
    title: "Fake Survey",
    description: "This is a fake survey for testing",
    state: "published",
    sections: sections,
  };
  return createSuccess(survey);
}

function toQuestion(questionRow: QuestionRow): Question {
  return {
    id: questionRow.id,
    title: questionRow.title,
    description: questionRow.description ?? "",
    question_type: questionRow.question_type as QuestionTypes,
    config: parseQuestionConfig(questionRow.config),
    required: questionRow.required,
  } as Question;
}

function parseQuestionConfig(
  config: unknown,
): QuestionConfigByType[QuestionTypes] {
  if (typeof config === "string") {
    try {
      return JSON.parse(config) as QuestionConfigByType[QuestionTypes];
    } catch {
      return {};
    }
  }

  if (config && typeof config === "object") {
    return config as QuestionConfigByType[QuestionTypes];
  }

  return {};
}

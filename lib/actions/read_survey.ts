"use server";

import { QuestionRow, SectionRow, SurveyRow, SurveyStatus } from "@/types/db_schema";
import { createError, createSuccess } from "@/types/errors";
import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { CheckBoxQuestionConfig, DatetimeQuestionConfig, DropdownQuestionConfig, LongQuestionConfig, MultipleChoiceQuestionConfig, NumberQuestionConfig, Question, QUESTION_TYPES, QuestionConfigByType, QuestionTypes, RatingQuestionConfig, Section, ShortQuestionConfig, Survey } from "@/types/question-type";
import { faker, fakerEL } from '@faker-js/faker';


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

export async function getUser() {
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();

  if (userRes.error) {
    return createError(userRes.error, userRes.error.message);
  }
  return createSuccess(userRes.data.user);
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
  for (let s of sections) {
    const { data: questionsData, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("section_id", s.id)
      .order("order_index", { ascending: true });
    if (questionsError) {
      return createError(questionsError, questionsError.message);
    }
    const questionsRows = questionsData as QuestionRow[];
    const questions:Question[] = questionsRows.map((qData) => {
      const q: Question = {
        id: qData.id,
        title: qData.title,
        description: qData.description ?? "",
        question_type: qData.question_type as QuestionTypes,
        config: JSON.parse(qData.config?.toString() ?? "{}"),
        required: qData.required,
      };
      return q;
    });
    s.questions = questions;
  }

  const s: Survey = {
    title: surveyRow.title,
    state: surveyRow.state,
    description: surveyRow.description ?? "",
    sections: sections,
  };
  return createSuccess(s);
}


// this function is for testing only, it will return a fake survey without checking the user or fetching from db
export async function getFakeSurveyById(id: string) {
 // u faker-js to generate fake survey data
  // generate sections and questions with faker-js
  const sections = Array.from({ length: 3 }).map((_, i) => {
    const questions = Array.from({ length: 5 }).map((_, j) => {
      const questionType: QuestionTypes = faker.helpers.arrayElement(QUESTION_TYPES);
      let config: QuestionConfigByType[QuestionTypes] = {};
      switch (questionType) {
        case "number":
          config = {
            isInteger: faker.datatype.boolean(),
            isRange: true,
            min: faker.number.int({ min: 0, max: 100 }),
            max: faker.number.int({ min: 101, max: 1000 }),
          } as NumberQuestionConfig;  
          break;
        case "short-answer":
          config = {placeholder: faker.lorem.sentence()} as ShortQuestionConfig;
          break;
        case "long-answer":
          config = {placeholder: faker.lorem.sentence()} as LongQuestionConfig;
          break;
        case "multiple-choice":
          config = {
            options: Array.from({ length: 4 }).map(() => faker.lorem.sentence()),
            haveOther: faker.datatype.boolean(),
          } as MultipleChoiceQuestionConfig;
          break;
        case "checkbox":
          config = {
            options: Array.from({ length: 4 }).map(() => faker.lorem.sentence()),
            haveOther: faker.datatype.boolean(),
          } as CheckBoxQuestionConfig;
          break;
        case "dropdown":
          config = {} as DropdownQuestionConfig;
          break;
        case "datetime":
          config = {mode: faker.helpers.arrayElement(["date", "time", "datetime"])} as DatetimeQuestionConfig;
          break;
        case "rating":
          config = {} as RatingQuestionConfig;
          break;
      
      }

      const q: Question = {
        id: faker.string.uuid(),
        title: `Question ${j + 1} of Section ${i + 1}: ${faker.lorem.sentence()}`,
        description: `This is the description for question ${j + 1} of section ${i + 1}`,
        question_type: questionType as any,
        config: config,
        required: j % 2 === 0,
      };
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
    title: "Fake Survey",
    description: "This is a fake survey for testing",
    state: "published",
    sections: sections,
  };
  return createSuccess(survey);
}
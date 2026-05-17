import { z } from "zod";
import { QUESTION_TYPES } from "./question-type";

export const surveyStatusSchema = z.enum(["draft", "published", "archived"]);
export type SurveyStatus = z.infer<typeof surveyStatusSchema>;
export const questionTypesSchema = z.enum(QUESTION_TYPES);
export const sectionEndBehaviorSchema = z.enum(["continue", "submit", "jump"]);
export const surveyRowSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  title: z.string(),
  state: surveyStatusSchema,
  image: z.string().nullable(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
});

export const surveyInsertSchema = z.object({
  id: z.uuid().optional(),
  user_id: z.uuid(),
  title: z.string(),
  state: surveyStatusSchema.optional().default("draft"),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  created_at: z.coerce.date().optional(),
});

export type SurveyRow = z.infer<typeof surveyRowSchema>;
export type SurveyInsert = z.infer<typeof surveyInsertSchema>;

export const sectionRowSchema = z.object({
  id: z.uuid(),
  survey_id: z.uuid(),
  order_index: z.number().int(),
  end_behavior: sectionEndBehaviorSchema,
  config: z.json(),
  title: z.string(),
  description: z.string().nullable(),
  created_at: z.coerce.date(),
});

export const sectionInsertSchema = z.object({
  id: z.uuid().optional(),
  survey_id: z.uuid(),
  order_index: z.number().int(),
  end_behavior: sectionEndBehaviorSchema.optional().default("continue"),
  config: z.json(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  created_at: z.coerce.date().optional(),
});
export type SectionRow = z.infer<typeof sectionRowSchema>;
export type SectionInsert = z.infer<typeof sectionInsertSchema>;

export const questionRowSchema = z.object({
  id: z.uuid(),
  section_id: z.uuid(),
  order_index: z.number().int(),
  title: z.string(),
  image: z.string().nullable(),
  description: z.string().nullable(),
  question_type: z.string(),
  config: z.json(),
  created_at: z.coerce.date(),
  required: z.boolean(),
});

export const questionInsertSchema = z.object({
  id: z.uuid().optional(),
  section_id: z.uuid(),
  order_index: z.number().int(),
  title: z.string().min(1),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  question_type: z.string(),
  config: z.json(),
  created_at: z.coerce.date().optional(),
  required: z.boolean().optional().default(false),
});

export type QuestionRow = z.infer<typeof questionRowSchema>;
export type QuestionInsert = z.infer<typeof questionInsertSchema>;

export const submissionRowSchema = z.object({
  id: z.uuid(),
  survey_id: z.uuid(),
  user_id: z.uuid(),
  created_at: z.coerce.date(),
  submitted_at: z.coerce.date(),
});
export const submissionInsertSchema = z.object({
  id: z.uuid().optional(),
  survey_id: z.uuid(),
  user_id: z.uuid(),
  created_at: z.coerce.date().optional(),
  submitted_at: z.coerce.date().optional(),
});

export type SubmissionRow = z.infer<typeof submissionRowSchema>;
export type SubmissionInsert = z.infer<typeof submissionInsertSchema>;

export const answerRowSchema = z.object({
  id: z.uuid(),
  submission_id: z.uuid(),
  question_id: z.uuid(),
  answer: z.json(),
  created_at: z.coerce.date(),
  answer_data: z.json(),
});

export const answerInsertSchema = z.object({
  id: z.uuid().optional(),
  submission_id: z.uuid(),
  question_id: z.uuid(),
  answer: z.json(),
  created_at: z.coerce.date().optional(),
});

export type AnswerRow = z.infer<typeof answerRowSchema>;
export type AnswerInsert = z.infer<typeof answerInsertSchema>;

export type AppUserData = {
  name: string;
  email: string;
};



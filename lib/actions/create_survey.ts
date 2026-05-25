"use server";

import {
  QuestionRow,
  QuestionInsert,
  SectionRow,
  SectionInsert,
  SurveyInsert,
} from "@/lib/types/db_schema";
import { createError } from "@/lib/types/errors";
import { Survey } from "@/lib/types/question-type";
import { validateSurveyForPublish } from "@/lib/validations/survey_publish";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { isPlaywrightE2E } from "@/lib/e2e/fixtures";

export async function submitSurvey(s: Survey, isDraft: boolean) {
  if (isPlaywrightE2E()) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/surveys");
    redirect("/dashboard/surveys");
  }

  if (!isDraft) {
    const validation = validateSurveyForPublish(s);

    if (!validation.success) {
      return createError(null, validation.message);
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return createError(error, error.message);
  }

  const userId = data.user.id;

  const surveySchema: SurveyInsert = {
    user_id: userId,
    title: s.title,
    description: s.description,
    state: isDraft ? "draft" : "published",
  };

  const surveyInsertRes = await supabase
    .from("surveys")
    .insert([surveySchema])
    .select("id")
    .limit(1)
    .single();

  if (surveyInsertRes.error) {
    return createError(
      surveyInsertRes.error,
      `Survey insert error: ${surveyInsertRes.error.message}`,
    );
  }

  const surveyId = surveyInsertRes.data.id as string;

  const sectionSchemas: SectionInsert[] = s.sections.map((sec, index) => ({
    id: sec.id,
    survey_id: surveyId,
    order_index: index,
    end_behavior: "continue",
    config: "{}",
    title: sec.title,
    description: sec.description,
  }));

  if (sectionSchemas.length > 0) {
    const sectionInsertRes = await supabase
      .from("sections")
      .insert(sectionSchemas);

    if (sectionInsertRes.error) {
      return createError(
        sectionInsertRes.error,
        `Section insert error: ${sectionInsertRes.error.message}`,
      );
    }
  }

  const questionSchemas: QuestionInsert[] = s.sections.flatMap((sec) =>
    sec.questions.map((q, index) => ({
      section_id: sec.id,
      order_index: index,
      title: q.title,
      question_type: q.question_type,
      config: q.config,
      description: q.description,
      required: q.required,
    })),
  );

  if (questionSchemas.length > 0) {
    const questionsInsertRes = await supabase
      .from("questions")
      .insert(questionSchemas);

    if (questionsInsertRes.error) {
      return createError(
        questionsInsertRes.error,
        `Question insert error: ${questionsInsertRes.error.message}`,
      );
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/surveys");
  redirect("/dashboard/surveys");
}

export async function updateSurvey(s: Survey, isDraft: boolean) {
  if (isPlaywrightE2E()) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/surveys");
    revalidatePath("/dashboard/analytics");
    revalidatePath(`/dashboard/analytics/${s.id}`);
    revalidatePath(`/surveys/${s.id}`);
    redirect("/dashboard/surveys");
  }

  if (!isDraft) {
    const validation = validateSurveyForPublish(s);

    if (!validation.success) {
      return createError(null, validation.message);
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return createError(error, error.message);
  }

  const userId = data.user.id;
  const nextState = isDraft ? "draft" : "published";

  const surveyUpdateRes = await supabase
    .from("surveys")
    .update({
      title: s.title,
      description: s.description,
      state: nextState,
    })
    .eq("id", s.id)
    .eq("user_id", userId);

  if (surveyUpdateRes.error) {
    return createError(
      surveyUpdateRes.error,
      `Survey update error: ${surveyUpdateRes.error.message}`,
    );
  }

  const currentSectionsRes = await supabase
    .from("sections")
    .select("id")
    .eq("survey_id", s.id);

  if (currentSectionsRes.error) {
    return createError(
      currentSectionsRes.error,
      `Section fetch error: ${currentSectionsRes.error.message}`,
    );
  }

  const currentSectionIds = (currentSectionsRes.data as Pick<SectionRow, "id">[])
    .map((section) => section.id);
  const nextSectionIds = s.sections.map((section) => section.id);
  const sectionIdsToDelete = currentSectionIds.filter(
    (id) => !nextSectionIds.includes(id),
  );

  if (sectionIdsToDelete.length > 0) {
    const sectionDeleteRes = await supabase
      .from("sections")
      .delete()
      .in("id", sectionIdsToDelete);

    if (sectionDeleteRes.error) {
      return createError(
        sectionDeleteRes.error,
        `Section delete error: ${sectionDeleteRes.error.message}`,
      );
    }
  }

  const sectionSchemas: SectionInsert[] = s.sections.map((sec, index) => ({
    id: sec.id,
    survey_id: s.id,
    order_index: index,
    end_behavior: "continue",
    config: {},
    title: sec.title,
    description: sec.description,
  }));

  if (sectionSchemas.length > 0) {
    const sectionUpsertRes = await supabase
      .from("sections")
      .upsert(sectionSchemas, { onConflict: "id" });

    if (sectionUpsertRes.error) {
      return createError(
        sectionUpsertRes.error,
        `Section upsert error: ${sectionUpsertRes.error.message}`,
      );
    }
  }

  const currentQuestionsRes = await supabase
    .from("questions")
    .select("id, section_id, sections!inner(survey_id)")
    .eq("sections.survey_id", s.id);

  if (currentQuestionsRes.error) {
    return createError(
      currentQuestionsRes.error,
      `Question fetch error: ${currentQuestionsRes.error.message}`,
    );
  }

  const currentQuestionIds = (
    currentQuestionsRes.data as Pick<QuestionRow, "id">[]
  ).map((question) => question.id);
  const nextQuestionIds = s.sections.flatMap((section) =>
    section.questions.map((question) => question.id),
  );
  const questionIdsToDelete = currentQuestionIds.filter(
    (id) => !nextQuestionIds.includes(id),
  );

  if (questionIdsToDelete.length > 0) {
    const questionDeleteRes = await supabase
      .from("questions")
      .delete()
      .in("id", questionIdsToDelete);

    if (questionDeleteRes.error) {
      return createError(
        questionDeleteRes.error,
        `Question delete error: ${questionDeleteRes.error.message}`,
      );
    }
  }

  const questionSchemas: QuestionInsert[] = s.sections.flatMap((sec) =>
    sec.questions.map((q, index) => ({
      id: q.id,
      section_id: sec.id,
      order_index: index,
      title: q.title,
      question_type: q.question_type,
      config: q.config,
      description: q.description,
      required: q.required,
    })),
  );

  if (questionSchemas.length > 0) {
    const questionsUpsertRes = await supabase
      .from("questions")
      .upsert(questionSchemas, { onConflict: "id" });

    if (questionsUpsertRes.error) {
      return createError(
        questionsUpsertRes.error,
        `Question upsert error: ${questionsUpsertRes.error.message}`,
      );
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/surveys");
  revalidatePath("/dashboard/analytics");
  revalidatePath(`/dashboard/analytics/${s.id}`);
  revalidatePath(`/surveys/${s.id}`);
  redirect("/dashboard/surveys");
}

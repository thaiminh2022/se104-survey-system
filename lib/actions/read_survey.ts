"use server";

import { SurveyRow, SurveyStatus } from "@/types/db_schema";
import { createError, createSuccess } from "@/types/errors";
import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

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

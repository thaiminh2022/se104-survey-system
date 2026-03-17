"use server";

import { Survey } from "@/types/survey-create/question-type";

export async function submitSurvey(sur: Survey) {
  console.log(JSON.stringify(sur, undefined, 4));
}

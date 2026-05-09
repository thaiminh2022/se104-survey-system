import { QuestionTypes } from "@/types/question-type";

export function convertQuestionTypeToName(t: QuestionTypes) {
  switch (t) {
    case "number":
      return "Number";
    case "short-answer":
      return "Short Answer";
    case "long-answer":
      return "Long Answer";
    case "multiple-choice":
      return "Multiple Choice";
    case "checkbox":
      return "Checkbox";
    case "dropdown":
      return "Drop down";
    case "datetime":
      return "Date Time";
    case "rating":
      return "Rating";
  }
}
export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function hasEnvVars() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}
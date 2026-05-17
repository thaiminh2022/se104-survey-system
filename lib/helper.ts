import { QuestionTypes } from "./types/question-type";

export function convertQuestionTypeToName(t: QuestionTypes) {
  switch (t) {
    case "single-choice":
      return "Single Choice";
    case "multiple-choice":
      return "Multiple Choice";
    case "rating-scale":
      return "Rating Scale";
    case "likert-scale":
      return "Likert Scale";
    case "short-text":
      return "Short Text";
    case "long-text":
      return "Long Text";
    case "dropdown":
      return "Dropdown";
    case "yes-no":
      return "Yes / No";
    case "matrix":
      return "Matrix";
    case "ranking":
      return "Ranking";
    case "date-time":
      return "Date / Time";
    case "consent":
      return "Consent / Agreement";
    case "number":
      return "Number";
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
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

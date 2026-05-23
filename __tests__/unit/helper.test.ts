import { afterEach, describe, expect, it } from "vitest";

import {
  convertQuestionTypeToName,
  getSiteUrl,
  hasEnvVars,
} from "@/lib/helper";

const ORIGINAL_ENV = process.env;

describe("helper utilities", () => {
  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("maps question types to display names", () => {
    expect(convertQuestionTypeToName("single-choice")).toBe("Single Choice");
    expect(convertQuestionTypeToName("multiple-choice")).toBe("Multiple Choice");
    expect(convertQuestionTypeToName("rating-scale")).toBe("Rating Scale");
    expect(convertQuestionTypeToName("date-time")).toBe("Date / Time");
    expect(convertQuestionTypeToName("consent")).toBe("Consent / Agreement");
  });

  it("uses NEXT_PUBLIC_SITE_URL without a trailing slash", () => {
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SITE_URL: "https://survey.example.com/",
      VERCEL_URL: "ignored.vercel.app",
    };

    expect(getSiteUrl()).toBe("https://survey.example.com");
  });

  it("uses VERCEL_URL when the public site url is missing", () => {
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SITE_URL: "",
      VERCEL_URL: "survey.vercel.app",
    };

    expect(getSiteUrl()).toBe("https://survey.vercel.app");
  });

  it("falls back to localhost when no deployment url is configured", () => {
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SITE_URL: "",
      VERCEL_URL: "",
    };

    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("reports whether Supabase public environment variables are present", () => {
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    };

    expect(hasEnvVars()).toBe(true);

    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    };

    expect(hasEnvVars()).toBe(false);
  });
});

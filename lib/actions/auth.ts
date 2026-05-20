"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const DEFAULT_AUTH_REDIRECT = "/dashboard";

function sanitizeReturnUrl(value: FormDataEntryValue | string | null): string {
  if (typeof value !== "string" || value.length === 0) {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (value.startsWith("/auth/login") || value.startsWith("/auth/register")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return value;
}

function redirectWithError(pathname: string, returnUrl: string, message: string) {
  const params = new URLSearchParams({
    returnUrl,
    error: message,
  });

  redirect(`${pathname}?${params.toString()}`);
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const returnUrl = sanitizeReturnUrl(formData.get("returnUrl"));

  

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithError("/auth/login", returnUrl, error.message);
    return;
  }

  redirect(returnUrl);
}

export async function register(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm-password") ?? "");
  const returnUrl = sanitizeReturnUrl(formData.get("returnUrl"));

  if (password !== confirmPassword) {
    redirectWithError("/auth/register", returnUrl, "Passwords do not match.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirectWithError("/auth/register", returnUrl, error.message);
  }

  if (!data.session) {
    const params = new URLSearchParams({
      returnUrl,
      message: "Check your email to confirm your account before signing in.",
    });
    redirect(`/auth/login?${params.toString()}`);
  }

  redirect(returnUrl);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

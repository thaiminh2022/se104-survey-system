"use server";

import { createError, createSuccess } from "@/lib/types/errors";
import { createClient } from "../supabase/server";
import { AppUserData } from "@/lib/types/db_schema";

export async function getUser() {
  const supabase = await createClient();
  const userRes = await supabase.auth.getUser();

  if (userRes.error) {
    return createError(userRes.error, userRes.error.message);
  }
  return createSuccess(userRes.data.user);
}

export async function getUserData() {
  const supabase = await createClient();
  const userRes = await getUser();
  if (!userRes.success) {
    return userRes;
  }
  const user = userRes.data;
  if (!user.email) {
    return createError(null, "User doesn't have an email");
  }

  const userData: AppUserData = {
    name: user.email.split("@")[0],
    email: user.email,
  };
  return createSuccess(userData);
}

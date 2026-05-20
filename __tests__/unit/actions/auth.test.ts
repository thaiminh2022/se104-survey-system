import { beforeEach, describe, expect, test, vi } from "vitest";

const { signInWithPassword, signUp, redirect } = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  redirect: vi.fn((url: string) => {
    throw new Error(`redirect:${url}`);
  }),
}));

vi.mock("@/lib/supabase/server", () => {
  return {
    createClient: vi.fn(async () => {
      return {
        auth: {
          signInWithPassword,
          signUp,
        },
      };
    }),
  };
});

vi.mock("next/navigation", () => ({
  redirect,
}));

function makeRegisterFormData({
  email = "user@example.com",
  password = "password",
  confirmPassword = "password",
  returnUrl = "/dashboard/surveys",
} = {}) {
  const formData = new FormData();

  formData.set("email", email);
  formData.set("password", password);
  formData.set("confirm-password", confirmPassword);
  formData.set("returnUrl", returnUrl);

  return formData;
}

describe("login action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("logs in and redirects to the return url", async () => {
    const { login } = await import("@/lib/actions/auth");
    const formData = new FormData();

    formData.set("email", "user@example.com");
    formData.set("password", "password");
    formData.set("returnUrl", "/dashboard/surveys");

    signInWithPassword.mockResolvedValue({ error: null });

    await expect(login(formData)).rejects.toThrow(
      "redirect:/dashboard/surveys",
    );

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password",
    });
  });

  test("redirects back to login with Supabase error message", async () => {
    const { login } = await import("@/lib/actions/auth");
    const formData = new FormData();

    formData.set("email", "user@example.com");
    formData.set("password", "wrong-password");
    formData.set("returnUrl", "/dashboard/surveys");

    signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });

    await expect(login(formData)).rejects.toThrow(
      "redirect:/auth/login?returnUrl=%2Fdashboard%2Fsurveys&error=Invalid+login+credentials",
    );
  });
});

describe("register action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("redirects back to register when passwords do not match", async () => {
    const { register } = await import("@/lib/actions/auth");

    await expect(
      register(
        makeRegisterFormData({
          password: "password",
          confirmPassword: "different-password",
        }),
      ),
    ).rejects.toThrow(
      "redirect:/auth/register?returnUrl=%2Fdashboard%2Fsurveys&error=Passwords+do+not+match.",
    );

    expect(signUp).not.toHaveBeenCalled();
  });

  test("signs up and redirects to the return url when Supabase creates a session", async () => {
    const { register } = await import("@/lib/actions/auth");

    signUp.mockResolvedValue({
      data: { session: { access_token: "token" } },
      error: null,
    });

    await expect(register(makeRegisterFormData())).rejects.toThrow(
      "redirect:/dashboard/surveys",
    );

    expect(signUp).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password",
    });
  });

  test("redirects to login with a confirmation message when signup needs email confirmation", async () => {
    const { register } = await import("@/lib/actions/auth");

    signUp.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    await expect(register(makeRegisterFormData())).rejects.toThrow(
      "redirect:/auth/login?returnUrl=%2Fdashboard%2Fsurveys&message=Check+your+email+to+confirm+your+account+before+signing+in.",
    );
  });

  test("redirects back to register with Supabase error message", async () => {
    const { register } = await import("@/lib/actions/auth");

    signUp.mockResolvedValue({
      data: { session: null },
      error: { message: "User already registered" },
    });

    await expect(register(makeRegisterFormData())).rejects.toThrow(
      "redirect:/auth/register?returnUrl=%2Fdashboard%2Fsurveys&error=User+already+registered",
    );
  });
});

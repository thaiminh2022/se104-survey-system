import { expect, test } from "@playwright/test";
import { loginThroughForm } from "./helpers";

test("home page links to auth and dashboard", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Create, share, and review surveys from one clean workspace.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Log in" })).toHaveAttribute(
    "href",
    "/auth/login",
  );
  await expect(
    page.getByRole("link", { name: "Go to Dashboard" }),
  ).toHaveAttribute("href", "/dashboard");
});

test("logged-out dashboard routes redirect to login with returnUrl", async ({
  page,
}) => {
  await page.goto("/dashboard/surveys/create");

  await expect(page).toHaveURL(
    /\/auth\/login\?returnUrl=%2Fdashboard%2Fsurveys%2Fcreate$/,
  );
  await expect(
    page.getByText("Login to your account", { exact: true }),
  ).toBeVisible();
});

test("public survey route does not require dashboard auth", async ({ page }) => {
  await page.goto("/surveys/e2e-survey");

  await expect(page).toHaveURL(/\/surveys\/e2e-survey$/);
  await expect(page.getByText("E2E Published Survey")).toBeVisible();
});

test("login form rejects invalid credentials and accepts the E2E user", async ({
  page,
}) => {
  await page.goto("/auth/login?returnUrl=%2Fdashboard");
  await page.getByLabel("Email").fill("wrong@example.com");
  await page.getByLabel("Password").fill("bad-password");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/error=Invalid\+login\+credentials/);
  await expect(page.getByText("Invalid login credentials")).toBeVisible();

  await loginThroughForm(page, "/dashboard");
  await expect(
    page.getByRole("heading", { level: 1, name: "Dashboard" }),
  ).toBeVisible();
});

test("register form renders fields and password mismatch error", async ({
  page,
}) => {
  await page.goto("/auth/register?returnUrl=%2Fdashboard");

  await expect(page.getByText("Create an account")).toBeVisible();
  await page.getByLabel("Email").fill("new@example.com");
  await page.getByLabel("Password", { exact: true }).fill("password");
  await page.getByLabel("Confirm Password").fill("different");
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL(/error=Passwords\+do\+not\+match/);
  await expect(page.getByText("Passwords do not match.")).toBeVisible();
});
